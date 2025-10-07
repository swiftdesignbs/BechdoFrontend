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
import { BrandsTable } from './brands-table';
import { BrandFormModal } from './brand-form-modal';

import { apiService } from 'src/utils/api-service';
import type { Brand, CreateBrandRequest, BrandsListResponse } from 'src/utils/api-service';

// ----------------------------------------------------------------------

export function AdminBrandView() {
  const theme = useTheme();
  const router = useRouter();

  // State management
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  // Note: formLoading removed since BrandFormModal handles its own loading state

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch brands data
  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getBrands(page + 1, rowsPerPage);
      if (response.success && response.data) {
        setBrands(response.data.data || []);
        
        // Handle both new pagination structure and legacy structure
        let totalItems = 0;
        if (response.data.pagination) {
          totalItems = response.data.pagination.totalItems;
        } else if (response.data.total !== undefined) {
          totalItems = response.data.total;
        }
        
        setTotalCount(totalItems);
      } else {
        showSnackbar('Failed to fetch brands: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching brands: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Load brands on component mount and when page/limit changes
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

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

  // Brand form handlers
  const handleAddBrand = useCallback(() => {
    setEditingBrand(null);
    setFormDialogOpen(true);
  }, []);

  const handleEditBrand = useCallback((brand: Brand) => {
    setEditingBrand(brand);
    setFormDialogOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setFormDialogOpen(false);
    setEditingBrand(null);
  }, []);

  // Note: handleFormSubmit is now handled internally by BrandFormModal
  // const handleFormSubmit = useCallback(async (formData: CreateBrandRequest) => {
  //   ... (functionality moved to BrandFormModal component)
  // }, [editingBrand, fetchBrands, showSnackbar]);

  // Delete brand handler
  const handleDeleteBrand = useCallback(async (brandId: number) => {
    try {
      const response = await apiService.deleteBrand(brandId);
      if (response.success) {
        showSnackbar('Brand deleted successfully!', 'success');
        fetchBrands(); // Refresh the list
      } else {
        showSnackbar('Failed to delete brand: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar(
        'Error deleting brand: ' + (error instanceof Error ? error.message : 'Unknown error'),
        'error'
      );
    }
  }, [fetchBrands, showSnackbar]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    router.push('/');
  }, [router]);

  // Brand stats (you can make this dynamic by adding stats API)
  const brandStats = [
    { title: 'Total Brands', value: totalCount.toString(), color: 'primary.main' },
    { title: 'Active Brands', value: brands.length.toString(), color: 'success.main' },
    { title: 'Categories', value: new Set(brands.map(b => b.category)).size.toString(), color: 'info.main' },
    { title: 'Avg Price Range', value: '$1K-100K', color: 'warning.main' },
  ];

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Brand Management</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={handleAddBrand}
            >
              Add Brand
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
          {brandStats.map((stat) => (
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

        {/* Brands Table */}
        <BrandsTable
          brands={brands}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleEditBrand}
          onDelete={handleDeleteBrand}
          onAddBrand={handleAddBrand}
        />

        {/* Brand Form Modal */}
        <BrandFormModal
          open={formDialogOpen}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            fetchBrands(); // Refresh the brands list
            showSnackbar(
              editingBrand 
                ? 'Brand updated successfully!' 
                : 'Brand created successfully!', 
              'success'
            );
          }}
          editBrand={editingBrand}
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