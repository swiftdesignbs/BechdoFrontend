import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { UserOrdersTable } from './user-orders-table';
import { apiService } from 'src/utils/api-service';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

interface Order {
  id: number;
  session_id: string;
  user_id: number;
  brand_id: number;
  model_id: number | null;
  model: string;
  switch_cond: number;
  processor: string;
  mac_series: string;
  ram: string;
  harddisk: string;
  touch_screen: string;
  screen_size: string;
  charger: string;
  graphics: string;
  functional_cod: string;
  age_laptop: string;
  physical_cond: string;
  note: string;
  is_mac: boolean;
  status: number;
  order_status: number;
  offer_price: number;
  user_offer_price: number | null;
  approx_price: number;
  user_status: number;
  name: string | null;
  email: string | null;
  mobile: string;
  address: string | null;
  state: string | null;
  city: number;
  zipcode: number;
  payment_method_id: number | null;
  account_holder: string | null;
  bank_name: string | null;
  ifsc_code: string | null;
  branch_address: string | null;
  upi_id: string | null;
  expected_date: string | null;
  expected_time: string | null;
  ssd: string;
  order_image: string;
  order_image_2: string;
  order_image_3: string;
  order_image_4: string;
  specification_text: string;
  comments: string | null;
  notification_shown: boolean;
  bonus: number;
  bonus_applicable: boolean;
  created_at: string;
  updated_at: string;
  brand: {
    id: number;
    brand_name: string;
    brandImage?: {
      id: number;
      image_name: string;
      image_path: string;
    };
  };
  customer: {
    id: number;
    customer_name: string;
    email: string;
    mobile: string;
  };
  channelPartner: {
    id: number;
    name: string;
  } | null;
  orderStatus: {
    id: number;
    name: string;
  };
}

interface OrdersResponse {
  data: Order[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

interface SingleOrderResponse {
  data: Order;
}

export function UserOrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiService.getMyOrders(page + 1, rowsPerPage);
      if (result.success && result.data) {
        const ordersData = result.data as OrdersResponse;
        setOrders(ordersData.data || []);
        setTotalCount(ordersData.pagination.totalItems || 0);
      } else {
        setSnackbar({ 
          open: true, 
          message: result.error || 'Failed to fetch orders', 
          severity: 'error' 
        });
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to fetch orders', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  const fetchSingleOrder = useCallback(async (orderId: number) => {
    try {
      const result = await apiService.getMyOrderById(orderId);
      if (result.success && result.data) {
        const orderData = result.data as SingleOrderResponse;
        setViewOrder(orderData.data);
      } else {
        setSnackbar({ 
          open: true, 
          message: result.error || 'Failed to fetch order details', 
          severity: 'error' 
        });
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to fetch order details', 
        severity: 'error' 
      });
    }
  }, []);

  const handleViewOrder = useCallback((orderId: number) => {
    fetchSingleOrder(orderId);
  }, [fetchSingleOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Container maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">My Orders</Typography>
      </Stack>

      <Card>
        <UserOrdersTable
          orders={orders}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onPageChange={(_e: unknown, newPage: number) => setPage(newPage)}
          onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => { 
            setRowsPerPage(parseInt(e.target.value, 10)); 
            setPage(0); 
          }}
          onViewOrder={handleViewOrder}
        />
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} maxWidth="lg" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {viewOrder && (
            <Box sx={{ width: '100%' }}>
              {(() => {
                // Parse specification_text into key-value pairs
                const specifications: Record<string, string> = {};
                
                if (viewOrder.specification_text) {
                  // Simple split approach that handles the semicolon case
                  const items = viewOrder.specification_text.split(', ');
                  let i = 0;
                  
                  while (i < items.length) {
                    const item = items[i];
                    const colonIndex = item.indexOf(':');
                    
                    if (colonIndex > -1) {
                      const key = item.substring(0, colonIndex).trim();
                      let value = item.substring(colonIndex + 1).trim();
                      
                      // Look ahead to see if next items don't have colons (they're part of this value)
                      let nextIndex = i + 1;
                      while (nextIndex < items.length && !items[nextIndex].includes(':')) {
                        value += ', ' + items[nextIndex];
                        nextIndex++;
                      }
                      
                      specifications[key] = value;
                      i = nextIndex;
                    } else {
                      i++;
                    }
                  }
                  
                  console.log('Specification text:', viewOrder.specification_text);
                  console.log('Parsed specifications:', specifications);
                }

                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9', width: '200px' }}>
                          Order Id
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {viewOrder.id}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Date
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {new Date(viewOrder.created_at).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Brand Name
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {viewOrder.brand?.brandImage ? (
                              <Avatar 
                                src={(() => {
                                  const imagePath = viewOrder.brand.brandImage.image_path.replace('public/', '');
                                  return `${CONFIG.apiBaseUrl}/${imagePath}${viewOrder.brand.brandImage.image_name}`;
                                })()}
                                alt={viewOrder.brand.brand_name}
                                sx={{ width: 32, height: 32 }}
                              />
                            ) : (
                              <Box 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  borderRadius: '50%', 
                                  backgroundColor: '#f44336', 
                                  color: 'white', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {viewOrder.brand?.brand_name?.charAt(0)?.toUpperCase() || '?'}
                              </Box>
                            )}
                            {viewOrder.brand?.brand_name}
                          </Box>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Model Name
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Model'] || viewOrder.model || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Processor
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Processor'] || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          RAM
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['RAM'] || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Hard Disk
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Hard Disk'] || 'N/A'}
                        </td>
                      </tr>
                      {specifications['SSD'] && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            SSD
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {specifications['SSD']}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Touch Screen
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Touch Screen'] || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Screen Size
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Screen Size'] || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Graphics Card
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['External Graphics Card'] || 'N/A'}
                        </td>
                      </tr>
                      {specifications['Charger'] && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Charger
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {specifications['Charger']}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Functional Condition
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Functional Condition'] || 'Good'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Physical Condition
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Physical Condition'] || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Age of Laptop
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {specifications['Age of Laptop'] || 'N/A'}
                        </td>
                      </tr>
                      {specifications['Laptop working'] && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Laptop working
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {specifications['Laptop working']}
                          </td>
                        </tr>
                      )}
                      {viewOrder.note && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Note
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {viewOrder.note}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Approximated Offer Price
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          ₹ {viewOrder.approx_price}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Offer Price
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          {viewOrder.offer_price || '0.00'}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                          Order status
                        </td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                          <Chip
                            label={viewOrder.orderStatus?.name || 'Unknown'}
                            color={viewOrder.orderStatus?.name === 'Product Received' ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </td>
                      </tr>
                      {viewOrder.address && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Address
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {viewOrder.address}
                          </td>
                        </tr>
                      )}
                      {viewOrder.zipcode && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Zipcode
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {viewOrder.zipcode}
                          </td>
                        </tr>
                      )}
                      {viewOrder.expected_date && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Expected Delivery Date
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {new Date(viewOrder.expected_date).toLocaleDateString()}
                          </td>
                        </tr>
                      )}
                      {viewOrder.expected_time && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Expected Delivery Time
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {viewOrder.expected_time}
                          </td>
                        </tr>
                      )}
                      {viewOrder.payment_method_id && (
                        <tr>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            Payment Method
                          </td>
                          <td style={{ border: '1px solid #bdbdbd', padding: '8px', verticalAlign: 'top' }}>
                            {viewOrder.payment_method_id}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                );
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOrder(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}