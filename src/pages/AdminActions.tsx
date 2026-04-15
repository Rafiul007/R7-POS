import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Category, Inventory2 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const adminActions = [
  {
    title: 'Manage Products',
    description: 'View products and create new product records.',
    path: '/admin/products',
    icon: Inventory2,
    disabled: false,
  },
  {
    title: 'Manage Categories',
    description: 'Organize product categories.',
    path: '/admin/categories',
    icon: Category,
    disabled: true,
  },
];

export const AdminActions = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant='overline' color='text.secondary'>
            Admin
          </Typography>
          <Typography variant='h5'>Admin Actions</Typography>
        </Stack>

        <Grid container spacing={2}>
          {adminActions.map(action => {
            const Icon = action.icon;

            return (
              <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Icon color='primary' />
                      <Stack spacing={0.5}>
                        <Typography variant='h6'>{action.title}</Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {action.description}
                        </Typography>
                      </Stack>
                      <Button
                        variant='contained'
                        disabled={action.disabled}
                        onClick={() => navigate(action.path)}
                      >
                        Open
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Box>
  );
};
