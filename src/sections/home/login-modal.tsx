import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onUserLogin: () => void;
};

export function LoginModal({ open, onClose, onUserLogin }: LoginModalProps) {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    password: 'user123',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleLogin = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically validate user credentials
    // For demo purposes, we'll just navigate to user dashboard
    localStorage.setItem('userType', 'user');
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/user/dashboard');
    setLoading(false);
    onClose();
  }, [router, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          background: 'transparent',
          boxShadow: 'none',
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
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            position: 'relative',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            p: 4,
            textAlign: 'center',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
              }
            }}
          >
            <Iconify icon="mingcute:close-line" width={24} />
          </IconButton>

          <Box sx={{ mb: 2 }}>
            <Logo />
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Welcome Back! 👋
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Sign in to {CONFIG.appName} to continue your journey
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: 4 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              variant="outlined"
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
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:checkmark-fill" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              variant="outlined"
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
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:eye-closed-bold" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button 
                variant="text" 
                size="small" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                Forgot Password?
              </Button>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
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
                  Signing In...
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Don&apos;t have an account?
              </Typography>
              <Button 
                variant="outlined" 
                size="large"
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.grey[500], 0.3),
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                Contact Admin for Account
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Dialog>
  );
}