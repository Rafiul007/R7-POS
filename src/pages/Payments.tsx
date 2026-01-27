import { Typography, Box, Paper } from '@mui/material';

export const Payments = () => {
  return (
    <Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Payment Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant='body1'>
          Process payments, view transaction history, and manage payment
          methods.
        </Typography>
      </Paper>
    </Box>
  );
};
