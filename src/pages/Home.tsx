import { Typography, Box } from '@mui/material';

export const Home = () => {
  return (
    <Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Welcome to POS System
      </Typography>
      <Typography variant='body1'>
        Point of Sale management system built with React and Material UI.
      </Typography>
    </Box>
  );
};
