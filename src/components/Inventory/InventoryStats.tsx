import { Box, Paper, Typography } from '@mui/material';
import {
  Inventory2,
  WarningAmber,
  BlockOutlined,
  CheckCircle,
} from '@mui/icons-material';

interface InventoryStatsProps {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  activeProducts: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderLeft: `4px solid ${color}`,
      transition: 'all 0.2s ease',
      '&:hover': {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }}
  >
    <Box
      sx={{
        p: 1.5,
        backgroundColor: bgColor,
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon sx={{ color, fontSize: '1.5rem' }} />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant='h5' fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

export const InventoryStats = ({
  totalProducts,
  lowStock,
  outOfStock,
  activeProducts,
}: InventoryStatsProps) => {
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
        icon={Inventory2}
        label='Total Products'
        value={totalProducts}
        color='#1976d2'
        bgColor='rgba(25, 118, 210, 0.08)'
      />
      <StatCard
        icon={WarningAmber}
        label='Low Stock'
        value={lowStock}
        color='#ff9800'
        bgColor='rgba(255, 152, 0, 0.08)'
      />
      <StatCard
        icon={BlockOutlined}
        label='Out of Stock'
        value={outOfStock}
        color='#f44336'
        bgColor='rgba(244, 67, 54, 0.08)'
      />
      <StatCard
        icon={CheckCircle}
        label='Active Products'
        value={activeProducts}
        color='#4caf50'
        bgColor='rgba(76, 175, 80, 0.08)'
      />
    </Box>
  );
};
