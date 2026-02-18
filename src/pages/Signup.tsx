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

export const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = () => {
    login({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
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
          `radial-gradient(700px circle at 12% 18%, ${alpha(
            theme.palette.primary.main,
            0.18
          )} 0%, transparent 55%),
           radial-gradient(600px circle at 82% 12%, ${alpha(
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
          maxWidth: 1020,
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
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.1fr' },
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
              Create account
            </Typography>
            <Typography variant='h4' fontWeight={600}>
              Start selling with R7-POS.
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Set up your store, payments, and products in minutes.
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
              <TextField label='Full Name' fullWidth size='small' />
              <TextField label='Email' type='email' fullWidth size='small' />
              <TextField
                label='Password'
                type='password'
                fullWidth
                size='small'
              />
              <TextField
                label='Confirm Password'
                type='password'
                fullWidth
                size='small'
              />
              <Button
                variant='contained'
                size='large'
                sx={{ borderRadius: 0 }}
                onClick={handleSignup}
              >
                Create Account
              </Button>
              <Button
                component={RouterLink}
                to='/login'
                variant='text'
                sx={{ textTransform: 'none' }}
              >
                Already have an account? Sign in
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
