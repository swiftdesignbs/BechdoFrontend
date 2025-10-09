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

interface OrderStatus {
  id: number;
  name: string;
}
interface Order {
  id: number;
  city: string;
  total_orders: number;
  pending: number;
  product_received: number;
  request_for_pick_up: number;
  pick_up_request_accepted: number;
}


interface CityOrdersTableProps {
  orders: Order[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewOrder?: (order: Order) => void;
}

export function CityOrdersTable({
  orders,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewOrder,
}: CityOrdersTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Total Orders</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>Product Received</TableCell>
            <TableCell>Request For Pick Up</TableCell>
            <TableCell>Pick Up Request Accepted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order.city || 0}</TableCell>
                <TableCell>{order.total_orders || 0}</TableCell>
                <TableCell>{order.pending || 0}</TableCell>
                <TableCell>{order.product_received || 0}</TableCell>
                <TableCell>{order.request_for_pick_up || 0}</TableCell>
                <TableCell>{order.pick_up_request_accepted || 0}</TableCell>
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
