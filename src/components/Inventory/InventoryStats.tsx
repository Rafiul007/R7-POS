import { Box, Paper, Typography, Stack } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
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
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderLeft: 'none',
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
      />
      <StatCard icon={WarningAmber} label='Low Stock' value={lowStock} />
      <StatCard icon={BlockOutlined} label='Out of Stock' value={outOfStock} />
      <StatCard
        icon={CheckCircle}
        label='Active Products'
        value={activeProducts}
      />
    </Box>
  );
};
