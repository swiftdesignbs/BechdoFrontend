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
import { apiService, type Image, type CreateOrderStatusRequest, type User } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface OrderStatusFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingOrderStatus?: OrderStatus | null; // OrderStatus to edit (null for create mode)
}

interface FormData {
  name: string;
  status: number;
}

const categories = [
  'Laptops',
];

export function OrderStatusFormModal({ open, onClose, onSuccess, editingOrderStatus }: OrderStatusFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    status: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form data when editing a order status
  useEffect(() => {
    if (editingOrderStatus && open) {
      setFormData({
        name: editingOrderStatus.name,
        status: editingOrderStatus.status,
      });
    } else if (open) {
      // Reset form for create mode
      setFormData({
        name: '',
        status: '',
      });
    }
  }, [editingOrderStatus, open]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    setSaving(true);
    setError(null);

    try {
        // Update existing order status
        const orderStatusData = {
          id: editingOrderStatus.id,
          name: formData.name.trim(),
          status: formData.status,
        };

        const response = await apiService.updateOrderStatus(orderStatusData);
        
        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.error || 'Failed to update order status');
        }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingOrderStatus ? 'update' : 'create'} order status`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      status: '',
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingOrderStatus ? 'Edit Order Status' : 'Create New Order Status'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%' }}>
              <FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 2 }}>Active</Typography>
                  <input
                    type="checkbox"
                    checked={formData.status === 1}
                    onChange={e => handleInputChange('status', e.target.checked ? 1 : 0)}
                  />
                </Box>
              </FormControl>
            </Box>
          </Box>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {editingOrderStatus ? "Update Order Status" : "Create Order Status"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}