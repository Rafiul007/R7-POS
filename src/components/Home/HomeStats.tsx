import { Box, Paper, Typography, Stack } from '@mui/material';
import {
  ShoppingCart,
  AttachMoney,
  PeopleAlt,
  Inventory2,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

interface HomeStatsProps {
  totalSales: number;
  revenue: number;
  customers: number;
  itemsInStock: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'transparent',
        transition: 'transform 0.25s ease, border-color 0.25s ease',
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'text.primary',
        },
      }}
    >
      <Box
        sx={{
          p: 1.25,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ color: theme.palette.primary.main, fontSize: '1.3rem' }} />
      </Box>
      <Stack spacing={0.25} sx={{ flex: 1 }}>
        <Typography
          variant='overline'
          sx={{
            letterSpacing: '0.18em',
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant='h5'
          fontWeight={600}
          sx={{ color: 'text.primary' }}
        >
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
};

export const HomeStats = ({
  totalSales,
  revenue,
  customers,
  itemsInStock,
}: HomeStatsProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      <StatCard
        icon={ShoppingCart}
        label='Total Sales'
        value={`${totalSales}`}
      />
      <StatCard
        icon={AttachMoney}
        label='Revenue'
        value={formatCurrency(revenue)}
      />
      <StatCard icon={PeopleAlt} label='Customers' value={`${customers}`} />
      <StatCard
        icon={Inventory2}
        label='Items In Stock'
        value={`${itemsInStock}`}
      />
    </Box>
  );
};
