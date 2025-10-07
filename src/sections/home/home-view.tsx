import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { LoginModal } from './login-modal';

// ----------------------------------------------------------------------

export function HomeView() {
  const theme = useTheme();
  const router = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleLoginClick = useCallback(() => {
    setLoginModalOpen(true);
  }, []);

  const handleLoginModalClose = useCallback(() => {
    setLoginModalOpen(false);
  }, []);

  const handleUserLogin = useCallback(() => {
    router.push('/user/sign-in');
  }, [router]);

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  const features = [
    {
      title: 'Easy to Use',
      description: 'Simple and intuitive interface for all users',
      icon: 'solar:check-circle-bold' as const,
    },
    {
      title: 'Secure',
      description: 'Advanced security features to protect your data',
      icon: 'solar:eye-bold' as const,
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support',
      icon: 'solar:chat-round-dots-bold' as const,
    },
    {
      title: 'Fast Performance',
      description: 'Lightning-fast response times',
      icon: 'eva:trending-up-fill' as const,
    },
  ];

  const renderHeader = () => (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Logo />
        
        <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              sx={{ 
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginClick}
          sx={{ fontWeight: 600 }}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );

  const renderHeroSection = () => (
    <Box
      sx={{
        pt: 12,
        pb: 8,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              maxWidth: 800,
            }}
          >
            Welcome to {CONFIG.appName}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Your comprehensive solution for managing all your needs. 
            Experience the power of modern technology with our intuitive platform.
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleLoginClick}
              sx={{ 
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );

  const renderFeaturesSection = () => (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Why Choose Us?
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
              We provide the best solutions with cutting-edge technology and exceptional service.
            </Typography>
          </Stack>
          
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.customShadows.card,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Iconify icon={feature.icon} width={32} sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );

  const renderFooter = () => (
    <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="space-between"
          >
            <Stack spacing={2}>
              <Logo />
              <Typography variant="body2" sx={{ color: 'grey.400', maxWidth: 300 }}>
                Building the future with innovative solutions and exceptional service.
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={6}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Company
                </Typography>
                {['About Us', 'Careers', 'Contact'].map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{ 
                      color: 'grey.400',
                      cursor: 'pointer',
                      '&:hover': { color: 'white' }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
              
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Support
                </Typography>
                {['Help Center', 'Documentation', 'API'].map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{ 
                      color: 'grey.400',
                      cursor: 'pointer',
                      '&:hover': { color: 'white' }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Stack>
          
          <Box
            sx={{
              pt: 4,
              borderTop: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              © 2025 {CONFIG.appName}. All rights reserved.
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{ 
                  color: 'grey.400',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <Iconify icon="socials:facebook" width={20} />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'grey.400',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <Iconify icon="socials:twitter" width={20} />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'grey.400',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <Iconify icon="socials:linkedin" width={20} />
              </IconButton>
              <IconButton
                sx={{ 
                  color: 'grey.400',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <Iconify icon="socials:github" width={20} />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );

  return (
    <>
      {renderHeader()}
      {renderHeroSection()}
      {renderFeaturesSection()}
      {renderFooter()}
      
      <LoginModal
        open={loginModalOpen}
        onClose={handleLoginModalClose}
        onUserLogin={handleUserLogin}
      />
    </>
  );
}