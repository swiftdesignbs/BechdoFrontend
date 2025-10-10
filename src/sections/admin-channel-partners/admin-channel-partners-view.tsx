import { useState, useEffect, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import { Iconify } from 'src/components/iconify';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ChannelPartnersTable } from './channel-partners-table';
import { ChannelPartnersFilter } from './channel-partners-filter';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { apiService } from 'src/utils/api-service';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import DialogContentText from '@mui/material/DialogContentText';

export function AdminChannelPartnersView() {
  // Handler for MUI Select change
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name as string]: value }));
  };

  // Add/Edit Channel Partner Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const theme = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [viewOrder, setViewOrder] = useState<any | null>(null);
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
  const [partnerCustomers, setPartnerCustomers] = useState<any[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [deleteCustomerDialogOpen, setDeleteCustomerDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ search: string; brand_id: string; orderStatus: string; city: string;  from: Date | null; to: Date | null }>({ search: '', brand_id: '', orderStatus: '', city: '', from: null, to: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [order_status, setOrderStatuses] = useState<any[]>([]);

  // Customer dialog state
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [customerEditMode, setCustomerEditMode] = useState<'add' | 'edit'>('add');
  const [customerFormData, setCustomerFormData] = useState<any>({
    customer_name: '',
    mobile: '',
    email: '',
    address: '',
    status: 1,
  });
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);

  // Open Add Customer Dialog
  const handleAddCustomer = () => {
    setCustomerEditMode('add');
    setCustomerFormData({ customer_name: '', mobile: '', email: '', address: '', status: 1 });
    setEditingCustomerId(null);
    setCustomerDialogOpen(true);
  };

  // Open Edit Customer Dialog
  const handleEditCustomer = (customer: any) => {
    setCustomerEditMode('edit');
    setCustomerFormData({
      customer_name: customer.customer_name,
      mobile: customer.mobile,
      email: customer.email,
      address: customer.address,
      status: customer.status,
    });
    setEditingCustomerId(customer.id);
    setCustomerDialogOpen(true);
  };

  // Handle customer form field change
  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle customer dialog close
  const handleCustomerDialogClose = () => {
    setCustomerDialogOpen(false);
  };

  // Validate customer form
  const validateCustomerForm = () => {
    if (!customerFormData.customer_name || customerFormData.customer_name.trim() === '') return 'Customer name is required';
    if (!customerFormData.mobile || !/^\d{10,}$/.test(customerFormData.mobile)) return 'Valid mobile is required';
    if (!customerFormData.email || !/\S+@\S+\.\S+/.test(customerFormData.email)) return 'Valid email is required';
    if (!customerFormData.address || customerFormData.address.trim() === '') return 'Address is required';
    return null;
  };

  // Submit handler for Add/Edit Customer
  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateCustomerForm();
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      return;
    }
    try {
      let result;
      if (customerEditMode === 'add') {
        result = await apiService.createCustomer({
          ...customerFormData,
          channel_partner_id: formData.id || editingCustomerId,
        });
      } else {
        result = await apiService.updateCustomer(editingCustomerId!, {
          ...customerFormData,
        });
      }
      if (result.success) {
        setSnackbar({ open: true, message: `Channel partner users ${customerEditMode === 'add' ? 'added' : 'updated'} successfully`, severity: 'success' });
        setCustomerDialogOpen(false);
        // Refresh customers
        setCustomerLoading(true);
        apiService.getPartnerCustomers({ channel_partner_id: formData.id || editingCustomerId, page: 1, limit: 10 })
          .then((res: any) => {
            if (res.success && res.data && Array.isArray(res.data.data)) {
              setPartnerCustomers(res.data.data);
            } else {
              setPartnerCustomers([]);
            }
          })
          .finally(() => setCustomerLoading(false));
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to save Channel partner users', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error saving Channel partner users', severity: 'error' });
    }
  };

  // Delete customer handler
  const handleDeleteCustomer = async (customerId: number) => {
    if (!window.confirm('Are you sure you want to delete this Channel partner user?')) return;
    setCustomerLoading(true);
    try {
      const result = await apiService.deleteCustomer(customerId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Channel partner user deleted successfully', severity: 'success' });
        // Refresh customers
        apiService.getPartnerCustomers({ channel_partner_id: formData.id || customerId, page: 1, limit: 10 })
          .then((res: any) => {
            if (res.success && res.data && Array.isArray(res.data.data)) {
              setPartnerCustomers(res.data.data);
            } else {
              setPartnerCustomers([]);
            }
          })
          .finally(() => setCustomerLoading(false));
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to delete Channel partner user', severity: 'error' });
        setCustomerLoading(false);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting Channel partner user', severity: 'error' });
      setCustomerLoading(false);
    }
  };

  // Confirm dialog handler
  const handleDeleteCustomerConfirm = async () => {
    if (customerToDelete) {
      await handleDeleteCustomer(customerToDelete.id);
      setDeleteCustomerDialogOpen(false);
      setCustomerToDelete(null);
    }
  };
  const handleDeleteCustomerCancel = () => {
    setDeleteCustomerDialogOpen(false);
    setCustomerToDelete(null);
  };

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
    // Fetch customers for this channel partner
    setCustomerLoading(true);
    apiService.getPartnerCustomers({ channel_partner_id: partner.id, page: 1, limit: 10 })
      .then((result: any) => {
        if (result.success && result.data && Array.isArray(result.data.data)) {
          setPartnerCustomers(result.data.data);
        } else {
          setPartnerCustomers([]);
        }
      })
      .finally(() => setCustomerLoading(false));
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

  // Form validation
  const validateForm = () => {
    const requiredFields = [
      'name', 'vendorCode', 'email', 'phone', 'address', 'store_manager_name',
      'store_manager_phone', 'store_head_cashier_name', 'store_head_cashier_phone',
      'bank_name', 'account_number', 'ifsc_code', 'address2', 'state', 'city', 'zip', 'slug'
    ];
    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        return `${field.replace(/_/g, ' ')} is required`;
      }
    }
    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Email is invalid';
    }
    // Basic phone format check
    if (!/^\d{10,}$/.test(formData.phone)) {
      return 'Phone is invalid';
    }
    return null;
  };

  // Submit handler for Add/Edit Channel Partner
  const handleChannelPartnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setSnackbar({ open: true, message: error, severity: 'error' });
      return;
    }
    const body = new FormData();
    // List all required fields explicitly to ensure they are always sent
    const requiredFields = [
      'name', 'vendorCode', 'email', 'phone', 'address', 'store_manager_name',
      'store_manager_phone', 'store_head_cashier_name', 'store_head_cashier_phone',
      'bank_name', 'account_number', 'ifsc_code', 'address2', 'state', 'city', 'zip', 'slug', 'discount_percentage'
    ];
    requiredFields.forEach((key) => {
      let value = formData[key];
      if (key === 'discount_percentage') {
        value = value === undefined || value === null || value === '' ? 0 : value;
      }
      body.append(key, value);
    });
    // Optional fields
    if (formData.related_staff_ids) {
      body.append('related_staff_ids', formData.related_staff_ids);
    }
    if (formData.store_image) {
      body.append('store_image', formData.store_image);
    }
    try {
      // Replace with your actual API call if needed
      const result = await apiService.createChannelPartner(body); // Should POST to /api/channel-partner/create
      if (result.success) {
        setSnackbar({ open: true, message: 'Channel Partner added successfully', severity: 'success' });
        setEditDialogOpen(false);
        fetchOrders();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to add Channel Partner', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error adding Channel Partner', severity: 'error' });
    }
  };

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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiService.getChannelPartners(page + 1, rowsPerPage);
      if (result.success) {
        setOrders(result.data.data || []);
        setStates(result.data.states || []);
        setCities(result.data.cities || []);
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

  // Initial effect to fetch orders on mount or pagination change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // If you need to fetch states and cities separately, you can add additional useEffect here

  // Delete channel partner handler
  const handleDeleteChannelPartner = async (partnerId: number) => {
    setLoading(true);
    try {
      const result = await apiService.deleteChannelPartner(partnerId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Channel Partner deleted successfully', severity: 'success' });
        fetchOrders();
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to delete Channel Partner', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting Channel Partner', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
          onDelete={handleDeleteChannelPartner}
        />
      </Card>

      {/* Add/Edit Channel Partner Dialog - Brand Form Style */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth PaperProps={{ sx: { height: '90vh' } }}>
        <DialogTitle>{editMode === 'add' ? 'Add Channel Partner' : 'Edit Channel Partner'}</DialogTitle>
        <DialogContent>
          <form id="channel-partner-form" onSubmit={handleChannelPartnerSubmit}>
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
                    <TextField label="Address" name="address" value={formData.address} onChange={handleFormChange} fullWidth required />
                    <TextField label="Address 2" name="address2" value={formData.address2} onChange={handleFormChange} fullWidth required />
                  </Stack>
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <Select
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleSelectChange}
                      fullWidth
                      displayEmpty
                      required
                    >
                      <MenuItem value=""><em>Select State</em></MenuItem>
                      {states.map((state) => (
                        <MenuItem key={state.id || state} value={state.name || state}>
                          {state.name || state}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* City Dropdown */}
                    <Select
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleSelectChange}
                      fullWidth
                      displayEmpty
                      required
                    >
                      <MenuItem value=""><em>Select City</em></MenuItem>
                      {cities.map((city) => (
                        <MenuItem key={city.id || city} value={city.name || city}>
                          {city.name || city}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextField label="Zip" name="zip" value={formData.zip} onChange={handleFormChange} fullWidth required />
                    <TextField label="Slug" name="slug" value={formData.slug} onChange={handleFormChange} fullWidth required />
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
                    <TextField label="Store Manager Name" name="store_manager_name" value={formData.store_manager_name} onChange={handleFormChange} fullWidth required />
                    <TextField label="Head Cashier Name" name="store_head_cashier_name" value={formData.store_head_cashier_name} onChange={handleFormChange} fullWidth required />
                  </Stack>
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <TextField label="Store Manager Phone" name="store_manager_phone" value={formData.store_manager_phone} onChange={handleFormChange} fullWidth required />
                    <TextField label="Head Cashier Phone" name="store_head_cashier_phone" value={formData.store_head_cashier_phone} onChange={handleFormChange} fullWidth required />
                  </Stack>
                </Box>
              </Card>

              {/* Bank Details */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Bank Details</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <TextField label="Bank Name" name="bank_name" value={formData.bank_name} onChange={handleFormChange} fullWidth required />
                  </Stack>
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <TextField label="Account Number" name="account_number" value={formData.account_number} onChange={handleFormChange} fullWidth required />
                    <TextField label="IFSC Code" name="ifsc_code" value={formData.ifsc_code} onChange={handleFormChange} fullWidth required />
                  </Stack>
                </Box>
              </Card>

              {/* Store Image */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Store Image</Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={
                        formData.store_image instanceof File
                          ? URL.createObjectURL(formData.store_image)
                          : typeof formData.store_image === 'string' && formData.store_image
                            ? formData.store_image.startsWith('/uploads/')
                              ? apiService.getImageBaseUrl() + formData.store_image
                              : formData.store_image
                            : ''
                      }
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
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
          </form>
          {/* Customer Table for Channel Partner */}
          {editMode === 'edit' && (
            <Card sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Channel partner users</Typography>
              <Button variant="contained" sx={{ mb: 2 }} startIcon={<Iconify icon="solar:pen-bold" />} onClick={handleAddCustomer}>Add Channel partner users</Button>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>ID</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Full Name</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Phone</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Email</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerLoading ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>Loading...</td></tr>
                    ) : partnerCustomers.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>No Channel partner users found</td></tr>
                    ) : (
                      partnerCustomers.map((customer) => (
                        <tr key={customer.id}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{customer.id}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{customer.customer_name}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{customer.mobile}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{customer.email}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditCustomer(customer)}>Edit</Button>
                              <Button size="small" variant="outlined" color="error" onClick={() => {
                              setCustomerToDelete(customer);
                              setDeleteCustomerDialogOpen(true);
                            }}>Delete</Button>
                            </Box>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Box>
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {/* Add/Edit Customer Dialog */}
          <Dialog open={customerDialogOpen} onClose={handleCustomerDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle>{customerEditMode === 'add' ? 'Add Channel partner users' : 'Edit Channel partner users'}</DialogTitle>
            <DialogContent>
              <form id="customer-form" onSubmit={handleCustomerSubmit}>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <TextField label="Full Name" name="customer_name" value={customerFormData.customer_name} onChange={handleCustomerFormChange} fullWidth required />
                  <TextField label="Mobile" name="mobile" value={customerFormData.mobile} onChange={handleCustomerFormChange} fullWidth required />
                  <TextField label="Email" name="email" value={customerFormData.email} onChange={handleCustomerFormChange} fullWidth required />
                  <TextField label="Address" name="address" value={customerFormData.address} onChange={handleCustomerFormChange} fullWidth required />
                </Stack>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCustomerDialogClose} color="inherit">Cancel</Button>
              <Button type="submit" form="customer-form" variant="contained" color="primary">{customerEditMode === 'add' ? 'Add' : 'Save'}</Button>
            </DialogActions>
          </Dialog>
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
      <Dialog
        open={deleteCustomerDialogOpen}
        onClose={handleDeleteCustomerCancel}
        aria-labelledby="delete-customer-dialog-title"
        aria-describedby="delete-customer-dialog-description"
      >
        <DialogTitle id="delete-customer-dialog-title">
          Delete Channel partner users
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-customer-dialog-description">
            Are you sure you want to delete the Channel partner user "{customerToDelete?.customer_name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCustomerCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteCustomerConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}