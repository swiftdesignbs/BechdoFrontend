import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { apiService, type Image, type CreateModelRequest, type UpdateModelRequest, type Model, type Brand } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface ModelFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editModel?: Model | null; // Model to edit (null for create mode)
}

interface FormData {
  brand_id: number | '';
  model_name: string;
  price_rng: string;
  model_image: number | null;
}

export function ModelFormModal({ open, onClose, onSuccess, editModel }: ModelFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    brand_id: '',
    model_name: '',
    price_rng: '',
    model_image: null,
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  
  const [images, setImages] = useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesPage, setImagesPage] = useState(1);
  const [imagesTotalPages, setImagesTotalPages] = useState(1);
  const [showImageSelector, setShowImageSelector] = useState(false);
  
  // For storing individual loaded images (for edit mode previews)
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: Image }>({});
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form data when editing a model
  useEffect(() => {
    if (editModel && open) {
      setFormData({
        brand_id: editModel.brand_id,
        model_name: editModel.model_name,
        price_rng: editModel.price_rng,
        model_image: editModel.modelImage?.id || null,
      });
    } else if (open) {
      // Reset form for create mode
      setFormData({
        brand_id: '',
        model_name: '',
        price_rng: '',
        model_image: null,
      });
    }
  }, [editModel, open]);

  // Load individual images for edit mode previews
  useEffect(() => {
    if (editModel && open && editModel.modelImage) {
      setLoadedImages({ [editModel.modelImage.id]: editModel.modelImage });
    }
  }, [editModel, open]);

  // Load brands when modal opens
  useEffect(() => {
    if (open) {
      loadBrands();
    }
  }, [open]);

  // Load individual image by ID (for edit mode)
  const loadIndividualImage = async (imageId: number) => {
    if (loadedImages[imageId]) return; // Already loaded
    
    try {
      const response = await apiService.getImage(imageId);
      if (response.success && response.data) {
        setLoadedImages(prev => ({
          ...prev,
          [imageId]: response.data!
        }));
      }
    } catch (err) {
      console.error('Error loading individual image:', err);
    }
  };

  // Load images when they're selected (if not already loaded)
  useEffect(() => {
    if (formData.model_image && !getSelectedImage(formData.model_image)) {
      loadIndividualImage(formData.model_image);
    }
  }, [formData.model_image]);

  // Load brands
  const loadBrands = async () => {
    setBrandsLoading(true);
    try {
      const response = await apiService.getBrands(1, 100); // Get all brands
      if (response.success && response.data) {
        setBrands(response.data.data);
      }
    } catch (err) {
      console.error('Error loading brands:', err);
    } finally {
      setBrandsLoading(false);
    }
  };

  // Load images when image selector is opened
  useEffect(() => {
    if (showImageSelector && open) {
      loadImages(1);
    }
  }, [showImageSelector, open]);

  const loadImages = async (page: number) => {
    setImagesLoading(true);
    try {
      const response = await apiService.getImages(page, 12);
      if (response.success && response.data) {
        setImages(response.data.data);
        setImagesPage(page);
        
        const totalPages = Math.ceil((response.data.total || 0) / 12);
        setImagesTotalPages(totalPages);
      }
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleImageSelect = (image: Image) => {
    setFormData(prev => ({ ...prev, model_image: image.id }));
    setShowImageSelector(false);
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const fullUrl = `${apiService.getImageBaseUrl()}${imagePath}`;
    console.log('Model Image URL constructed:', { imagePath, baseUrl: apiService.getImageBaseUrl(), fullUrl });
    return fullUrl;
  };

  const getSelectedImage = (imageId: number | null): Image | null => {
    if (!imageId) return null;
    
    // First check in the images list (from selector)
    const foundInList = images.find(img => img.id === imageId);
    if (foundInList) return foundInList;
    
    // Then check in individually loaded images (for edit mode)
    const foundInLoaded = loadedImages[imageId];
    if (foundInLoaded) return foundInLoaded;
    
    return null;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.model_name.trim()) {
      setError('Model name is required');
      return;
    }
    if (!formData.brand_id) {
      setError('Brand is required');
      return;
    }
    if (!formData.price_rng.trim()) {
      setError('Price range is required');
      return;
    }
    if (!formData.model_image) {
      setError('Model image is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const modelData: CreateModelRequest = {
        brand_id: Number(formData.brand_id),
        model_name: formData.model_name.trim(),
        price_rng: formData.price_rng.trim(),
        model_image: formData.model_image,
      };

      if (editModel) {
        // Update existing model
        const updateData = {
          ...modelData,
          id: editModel.id,
        };
        const response = await apiService.updateModel(updateData);
        
        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.error || 'Failed to update model');
        }
      } else {
        // Create new model
        const response = await apiService.createModel(modelData);
        
        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.error || 'Failed to create model');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editModel ? 'update' : 'create'} model`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      brand_id: '',
      model_name: '',
      price_rng: '',
      model_image: null,
    });
    setError(null);
    setShowImageSelector(false);
    setLoadedImages({});
    onClose();
  };

  const renderImageSelector = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Model Image
      </Typography>
      
      {imagesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
            {images.map((image) => (
              <Box key={image.id} sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 11px)', md: 'calc(25% - 12px)' } }}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 },
                  }}
                  onClick={() => handleImageSelect(image)}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={getImageUrl(image.image_path)}
                    alt={image.image_name}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/placeholder.png';
                    }}
                  />
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="caption" noWrap>
                      {image.image_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
          
          {imagesTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={imagesTotalPages}
                page={imagesPage}
                onChange={(_, page) => loadImages(page)}
                color="primary"
              />
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={() => setShowImageSelector(false)}>
              Cancel
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        {editModel ? 'Edit Model' : 'Create New Model'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {showImageSelector ? (
          renderImageSelector()
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Model Name"
                value={formData.model_name}
                onChange={(e) => handleInputChange('model_name', e.target.value)}
                required
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    value={formData.brand_id}
                    onChange={(e) => handleInputChange('brand_id', e.target.value)}
                    label="Brand"
                    disabled={brandsLoading}
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.brand_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Price Range"
                  value={formData.price_rng}
                  onChange={(e) => handleInputChange('price_rng', e.target.value)}
                  placeholder="e.g., 5400 - 40000"
                  required
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Model Image *
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:eye-bold" />}
                onClick={() => setShowImageSelector(true)}
                fullWidth
                sx={{ justifyContent: 'flex-start', height: 56 }}
              >
                {formData.model_image ? 'Change Model Image' : 'Select Model Image'}
              </Button>
              {formData.model_image && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                  {(() => {
                    const selectedImage = getSelectedImage(formData.model_image);
                    return selectedImage ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box
                          component="img"
                          src={getImageUrl(selectedImage.image_path)}
                          alt={selectedImage.image_name}
                          sx={{
                            width: '100%',
                            maxWidth: 200,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 1,
                            backgroundColor: 'grey.100',
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {selectedImage.image_name}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="caption" color="text.secondary">
                          Loading image... (ID: {formData.model_image})
                        </Typography>
                      </Box>
                    );
                  })()}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      {!showImageSelector && (
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <Iconify icon="solar:pen-bold" />}
          >
            {saving ? (editModel ? 'Updating...' : 'Creating...') : (editModel ? 'Update Model' : 'Create Model')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}