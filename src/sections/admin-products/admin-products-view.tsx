import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function AdminProductsView() {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('customerId');
    localStorage.removeItem('user');
    router.push('/');
  }, [router]);

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4">Products Management</Typography>
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Product Management Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is the products management section. Here you can manage all products in the system.
          </Typography>
        </Card>
      </Stack>
    </Container>
  );
}