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
import { apiService, type Image, type CreateBrandRequest, type Brand } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface BrandFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editBrand?: Brand | null; // Brand to edit (null for create mode)
}

interface FormData {
  brand_name: string;
  category: string;
  price_range: string;
  brand_image: number | null;
  banner_image: number | null;
}

const categories = [
  'Laptops',
];

export function BrandFormModal({ open, onClose, onSuccess, editBrand }: BrandFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    brand_name: '',
    category: '',
    price_range: '',
    brand_image: null,
    banner_image: null,
  });

  const [images, setImages] = useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesPage, setImagesPage] = useState(1);
  const [imagesTotalPages, setImagesTotalPages] = useState(1);
  const [showImageSelector, setShowImageSelector] = useState<'brand' | 'banner' | null>(null);
  
  // For storing individual loaded images (for edit mode previews)
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: Image }>({});
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form data when editing a brand
  useEffect(() => {
    if (editBrand && open) {
      setFormData({
        brand_name: editBrand.brand_name,
        category: editBrand.category,
        price_range: editBrand.price_range,
        brand_image: editBrand.brand_image,
        banner_image: editBrand.banner_image,
      });
    } else if (open) {
      // Reset form for create mode
      setFormData({
        brand_name: '',
        category: '',
        price_range: '',
        brand_image: null,
        banner_image: null,
      });
    }
  }, [editBrand, open]);

  // Load individual images for edit mode previews
  useEffect(() => {
    if (editBrand && open) {
      if (editBrand.brand_image) loadIndividualImage(editBrand.brand_image);
      if (editBrand.banner_image) loadIndividualImage(editBrand.banner_image);
    }
  }, [editBrand, open]);

  // Load individual image by ID (for edit mode)
  const loadIndividualImage = async (imageId: number) => {
    if (loadedImages[imageId]) return; // Already loaded
    
    console.log('Loading individual image:', imageId);
    try {
      const response = await apiService.getImage(imageId);
      console.log('Individual image response:', response);
      if (response.success && response.data) {
        console.log('Individual image data:', response.data);
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
    if (formData.brand_image && !getSelectedImage(formData.brand_image)) {
      loadIndividualImage(formData.brand_image);
    }
    if (formData.banner_image && !getSelectedImage(formData.banner_image)) {
      loadIndividualImage(formData.banner_image);
    }
  }, [formData.brand_image, formData.banner_image]);

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
      console.log('Images list response:', response);
      if (response.success && response.data) {
        console.log('Images data:', response.data.data);
        setImages(response.data.data);
        setImagesPage(page);
        setImagesTotalPages(Math.ceil((response.data.total || 0) / 12));
      }
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleImageSelect = (image: Image) => {
    if (showImageSelector === 'brand') {
      setFormData(prev => ({ ...prev, brand_image: image.id }));
    } else if (showImageSelector === 'banner') {
      setFormData(prev => ({ ...prev, banner_image: image.id }));
    }
    setShowImageSelector(null);
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const fullUrl = `${apiService.getImageBaseUrl()}${imagePath}`;
    console.log('Image URL constructed:', { imagePath, baseUrl: apiService.getImageBaseUrl(), fullUrl });
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
    if (!formData.brand_name.trim()) {
      setError('Brand name is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.price_range.trim()) {
      setError('Price range is required');
      return;
    }
    if (!formData.brand_image) {
      setError('Brand image is required');
      return;
    }
    if (!formData.banner_image) {
      setError('Banner image is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editBrand) {
        // Update existing brand
        const brandData = {
          id: editBrand.id,
          brand_name: formData.brand_name.trim(),
          category: formData.category,
          price_range: formData.price_range.trim(),
          brand_image: formData.brand_image,
          banner_image: formData.banner_image,
        };

        const response = await apiService.updateBrand(brandData);
        
        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.error || 'Failed to update brand');
        }
      } else {
        // Create new brand
        const brandData: CreateBrandRequest = {
          brand_name: formData.brand_name.trim(),
          category: formData.category,
          price_range: formData.price_range.trim(),
          brand_image: formData.brand_image,
          banner_image: formData.banner_image,
        };

        const response = await apiService.createBrand(brandData);
        
        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.error || 'Failed to create brand');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editBrand ? 'update' : 'create'} brand`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      brand_name: '',
      category: '',
      price_range: '',
      brand_image: null,
      banner_image: null,
    });
    setError(null);
    setShowImageSelector(null);
    onClose();
  };

  const renderImageSelector = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select {showImageSelector === 'brand' ? 'Brand' : 'Banner'} Image
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
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" noWrap>
                      {image.image_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
          
          {imagesTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={imagesTotalPages}
                page={imagesPage}
                onChange={(_, page) => loadImages(page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
      
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button onClick={() => setShowImageSelector(null)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: showImageSelector ? '80vh' : 'auto' }
      }}
    >
      <DialogTitle>
        {editBrand ? 'Edit Brand' : 'Create New Brand'}
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
                label="Brand Name"
                value={formData.brand_name}
                onChange={(e) => handleInputChange('brand_name', e.target.value)}
                required
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Price Range"
                  value={formData.price_range}
                  onChange={(e) => handleInputChange('price_range', e.target.value)}
                  placeholder="e.g., 10-20"
                  required
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Brand Image *
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:eye-bold" />}
                  onClick={() => setShowImageSelector('brand')}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', height: 56 }}
                >
                  {formData.brand_image ? 'Change Brand Image' : 'Select Brand Image'}
                </Button>
                {formData.brand_image && (
                  <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                    {(() => {
                      const selectedImage = getSelectedImage(formData.brand_image);
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
                            Loading image... (ID: {formData.brand_image})
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Box>
                )}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Banner Image *
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:eye-bold" />}
                  onClick={() => setShowImageSelector('banner')}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', height: 56 }}
                >
                  {formData.banner_image ? 'Change Banner Image' : 'Select Banner Image'}
                </Button>
                {formData.banner_image && (
                  <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                    {(() => {
                      const selectedImage = getSelectedImage(formData.banner_image);
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
                            Loading image... (ID: {formData.banner_image})
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Box>
                )}
              </Box>
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
            {saving ? (editBrand ? 'Updating...' : 'Creating...') : (editBrand ? 'Update Brand' : 'Create Brand')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}