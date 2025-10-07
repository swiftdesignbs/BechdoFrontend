import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { PartnerOrdersTable } from './partner-orders-table';
import { PartnerOrdersFilter } from './partner-orders-filter';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useMemo } from 'react';
import { apiService } from 'src/utils/api-service';

// Dummy data for brands, cities, stores (replace with API calls as needed)
const DUMMY_BRANDS = [
  { id: 4, brand_name: 'HP' },
  { id: 5, brand_name: 'Dell' },
];
const DUMMY_CITIES = [
  { id: 604, name: 'Hyderabad' },
  { id: 605, name: 'Mumbai' },
];
const DUMMY_STORES = [
  { id: 1, name: 'Croma Panjagutta' },
  { id: 2, name: 'Reliance Digital' },
];

export function AdminPartnerOrdersView() {
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
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ search: string; brand_id: string; order_status: string; city: string; store_id: string; from: Date | null; to: Date | null }>({ search: '', brand_id: '', order_status: '', city: '', store_id: '', from: null, to: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
        search: filters.search || '',
        brand_id: filters.brand_id || '',
        order_status: filters.order_status || '',
        city: filters.city || '',
        store_id: filters.store_id || '',
        daterange: filters.from && filters.to ? `${(filters.from as Date).toISOString()}_${(filters.to as Date).toISOString()}` : '',
      });
      const result = await apiService.getPartnerOrders(Object.fromEntries(params.entries()));
      if (result.success) {
        setOrders(result.data.data || []);
        setTotalCount(result.data.total || 0);
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to fetch orders', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch orders', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Container maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Partner Orders</Typography>
      </Stack>
      <PartnerOrdersFilter
        filters={filters}
        onChange={setFilters}
        brands={DUMMY_BRANDS}
        cities={DUMMY_CITIES}
        stores={DUMMY_STORES}
      />
      <Card>
        <PartnerOrdersTable
          orders={orders}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={(_e: unknown, newPage: number) => setPage(newPage)}
          onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          onViewOrder={setViewOrder}
        />
      </Card>
      <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {viewOrder && (
            <Box component="form" id="order-update-form" onSubmit={handleOrderUpdate} sx={{ width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '10px', border: '1px solid #bdbdbd', width: '40%', textAlign: 'left' }}>Point</th>
                    <th style={{ padding: '10px', border: '1px solid #bdbdbd', textAlign: 'left' }}>Review</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Switching Condition</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.switch_cond === 1 ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Brand Name</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.brand?.brand_name || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Model Name</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.model_name || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Series</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.series || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Processor</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.processor || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>RAM</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.ram || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Hard Disk</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.hard_disk || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>SSD (Solid State Drive)</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.ssd || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Touch Screen</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.touch_screen || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Screen Size</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.screen_size || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Graphics Card</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.graphics_card || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Charger</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.charger || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Functional Condition</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.functional_condition || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Physical Condition</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.physical_condition || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Age of Laptop</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.age_of_laptop || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Note</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.note || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Approximated Offer Price</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.approx_price ? `₹ ${viewOrder.approx_price}` : '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Offer Price</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}><input name="offer_price" type="number" defaultValue={viewOrder.offer_price || ''} style={{ width: '100%' }} /></td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Order Status</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                      <select name="order_status" defaultValue={viewOrder.order_status} style={{ width: '100%' }}>
                        <option value={1}>Pending</option>
                        <option value={2}>Completed</option>
                        <option value={3}>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Comments</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}><textarea name="comments" defaultValue={viewOrder.comments || ''} style={{ width: '100%' }} placeholder="Enter comments..." /></td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Expected Delivery Date</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.expected_delivery_date || 'Not Available'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Expected Delivery Time</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.expected_delivery_time || 'Not Available'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Zipcode</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.zipcode || '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>Payment Method</td>
                    <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>{viewOrder.payment_method || 'NOT FOUND'}</td>
                  </tr>
                </tbody>
              </table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOrder(null)}>Close</Button>
          <Button type="submit" form="order-update-form" variant="contained">Update</Button>
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
