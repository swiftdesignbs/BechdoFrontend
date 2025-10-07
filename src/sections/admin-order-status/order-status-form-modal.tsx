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
  email: string;
  password: string;
  is_super: number | null;
}

const categories = [
  'Laptops',
];

export function OrderStatusFormModal({ open, onClose, onSuccess, editingOrderStatus }: OrderStatusFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    is_super: null,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form data when editing a order status
  useEffect(() => {
    if (editingOrderStatus && open) {
      setFormData({
        name: editingOrderStatus.name,
        email: editingOrderStatus.email,
        password: '', // Don't show password when editing
        is_super: editingOrderStatus.is_super,
      });
    } else if (open) {
      // Reset form for create mode
      setFormData({
        name: '',
        email: '',
        password: '',
        is_super: null,
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
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    // Only require password when creating a new user
    if (!editingOrderStatus && !formData.password.trim()) {
      setError('Password is required');
      return;
    }
    if (formData.is_super === null || formData.is_super === undefined) {
      setError('User Type is required');
      return;
    }
    
    setSaving(true);
    setError(null);

    try {
      if (editingorderStatus) {
        // Update existing order status
        const orderStatusData = {
          id: editingorderStatus.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          // Only send password if it's changed
          ...(formData.password.trim() ? { password: formData.password.trim() } : {}),
          is_super: formData.is_super,
        };

        const response = await apiService.updateOrderStatus(orderStatusData);
        
        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.error || 'Failed to update order status');
        }
      } else {
        // Create new order status
        const orderStatusData: CreateOrderStatusRequest = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          is_super: formData.is_super,
        };

        const response = await apiService.createOrderStatus(orderStatusData);
        
        if (response.success) {
          onSuccess();
          handleClose();
        } else {
          setError(response.error || 'Failed to create order status');
        }
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
      email: '',
      password: '',
      is_super: null,
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
            
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="e.g., user@example.com"
                required
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required={!editingOrderStatus}
                placeholder={editingOrderStatus ? "Leave blank to keep existing password" : ""}
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>User Type</InputLabel>
                <Select
                  value={formData.is_super}
                  onChange={(e) => handleInputChange('is_super', e.target.value as number)}
                  label="User Type"
                >
                  <MenuItem key="super_admin" value={1}>
                    Super Admin
                  </MenuItem>
                  <MenuItem key="staff" value={0}>
                    Staff
                  </MenuItem>
                </Select>
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