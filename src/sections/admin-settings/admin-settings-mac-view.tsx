import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';

import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';

import { ConfigMacModal } from './config-mac-modal';

import { apiService } from 'src/utils/api-service';
import type { WindowsSettingsData, ConfigSection, ConfigDataItem, Setting, SaveOrderRequest } from 'src/utils/api-service';

// ----------------------------------------------------------------------

export function AdminSettingsMacView() {
  // State management
  const [data, setData] = useState<WindowsSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deductionPercent, setDeductionPercent] = useState('90');
  const [deductionSetting, setDeductionSetting] = useState<Setting | null>(null);
  const [savingDeduction, setSavingDeduction] = useState(false);
  const [savingOrder, setSavingOrder] = useState<string | null>(null); // Track which config is being saved
  const [orderChanges, setOrderChanges] = useState<Record<string, Record<number, number>>>({}); // Track order changes
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ConfigSection | null>(null);
  const [editingItem, setEditingItem] = useState<ConfigDataItem | null>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch deduction percentage setting
  const fetchDeductionSetting = useCallback(async () => {
    try {
      const response = await apiService.getSettings(1, 100); // Get all settings
      if (response.success && response.data) {
        const deductionSetting = response.data.data.find(
          (setting) => setting.name === 'laptop_not_working_deduction_percent'
        );
        if (deductionSetting) {
          setDeductionSetting(deductionSetting);
          setDeductionPercent(deductionSetting.value);
        }
      }
    } catch (error) {
      console.error('Error fetching deduction setting:', error);
    }
  }, []);

  // Fetch Mac settings data (using the Mac API endpoint)
  const fetchMacSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getWindowsSettingsMac();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setSnackbar({
          open: true,
          message: response.error || 'Failed to load settings',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching Mac settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load settings',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMacSettings();
    fetchDeductionSetting();
  }, [fetchMacSettings, fetchDeductionSetting]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const updateItemOrder = (configType: string, itemId: number, newOrder: number) => {
    console.log('Updating order for config:', configType, 'item:', itemId, 'new order:', newOrder);
    setOrderChanges((prev) => {
      const updated = {
        ...prev,
        [configType]: {
          ...prev[configType],
          [itemId]: newOrder,
        },
      };
      console.log('Updated order changes:', updated);
      return updated;
    });
  };

  const getItemOrder = (configType: string, itemId: number, defaultOrder: number): number => {
    return orderChanges[configType]?.[itemId] ?? defaultOrder;
  };

  const moveItemUp = (config: ConfigSection, itemIndex: number) => {
    if (itemIndex > 0) {
      const item = config.data[itemIndex];
      const prevItem = config.data[itemIndex - 1];
      const currentOrder = getItemOrder(config.type, item.id, item.order);
      const prevOrder = getItemOrder(config.type, prevItem.id, prevItem.order);
      
      updateItemOrder(config.type, item.id, prevOrder);
      updateItemOrder(config.type, prevItem.id, currentOrder);
    }
  };

  const moveItemDown = (config: ConfigSection, itemIndex: number) => {
    if (itemIndex < config.data.length - 1) {
      const item = config.data[itemIndex];
      const nextItem = config.data[itemIndex + 1];
      const currentOrder = getItemOrder(config.type, item.id, item.order);
      const nextOrder = getItemOrder(config.type, nextItem.id, nextItem.order);
      
      updateItemOrder(config.type, item.id, nextOrder);
      updateItemOrder(config.type, nextItem.id, currentOrder);
    }
  };

  const hasOrderChanges = (configType: string): boolean => {
    const hasChanges = orderChanges[configType] && Object.keys(orderChanges[configType]).length > 0;
    console.log('Checking order changes for', configType, ':', hasChanges, orderChanges[configType]);
    return hasChanges;
  };

  const handleAddNew = (config: ConfigSection) => {
    setCurrentConfig(config);
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (config: ConfigSection, item: ConfigDataItem) => {
    setCurrentConfig(config);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentConfig(null);
    setEditingItem(null);
  };

  const handleModalSuccess = () => {
    // Refresh the data after successful create/update
    fetchMacSettings();
    setSnackbar({
      open: true,
      message: `${currentConfig?.title} ${editingItem ? 'updated' : 'created'} successfully`,
      severity: 'success',
    });
  };

  const handleSaveChanges = async () => {
    setSavingDeduction(true);
    try {
      if (deductionSetting) {
        // Update existing setting
        const response = await apiService.updateSetting(deductionSetting.id, {
          id: deductionSetting.id,
          name: 'laptop_not_working_deduction_percent',
          value: deductionPercent,
        });
        
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Deduction percentage updated successfully',
            severity: 'success',
          });
          // Refresh the setting
          await fetchDeductionSetting();
        } else {
          throw new Error(response.error || 'Failed to update setting');
        }
      } else {
        // Create new setting
        const response = await apiService.createSetting({
          name: 'laptop_not_working_deduction_percent',
          value: deductionPercent,
        });
        
        if (response.success) {
          setSnackbar({
            open: true,
            message: 'Deduction percentage created successfully',
            severity: 'success',
          });
          // Refresh the setting
          await fetchDeductionSetting();
        } else {
          throw new Error(response.error || 'Failed to create setting');
        }
      }
    } catch (error) {
      console.error('Error saving deduction percentage:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save deduction percentage',
        severity: 'error',
      });
    } finally {
      setSavingDeduction(false);
    }
  };

  const handleSaveOrder = async (config: ConfigSection) => {
    setSavingOrder(config.type);
    try {
      // Get current order changes or use default order
      const itemIds = config.data.map((item) => {
        const currentOrder = getItemOrder(config.type, item.id, item.order);
        return `${item.id}_${currentOrder}`;
      });
      
      const orderData: SaveOrderRequest = {
        config_type: config.type,
        item_ids: itemIds,
        is_mac: 1, // Always 1 for Mac settings
      };

      const response = await apiService.saveOrderIndexes(orderData);
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: `${config.title} order saved successfully`,
          severity: 'success',
        });
        // Clear order changes for this config
        setOrderChanges((prev) => {
          const updated = { ...prev };
          delete updated[config.type];
          return updated;
        });
        // Refresh the data to get updated order
        await fetchMacSettings();
      } else {
        throw new Error(response.error || 'Failed to save order');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save order',
        severity: 'error',
      });
    } finally {
      setSavingOrder(null);
    }
  };

  const renderConfigSection = (config: ConfigSection, inSideBySide: boolean = false) => (
    <Card 
      key={config.type} 
      sx={{ 
        mb: inSideBySide ? 0 : 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        flex: inSideBySide ? 1 : 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 40, 
                height: 40,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {config.title.charAt(0)}
            </Avatar>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.primary', 
                  fontWeight: 600,
                  fontSize: '1.25rem'
                }}
              >
                {config.title}
              </Typography>
              {hasOrderChanges(config.type) && (
                <Chip 
                  label="Changes" 
                  size="small" 
                  color="warning"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: 20,
                    fontWeight: 600,
                    animation: 'pulse 2s infinite'
                  }} 
                />
              )}
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              size="small"
              onClick={() => handleAddNew(config)}
              sx={{ 
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                fontSize: '0.875rem'
              }}
            >
              Add New +
            </Button>
            <Button 
              variant={hasOrderChanges(config.type) ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                console.log('Save order clicked for config:', config.type, 'Has changes:', hasOrderChanges(config.type));
                handleSaveOrder(config);
              }}
              disabled={savingOrder === config.type || !hasOrderChanges(config.type)}
              startIcon={savingOrder === config.type ? <CircularProgress size={12} color="inherit" /> : null}
              sx={{ 
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                fontSize: '0.75rem',
                minWidth: 120,
                bgcolor: hasOrderChanges(config.type) ? 'warning.main' : undefined,
                color: hasOrderChanges(config.type) ? 'white' : undefined,
                border: hasOrderChanges(config.type) ? '2px solid' : '1px solid',
                borderColor: hasOrderChanges(config.type) ? 'warning.dark' : 'divider',
                '&:hover': {
                  bgcolor: hasOrderChanges(config.type) ? 'warning.dark' : 'action.hover',
                },
                '&:disabled': {
                  bgcolor: hasOrderChanges(config.type) ? 'warning.light' : undefined,
                  color: hasOrderChanges(config.type) ? 'white' : undefined,
                }
              }}
            >
              {savingOrder === config.type ? 'Saving...' : hasOrderChanges(config.type) ? 'Save Changes' : 'Save Order'}
            </Button>
          </Stack>
        </Stack>

        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            '& .MuiTableCell-head': {
              backgroundColor: 'grey.50',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: 'text.primary',
              borderBottom: '2px solid',
              borderColor: 'divider',
              py: 1.5
            }
          }}
        >
          <Table size="medium" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  width: '50px', 
                  textAlign: 'center'
                }}>
                  #
                </TableCell>
                <TableCell>Title</TableCell>
                {config.show_description && (
                  <TableCell sx={{ minWidth: 200 }}>
                    Description
                  </TableCell>
                )}
                {config.show_image && (
                  <TableCell sx={{ 
                    width: '80px', 
                    textAlign: 'center' 
                  }}>
                    Image
                  </TableCell>
                )}
                <TableCell sx={{ 
                  width: '180px', 
                  textAlign: 'center' 
                }}>
                  Order
                </TableCell>
                <TableCell sx={{ 
                  width: '120px', 
                  textAlign: 'center' 
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.data.map((item: ConfigDataItem, index: number) => (
                <TableRow 
                  key={item.id} 
                  hover
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      bgcolor: 'action.hover' 
                    },
                    '&:hover': { 
                      bgcolor: 'primary.lighter',
                      transition: 'background-color 0.2s ease'
                    },
                    '& td': {
                      py: 1.5,
                      fontSize: '0.875rem',
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }
                  }}
                >
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        mx: 'auto'
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {item.title}
                    </Typography>
                    {item.extra_price_title && (
                      <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.5 }}>
                        {item.extra_price_title}
                      </Typography>
                    )}
                  </TableCell>
                  {config.show_description && (
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.description || '-'}
                      </Typography>
                    </TableCell>
                  )}
                  {config.show_image && (
                    <TableCell sx={{ textAlign: 'center' }}>
                      {item.image ? (
                        <Avatar
                          src={`${CONFIG.apiBaseUrl}${item.image.image_path}`}
                          alt={item.title}
                          variant="rounded"
                          sx={{ 
                            width: 40, 
                            height: 40,
                            mx: 'auto',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            mx: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            borderRadius: 1,
                            border: '1px dashed',
                            borderColor: 'grey.300'
                          }}
                        >
                          <Typography variant="caption" color="text.disabled">
                            No Image
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  )}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                      <Tooltip title="Move Up">
                        <IconButton 
                          size="small" 
                          color="primary"
                          disabled={index === 0}
                          onClick={() => moveItemUp(config, index)}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'primary.lighter' 
                            }
                          }}
                        >
                          ↑
                        </IconButton>
                      </Tooltip>
                      <TextField
                        size="small"
                        value={getItemOrder(config.type, item.id, item.order)}
                        onChange={(e) => {
                          const newOrder = parseInt(e.target.value, 10);
                          console.log('Order field changed:', config.type, item.id, 'from', item.order, 'to', newOrder);
                          if (!isNaN(newOrder) && newOrder !== item.order) {
                            updateItemOrder(config.type, item.id, newOrder);
                          }
                        }}
                        variant="outlined"
                        type="number"
                        inputProps={{ min: 1 }}
                        sx={{ 
                          width: 70,
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            bgcolor: getItemOrder(config.type, item.id, item.order) !== item.order ? 'warning.lighter' : 'transparent',
                            '& fieldset': {
                              borderColor: getItemOrder(config.type, item.id, item.order) !== item.order ? 'warning.main' : 'divider',
                              borderWidth: getItemOrder(config.type, item.id, item.order) !== item.order ? 2 : 1,
                            }
                          }
                        }}
                      />
                      <Tooltip title="Move Down">
                        <IconButton 
                          size="small" 
                          color="primary"
                          disabled={index === config.data.length - 1}
                          onClick={() => moveItemDown(config, index)}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'primary.lighter' 
                            }
                          }}
                        >
                          ↓
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEdit(config, item)}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'primary.lighter' 
                            }
                          }}
                        >
                          <Iconify icon="solar:pen-bold" width={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'error.lighter' 
                            }
                          }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error">Failed to load Mac settings</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 1, 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Mac Settings
        </Typography>
      </Box>

      <Stack spacing={3} direction={{ xs: 'column', lg: 'row' }}>
        {/* Overall Deduction Percentage */}
        <Box sx={{ flex: 1 }}>
          <Card 
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  <Iconify icon="solar:settings-bold-duotone" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Deduction Settings
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Overall Deduction Percentage(%) if Mac doesn&apos;t work/switch on:
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TextField
                  value={deductionPercent}
                  onChange={(e) => setDeductionPercent(e.target.value)}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    width: 120,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiInputBase-input': { color: 'white' }
                  }}
                  InputProps={{
                    endAdornment: <Typography variant="body2" sx={{ color: 'white', ml: 1 }}>%</Typography>
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSaveChanges}
                  disabled={savingDeduction}
                  startIcon={savingDeduction ? <CircularProgress size={16} color="inherit" /> : null}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    minWidth: 120
                  }}
                >
                  {savingDeduction ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Box>

        {/* Add / Edit Mac Processors */}
        <Box sx={{ flex: 1 }}>
          <Card 
            sx={{ 
              p: 3,
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'primary.main',
              bgcolor: 'primary.lighter',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.light',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)'
              }
            }}
          >
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="center"
              spacing={2}
              sx={{ minHeight: 120 }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 50, height: 50 }}>
                🍎
              </Avatar>
              <Box>
                <Typography variant="h6" color="primary.dark" sx={{ fontWeight: 600 }}>
                  Add / Edit Mac Processors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure processor categories and pricing
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Stack>

      {/* Switch Condition (Mac) */}
      <Card sx={{ 
        mb: 4, 
        mt: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 2
      }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              🍎
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Switch Condition? (Mac)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mac functionality status and pricing impact
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <TableContainer 
            component={Paper} 
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              '& .MuiTableCell-head': {
                backgroundColor: 'grey.50',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'text.primary',
                borderBottom: '2px solid',
                borderColor: 'divider',
                py: 1.5
              }
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '50px', textAlign: 'center' }}>#</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell sx={{ width: '120px', textAlign: 'center' }}>Price Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.switch.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    hover
                    sx={{
                      '&:nth-of-type(odd)': { 
                        bgcolor: 'action.hover' 
                      },
                      '&:hover': { 
                        bgcolor: 'primary.lighter',
                        transition: 'background-color 0.2s ease'
                      },
                      '& td': {
                        py: 1.5,
                        fontSize: '0.875rem',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }
                    }}
                  >
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: item.swtich_condition === 'Yes' ? 'success.main' : 'error.main',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          mx: 'auto'
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        {item.swtich_condition}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip 
                        label={item.swtich_price === 0 ? 'NA' : `₹${item.swtich_price}`}
                        size="small"
                        color={item.swtich_price === 0 ? 'default' : 'error'}
                        variant="filled"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      {/* Configuration Sections */}
      {(() => {
        const sections = [];
        let i = 0;
        
        while (i < data.configData.length) {
          const config = data.configData[i];
          const nextConfig = data.configData[i + 1];
          
          // Determine if tables are suitable for side-by-side (small tables)
          const isSmallTable = !config.show_image && !config.show_description && config.data.length <= 8;
          const isNextTableSmall = nextConfig && !nextConfig.show_image && !nextConfig.show_description && nextConfig.data.length <= 8;
          
          // Check if current or next config is External Graphics or SSD - they should be in separate rows
          const isExternalGraphicsOrSSD = (configType: string, title: string) => {
            return configType === 'EXTERNAL_GRAPHICS' || 
                   configType === 'SSD' || 
                   title.toLowerCase().includes('external graphics') ||
                   title.toLowerCase().includes('ssd') ||
                   title.toLowerCase().includes('graphics card') ||
                   title.toLowerCase().includes('storage');
          };
          
          const shouldRenderSeparately = isExternalGraphicsOrSSD(config.type, config.title) || 
                                       (nextConfig && isExternalGraphicsOrSSD(nextConfig.type, nextConfig.title));
          
          // If both current and next tables are small AND neither is External Graphics or SSD, render them side by side
          if (isSmallTable && isNextTableSmall && !shouldRenderSeparately) {
            sections.push(
              <Stack 
                key={`${config.type}-${nextConfig.type}-pair`} 
                direction={{ xs: 'column', lg: 'row' }} 
                spacing={3} 
                sx={{ mb: 3 }}
              >
                {renderConfigSection(config, true)}
                {renderConfigSection(nextConfig, true)}
              </Stack>
            );
            i += 2; // Skip the next config as it's already rendered
          } else {
            // Render single table (either large or remaining small table, or External Graphics/SSD)
            sections.push(renderConfigSection(config));
            i += 1;
          }
        }
        
        return sections;
      })()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Config Modal */}
      {currentConfig && (
        <ConfigMacModal
          open={modalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          configType={currentConfig.type}
          configTitle={currentConfig.title}
          editItem={editingItem}
          windowsData={data}
        />
      )}
    </Container>
  );
}