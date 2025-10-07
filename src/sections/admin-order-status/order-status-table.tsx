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
import { alpha } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { OrderStatus } from 'src/utils/api-service';
import { apiService } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface OrderStatusesTableProps {
  orderStatuses: OrderStatus[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (orderStatus: OrderStatus) => void;
  onDelete: (orderStatusId: number) => void;
  onAddOrderStatus: () => void;
}

export function OrderStatusesTable({
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
}: OrderStatusesTableProps) {
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
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={onAddOrderStatus}
          >
            Add Order Status
          </Button>
        </Box>
      </Box>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>	User Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading order statuses...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : orderStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No order statuses found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orderStatuses.map((orderStatus, index) => (
                  <TableRow key={orderStatus.id} hover>
                    <TableCell>
                      <Typography>
                        {page * rowsPerPage + index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" noWrap>
                        {orderStatus.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {orderStatus.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {orderStatus.is_super ? 'Super Admin' : 'Staff'}
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
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(orderStatus)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
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