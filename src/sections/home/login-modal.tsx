import { useState, useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { apiService } from 'src/utils/api-service';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// OTP Input Component
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

function OtpInput({ value, onChange, length = 4 }: OtpInputProps) {
  const theme = useTheme();
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    
    const newOtp = value.split('');
    newOtp[index] = digit;
    
    // Fill array to correct length
    while (newOtp.length < length) {
      newOtp.push('');
    }
    
    const newValue = newOtp.join('');
    onChange(newValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      const nextInput = inputRefs.current[index + 1]?.querySelector('input');
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1]?.querySelector('input');
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData.padEnd(length, ''));
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    const nextInput = inputRefs.current[nextIndex]?.querySelector('input');
    nextInput?.focus();
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', textAlign: 'center' }}>
        Enter the 4-digit OTP sent to your mobile
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1.5, 
          justifyContent: 'center',
          mb: 1.5
        }}
      >
        {Array.from({ length }, (_, index) => (
          <TextField
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: { 
                textAlign: 'center', 
                fontSize: '1.25rem',
                fontWeight: 600,
                padding: '12px 8px'
              },
            }}
            sx={{
              width: 48,
              height: 48,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                border: `1.5px solid ${theme.palette.grey[300]}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: theme.palette.grey[400],
                },
                '&.Mui-focused': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                ...(value[index] && {
                  borderColor: theme.palette.success.main,
                  backgroundColor: alpha(theme.palette.success.main, 0.08),
                })
              },
              '& .MuiOutlinedInput-input': {
                padding: '12px 8px',
              },
              '& fieldset': {
                border: 'none',
              }
            }}
          />
        ))}
      </Box>
      {value.length === length && (
        <Box sx={{ textAlign: 'center', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500 }}>
            ✓ OTP entered successfully
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onUserLogin: () => void;
  onLoginSuccess?: () => void; // Add callback for successful login
};

export function LoginModal({ open, onClose, onUserLogin, onLoginSuccess }: LoginModalProps) {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isStoreLogin, setIsStoreLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [formData, setFormData] = useState({
    mobile: '',
    storeCode: '',
    otp: '',
    channelPartnerId: '', // For store login
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleOtpChange = (otpValue: string) => {
    setFormData(prev => ({
      ...prev,
      otp: otpValue
    }));
  };

  const handleSendOTP = useCallback(async () => {
    if (!formData.mobile || formData.mobile.length !== 10) {
      return;
    }
    setLoading(true);
    
    try {
      const loginData = {
        mobile: formData.mobile,
        isVendor: isStoreLogin ? 1 : 0,
        channel_partner_id: isStoreLogin ? formData.storeCode : '', // Use storeCode as channel_partner_id for store login
      };
      
      const response = await apiService.customerLogin(loginData);
      
      if (response.success) {
        setOtpSent(true);
        setOtpSentMessage(`OTP sent successfully to +91-${formData.mobile}`);
        console.log('OTP sent successfully:', response.data);
      } else {
        console.error('Failed to send OTP:', response.error);
        setOtpSentMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      // You might want to show an error message to the user here
    }
    
    setLoading(false);
  }, [formData.mobile, formData.storeCode, isStoreLogin]);

  const handleVerifyOTP = useCallback(async () => {
    setLoading(true);
    
    try {
      const otpData = {
        mobile: formData.mobile,
        otp: formData.otp,
      };
      
      const response = await apiService.verifyOTP(otpData);
      
      if (response.success && response.data?.result) {
        // Store authentication data
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        if (response.data.customer) {
          localStorage.setItem('userData', JSON.stringify(response.data.customer)); // Changed from 'user' to 'userData'
          localStorage.setItem('customerId', response.data.customer.id.toString());
        }
        
        localStorage.setItem('userType', 'user');
        localStorage.setItem('isAuthenticated', 'true');
        
        // Notify parent component of successful login
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Force a page reload to ensure auth context picks up the new state
        window.location.href = '/user/profile';
        setLoading(false);
        onClose();
      } else {
        console.error('OTP verification failed:', response.error || 'Invalid OTP');
        // You might want to show an error message to the user here
        setLoading(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // You might want to show an error message to the user here
      setLoading(false);
    }
  }, [formData.mobile, formData.otp, router, onClose, onLoginSuccess]);

  const handleStoreLogin = useCallback(async () => {
    setLoading(true);
    
    try {
      const loginData = {
        mobile: '', // No mobile required for store login
        isVendor: 1,
        channel_partner_id: formData.storeCode,
      };
      
      const response = await apiService.customerLogin(loginData);
      
      if (response.success) {
        localStorage.setItem('userType', 'store');
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/store/dashboard');
        setLoading(false);
        onClose();
      } else {
        console.error('Store login failed:', response.error);
        // You might want to show an error message to the user here
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during store login:', error);
      // You might want to show an error message to the user here
      setLoading(false);
    }
  }, [formData.storeCode, router, onClose]);

  const resetForm = () => {
    setFormData({
      mobile: '',
      storeCode: '',
      otp: '',
      channelPartnerId: '',
    });
    setOtpSent(false);
    setIsStoreLogin(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => {
        resetForm();
        onClose();
      }}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          background: 'transparent',
          boxShadow: 'none',
          maxHeight: '90vh',
          overflow: 'visible',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: alpha(theme.palette.grey[900], 0.8),
          backdropFilter: 'blur(8px)',
        }
      }}
    >
      <Card
        sx={{
          p: 0,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.grey[300], 0.2)}`,
          boxShadow: `0 24px 48px ${alpha(theme.palette.grey[900], 0.15)}`,
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            position: 'relative',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            p: 2.5,
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={() => {
              resetForm();
              onClose();
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
              }
            }}
          >
            <Iconify icon="mingcute:close-line" width={20} />
          </IconButton>

          <Box sx={{ mb: 1.5 }}>
            <Logo />
          </Box>
          
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
            Welcome Back! 👋
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sign in to {CONFIG.appName} to continue your journey
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ 
          p: 3, 
          flex: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
            {/* Mobile Number Input - Only show when Store Login is NOT checked */}
            {!isStoreLogin && (
              <TextField
                fullWidth
                label="Mobile No."
                placeholder="Enter 10 Digit Mobile No."
                value={formData.mobile}
                onChange={handleInputChange('mobile')}
                variant="outlined"
                type="tel"
                inputProps={{ maxLength: 10 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[50], 0.5),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.grey[50], 0.8),
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    }
                  }
                }}
              />
            )}

            {/* Store Login Checkbox */}
            <FormControlLabel
              control={
                <Checkbox 
                  checked={isStoreLogin}
                  onChange={(e) => setIsStoreLogin(e.target.checked)}
                  sx={{ color: 'primary.main' }}
                />
              }
              label="Store Login"
              sx={{ alignSelf: 'flex-start' }}
            />

            {/* Store Code Input - Only show when Store Login is checked */}
            {isStoreLogin && (
              <TextField
                fullWidth
                label="Store Code"
                placeholder="Enter Store Code"
                value={formData.storeCode}
                onChange={handleInputChange('storeCode')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.grey[50], 0.5),
                  }
                }}
              />
            )}

            {/* OTP Sent Message */}
            {!isStoreLogin && otpSent && otpSentMessage && (
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Iconify 
                  icon="eva:checkmark-fill" 
                  sx={{ color: 'success.main', width: 20, height: 20 }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ color: 'success.dark', fontWeight: 500 }}
                >
                  {otpSentMessage}
                </Typography>
              </Box>
            )}

            {/* OTP Input - Only show when OTP is sent and NOT store login */}
            {!isStoreLogin && otpSent && (
              <OtpInput
                value={formData.otp}
                onChange={handleOtpChange}
                length={4}
              />
            )}

            {/* Action Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={
                isStoreLogin 
                  ? handleStoreLogin 
                  : otpSent 
                    ? handleVerifyOTP 
                    : handleSendOTP
              }
              disabled={
                loading || 
                (isStoreLogin && !formData.storeCode) ||
                (!isStoreLogin && !otpSent && formData.mobile.length !== 10) ||
                (!isStoreLogin && otpSent && !formData.otp)
              }
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
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
                  {isStoreLogin 
                    ? 'Verifying...' 
                    : otpSent 
                      ? 'Verifying...' 
                      : 'Sending OTP...'
                  }
                </Box>
              ) : (
                isStoreLogin 
                  ? 'Verify' 
                  : otpSent 
                    ? 'Verify' 
                    : 'SEND OTP'
              )}
            </Button>

            {/* Resend OTP Button */}
            {!isStoreLogin && otpSent && (
              <Button
                fullWidth
                variant="text"
                size="medium"
                onClick={handleSendOTP}
                disabled={loading}
                sx={{ 
                  mt: 1,
                  py: 0.75,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: theme.palette.primary.main,
                  borderRadius: 2,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.08),
                  },
                  '&:disabled': {
                    color: theme.palette.grey[400],
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Resend OTP
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    </Dialog>
  );
}