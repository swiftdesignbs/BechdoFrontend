import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/auth-context';
import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';
import { apiService } from 'src/utils/api-service';

// ----------------------------------------------------------------------

interface DashboardStats {
  totalOrders: number;
  totalRegisters: number;
  totalApproved: number;
  ordersByMonth: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
  ordersByBrand: {
    apple: number;
    acer: number;
    lenovo: number;
    hp: number;
    dell: number;
    asus: number;
  };
  companyData: any[];
  userFiles: any[];
}

// ----------------------------------------------------------------------

export function AdminDashboardView() {
  const theme = useTheme();
  const router = useRouter();
  const { logout, user } = useAuth();

  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getDashboardStats();
        console.log('Dashboard API Response:', response);
        if (response.success && response.data) {
          console.log('Dashboard Data:', response.data);
          setDashboardData(response.data.data);
        } else {
          console.error('Dashboard API Error:', response.error);
          setError(response.error || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart configurations
  const monthlyOrdersChartOptions = useChart({
    chart: { 
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    colors: [theme.palette.primary.main],
    tooltip: {
      y: {
        formatter: (value: number) => `${value} orders`,
      },
    },
  });

  const brandOrdersChartOptions = useChart({
    chart: { 
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '70%',
      },
    },
    xaxis: {
      categories: ['Apple', 'Acer', 'Lenovo', 'HP', 'Dell', 'Asus'],
    },
    colors: [theme.palette.secondary.main],
    tooltip: {
      y: {
        formatter: (value: number) => `${value} orders`,
      },
    },
  });

  // Prepare chart data
  const monthlyOrdersData = dashboardData?.ordersByMonth ? [
    {
      name: 'Orders By Month',
      data: [
        dashboardData.ordersByMonth.jan || 0,
        dashboardData.ordersByMonth.feb || 0,
        dashboardData.ordersByMonth.mar || 0,
        dashboardData.ordersByMonth.apr || 0,
        dashboardData.ordersByMonth.may || 0,
        dashboardData.ordersByMonth.jun || 0,
        dashboardData.ordersByMonth.jul || 0,
        dashboardData.ordersByMonth.aug || 0,
        dashboardData.ordersByMonth.sep || 0,
        dashboardData.ordersByMonth.oct || 0,
        dashboardData.ordersByMonth.nov || 0,
        dashboardData.ordersByMonth.dec || 0,
      ],
    },
  ] : [];

  const brandOrdersData = dashboardData?.ordersByBrand ? [
    {
      name: "Brand's Order",
      data: [
        dashboardData.ordersByBrand.apple || 0,
        dashboardData.ordersByBrand.acer || 0,
        dashboardData.ordersByBrand.lenovo || 0,
        dashboardData.ordersByBrand.hp || 0,
        dashboardData.ordersByBrand.dell || 0,
        dashboardData.ordersByBrand.asus || 0,
      ],
    },
  ] : [];

  const adminStats = dashboardData ? [
    { 
      title: 'TOTAL ORDERS', 
      value: (dashboardData.totalOrders || 0).toLocaleString(), 
      color: theme.palette.primary.main,
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    },
    { 
      title: 'USER REGISTERED', 
      value: (dashboardData.totalRegisters || 0).toLocaleString(), 
      color: theme.palette.success.main,
      bgColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.3)'
    },
    { 
      title: 'APPROVED ORDERS', 
      value: (dashboardData.totalApproved || 0).toLocaleString(), 
      color: theme.palette.info.main,
      bgColor: 'rgba(14, 165, 233, 0.1)',
      borderColor: 'rgba(14, 165, 233, 0.3)'
    },
  ] : [];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

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
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {adminStats.map((stat, index) => (
            <Card
              key={index}
              sx={{
                p: 3,
                borderRadius: 2,
                background: stat.bgColor,
                border: `1px solid ${stat.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h3" sx={{ mb: 1, color: stat.color, fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
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
                    background: alpha(stat.color, 0.12),
                  }}
                >
                  <Iconify icon="solar:bell-bing-bold-duotone" width={24} sx={{ color: stat.color }} />
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>

        {/* Charts Section */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            },
          }}
        >
          {/* Monthly Orders Chart */}
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
              Approved Orders
            </Typography>
            <Box sx={{ height: 'auto' }}>
              <Chart
                type="bar"
                series={monthlyOrdersData}
                options={monthlyOrdersChartOptions}
              />
            </Box>
          </Card>

          {/* Brand Orders Chart */}
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'secondary.main' }}>
              Orders Coming from
            </Typography>
            <Box sx={{ height: 'auto' }}>
              <Chart
                type="bar"
                series={brandOrdersData}
                options={brandOrdersChartOptions}
              />
            </Box>
          </Card>
        </Box>

      </Stack>
    </Container>
  );
}