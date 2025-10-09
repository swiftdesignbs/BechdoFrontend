import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { Iconify } from 'src/components/iconify';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ChannelPartnersTable } from './channel-partners-table';
import { ChannelPartnersFilter } from './channel-partners-filter';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useMemo } from 'react';
import { apiService } from 'src/utils/api-service';

export function AdminChannelPartnersView() {
  // ...existing code...

  // Handler for updating order data using apiService
  const handleOrderUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!viewOrder) return;
    const form = e.currentTarget;
    const data = {
      order_status: Number((form.elements.namedItem('order_status') as HTMLSelectElement).value),
      offer_price: Number((form.elements.namedItem('offer_price') as HTMLInputElement).value),
      comments: (form.elements.namedItem('comments') as HTMLTextAreaElement).value,
    };
    try {
      // Use apiService for updating order
      const result = await apiService.updateOrderData(viewOrder.id, data);
      if (result.success) {
        setSnackbar({ open: true, message: 'Order updated successfully', severity: 'success' });
        setViewOrder(null);
        fetchOrders(); // Refresh orders
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to update order', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error updating order', severity: 'error' });
    }
  };
  const theme = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [viewOrder, setViewOrder] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>({
  name: '',
  vendorCode: '',
  email: '',
  phone: '',
  address: '',
  store_manager_name: '',
  store_manager_phone: '',
  store_head_cashier_name: '',
  store_head_cashier_phone: '',
  bank_name: '',
  account_number: '',
  ifsc_code: '',
  address2: '',
  state: '',
  city: '',
  zip: '',
  slug: '',
  related_staff_ids: '', // optional
  discount_percentage: 0, // default 0
  store_image: null, // optional
  });
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ search: string; brand_id: string; orderStatus: string; city: string;  from: Date | null; to: Date | null }>({ search: '', brand_id: '', orderStatus: '', city: '', from: null, to: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [order_status, setOrderStatuses] = useState<any[]>([]);
  // Open Add Channel Partner Dialog
  const handleAddChannelPartner = () => {
    setEditMode('add');
    setFormData({
      name: '', vendorCode: '', email: '', phone: '', address: '', store_manager_name: '', store_manager_phone: '', store_head_cashier_name: '', store_head_cashier_phone: '', bank_name: '', account_number: '', ifsc_code: '', address2: '', state: '', city: '', zip: '', slug: '', related_staff_ids: '', discount_percentage: '', store_image: null,
    });
    setEditDialogOpen(true);
  };

  // Open Edit Channel Partner Dialog
  const handleEditChannelPartner = (partner: any) => {
    setEditMode('edit');
    setFormData({ ...partner });
    setEditDialogOpen(true);
  };

  // Handle form field change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, store_image: e.target.files?.[0] || null }));
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };
  
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiService.getChannelPartners(page + 1, rowsPerPage);
      if (result.success) {
        setOrders(result.data.data || []);
        setTotalCount(result.data.pagination?.totalItems || 0);
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to fetch orders', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch orders', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Container maxWidth={false}>
      <Card>
        <ChannelPartnersTable
          orders={orders}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={(_e: unknown, newPage: number) => setPage(newPage)}
          onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          onEdit={handleEditChannelPartner}
          onAddChannelPartner={handleAddChannelPartner}
          onDelete={() => {}} // Will be implemented next
        />
      </Card>

      {/* Add/Edit Channel Partner Dialog - Brand Form Style */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
        <DialogTitle>{editMode === 'add' ? 'Add Channel Partner' : 'Edit Channel Partner'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField label="Name" name="name" value={formData.name} onChange={handleFormChange} fullWidth required />
                  <TextField label="Vendor Code" name="vendorCode" value={formData.vendorCode} onChange={handleFormChange} fullWidth required />
                  <TextField label="Email" name="email" value={formData.email} onChange={handleFormChange} fullWidth required />
                  <TextField label="Phone" name="phone" value={formData.phone} onChange={handleFormChange} fullWidth required />
                  <TextField label="Address" name="address" value={formData.address} onChange={handleFormChange} fullWidth />
                  <TextField label="Address 2" name="address2" value={formData.address2} onChange={handleFormChange} fullWidth />
                </Stack>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField label="State" name="state" value={formData.state} onChange={handleFormChange} fullWidth />
                  <TextField label="City" name="city" value={formData.city} onChange={handleFormChange} fullWidth />
                  <TextField label="Zip" name="zip" value={formData.zip} onChange={handleFormChange} fullWidth />
                  <TextField label="Slug" name="slug" value={formData.slug} onChange={handleFormChange} fullWidth />
                  <TextField label="Discount Percentage" name="discount_percentage" type="number" value={formData.discount_percentage} onChange={handleFormChange} fullWidth />
                  <TextField label="Related Staff IDs" name="related_staff_ids" value={formData.related_staff_ids} onChange={handleFormChange} fullWidth />
                </Stack>
              </Box>
            </Card>

            {/* Store Manager & Cashier */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Store Staff</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField label="Store Manager Name" name="store_manager_name" value={formData.store_manager_name} onChange={handleFormChange} fullWidth />
                  <TextField label="Head Cashier Name" name="store_head_cashier_name" value={formData.store_head_cashier_name} onChange={handleFormChange} fullWidth />
                </Stack>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField label="Store Manager Phone" name="store_manager_phone" value={formData.store_manager_phone} onChange={handleFormChange} fullWidth />
                  <TextField label="Head Cashier Phone" name="store_head_cashier_phone" value={formData.store_head_cashier_phone} onChange={handleFormChange} fullWidth />
                </Stack>
              </Box>
            </Card>

            {/* Bank Details */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Bank Details</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField label="Bank Name" name="bank_name" value={formData.bank_name} onChange={handleFormChange} fullWidth />
                </Stack>
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <TextField label="Account Number" name="account_number" value={formData.account_number} onChange={handleFormChange} fullWidth />
                  <TextField label="IFSC Code" name="ifsc_code" value={formData.ifsc_code} onChange={handleFormChange} fullWidth />
                </Stack>
              </Box>
            </Card>

            {/* Store Image */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Store Image</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={formData.store_image ? URL.createObjectURL(formData.store_image) : ''} variant="rounded" sx={{ width: 80, height: 80 }} />
                  <Box>
                    <input accept="image/*" style={{ display: 'none' }} id="store-image-upload" type="file" onChange={handleFileChange} />
                    <label htmlFor="store-image-upload">
                      <Button variant="outlined" component="span" startIcon={<Iconify icon="solar:pen-bold" />}>Upload Store Image</Button>
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
          <Button onClick={handleDialogClose} color="inherit">Cancel</Button>
          <Button type="submit" form="channel-partner-form" variant="contained" color="primary">{editMode === 'add' ? 'Add' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
