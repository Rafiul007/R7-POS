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
    theme.palette.primary.main,
    alpha(theme.palette.primary.main, 0.7),
    alpha(theme.palette.primary.main, 0.45),
    alpha(theme.palette.primary.main, 0.25),
  ];

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
                borderRadius: 0,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
