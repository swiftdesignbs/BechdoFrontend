import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/auth-context';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AdminDashboardView() {
  const theme = useTheme();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  const adminStats = [
    { title: 'Total Users', value: '1,234', color: 'primary.main' },
    { title: 'Active Sessions', value: '89', color: 'info.main' },
    { title: 'System Health', value: '98%', color: 'success.main' },
    { title: 'Revenue', value: '$12.4k', color: 'warning.main' },
  ];

  const recentActivities = [
    { action: 'New user registration', user: 'John Doe', time: '5 minutes ago' },
    { action: 'User profile updated', user: 'Jane Smith', time: '15 minutes ago' },
    { action: 'System backup completed', user: 'System', time: '1 hour ago' },
    { action: 'Security scan finished', user: 'System', time: '2 hours ago' },
  ];

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Admin Dashboard</Typography>
          {/* <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Logout
          </Button> */}
        </Box>

        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Welcome to the admin panel. Monitor and manage your system from here.
        </Typography>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {adminStats.map((stat, index) => (
            <Card
              key={index}
              sx={{
                p: 3,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" sx={{ mb: 1, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(theme.palette.primary.main, 0.12),
                  }}
                >
                  <Iconify icon="solar:bell-bing-bold-duotone" width={24} sx={{ color: stat.color }} />
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>

        {/* Management Cards */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(3, 2fr) repeat(1, 1fr)',
            },
          }}
        >
          <Box sx={{ gridColumn: { md: 'span 2' } }}>
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activities
              </Typography>
              <Stack spacing={2}>
                {recentActivities.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        by {activity.user}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Box>
          
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button variant="contained" fullWidth startIcon={<Iconify icon="solar:settings-bold-duotone" />}>
                Add New User
              </Button>
              <Button variant="outlined" fullWidth startIcon={<Iconify icon="solar:settings-bold-duotone" />}>
                System Settings
              </Button>
              <Button variant="outlined" fullWidth startIcon={<Iconify icon="solar:home-angle-bold-duotone" />}>
                View Reports
              </Button>
              <Button variant="outlined" fullWidth startIcon={<Iconify icon="solar:shield-keyhole-bold-duotone" />}>
                Security Center
              </Button>
            </Stack>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
}