import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export interface SalesTrendPoint {
  name: string;
  sales: number;
}

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
}

const tooltipFormatter = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const SalesTrendChart = ({ data }: SalesTrendChartProps) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 800 }}>
            Donations
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Performance trend for the last 7 days
          </Typography>
        </Box>
        <Button variant='outlined' size='small' color='inherit'>
          Weekly
        </Button>
      </Stack>

      <Box sx={{ width: '100%', height: 340 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id='salesAreaGradient'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop offset='5%' stopColor='#FF6B57' stopOpacity={0.28} />
                <stop offset='95%' stopColor='#FF6B57' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={alpha(theme.palette.text.secondary, 0.12)}
              vertical={false}
              strokeDasharray='4 4'
            />
            <XAxis
              dataKey='name'
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={value => `$${value}`}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `0 18px 40px ${alpha(theme.palette.common.black, 0.12)}`,
              }}
              labelStyle={{
                color: theme.palette.text.secondary,
                fontWeight: 600,
              }}
            />
            <Area
              type='monotone'
              dataKey='sales'
              stroke='#FF6B57'
              strokeWidth={3}
              fill='url(#salesAreaGradient)'
              activeDot={{
                r: 6,
                fill: '#FFFFFF',
                stroke: '#FF6B57',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
