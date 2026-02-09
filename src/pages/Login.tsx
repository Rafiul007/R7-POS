import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useAlert } from '../hooks';
import { MESSAGES } from '../constants';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  const handleLogin = () => {
    login();
    showAlert({ message: MESSAGES.AUTH.LOGIN_SUCCESS, severity: 'success' });
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, md: 6 },
        position: 'relative',
        overflow: 'hidden',
        background: theme =>
          `radial-gradient(700px circle at 10% 20%, ${alpha(
            theme.palette.primary.main,
            0.18
          )} 0%, transparent 55%),
           radial-gradient(600px circle at 80% 10%, ${alpha(
             theme.palette.info.main,
             0.18
           )} 0%, transparent 60%),
           linear-gradient(180deg, ${alpha(
             theme.palette.primary.main,
             0.08
           )} 0%, ${alpha(theme.palette.info.main, 0)} 55%)`,
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 960,
          p: 0,
          borderRadius: 0,
          border: '1px solid',
          borderColor: 'divider',
          textAlign: 'left',
          boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 0,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              R7
            </Box>
            <Typography variant='overline' sx={{ letterSpacing: '0.2em' }}>
              Welcome back
            </Typography>
            <Typography variant='h4' fontWeight={600}>
              Sign in to R7-POS.
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Access sales, inventory, and payments in one place.
            </Typography>
          </Box>
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderLeft: { xs: 'none', md: '1px solid' },
              borderColor: 'divider',
              backgroundColor: theme => theme.palette.background.paper,
            }}
          >
            <Stack spacing={2}>
              <TextField label='Email' type='email' fullWidth size='small' />
              <TextField
                label='Password'
                type='password'
                fullWidth
                size='small'
              />
              <Button
                variant='contained'
                size='large'
                sx={{ borderRadius: 0 }}
                onClick={handleLogin}
              >
                Sign In
              </Button>
              <Button
                component={RouterLink}
                to='/signup'
                variant='text'
                sx={{ textTransform: 'none' }}
              >
                Don’t have an account? Create one
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
