import { Typography, Box, Paper } from '@mui/material';

export const Inventory = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Track stock levels, manage inventory, and monitor product availability.
        </Typography>
      </Paper>
    </Box>
  );
};