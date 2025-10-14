import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';

import { Iconify } from 'src/components/iconify';
import { apiService } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface ProcessorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProcessor?: {
    id: number;
    title: string;
    price: number;
    bonus: number;
  } | null;
  configType?: string;
  isParent?: number;
}

interface ProcessorFormData {
  title: string;
  price: string;
  bonus: string;
}

// ----------------------------------------------------------------------

export function ProcessorModal({
  open,
  onClose,
  onSuccess,
  editProcessor = null,
  configType = 'PROCESSOR',
  isParent = 0,
}: ProcessorModalProps) {
  const [formData, setFormData] = useState<ProcessorFormData>({
    title: '',
    price: '',
    bonus: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProcessorFormData>>({});

  const isEditMode = editProcessor !== null;

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && editProcessor) {
      setFormData({
        title: editProcessor.title,
        price: editProcessor.price.toString(),
        bonus: editProcessor.bonus.toString(),
      });
    } else {
      setFormData({
        title: '',
        price: '',
        bonus: '',
      });
    }
    setErrors({});
  }, [isEditMode, editProcessor, open]);

  const handleChange = (field: keyof ProcessorFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProcessorFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (isEditMode) {
      if (!formData.bonus.trim()) {
        newErrors.bonus = 'Bonus is required';
      } else if (isNaN(Number(formData.bonus)) || Number(formData.bonus) < 0) {
        newErrors.bonus = 'Bonus must be a valid positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Determine if this is Mac based on configType
      const isMacConfig = configType === 'MAC_SERIES';
      
      if (isEditMode && editProcessor) {
        // For edit mode, we need to use updateSystemConfig
        // Note: Bonus handling might require additional API calls or different endpoint
        const payload = {
          title: formData.title.trim(),
          categories: [],
          is_mac: isMacConfig,
          is_parent: isParent,
          config_type: configType,
          default_config_price: Number(formData.price),
          edit_mode: true,
          edit_id: editProcessor.id,
        };

        const response = await apiService.updateSystemConfig(payload);
        
        if (response.success) {
          // TODO: Handle bonus update separately if needed
          // This might require a different API endpoint for updating bonus
          onSuccess();
          onClose();
        } else {
          throw new Error(response.error || 'Failed to update processor');
        }
      } else {
        // For create mode
        const payload = {
          title: formData.title.trim(),
          categories: [],
          is_mac: isMacConfig,
          is_parent: isParent,
          config_type: configType,
          default_config_price: Number(formData.price),
          edit_mode: false,
        };

        const response = await apiService.createSystemConfig(payload);
        
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          throw new Error(response.error || 'Failed to create processor');
        }
      }
    } catch (error) {
      console.error('Error saving processor:', error);
      // You can add a snackbar notification here if needed
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            sx={{ 
              bgcolor: isEditMode ? 'warning.main' : 'primary.main',
              width: 40,
              height: 40
            }}
          >
            <Iconify 
              icon={isEditMode ? "solar:pen-bold" : "solar:check-circle-bold"} 
              width={20} 
            />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isEditMode ? 
                `Edit ${configType === 'MAC_SERIES' ? 'Mac' : 'Windows'} Processor` : 
                `Add New ${configType === 'MAC_SERIES' ? 'Mac' : 'Windows'} Processor`
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditMode ? 
                `Update ${configType === 'MAC_SERIES' ? 'Mac' : 'Windows'} processor details` : 
                `Configure ${configType === 'MAC_SERIES' ? 'Mac' : 'Windows'} processor categories and pricing`
              }
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            placeholder="Enter processor title (e.g., AMD ATHLON)"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              }
            }}
          />

          <TextField
            label="Price (Rs)"
            value={formData.price}
            onChange={handleChange('price')}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            type="number"
            placeholder="Enter price in rupees"
            InputProps={{
              startAdornment: (
                <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                  ₹
                </Typography>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              }
            }}
          />

          {isEditMode && (
            <TextField
              label="Bonus"
              value={formData.bonus}
              onChange={handleChange('bonus')}
              error={!!errors.bonus}
              helperText={errors.bonus}
              fullWidth
              type="number"
              placeholder="Enter bonus amount"
              InputProps={{
                startAdornment: (
                  <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                    ₹
                  </Typography>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                }
              }}
            />
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            minWidth: 120,
          }}
        >
          {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}