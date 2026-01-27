import { Typography, Box, Paper } from '@mui/material';

export const Products = () => {
  return (
    <Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Products Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant='body1'>
          Manage your product catalog, pricing, and inventory levels.
        </Typography>
      </Paper>
    </Box>
  );
};
