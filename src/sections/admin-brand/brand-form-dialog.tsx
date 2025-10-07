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
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import type { Brand, CreateBrandRequest } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface BrandFormDialogProps {
  open: boolean;
  brand?: Brand | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBrandRequest) => void;
}

interface FormData {
  brand_name: string;
  category: string;
  price_range: string;
  brand_image?: File;
  banner_image?: File;
}

export function BrandFormDialog({
  open,
  brand,
  loading = false,
  onClose,
  onSubmit,
}: BrandFormDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    brand_name: '',
    category: '',
    price_range: '',
  });

  const [brandImagePreview, setBrandImagePreview] = useState<string>('');
  const [bannerImagePreview, setBannerImagePreview] = useState<string>('');

  const isEditing = Boolean(brand);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (brand) {
        // Editing existing brand
        setFormData({
          brand_name: brand.brand_name,
          category: brand.category,
          price_range: brand.price_range,
        });
        setBrandImagePreview(`${brand.brandImage.image_path}${brand.brandImage.image_name}`);
        setBannerImagePreview(`${brand.bannerImage.image_path}${brand.bannerImage.image_name}`);
      } else {
        // Creating new brand
        setFormData({
          brand_name: '',
          category: '',
          price_range: '',
        });
        setBrandImagePreview('');
        setBannerImagePreview('');
      }
    }
  }, [open, brand]);

  const handleInputChange = useCallback((field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  }, []);

  const handleImageChange = useCallback((field: 'brand_image' | 'banner_image') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (field === 'brand_image') {
          setBrandImagePreview(result);
        } else {
          setBannerImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(formData);
  }, [formData, onSubmit]);

  const isFormValid = formData.brand_name.trim() && formData.category.trim() && formData.price_range.trim();

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
        {isEditing ? 'Edit Brand' : 'Add New Brand'}
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
                label="Brand Name"
                value={formData.brand_name}
                onChange={handleInputChange('brand_name')}
                fullWidth
                required
              />
              <TextField
                label="Category"
                value={formData.category}
                onChange={handleInputChange('category')}
                fullWidth
                required
                placeholder="e.g., Electronics, Laptops, Smartphones"
              />
              <TextField
                label="Price Range"
                value={formData.price_range}
                onChange={handleInputChange('price_range')}
                fullWidth
                required
                placeholder="e.g., 1000-100000"
                helperText="Enter price range in format: min-max"
              />
            </Stack>
          </Card>

          {/* Brand Image */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Brand Image
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={brandImagePreview}
                  variant="rounded"
                  sx={{ width: 80, height: 80 }}
                >
                  <Iconify icon="solar:eye-bold" />
                </Avatar>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="brand-image-upload"
                    type="file"
                    onChange={handleImageChange('brand_image')}
                  />
                  <label htmlFor="brand-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Iconify icon="solar:pen-bold" />}
                    >
                      Upload Brand Image
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    Recommended: Square image, max 2MB
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Card>

          {/* Banner Image */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Banner Image
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 60,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: bannerImagePreview ? `url(${bannerImagePreview})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    bgcolor: bannerImagePreview ? 'transparent' : alpha('#919EAB', 0.16),
                  }}
                >
                  {!bannerImagePreview && (
                    <Iconify icon="solar:eye-bold" sx={{ color: 'text.disabled' }} />
                  )}
                </Box>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="banner-image-upload"
                    type="file"
                    onChange={handleImageChange('banner_image')}
                  />
                  <label htmlFor="banner-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Iconify icon="solar:pen-bold" />}
                    >
                      Upload Banner Image
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                    Recommended: 2:1 aspect ratio, max 2MB
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
          {loading ? 'Saving...' : isEditing ? 'Update Brand' : 'Create Brand'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}