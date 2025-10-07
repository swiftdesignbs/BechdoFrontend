import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UserDashboardView() {
  const theme = useTheme();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  }, [router]);

  const userStats = [
    { title: 'Profile Completion', value: '85%', color: 'primary.main', icon: 'solar:check-circle-bold' as const },
    { title: 'Activities', value: '24', color: 'info.main', icon: 'eva:trending-up-fill' as const },
    { title: 'Achievements', value: '12', color: 'success.main', icon: 'eva:done-all-fill' as const },
    { title: 'Points', value: '1,420', color: 'warning.main', icon: 'eva:checkmark-fill' as const },
  ];

  const quickActions = [
    { title: 'Update Profile', icon: 'solar:pen-bold' as const, color: 'primary' },
    { title: 'View Reports', icon: 'eva:trending-up-fill' as const, color: 'info' },
    { title: 'Settings', icon: 'solar:restart-bold' as const, color: 'secondary' },
    { title: 'Help Center', icon: 'solar:chat-round-dots-bold' as const, color: 'success' },
  ];

  const recentActivities = [
    { title: 'Profile updated successfully', time: '2 hours ago', icon: 'solar:check-circle-bold' as const },
    { title: 'New achievement unlocked: Early Bird', time: '1 day ago', icon: 'eva:done-all-fill' as const },
    { title: 'Weekly report generated', time: '3 days ago', icon: 'eva:trending-up-fill' as const },
    { title: 'Password changed', time: '1 week ago', icon: 'solar:restart-bold' as const },
  ];

  const renderHeader = () => (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
        borderRadius: 3,
        p: 4,
        mb: 4,
      }}
    >
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Welcome back! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Here&apos;s what&apos;s happening with your account today.
          </Typography>
        </Stack>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={handleLogout}
          startIcon={<Iconify icon="solar:restart-bold" />}
          sx={{ 
            fontWeight: 600,
            borderColor: alpha(theme.palette.text.primary, 0.2),
            '&:hover': {
              borderColor: theme.palette.text.primary,
              bgcolor: alpha(theme.palette.text.primary, 0.04),
            }
          }}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );

  const renderStats = () => (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        mb: 4,
      }}
    >
      {userStats.map((stat, index) => (
        <Card
          key={index}
          sx={{
            p: 3,
            borderRadius: 2,
            background: alpha(theme.palette.primary.main, 0.04),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.customShadows.card,
              background: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon={stat.icon} width={24} sx={{ color: stat.color }} />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h3" sx={{ color: stat.color, fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {stat.title}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Box>
  );

  const renderQuickActions = () => (
    <Card sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Quick Actions
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
          },
        }}
      >
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outlined"
            size="large"
            startIcon={<Iconify icon={action.icon} />}
            sx={{
              p: 2,
              justifyContent: 'flex-start',
              borderColor: alpha(theme.palette.grey[500], 0.2),
              '&:hover': {
                borderColor: `${action.color}.main`,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            {action.title}
          </Button>
        ))}
      </Box>
    </Card>
  );

  const renderRecentActivities = () => (
    <Card sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Recent Activities
      </Typography>
      <Stack spacing={3}>
        {recentActivities.map((activity, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Iconify icon={activity.icon} width={20} sx={{ color: 'primary.main' }} />
            </Box>
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {activity.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {activity.time}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={0}>
        {renderHeader()}
        {renderStats()}
        {renderQuickActions()}
        {renderRecentActivities()}
      </Stack>
    </Container>
  );
}