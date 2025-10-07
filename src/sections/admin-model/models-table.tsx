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

import type { Model } from 'src/utils/api-service';
import { apiService } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface ModelsTableProps {
  models: Model[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (model: Model) => void;
  onDelete: (modelId: number) => void;
  onAddModel: () => void;
}

export function ModelsTable({
  models,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onAddModel,
}: ModelsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);

  const handleDeleteClick = useCallback((model: Model) => {
    setModelToDelete(model);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (modelToDelete) {
      onDelete(modelToDelete.id);
      setDeleteDialogOpen(false);
      setModelToDelete(null);
    }
  }, [modelToDelete, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setModelToDelete(null);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${apiService.getImageBaseUrl()}${imagePath}`;
  };

  return (
    <Card>
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Models Management</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={onAddModel}
          >
            Add Model
          </Button>
        </Box>
      </Box>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thumbnail</TableCell>
                <TableCell>Model Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Price Range</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading models...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No models found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => (
                  <TableRow key={model.id} hover>
                    <TableCell>
                      {model.modelImage ? (
                        <Avatar
                          src={getImageUrl(model.modelImage.image_path)}
                          alt={model.model_name}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        >
                          {model.model_name.charAt(0).toUpperCase()}
                        </Avatar>
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{ width: 48, height: 48, bgcolor: 'grey.200' }}
                        >
                          {model.model_name.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" noWrap>
                        {model.model_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={model.brandName?.brand_name || 'N/A'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        ${model.price_rng}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(model.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(model)}
                        sx={{ mr: 1 }}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(model)}
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
          Delete Model
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the model "{modelToDelete?.model_name}"? 
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