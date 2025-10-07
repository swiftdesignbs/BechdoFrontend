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
import { UsersTable } from './user-table';
import { UserFormModal } from './user-form-modal';

import { apiService } from 'src/utils/api-service';
import type { User, CreateUserRequest, UsersListResponse } from 'src/utils/api-service';

// ----------------------------------------------------------------------

export function AdminUserView() {
  const theme = useTheme();
  const router = useRouter();

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Note: formLoading removed since UserFormModal handles its own loading state

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers(page + 1, rowsPerPage);
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        
        // Handle both new pagination structure and legacy structure
        let totalItems = 0;
        if (response.data.pagination) {
          totalItems = response.data.pagination.totalItems;
        } else if (response.data.total !== undefined) {
          totalItems = response.data.total;
        }
        
        setTotalCount(totalItems);
      } else {
        showSnackbar('Failed to fetch users: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching users: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Load users on component mount and when page/limit changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  // User form handlers
  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setFormDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setFormDialogOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setFormDialogOpen(false);
    setEditingUser(null);
  }, []);

  // Note: handleFormSubmit is now handled internally by UserFormModal
  // const handleFormSubmit = useCallback(async (formData: CreateUserRequest) => {
  //   ... (functionality moved to UserFormModal component)
  // }, [editingUser, fetchUsers, showSnackbar]);

  // Delete user handler
  const handleDeleteUser = useCallback(async (userId: number) => {
    try {
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        showSnackbar('User deleted successfully!', 'success');
        fetchUsers(); // Refresh the list
      } else {
        showSnackbar('Failed to delete user: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar(
        'Error deleting user: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'error'
      );
    }
  }, [fetchUsers, showSnackbar]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    router.push('/');
  }, [router]);

  // User stats (you can make this dynamic by adding stats API)
  const userStats = [
    { title: 'Total Users', value: totalCount.toString(), color: 'primary.main' },
    { title: 'Active Users', value: users.length.toString(), color: 'success.main' },
    { title: 'Roles', value: new Set(users.map(u => u.role)).size.toString(), color: 'info.main' },
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
              onClick={handleAddUser}
            >
              Add User
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

        {/* Users Table */}
        <UsersTable
          users={users}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onAddUser={handleAddUser}
        />

        {/* User Form Modal */}
        <UserFormModal
          open={formDialogOpen}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            fetchUsers(); // Refresh the users list
            showSnackbar(
              editingUser 
                ? 'User updated successfully!' 
                : 'User created successfully!', 
              'success'
            );
          }}
          editingUser={editingUser}
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