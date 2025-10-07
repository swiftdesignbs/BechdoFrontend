import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useRouter } from 'src/routes/hooks';


import { VendorView } from './vendor-view';
import { VendorsTable } from './vendors-table';

import { apiService } from 'src/utils/api-service';
import type { Vendor, VendorsListResponse } from 'src/utils/api-service';

// ----------------------------------------------------------------------

export function AdminVendorsView() {
  const router = useRouter();

  // State management
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch vendors data
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getVendors(page + 1, rowsPerPage);
      if (response.success && response.data) {
        setVendors(response.data.data || []);
        
        // Handle both new pagination structure and legacy structure
        let totalItems = 0;
        if (response.data.pagination) {
          totalItems = response.data.pagination.totalItems;
        } else if (response.data.total !== undefined) {
          totalItems = response.data.total;
        }
        
        setTotalCount(totalItems);
      } else {
        showSnackbar('Failed to fetch vendors: ' + (response.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching vendors: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Load vendors on component mount and when page/limit changes
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

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

  const handleViewVendor = useCallback((vendor: Vendor) => {
      setViewingVendor(vendor);
    }, []);

   const handleDeleteVendor = useCallback(async (vendorId: number) => {
      try {
        const response = await apiService.deleteVendor(vendorId);
        if (response.success) {
          showSnackbar('Vendor deleted successfully!', 'success');
          fetchVendors(); // Refresh the list
        } else {
          showSnackbar('Failed to delete vendor: ' + (response.error || 'Unknown error'), 'error');
        }
      } catch (error) {
        showSnackbar(
          'Error deleting vendor: ' + (error instanceof Error ? error.message : 'Unknown error'),
          'error'
        );
      }
    }, [fetchVendors, showSnackbar]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    router.push('/');
  }, [router]);


  // Vendor stats
  // const activeVendors = vendors.filter(vendor => vendor.status === 1).length;
  // const vendorCustomers = vendors.filter(vendor => vendor.isCustomer === 1).length;

  // const vendorStats = [
  //   { title: 'Total Vendors', value: totalCount.toString(), color: 'primary.main' },
  //   { title: 'Active Vendors', value: activeVendors.toString(), color: 'success.main' },
  //   { title: 'Vendors', value: vendorCustomers.toString(), color: 'info.main' },
  //   { title: 'Current Page', value: `${page + 1} of ${Math.ceil(totalCount / rowsPerPage)}`, color: 'warning.main' },
  // ];

  // Conditional rendering: show vendor details page or vendors table
  if (viewingVendor) {
    return (
      <Container maxWidth="lg">
        <VendorView vendor={viewingVendor} onClose={() => setViewingVendor(null)} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        {/* Vendors Table */}
        <VendorsTable
          vendors={vendors}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onView={handleViewVendor}
          onDelete={handleDeleteVendor}
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