import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Scrollbar } from 'src/components/scrollbar/scrollbar';
import { Iconify } from 'src/components/iconify';

import { OrderStatus } from 'src/utils/api-service';
import { apiService } from 'src/utils/api-service';

// Define OrderStatus type here (based on typical usage)
export interface OrderStatusTableProps {
  orderStatuses: OrderStatus[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (orderStatus: OrderStatus) => void;
  onDelete: (id: number) => void;
  onAddOrderStatus: () => void;
}



export interface OrderStatus {
  id: number;
  name: string;
  status: number;
}

export function OrderStatusTable({
  orderStatuses,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onAddOrderStatus,
}: OrderStatusTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderStatusToDelete, setOrderStatusToDelete] = useState<OrderStatus | null>(null);

  const handleDeleteClick = useCallback((orderStatus: OrderStatus) => {
    setOrderStatusToDelete(orderStatus);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (orderStatusToDelete) {
      onDelete(orderStatusToDelete.id);
      setDeleteDialogOpen(false);
      setOrderStatusToDelete(null);
    }
  }, [orderStatusToDelete, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setOrderStatusToDelete(null);
  }, []);

  return (
    <Card>
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Order Statuses Management</Typography>
          {/* <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={onAddOrderStatus}
          >
            Add Order Status
          </Button> */}
        </Box>
      </Box>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading order statuses...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : orderStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No order statuses found
                    </Typography>
                  </TableCell>
                </TableRow>
              ): (
                orderStatuses.map((orderStatus, index) => (
                  <TableRow key={orderStatus.id} hover>
                    <TableCell>
                      <Typography>
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" noWrap>
                        {orderStatus.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                    <Typography>
                      {orderStatus.status === 1 ? 'Active' : orderStatus.status === 0 ? 'Disabled' : orderStatus.status}
                    </Typography>
                  </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(orderStatus)}
                        sx={{ mr: 1 }}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showFirstButton
        showLastButton
      />
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the order status "{orderStatusToDelete?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
