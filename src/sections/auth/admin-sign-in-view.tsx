import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/auth-context';
import { ApiDebugger } from 'src/utils/api-debugger';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AdminSignInView() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = useCallback(async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Starting admin login process...');
      const response = await login(formData.email.trim(), formData.password);

      if (response.success) {
        console.log('✅ Login successful, redirecting to admin dashboard');
        // Successfully logged in, redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        console.log('❌ Login failed:', response.error);
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, login, router]);

  // Debug function for testing (remove in production)
  const handleDebugTest = useCallback(async () => {
    console.log('🧪 Running API debug test...');
    await ApiDebugger.testAdminLogin();
    await ApiDebugger.testConnection();
    await ApiDebugger.testRawLogin();
  }, []);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      handleSignIn();
    }
  };

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        name="email"
        label="Admin Email"
        value={formData.email}
        onChange={handleInputChange('email')}
        onKeyPress={handleKeyPress}
        disabled={loading}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Admin Password"
        value={formData.password}
        onChange={handleInputChange('password')}
        onKeyPress={handleKeyPress}
        disabled={loading}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowPassword(!showPassword)} 
                  edge="end"
                  disabled={loading}
                >
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        disabled={loading}
        sx={{ 
          position: 'relative',
          minHeight: 48,
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Admin Sign in'
        )}
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Admin Sign in</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Access admin dashboard
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.disabled', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Link
          variant="subtitle2"
          onClick={() => router.push('/')}
          sx={{ cursor: 'pointer' }}
        >
          Back to Home
        </Link>
        
        {/* Debug button - remove in production */}
        <Button
          variant="text"
          size="small"
          onClick={handleDebugTest}
          sx={{ 
            display: 'block', 
            mx: 'auto', 
            mt: 2, 
            fontSize: '0.75rem',
            color: 'text.secondary' 
          }}
        >
          🧪 Debug API
        </Button>
      </Box>
    </>
  );
}