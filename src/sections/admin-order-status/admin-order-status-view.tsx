import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { OrderStatusesTable } from './order-status-table';
import { OrderStatusFormModal } from './order-status-form-modal';

import { apiService } from 'src/utils/api-service';
import type { OrderStatus, CreateOrderStatusRequest, OrderStatusesListResponse } from 'src/utils/api-service';

// ----------------------------------------------------------------------

export function AdminOrderStatusView() {
  const theme = useTheme();
  const router = useRouter();

  // State management
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingOrderStatus, setEditingOrderStatus] = useState<OrderStatus | null>(null);
  // Note: formLoading removed since UserFormModal handles its own loading state

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch order statuses data
  const fetchOrderStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrderStatuses(page + 1, rowsPerPage);
      if (response.success && response.data) {
        setOrderStatuses(response.data.orderStatuses || []);
        
        // Handle both new pagination structure and legacy structure
        let totalItems = 0;
        if (response.data.pagination) {
          totalItems = response.data.pagination.totalItems;
        } else if (response.data.total !== undefined) {
          totalItems = response.data.total;
        }
        
        setTotalCount(totalItems);
      } else {
        showSnackbar('Failed to fetch order statuses: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching order statuses: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Load order statuses on component mount and when page/limit changes
  useEffect(() => {
    fetchOrderStatuses();
  }, [fetchOrderStatuses]);

  // Snackbar helper
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Order status form handlers
  const handleAddOrderStatus = useCallback(() => {
    setEditingOrderStatus(null);
    setFormDialogOpen(true);
  }, []);

  const handleEditOrderStatus = useCallback((orderStatus: OrderStatus) => {
    setEditingOrderStatus(orderStatus);
    setFormDialogOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setFormDialogOpen(false);
    setEditingOrderStatus(null);
  }, []);

  // Note: handleFormSubmit is now handled internally by UserFormModal
  // const handleFormSubmit = useCallback(async (formData: CreateUserRequest) => {
  //   ... (functionality moved to UserFormModal component)
  // }, [editingUser, fetchUsers, showSnackbar]);

  // Delete order status handler
  const handleDeleteOrderStatus = useCallback(async (orderStatusId: number) => {
    try {
      const response = await apiService.deleteOrderStatus(orderStatusId);
      if (response.success) {
        showSnackbar('Order status deleted successfully!', 'success');
        fetchOrderStatuses(); // Refresh the list
      } else {
        showSnackbar('Failed to delete order status: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar(
        'Error deleting order status: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'error'
      );
    }
  }, [fetchOrderStatuses, showSnackbar]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    router.push('/');
  }, [router]);

  // Order status stats (you can make this dynamic by adding stats API)
  const orderStatusStats = [
    { title: 'Total Order Statuses', value: totalCount.toString(), color: 'primary.main' },
    { title: 'Active Order Statuses', value: orderStatuses.length.toString(), color: 'success.main' },
    { title: 'Roles', value: new Set(orderStatuses.map(u => u.role)).size.toString(), color: 'info.main' },
    { title: 'Avg Age', value: '30', color: 'warning.main' },
  ];

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">User Management</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={handleAddOrderStatus}
            >
              Add Order Status
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box> */}

        {/* Stats Cards */}
        {/* <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {userStats.map((stat) => (
            <Card key={stat.title} sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {stat.title}
              </Typography>
            </Card>
          ))}
        </Box> */}

        {/* Order Status Table */}
        <OrderStatusesTable
          orderStatuses={orderStatuses}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleEditOrderStatus}
          onDelete={handleDeleteOrderStatus}
          onAddOrderStatus={handleAddOrderStatus}
        />

        {/* OrderStatus Form Modal */}
        <OrderStatusFormModal
          open={formDialogOpen}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            fetchOrderStatuses(); // Refresh the order statuses list
            showSnackbar(
              editingOrderStatus
                ? 'Order status updated successfully!'
                : 'Order status created successfully!',
              'success'
            );
          }}
          editingOrderStatus={editingOrderStatus}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
}