import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CategoryOutlined, Inventory2Outlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const adminActionCards = [
  {
    title: 'Manage Products',
    description:
      'Create products, review stock, and manage catalog visibility.',
    buttonLabel: 'Open Products',
    path: '/admin/actions/products',
    Icon: Inventory2Outlined,
  },
  {
    title: 'Catalog',
    description: 'Create categories and keep product grouping organized.',
    buttonLabel: 'Open Catalog',
    path: '/admin/actions/catalog',
    Icon: CategoryOutlined,
  },
];

export const AdminActions = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100%',
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 4, md: 6 },
        backgroundColor: 'background.default',
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant='overline' color='text.secondary'>
            Admin
          </Typography>
          <Typography variant='h5' sx={{ fontWeight: 800 }}>
            Admin Actions
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {adminActionCards.map(
            ({ title, description, buttonLabel, path, Icon }) => (
              <Grid key={title} size={{ xs: 12, md: 6, xl: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: theme =>
                      `0 16px 36px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <CardContent>
                    <Stack spacing={2.5} sx={{ height: '100%' }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'grid',
                          placeItems: 'center',
                          color: 'primary.main',
                          bgcolor: theme =>
                            alpha(theme.palette.primary.main, 0.1),
                        }}
                      >
                        <Icon />
                      </Box>

                      <Stack spacing={0.75} sx={{ flex: 1 }}>
                        <Typography variant='h6' sx={{ fontWeight: 800 }}>
                          {title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {description}
                        </Typography>
                      </Stack>

                      <Button
                        variant='contained'
                        onClick={() => navigate(path)}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        {buttonLabel}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Stack>
    </Box>
  );
};
