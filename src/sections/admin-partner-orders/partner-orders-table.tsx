import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import Visibility from '@mui/icons-material/VisibilityOutlined';

interface ChannelPartner {
  id: number;
  name: string;
}
interface Brand {
  id: number;
  brand_name: string;
}
interface City {
  id: number;
  name: string;
}
interface OrderStatus {
  id: number;
  name: string;
}
interface Order {
  id: number;
  user_id: number;
  channelPartner?: ChannelPartner;
  created_at: string;
  brand?: Brand;
  specification_text: string;
  problems?: string;
  switch_cond?: number;
  mobile: string;
  cityData?: City;
  orderStatus?: OrderStatus;
  approx_price: number;
  order_status: number;
}


interface PartnerOrdersTableProps {
  orders: Order[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewOrder?: (order: Order) => void;
}

export function PartnerOrdersTable({
  orders,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewOrder,
}: PartnerOrdersTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User Id</TableCell>
            <TableCell>Channel Partner</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Brand Name</TableCell>
            <TableCell>Specification Details</TableCell>
            <TableCell>Problems</TableCell>
            <TableCell>Is working?</TableCell>
            <TableCell>Mobile Number</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={13} align="center">
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} align="center">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user_id}</TableCell>
                <TableCell>{order.channelPartner?.name || '-'}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                <TableCell>{order.brand?.brand_name || '-'}</TableCell>
                <TableCell>
                  {order.specification_text
                    ? order.specification_text
                        .split(/[,/;]+/)
                        .map((part) => {
                          const idx = part.indexOf(':');
                          return idx !== -1 ? part.slice(idx + 1).trim() : part.trim();
                        })
                        .filter(Boolean)
                        .join(', ')
                    : '-'}
                </TableCell>
                <TableCell>{order.problems || '-'}</TableCell>
                <TableCell>{order.switch_cond === 1 ? 'Yes' : 'No'}</TableCell>
                <TableCell>{order.mobile}</TableCell>
                <TableCell>{order.cityData?.name || '-'}</TableCell>
                <TableCell>{order.approx_price}</TableCell>
                <TableCell>{order.orderStatus?.name}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => onViewOrder && onViewOrder(order)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </TableContainer>
  );
}
