import React, { useState, useEffect, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';

import { Iconify } from 'src/components/iconify';

import {
  type ConfigDataItem,
  type WindowsSettingsData,
  type SystemConfigRequest,
  type SystemConfigCategory,
  type Image,
  apiService,
} from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface ConfigMacModalProps {
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

export function ConfigMacModal({
  open,
  onClose,
  onSuccess,
  configType,
  configTitle,
  editItem = null,
  windowsData,
}: ConfigMacModalProps) {
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
          const updatedProcessors = windowsData.series_mac.map((processor) => {
            const configDetail = configDetails.find((detail: any) => detail.parent_id === processor.id);
            return {
              id: processor.id,
              title: processor.title,
              visible: configDetail ? configDetail.active : false,
              price: configDetail ? configDetail.price.toString() : '',
            };
          });
          setProcessors(updatedProcessors);
        } else {
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
      setError('No processor data available. Please check the Mac configuration.');
    } else if (open && editItem && !windowsData) {
      setError('Mac configuration data not available.');
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
        is_mac: true, // Always true for Mac settings
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
            {editItem ? `Edit ${configTitle}` : `Add New ${configTitle}`}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Title Field */}
          <TextField
            label="Configuration Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />

          {/* Default Price Field */}
          <TextField
            label="Default Price (Optional)"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
            type="number"
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />

          {/* Image Selection (only for FUNCTIONAL_CONDITION) */}
          {showImageUpload && (
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Configuration Image (Optional)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowImageSelector(!showImageSelector)}
                  startIcon={<Iconify icon={showImageSelector ? "mingcute:add-line" : "mingcute:add-line"} />}
                  sx={{ borderRadius: 1.5 }}
                >
                  {showImageSelector ? 'Hide Images' : 'Select Image'}
                </Button>
              </Stack>

              {/* Selected Image Preview */}
              {selectedImageId && getSelectedImage(selectedImageId) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Selected Image:
                  </Typography>
                  <Card sx={{ maxWidth: 200, borderRadius: 1.5 }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={getNewImageUrl(getSelectedImage(selectedImageId)!.image_path, getSelectedImage(selectedImageId)!.image_name)}
                      alt={getSelectedImage(selectedImageId)!.image_name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {getSelectedImage(selectedImageId)!.image_name}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 1, pt: 0 }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setSelectedImageId(null)}
                        startIcon={<Iconify icon="mingcute:close-line" />}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              )}

              {/* Image Selection Grid */}
              {showImageSelector && (
                <Box sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 1.5, 
                  p: 2,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {imagesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                        gap: 2
                      }}>
                        {images.map((image) => (
                          <Box key={image.id}>
                            <Card 
                              sx={{ 
                                cursor: 'pointer',
                                borderRadius: 1.5,
                                border: selectedImageId === image.id ? 2 : 1,
                                borderColor: selectedImageId === image.id ? 'primary.main' : 'divider',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2
                                }
                              }}
                              onClick={() => setSelectedImageId(image.id)}
                            >
                              <CardMedia
                                component="img"
                                height="80"
                                image={getImageUrl(image.image_path)}
                                alt={image.image_name}
                                sx={{ objectFit: 'cover' }}
                              />
                              <CardContent sx={{ p: 1 }}>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {image.image_name}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Box>
                        ))}
                      </Box>

                      {/* Pagination */}
                      {imagesTotalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Pagination
                            count={imagesTotalPages}
                            page={imagesPage}
                            onChange={(_, page) => loadImages(page)}
                            size="small"
                          />
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}

          <Divider />

          {/* Processor Configuration */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Mac Series Configuration
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCheckAll}
                  sx={{ borderRadius: 1.5 }}
                >
                  Check All
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUncheckAll}
                  sx={{ borderRadius: 1.5 }}
                >
                  Uncheck All
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1.5, 
              overflow: 'hidden',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {processors.length > 0 ? (
                processors.map((processor, index) => (
                  <Box
                    key={processor.id}
                    sx={{
                      p: 2,
                      borderBottom: index < processors.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      bgcolor: processor.visible ? 'action.hover' : 'transparent',
                      transition: 'background-color 0.2s ease-in-out'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={processor.visible}
                            onChange={(e) => handleProcessorChange(processor.id, 'visible', e.target.checked)}
                            sx={{ p: 0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {processor.title}
                          </Typography>
                        }
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Price"
                        value={processor.price}
                        onChange={(e) => handleProcessorChange(processor.id, 'price', e.target.value)}
                        type="number"
                        size="small"
                        disabled={!processor.visible}
                        sx={{ 
                          width: 120,
                          '& .MuiOutlinedInput-root': { borderRadius: 1 }
                        }}
                      />
                    </Stack>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No Mac series data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 1.5 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{ borderRadius: 1.5 }}
        >
          {loading ? 'Saving...' : (editItem ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}