import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { apiService } from 'src/utils/api-service';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UserProfileView() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
    open: false,
    type: 'success',
    message: ''
  });
  const [states, setStates] = useState<Array<{ id: number; name: string }>>([]);
  const [statesLoading, setStatesLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    address: '',
    state: '',
    pincode: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setProfileData({
          fullname: user.customer_name || '',
          email: user.email || '',
          address: user.address || '',
          state: user.state || '',
          pincode: user.zipcode || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Load states list
    loadStates();
  }, []);

  const loadStates = async () => {
    setStatesLoading(true);
    try {
      const response = await apiService.getStates(1, 50);
      if (response.success && response.data?.data) {
        setStates(response.data.data);
      } else {
        console.error('Failed to load states:', response.error);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    }
    setStatesLoading(false);
  };

  const handleProfileInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePasswordInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setSnackbar({ open: true, type, message });
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleUpdateProfile = useCallback(async () => {
    // Validate required fields
    if (!profileData.fullname.trim()) {
      showAlert('error', 'Full name is required');
      return;
    }
    if (!profileData.email.trim()) {
      showAlert('error', 'Email address is required');
      return;
    }
    if (!profileData.address.trim()) {
      showAlert('error', 'Address is required');
      return;
    }
    if (!profileData.state.trim()) {
      showAlert('error', 'State is required');
      return;
    }
    if (!profileData.pincode.trim()) {
      showAlert('error', 'Pincode is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      showAlert('error', 'Please enter a valid email address');
      return;
    }

    // Validate pincode (should be 6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(profileData.pincode)) {
      showAlert('error', 'Pincode must be 6 digits');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiService.updateProfile(profileData);
      
      if (response.success) {
        showAlert('success', 'Profile updated successfully!');
        
        // Update localStorage with new data
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = {
            ...user,
            customer_name: profileData.fullname,
            email: profileData.email,
            address: profileData.address,
            state: profileData.state,
            zipcode: profileData.pincode
          };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      } else {
        showAlert('error', response.error || 'Failed to update profile');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
      console.error('Error updating profile:', error);
    }
    
    setLoading(false);
  }, [profileData]);

  const handleChangePassword = useCallback(async () => {
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert('error', 'New passwords do not match');
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      showAlert('error', 'New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        showAlert('success', 'Password changed successfully!');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showAlert('error', response.error || 'Failed to change password');
      }
    } catch (error) {
      showAlert('error', 'Network error occurred');
      console.error('Error changing password:', error);
    }
    
    setLoading(false);
  }, [passwordData]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Profile Settings
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage your account information and security settings
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Profile Cards in Row Layout */}
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
          }}
        >
          {/* Profile Information Card */}
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.grey[300], 0.2)}`,
              boxShadow: `0 24px 48px ${alpha(theme.palette.grey[900], 0.15)}`,
            }}
          >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Iconify icon="solar:pen-bold" width={24} sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Personal Information
            </Typography>
          </Box>

          <Stack spacing={3}>
            <TextField
              fullWidth
              required
              label="Full Name"
              value={profileData.fullname}
              onChange={handleProfileInputChange('fullname')}
              variant="outlined"
              error={!profileData.fullname.trim()}
              helperText={!profileData.fullname.trim() ? 'Full name is required' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                }
              }}
            />

            <TextField
              fullWidth
              required
              label="Email Address"
              type="email"
              value={profileData.email}
              onChange={handleProfileInputChange('email')}
              variant="outlined"
              error={!profileData.email.trim() || (profileData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))}
              helperText={
                !profileData.email.trim() 
                  ? 'Email address is required' 
                  : (profileData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))
                    ? 'Please enter a valid email address'
                    : ''
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                }
              }}
            />

            <TextField
              fullWidth
              required
              label="Address"
              multiline
              rows={3}
              value={profileData.address}
              onChange={handleProfileInputChange('address')}
              variant="outlined"
              error={!profileData.address.trim()}
              helperText={!profileData.address.trim() ? 'Address is required' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl
                fullWidth
                required
                variant="outlined"
                error={!profileData.state.trim()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  }
                }}
              >
                <InputLabel id="state-select-label">State</InputLabel>
                <Select
                  labelId="state-select-label"
                  value={profileData.state}
                  onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                  label="State *"
                  disabled={statesLoading}
                  endAdornment={
                    statesLoading ? (
                      <InputAdornment position="end" sx={{ mr: 2 }}>
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : null
                  }
                >
                  <MenuItem value="">
                    <em>Select a state</em>
                  </MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.name}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
                {!profileData.state.trim() && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    State is required
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                required
                label="Pincode"
                value={profileData.pincode}
                onChange={handleProfileInputChange('pincode')}
                variant="outlined"
                inputProps={{ maxLength: 6 }}
                error={!profileData.pincode.trim() || (profileData.pincode.trim() && !/^\d{6}$/.test(profileData.pincode))}
                helperText={
                  !profileData.pincode.trim() 
                    ? 'Pincode is required' 
                    : (profileData.pincode.trim() && !/^\d{6}$/.test(profileData.pincode))
                      ? 'Pincode must be 6 digits'
                      : ''
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  }
                }}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleUpdateProfile}
              disabled={
                loading || 
                !profileData.fullname.trim() || 
                !profileData.email.trim() || 
                !profileData.address.trim() || 
                !profileData.state.trim() || 
                !profileData.pincode.trim() ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email) ||
                !/^\d{6}$/.test(profileData.pincode)
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: theme.palette.grey[300],
                  boxShadow: 'none',
                  transform: 'none',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  Updating...
                </Box>
              ) : (
                'Update Profile'
              )}
            </Button>
          </Stack>
        </Card>

          {/* Change Password Card */}
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.grey[300], 0.2)}`,
              boxShadow: `0 24px 48px ${alpha(theme.palette.grey[900], 0.15)}`,
            }}
          >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Iconify icon="solar:restart-bold" width={24} sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Change Password
            </Typography>
          </Box>

          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.oldPassword}
              onChange={handlePasswordInputChange('oldPassword')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        <Iconify 
                          icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} 
                          width={20}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange('newPassword')}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                }
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowNewPassword(!showNewPassword)} 
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        <Iconify 
                          icon={showNewPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} 
                          width={20}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange('confirmPassword')}
              variant="outlined"
              error={passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword}
              helperText={
                passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                }
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleChangePassword}
              disabled={loading || !passwordData.oldPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
              color="warning"
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 12px 32px ${alpha(theme.palette.warning.main, 0.4)}`,
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: theme.palette.grey[300],
                  boxShadow: 'none',
                  transform: 'none',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  Changing...
                </Box>
              ) : (
                'Change Password'
              )}
            </Button>
          </Stack>
        </Card>
        </Box>
      </Stack>

      {/* Success/Error Snackbar - Bottom Right Corner */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 2, mr: 2 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.type}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            boxShadow: `0 8px 24px ${alpha(theme.palette.grey[900], 0.2)}`,
            '& .MuiAlert-icon': {
              fontSize: '1.2rem',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}