import { Paper, Typography, Box, Stack, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface TopProduct {
  name: string;
  sku: string;
  sold: number;
  revenue: number;
}

interface TopProductsProps {
  data: TopProduct[];
}

export const TopProducts = ({ data }: TopProductsProps) => {
  return (
    <Paper
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: theme => alpha(theme.palette.secondary.main, 0.14),
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.secondary.main,
            0.08
          )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 44%)`,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant='overline' sx={{ letterSpacing: '0.18em' }}>
          Products
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Top performers
        </Typography>
      </Box>
      <Stack spacing={2} divider={<Divider />}>
        {data.map(product => (
          <Box
            key={product.sku}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              p: 1.5,
              borderRadius: 3,
              backgroundColor: theme => alpha(theme.palette.common.white, 0.72),
            }}
          >
            <Box>
              <Typography variant='body2' fontWeight={600}>
                {product.name}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {product.sku}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant='body2' fontWeight={600}>
                {product.sold} sold
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                ${product.revenue.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};
