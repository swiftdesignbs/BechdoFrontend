import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function UnauthorizedView() {
  const router = useRouter();

  return (
    <Container
      sx={{
        py: 12,
        maxWidth: 400,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h3" sx={{ mb: 2 }}>
        401
      </Typography>

      <Typography variant="h4" sx={{ mb: 2 }}>
        Unauthorized
      </Typography>

      <Typography
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
          mb: 4,
        }}
      >
        You don't have permission to access this page.
        Please sign in with the appropriate account.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          size="large"
          variant="outlined"
          onClick={() => router.push('/')}
        >
          Go to Home
        </Button>
        
        <Button
          size="large"
          variant="contained"
          onClick={() => router.push('/admin/sign-in')}
        >
          Admin Sign In
        </Button>
      </Box>
    </Container>
  );
}