import { Paper, Typography, Box, Stack } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

interface MetricItem {
  label: string;
  value: string;
  helper?: string;
}

interface PerformanceMetricsProps {
  title: string;
  subtitle: string;
  metrics: MetricItem[];
}

export const PerformanceMetrics = ({
  title,
  subtitle,
  metrics,
}: PerformanceMetricsProps) => {
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
          Metrics
        </Typography>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {subtitle}
        </Typography>
      </Box>
      <Stack spacing={2}>
        {metrics.map(metric => (
          <Box
            key={metric.label}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            }}
          >
            <Typography
              variant='overline'
              sx={{
                letterSpacing: '0.14em',
                color: 'text.secondary',
                fontWeight: 600,
              }}
            >
              {metric.label}
            </Typography>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              {metric.value}
            </Typography>
            {metric.helper && (
              <Typography variant='caption' color='text.secondary'>
                {metric.helper}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};
