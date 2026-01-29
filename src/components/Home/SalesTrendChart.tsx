import { Paper, Typography, Box } from '@mui/material';
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
    <Paper
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: theme => alpha(theme.palette.background.paper, 0.92),
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant='overline' sx={{ letterSpacing: '0.18em' }}>
          Sales Trend
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Weekly revenue
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.35}
                />
                <stop
                  offset='95%'
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={alpha(theme.palette.primary.main, 0.08)}
              vertical={false}
            />
            <XAxis
              dataKey='name'
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
              }}
            />
            <Area
              type='monotone'
              dataKey='sales'
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              fill='url(#salesGradient)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
