import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { apiService, type Model, type CreateModelRequest, type Brand, type Image } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface ModelFormDialogProps {
  open: boolean;
  model?: Model | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateModelRequest) => void;
}

interface FormData {
  brand_id: number | '';
  model_name: string;
  price_rng: string;
  model_image?: File;
}

export function ModelFormDialog({
  open,
  model,
  loading = false,
  onClose,
  onSubmit,
}: ModelFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    brand_id: '',
    model_name: '',
    price_rng: '',
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [modelImagePreview, setModelImagePreview] = useState<string>('');

  const isEditing = Boolean(model);

  // Load brands when dialog opens
  useEffect(() => {
    if (open) {
      loadBrands();
    }
  }, [open]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (model) {
        // Editing existing model
        setFormData({
          brand_id: model.brand_id,
          model_name: model.model_name,
          price_rng: model.price_rng,
        });
        if (model.modelImage) {
          setModelImagePreview(`${model.modelImage.image_path}${model.modelImage.image_name}`);
        }
      } else {
        // Creating new model
        setFormData({
          brand_id: '',
          model_name: '',
          price_rng: '',
        });
        setModelImagePreview('');
      }
    }
  }, [open, model]);

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

  const handleInputChange = useCallback((field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  }, []);

  const handleSelectChange = useCallback((field: keyof FormData) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  }, []);

  const handleImageChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        model_image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setModelImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const modelImageId = isEditing && model?.modelImage?.id && !formData.model_image ? model.modelImage.id : 0;
    
    const submitData: CreateModelRequest = {
      brand_id: Number(formData.brand_id),
      model_name: formData.model_name,
      price_rng: formData.price_rng,
      model_image: modelImageId,
    };

    // If there's a new image file, we'll need to handle the file upload
    // For now, we'll pass the form data and let the parent handle file upload
    onSubmit({
      ...submitData,
      ...(formData.model_image && { model_image_file: formData.model_image as any }),
    });
  }, [formData, onSubmit, isEditing, model]);

  const isFormValid = formData.brand_id && formData.model_name.trim() && formData.price_rng.trim() && 
    (isEditing || formData.model_image);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        {isEditing ? 'Edit Model' : 'Add New Model'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Basic Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Model Name"
                value={formData.model_name}
                onChange={handleInputChange('model_name')}
                fullWidth
                required
              />
              
              <FormControl fullWidth required>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={formData.brand_id}
                  onChange={handleSelectChange('brand_id')}
                  label="Brand"
                  disabled={brandsLoading}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.brand_name}
                    </MenuItem>
                  ))}
                </Select>
                {brandsLoading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="text.secondary">
                      Loading brands...
                    </Typography>
                  </Box>
                )}
              </FormControl>
              
              <TextField
                label="Price Range"
                value={formData.price_rng}
                onChange={handleInputChange('price_rng')}
                fullWidth
                required
                placeholder="e.g., 5400 - 40000"
                helperText="Enter price range in format: min - max"
              />
            </Stack>
          </Card>

          {/* Model Image */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Model Image
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={modelImagePreview}
                  variant="rounded"
                  sx={{ width: 80, height: 80 }}
                >
                  <Iconify icon="solar:eye-bold" />
                </Avatar>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="model-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="model-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Iconify icon="solar:pen-bold" />}
                    >
                      Upload Model Image
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    Recommended: Square image, max 2MB
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || loading}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Model' : 'Create Model'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}