import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { Box, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityOutlined';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

interface Brand {
  id: number;
  brand_name: string;
  brandImage?: {
    id: number;
    image_name: string;
    image_path: string;
  };
}

interface OrderStatus {
  id: number;
  name: string;
}

interface Order {
  id: number;
  created_at: string;
  brand: Brand;
  model: string;
  order_status: number;
  offer_price: number;
  approx_price: number;
  orderStatus: OrderStatus;
}

interface UserOrdersTableProps {
  orders: Order[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewOrder: (orderId: number) => void;
}

// Helper function to get brand image URL
const getBrandImageUrl = (brand: Brand): string => {
  if (brand.brandImage) {
    // Convert public path to proper URL
    const imagePath = brand.brandImage.image_path.replace('public/', '');
    return `${CONFIG.apiBaseUrl}/${imagePath}${brand.brandImage.image_name}`;
  }
  return '';
};

// Helper function to get status color
const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'approved':
    case 'completed':
      return 'success';
    case 'rejected':
    case 'cancelled':
      return 'error';
    case 'processing':
    case 'request for pick up':
      return 'info';
    default:
      return 'default';
  }
};

export function UserOrdersTable({
  orders,
  totalCount,
  page,
  rowsPerPage,
  loading,
  onPageChange,
  onRowsPerPageChange,
  onViewOrder,
}: UserOrdersTableProps) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Brand Name</TableCell>
              <TableCell>Model No</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Offer Price</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    {order.id}
                  </TableCell>
                  
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getBrandImageUrl(order.brand) ? (
                        <Avatar 
                          src={getBrandImageUrl(order.brand)} 
                          alt={order.brand.brand_name}
                          sx={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {order.brand.brand_name.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                      <Typography variant="body2">
                        {order.brand.brand_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {order.model || 'N/A'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={order.orderStatus?.name || 'Unknown'}
                      color={getStatusColor(order.orderStatus?.name || '')}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      ₹{order.offer_price || order.approx_price}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    {/* Add action buttons here if needed */}
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => onViewOrder(order.id)}
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  );
}