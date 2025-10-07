import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import { Scrollbar } from 'src/components/scrollbar';

import type { Vendor } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface VendorsTableProps {
  vendors: Vendor[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onView: (vendor: Vendor) => void;
  onDelete: (vendorId: number) => void;
}

export function VendorsTable({
  vendors,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onDelete,
}: VendorsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  const handleDeleteClick = useCallback((vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (vendorToDelete) {
      onDelete(vendorToDelete.id);
      setDeleteDialogOpen(false);
      setVendorToDelete(null);
    }
  }, [vendorToDelete, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return '-';
    return address.length > 50 ? `${address.substring(0, 50)}...` : address;
  };

  const getStatusChip = (status: number) => {
    if (status === 1) {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="error" size="small" />;
  };

  return (
    <Card>
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Vendors Management</Typography>
          </Box>
        </Box>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Store Name</TableCell>
                <TableCell>Store Address</TableCell>
                <TableCell>Contact Name</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Loading vendors...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No vendors found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor, index) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {page * rowsPerPage + index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" noWrap>
                        {vendor.store_name || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" title={vendor.store_address}>
                        {formatAddress(vendor.store_address)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {vendor.contact_name || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {vendor.contact_number || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => onView(vendor)}
                        sx={{ mr: 1 }}
                      >
                        <Iconify icon="solar:eye-bold" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(vendor)}
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
                Delete Vendor
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-dialog-description">
                  Are you sure you want to delete the vendor "{vendorToDelete?.store_name}"? 
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