import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

export interface DashboardAlert {
  id: string;
  type: string;
  title: string;
  status: 'Awaiting' | 'Pending' | 'Not Done' | 'New';
  due: string;
}

interface AlertsPanelProps {
  items: DashboardAlert[];
}

export const AlertsPanel = ({ items }: AlertsPanelProps) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          px: 3,
          py: 2.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 800 }}>
            To-Do & Alerts
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Team actions that need attention
          </Typography>
        </Box>
        <Button variant='outlined' size='small' color='inherit'>
          View all
        </Button>
      </Stack>

      <Stack sx={{ px: 3, py: 1 }}>
        {items.map((item, index) => {
          const palette = {
            Awaiting: {
              bg: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.dark,
            },
            Pending: {
              bg: alpha(theme.palette.warning.main, 0.12),
              color: theme.palette.warning.dark,
            },
            'Not Done': {
              bg: alpha(theme.palette.text.secondary, 0.1),
              color: theme.palette.text.secondary,
            },
            New: {
              bg: alpha(theme.palette.secondary.main, 0.12),
              color: theme.palette.secondary.dark,
            },
          }[item.status];
          return (
            <Stack
              key={item.id}
              direction='row'
              spacing={1.5}
              alignItems='center'
              justifyContent='space-between'
              sx={{
                py: 1.5,
                borderBottom:
                  index === items.length - 1
                    ? 'none'
                    : `1px solid ${theme.palette.divider}`,
                gap: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant='caption'
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    mb: 0.4,
                    fontWeight: 600,
                  }}
                >
                  {item.type}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 700, lineHeight: 1.4 }}
                >
                  {item.title}
                </Typography>
              </Box>

              <Chip
                label={item.status}
                size='small'
                sx={{
                  bgcolor: palette.bg,
                  color: palette.color,
                  fontWeight: 700,
                }}
              />

              <Typography
                variant='caption'
                sx={{
                  minWidth: 56,
                  textAlign: 'right',
                  color: 'text.secondary',
                }}
              >
                {item.due}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
};
