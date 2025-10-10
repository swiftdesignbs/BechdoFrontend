import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import Typography from '@mui/material/Typography';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

// Channel Partner Table Types
export interface ChannelPartner {
  id: number;
  slug: string;
  name: string;
  vendorCode: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  discount_percentage: number;
}

interface ChannelPartnersTableProps {
  orders: ChannelPartner[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewOrder?: (order: ChannelPartner) => void;
  onEdit: (order: ChannelPartner) => void;
  onDelete: (orderId: number) => void;
  onAddChannelPartner: () => void;
}

export function ChannelPartnersTable({
  orders,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewOrder,
  onEdit,
  onDelete,
  onAddChannelPartner,
}: ChannelPartnersTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [channelPartnerToDelete, setChannelPartnerToDelete] = useState<ChannelPartner | null>(null);

  const handleDeleteClick = useCallback((channelPartner: ChannelPartner) => {
    setChannelPartnerToDelete(channelPartner);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (channelPartnerToDelete) {
      onDelete(channelPartnerToDelete.id);
      setDeleteDialogOpen(false);
      setChannelPartnerToDelete(null);
    }
  }, [channelPartnerToDelete, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setChannelPartnerToDelete(null);
  }, []);

  return (
    <Card>
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Channel Partners Management</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={onAddChannelPartner}
          >
            Add Channel Partner
          </Button>
        </Box>
      </Box>

      <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Slug</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Vendor Code</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell>Discount %</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            Loading channel partners...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            No channel partners found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((partner, idx) => (
                        <TableRow key={partner.id} hover>
                          <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                          <TableCell>{partner.slug}</TableCell>
                          <TableCell>{partner.name}</TableCell>
                          <TableCell>{partner.vendorCode}</TableCell>
                          <TableCell>{partner.email}</TableCell>
                          <TableCell>{partner.phone}</TableCell>
                          <TableCell>{partner.state}</TableCell>
                          <TableCell>{partner.city}</TableCell>
                          <TableCell>{partner.discount_percentage}</TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              onClick={() => onEdit(partner)}
                              sx={{ mr: 1 }}
                            >
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(partner)}
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
          Delete Channel Partner
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the brand "{channelPartnerToDelete?.name}"? 
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
