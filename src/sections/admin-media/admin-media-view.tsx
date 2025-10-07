import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';

import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

import { apiService, type Image } from 'src/utils/api-service';

// ----------------------------------------------------------------------

export function AdminMediaView() {
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  }, [router]);

  const loadImages = useCallback(async (currentPage: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getImages(currentPage, limit);
      
      if (response.success && response.data) {
        setImages(response.data.data || []);
        if (response.data.total) {
          setTotalPages(Math.ceil(response.data.total / limit));
        }
      } else {
        setError(response.error || 'Failed to load images');
      }
    } catch (err) {
      setError('Network error while loading images');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid image file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await apiService.uploadImage(selectedFile);
      
      if (response.success) {
        setSuccess('Image uploaded successfully');
        setUploadDialogOpen(false);
        setSelectedFile(null);
        // Refresh the images list
        await loadImages(page);
      } else {
        setError(response.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Network error while uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await apiService.deleteImage(imageId);
      
      if (response.success) {
        setSuccess('Image deleted successfully');
        // Refresh the images list
        await loadImages(page);
      } else {
        setError(response.error || 'Failed to delete image');
      }
    } catch (err) {
      setError('Network error while deleting image');
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    loadImages(value);
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${apiService.getImageBaseUrl()}${imagePath}`;
  };

  useEffect(() => {
    loadImages(1);
  }, [loadImages]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Media Management</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload Image
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Loading indicator */}
        {loading && <LinearProgress />}

        {/* Images Grid */}
        <Grid container spacing={3}>
          {images.map((image) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(image.image_path)}
                  alt={image.image_name}
                  sx={{
                    objectFit: 'cover',
                    backgroundColor: 'grey.100',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {image.image_name}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty state */}
        {!loading && images.length === 0 && (
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <Iconify icon="solar:eye-bold" sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No images found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload your first image to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload Image
            </Button>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        {/* Upload Dialog */}
        <Dialog
          open={uploadDialogOpen}
          onClose={() => !uploading && setUploadDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Upload New Image</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="image-upload-input"
              />
              <label htmlFor="image-upload-input">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  sx={{ height: 120, border: '2px dashed', borderColor: 'grey.300' }}
                >
                  {selectedFile ? selectedFile.name : 'Click to select image'}
                </Button>
              </label>
              
              {selectedFile && (
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
              
              {uploading && <LinearProgress />}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={!selectedFile || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}