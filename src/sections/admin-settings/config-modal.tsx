import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';

import { Iconify } from 'src/components/iconify';

import { apiService } from 'src/utils/api-service';
import type { 
  SystemConfigRequest, 
  SystemConfigCategory, 
  ConfigDataItem,
  WindowsSettingsData,
  ConfigItemDetail,
  Image
} from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface ConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  configType: string;
  configTitle: string;
  editItem?: ConfigDataItem | null;
  windowsData: WindowsSettingsData | null;
}

interface ProcessorFormData {
  id: number;
  title: string;
  visible: boolean;
  price: string;
}

export function ConfigModal({
  open,
  onClose,
  onSuccess,
  configType,
  configTitle,
  editItem = null,
  windowsData,
}: ConfigModalProps) {
  // State management
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [defaultPrice, setDefaultPrice] = useState('');
  const [processors, setProcessors] = useState<ProcessorFormData[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  // Image selection state
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesPage, setImagesPage] = useState(1);
  const [imagesTotalPages, setImagesTotalPages] = useState(1);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: Image }>({});

  // Check if this config type should show image upload
  useEffect(() => {
    setShowImageUpload(configType === 'FUNCTIONAL_CONDITION');
  }, [configType]);

  // Load individual image by ID (for edit mode)
  const loadIndividualImage = async (imageId: number) => {
    if (loadedImages[imageId]) return; // Already loaded
    
    try {
      const response = await apiService.getImage(imageId);
      if (response.success && response.data) {
        setLoadedImages(prev => ({
          ...prev,
          [imageId]: response.data!
        }));
      }
    } catch (err) {
      console.error('Error loading individual image:', err);
    }
  };

  // Load images for selection
  const loadImages = async (page: number) => {
    setImagesLoading(true);
    try {
      const response = await apiService.getImages(page, 12);
      if (response.success && response.data) {
        setImages(response.data.data);
        setImagesPage(page);
        setImagesTotalPages(Math.ceil((response.data.total || 0) / 12));
      }
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setImagesLoading(false);
    }
  };

  // Load images when image selector is opened
  useEffect(() => {
    if (showImageSelector && open) {
      loadImages(1);
    }
  }, [showImageSelector, open]);

  // Load individual image when selected (if not already loaded)
  useEffect(() => {
    if (selectedImageId && !getSelectedImage(selectedImageId)) {
      loadIndividualImage(selectedImageId);
    }
  }, [selectedImageId]);

  // Helper function to get selected image
  const getSelectedImage = (imageId: number | null): Image | null => {
    if (!imageId) return null;
    return loadedImages[imageId] || images.find(img => img.id === imageId) || null;
  };

  // Helper function to get image URL
  const getImageUrl = (imagePath: string): string => {
    const baseUrl = apiService.getImageBaseUrl();
    return `${baseUrl}${imagePath}`;
  };

  const getNewImageUrl = (imagePath: string, image_name: string): string => {
    const baseUrl = apiService.getImageBaseUrl();
    return `${baseUrl}${imagePath}`;
  };

  // Initialize processors from series_mac data
  useEffect(() => {
    if (windowsData?.series_mac && Array.isArray(windowsData.series_mac)) {
      const processorsData = windowsData.series_mac.map((item) => ({
        id: item.id,
        title: item.title,
        visible: false,
        price: '',
      }));
      setProcessors(processorsData);
    }
  }, [windowsData]);

  const loadExistingConfig = useCallback(async (configId: number) => {
    if (!windowsData?.series_mac || !Array.isArray(windowsData.series_mac)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSystemConfig(configId, windowsData?.parentTypeId);
      
      if (response.success) {
        // Handle nested result structure from API
        let configDetails = null;
        
        if (response.data?.result?.config_item_details && Array.isArray(response.data.result.config_item_details)) {
          configDetails = response.data.result.config_item_details;
        } else if (response.data?.config_item_details && Array.isArray(response.data.config_item_details)) {
          configDetails = response.data.config_item_details;
        } else if (Array.isArray(response.data)) {
          configDetails = response.data;
        }
        
        if (configDetails && configDetails.length > 0) {
          // Create a map for faster lookup
          const configItemMap = new Map();
          configDetails.forEach((item: ConfigItemDetail) => {
            configItemMap.set(item.parent_id, item);
          });
          
          // Update processors with existing data
          const updatedProcessors = windowsData.series_mac.map((processor) => {
            const existingItem = configItemMap.get(processor.id);
            
            return {
              id: processor.id,
              title: processor.title,
              visible: existingItem?.active || false,
              price: existingItem?.price?.toString() || '',
            };
          });
          
          setProcessors(updatedProcessors);
        } else {
          // Set default processors if no config details found
          const defaultProcessors = windowsData.series_mac.map((processor) => ({
            id: processor.id,
            title: processor.title,
            visible: false,
            price: '',
          }));
          setProcessors(defaultProcessors);
        }
      } else {
        setError(response.error || 'Failed to load configuration data');
        
        // Set default processors even on API failure
        const defaultProcessors = windowsData.series_mac.map((processor) => ({
          id: processor.id,
          title: processor.title,
          visible: false,
          price: '',
        }));
        setProcessors(defaultProcessors);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      setError('Failed to load configuration data');
      
      // Set default processors on error
      if (windowsData?.series_mac) {
        const defaultProcessors = windowsData.series_mac.map((processor) => ({
          id: processor.id,
          title: processor.title,
          visible: false,
          price: '',
        }));
        setProcessors(defaultProcessors);
      }
    } finally {
      setLoading(false);
    }
  }, [windowsData]);

  // Load existing config data when editing
  useEffect(() => {
    if (editItem && open && windowsData) {
      setTitle(editItem.title);
      setDefaultPrice(editItem.extra_price_title || '');
      setSelectedImageId(editItem.image_id || null);
      
      // Load individual image if it exists
      if (editItem.image_id) {
        loadIndividualImage(editItem.image_id);
      }
      
      // Load existing processor configurations
      loadExistingConfig(editItem.id);
    } else if (open && !editItem && windowsData?.series_mac && Array.isArray(windowsData.series_mac)) {
      // Reset form for new item
      setTitle('');
      setDefaultPrice('');
      setImageFile(null);
      setSelectedImageId(null);
      setError(null);
      const processorsData = windowsData.series_mac.map((item) => ({
        id: item.id,
        title: item.title,
        visible: false,
        price: '',
      }));
      setProcessors(processorsData);
      setCheckAll(false);
    } else if (open && !windowsData?.series_mac) {
      setError('No processor data available. Please check the Windows configuration.');
    } else if (open && editItem && !windowsData) {
      setError('Windows configuration data not available.');
    }
  }, [editItem, open, windowsData, loadExistingConfig]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setProcessors((prev) =>
      prev.map((processor) => ({
        ...processor,
        visible: newCheckAll,
      }))
    );
  };

  const handleUncheckAll = () => {
    setCheckAll(false);
    setProcessors((prev) =>
      prev.map((processor) => ({
        ...processor,
        visible: false,
      }))
    );
  };

  const handleProcessorChange = (processorId: number, field: 'visible' | 'price', value: boolean | string) => {
    setProcessors((prev) =>
      prev.map((processor) =>
        processor.id === processorId
          ? { ...processor, [field]: value }
          : processor
      )
    );
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!processors || processors.length === 0) {
      setError('No processors available');
      return false;
    }
    
    const hasVisibleProcessors = processors.some((p) => p.visible);
    if (!hasVisibleProcessors) {
      setError('At least one processor must be selected');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare categories data
      const categories: SystemConfigCategory[] = processors.map((processor) => ({
        id: processor.id,
        active: processor.visible,
        price: processor.price ? parseInt(processor.price, 10) : undefined,
        extra_price: 0, // Default value
      }));

      const configData: SystemConfigRequest = {
        title: title.trim(),
        categories,
        is_mac: windowsData?.isMac || false,
        is_parent: 0,
        config_type: configType,
        default_config_price: defaultPrice ? parseInt(defaultPrice, 10) : 0,
        edit_mode: !!editItem,
        edit_id: editItem?.id,
        image_id: selectedImageId,
      };

      let response;
      if (editItem) {
        response = await apiService.updateSystemConfig(configData);
      } else {
        response = await apiService.createSystemConfig(configData);
      }

      if (response.success) {
        onSuccess();
        handleClose();
      } else {
        setError(response.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setError('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title.trim() && processors && processors.length > 0 && processors.some((p) => p.visible);

  // Don't render modal if windowsData is not available
  if (!windowsData) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          minHeight: showImageSelector ? '80vh' : 'auto'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editItem ? 'Edit' : 'Add'} {configTitle}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'grey.500' }}>
            <Iconify icon="solar:eye-closed-bold" width={20} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Debug Panel in Development */}
          {/* {import.meta.env.DEV && editItem && (
            <Paper sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'warning.main' }}>
              <Typography variant="subtitle2" color="warning.main" gutterBottom>
                🔧 Debug Info (Development Mode):
              </Typography>
              <Typography variant="caption" component="div">
                Editing Config ID: {editItem.id}
              </Typography>
              <Typography variant="caption" component="div">
                Parent Type ID: {windowsData?.parentTypeId}
              </Typography>
              <Typography variant="caption" component="div">
                Processors Loaded: {processors.length} / {windowsData?.series_mac?.length || 0}
              </Typography>
              <Typography variant="caption" component="div">
                Selected Processors: {processors.filter(p => p.visible).length}
              </Typography>
              <Typography variant="caption" component="div">
                Loading State: {loading ? 'Loading...' : 'Ready'}
              </Typography>
              <Typography variant="caption" component="div">
                Error State: {error || 'None'}
              </Typography>
            </Paper>
          )} */}

          {/* Title Field */}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            error={!title.trim() && title !== ''}
            helperText={!title.trim() && title !== '' ? 'Title is required' : ''}
          />

          {/* Default Price Field */}
          <TextField
            label="Default Price"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
            fullWidth
            type="number"
            helperText="Only applies for empty values of price for the below inputs."
          />

          {/* Image Selection (only for Functional Condition) */}
          {showImageUpload && !showImageSelector && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Select Image
              </Typography>
              
              {/* Selected Image Preview */}
              {selectedImageId && getSelectedImage(selectedImageId) && (
                <Card sx={{ maxWidth: 200, mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={getNewImageUrl(getSelectedImage(selectedImageId)!.image_path, getSelectedImage(selectedImageId)!.image_name)}
                    alt={getSelectedImage(selectedImageId)!.image_name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" noWrap>
                      {getSelectedImage(selectedImageId)!.image_name}
                    </Typography>
                  </CardContent>
                </Card>
              )}
              
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:eye-bold" />}
                  onClick={() => setShowImageSelector(true)}
                >
                  {selectedImageId ? 'Change Image' : 'Select Image'}
                </Button>
                
                {selectedImageId && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => setSelectedImageId(null)}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            </Box>
          )}

          {/* Image Selector Modal Content */}
          {showImageUpload && showImageSelector && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Image
              </Typography>
              
              {imagesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                    gap: 2, 
                    mb: 3,
                    maxHeight: 400,
                    overflowY: 'auto'
                  }}>
                    {images.map((image) => (
                      <Box key={image.id}>
                        <Card
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedImageId === image.id ? 2 : 0,
                            borderColor: 'primary.main',
                            '&:hover': {
                              boxShadow: 3
                            }
                          }}
                          onClick={() => {
                            setSelectedImageId(image.id);
                            setShowImageSelector(false);
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={getImageUrl(image.image_path)}
                            alt={image.image_name}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ p: 1 }}>
                            <Typography variant="caption" noWrap>
                              {image.image_name}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                  
                  {imagesTotalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Pagination
                        count={imagesTotalPages}
                        page={imagesPage}
                        onChange={(_, page) => loadImages(page)}
                        color="primary"
                      />
                    </Box>
                  )}
                </>
              )}
              
              <Button
                variant="outlined"
                onClick={() => setShowImageSelector(false)}
              >
                Cancel
              </Button>
            </Box>
          )}

          <Divider />

          {/* Select Processors Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select Processors
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCheckAll}
                sx={{ textTransform: 'none' }}
              >
                Check All
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleUncheckAll}
                sx={{ textTransform: 'none' }}
              >
                Uncheck All
              </Button>
            </Stack>

            {/* Processors Table */}
            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 2 }}>
                {/* Header */}
                <Stack direction="row" spacing={2} sx={{ mb: 2, fontWeight: 600 }}>
                  <Box sx={{ flex: 2 }}>
                    <Typography variant="subtitle2">Name</Typography>
                  </Box>
                  <Box sx={{ width: 100, textAlign: 'center' }}>
                    <Typography variant="subtitle2">Visible</Typography>
                  </Box>
                  <Box sx={{ width: 120 }}>
                    <Typography variant="subtitle2">Price</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Processor Rows */}
                <Stack spacing={2}>
                  {processors && processors.length > 0 ? (
                    processors.map((processor) => (
                      <Stack key={processor.id} direction="row" spacing={2} alignItems="center">
                        <Box sx={{ flex: 2 }}>
                          <Typography variant="body2">{processor.title}</Typography>
                        </Box>
                        <Box sx={{ width: 100, display: 'flex', justifyContent: 'center' }}>
                          <Checkbox
                            checked={processor.visible}
                            onChange={(e) =>
                              handleProcessorChange(processor.id, 'visible', e.target.checked)
                            }
                            size="small"
                          />
                        </Box>
                        <Box sx={{ width: 120 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={processor.price}
                            onChange={(e) =>
                              handleProcessorChange(processor.id, 'price', e.target.value)
                            }
                            disabled={!processor.visible}
                            fullWidth
                          />
                        </Box>
                      </Stack>
                    ))
                  ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {loading ? 'Loading processors...' : 'No processors available'}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Saving...' : editItem ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}