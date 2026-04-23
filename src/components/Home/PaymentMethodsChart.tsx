import { Paper, Typography, Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export interface PaymentMethodPoint {
  name: string;
  value: number;
}

interface PaymentMethodsChartProps {
  data: PaymentMethodPoint[];
}

export const PaymentMethodsChart = ({ data }: PaymentMethodsChartProps) => {
  const theme = useTheme();
  const colors = [
    theme.palette.secondary.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.dark,
  ];

  return (
    <Paper
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette.secondary.main, 0.16),
        background: `linear-gradient(180deg, ${alpha(
          theme.palette.secondary.main,
          0.08
        )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 42%)`,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant='overline' sx={{ letterSpacing: '0.18em' }}>
          Payments
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Payment methods
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey='value'
              nameKey='name'
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              stroke='none'
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                borderRadius: 16,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: `0 10px 24px ${alpha(theme.palette.primary.dark, 0.08)}`,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
