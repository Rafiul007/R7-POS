import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface HomeStatsProps {
  totalSales: number;
  revenue: number;
  customers: number;
  itemsInStock: number;
}

type StatCardConfig = {
  label: string;
  value: string;
  helper: string;
  delta: string;
  positive?: boolean;
};

const SummaryCard = ({
  label,
  value,
  helper,
  delta,
  positive = true,
}: StatCardConfig) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2.25,
        borderRadius: 3,
        position: 'relative',
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant='body2' color='text.secondary'>
          {label}
        </Typography>
        <Typography
          variant='h5'
          sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}
        >
          {value}
        </Typography>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: positive
                ? theme.palette.success.main
                : theme.palette.warning.main,
            }}
          />
          <Typography
            variant='caption'
            sx={{
              color: positive
                ? theme.palette.success.dark
                : theme.palette.warning.dark,
              fontWeight: 700,
            }}
          >
            {delta}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {helper}
          </Typography>
        </Stack>
        <Box
          sx={{
            position: 'absolute',
            inset: 'auto 18px 18px auto',
            width: 56,
            height: 28,
            opacity: 0.9,
          }}
        >
          <svg viewBox='0 0 56 28' width='56' height='28' fill='none'>
            <path
              d='M2 22C7 22 9 9 15 9C21 9 20 25 28 25C36 25 33 7 42 7C48 7 50 17 54 3'
              stroke={
                positive
                  ? theme.palette.primary.main
                  : theme.palette.warning.main
              }
              strokeWidth='2.5'
              strokeLinecap='round'
            />
          </svg>
        </Box>
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

  const stats: StatCardConfig[] = [
    {
      label: 'Donations',
      value: formatCurrency(revenue),
      helper: 'Last week',
      delta: '8.2%',
    },
    {
      label: 'Active campaigns',
      value: `${Math.max(totalSales - 268, 18)}`,
      helper: 'Retail + online',
      delta: '3 live',
    },
    {
      label: 'Upcoming events',
      value: `${Math.max(customers - 139, 3)}`,
      helper: 'This week',
      delta: '2 pending',
      positive: false,
    },
    {
      label: 'Active members',
      value: new Intl.NumberFormat('en-US').format(itemsInStock * 4 + 219),
      helper: 'New this week',
      delta: '52',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {stats.map(stat => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </Box>
  );
};
