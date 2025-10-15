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
import { ModelsTable } from './models-table';
import { ModelFormModal } from './model-form-modal';

import { apiService } from 'src/utils/api-service';
import type { Model, CreateModelRequest, ModelsListResponse } from 'src/utils/api-service';

// ----------------------------------------------------------------------

export function AdminModelView() {
  const theme = useTheme();
  const router = useRouter();

  // State management
  const [models, setModels] = useState<Model[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch models data
  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getModels(page + 1, rowsPerPage);
      if (response.success && response.data) {
        setModels(response.data.data || []);
        
        // Handle both new pagination structure and legacy structure
        let totalItems = 0;
        if (response.data.pagination) {
          totalItems = response.data.pagination.totalItems;
        } else if (response.data.total !== undefined) {
          totalItems = response.data.total;
        }
        
        setTotalCount(totalItems);
      } else {
        showSnackbar('Failed to fetch models: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar(
        'Error fetching models: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Show snackbar notification
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Load models on component mount and when page/rowsPerPage changes
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Pagination handlers
  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Model form handlers
  const handleAddModel = useCallback(() => {
    setEditingModel(null);
    setFormDialogOpen(true);
  }, []);

  const handleEditModel = useCallback((model: Model) => {
    setEditingModel(model);
    setFormDialogOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setFormDialogOpen(false);
    setEditingModel(null);
  }, []);

  // Delete model handler
  const handleDeleteModel = useCallback(async (modelId: number) => {
    try {
      const response = await apiService.deleteModel(modelId);
      if (response.success) {
        showSnackbar('Model deleted successfully!', 'success');
        fetchModels(); // Refresh the list
      } else {
        showSnackbar('Failed to delete model: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar(
        'Error deleting model: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'error'
      );
    }
  }, [fetchModels, showSnackbar]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('customerId');
    localStorage.removeItem('user');
    router.push('/');
  }, [router]);

  // Model stats (you can make this dynamic by adding stats API)
  const modelStats = [
    { title: 'Total Models', value: totalCount.toString(), color: 'primary.main' },
    { title: 'Active Models', value: models.length.toString(), color: 'success.main' },
    { title: 'Brands', value: new Set(models.map(m => m.brand_id)).size.toString(), color: 'info.main' },
    { title: 'Avg Price Range', value: '$500-50K', color: 'warning.main' },
  ];

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Model Management</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={handleAddModel}
            >
              Add Model
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
          {modelStats.map((stat) => (
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

        {/* Models Table */}
        <ModelsTable
          models={models}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleEditModel}
          onDelete={handleDeleteModel}
          onAddModel={handleAddModel}
        />

        {/* Model Form Modal */}
        <ModelFormModal
          open={formDialogOpen}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            fetchModels(); // Refresh the models list
            showSnackbar(
              editingModel 
                ? 'Model updated successfully!' 
                : 'Model created successfully!', 
              'success'
            );
          }}
          editModel={editingModel}
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