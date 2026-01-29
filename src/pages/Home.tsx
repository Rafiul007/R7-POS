import { Box, Typography, Stack, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  HomeStats,
  SalesTrendChart,
  PaymentMethodsChart,
  type SalesTrendPoint,
  type PaymentMethodPoint,
  TopProducts,
  type TopProduct,
  PerformanceMetrics,
} from '../components/Home';

export const Home = () => {
  const salesTrendData: SalesTrendPoint[] = [
    { name: 'Mon', sales: 1850 },
    { name: 'Tue', sales: 2100 },
    { name: 'Wed', sales: 1980 },
    { name: 'Thu', sales: 2460 },
    { name: 'Fri', sales: 2890 },
    { name: 'Sat', sales: 3420 },
    { name: 'Sun', sales: 2760 },
  ];

  const paymentMethodData: PaymentMethodPoint[] = [
    { name: 'Card', value: 54 },
    { name: 'Cash', value: 22 },
    { name: 'Bank', value: 14 },
    { name: 'Wallet', value: 10 },
  ];

  const topProducts: TopProduct[] = [
    {
      name: 'Wireless Bluetooth Headphones',
      sku: 'WH-001',
      sold: 86,
      revenue: 6120,
    },
    { name: 'Smart Fitness Watch', sku: 'FW-003', sold: 52, revenue: 7740 },
    { name: 'Organic Coffee Beans', sku: 'CF-002', sold: 140, revenue: 3500 },
    { name: 'Ergonomic Office Chair', sku: 'OC-004', sold: 18, revenue: 5380 },
  ];

  const performanceMetrics = [
    {
      label: 'Avg order value',
      value: '$64.40',
      helper: 'Based on last 7 days',
    },
    { label: 'Refund rate', value: '1.8%', helper: 'Last 30 days' },
    { label: 'Repeat customers', value: '28%', helper: 'Monthly cohort' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100%',
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.12
          )} 0%, ${alpha(theme.palette.info.main, 0)} 45%)`,
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Stack spacing={2}>
          <Typography
            variant='overline'
            sx={{
              letterSpacing: '0.22em',
              color: 'text.secondary',
              fontWeight: 600,
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant='h3'
            sx={{ fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Daily performance at a glance.
          </Typography>
          <Typography
            variant='body1'
            sx={{ color: 'text.secondary', maxWidth: 520 }}
          >
            Track sales momentum, customer activity, and payment mix.
          </Typography>
          <Divider sx={{ maxWidth: 320 }} />
        </Stack>

        <HomeStats
          totalSales={286}
          revenue={18420}
          customers={142}
          itemsInStock={412}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' },
            gap: 3,
          }}
        >
          <SalesTrendChart data={salesTrendData} />
          <PaymentMethodsChart data={paymentMethodData} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' },
            gap: 3,
          }}
        >
          <TopProducts data={topProducts} />
          <PerformanceMetrics
            title='Customer performance'
            subtitle='Key indicators for the current period.'
            metrics={performanceMetrics}
          />
        </Box>
      </Box>
    </Box>
  );
};
