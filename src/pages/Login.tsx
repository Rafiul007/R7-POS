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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAlert } from '../hooks';
import { MESSAGES } from '../constants';
import { useLogin } from '../hooks/auth/useLogin';

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address.')
    .required('Email is required.'),
  password: yup.string().required('Password is required.'),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const handleLogin = (values: LoginFormValues) => {
    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          showAlert({
            message: MESSAGES.AUTH.LOGIN_SUCCESS,
            severity: 'success',
          });
          navigate('/');
        },
        onError: () => {
          showAlert({
            message: MESSAGES.AUTH.LOGIN_FAILED,
            severity: 'error',
          });
        },
      }
    );
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
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: 960,
          borderRadius: 0,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Typography variant='h4' fontWeight={600}>
              Sign in to R7-POS.
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderLeft: { xs: 'none', md: '1px solid' },
              borderColor: 'divider',
            }}
          >
            <Stack
              component='form'
              spacing={2}
              noValidate
              onSubmit={handleSubmit(handleLogin)}
            >
              <TextField
                label='Email'
                type='email'
                size='small'
                autoComplete='email'
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email')}
              />

              <TextField
                label='Password'
                type='password'
                size='small'
                autoComplete='current-password'
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register('password')}
              />

              <Button
                type='submit'
                variant='contained'
                size='large'
                sx={{ borderRadius: 0 }}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
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
