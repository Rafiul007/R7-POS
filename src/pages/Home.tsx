import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  AlertsPanel,
  EventsTable,
  HomeStats,
  SalesTrendChart,
  type DashboardAlert,
  type DashboardEventRow,
  type SalesTrendPoint,
} from '../components/Home';

export const Home = () => {
  const salesTrendData: SalesTrendPoint[] = [
    { name: 'Sat', sales: 2200 },
    { name: 'Sun', sales: 3500 },
    { name: 'Mon', sales: 4900 },
    { name: 'Tue', sales: 7200 },
    { name: 'Wed', sales: 9400 },
    { name: 'Thu', sales: 8800 },
    { name: 'Fri', sales: 13200 },
  ];

  const alerts: DashboardAlert[] = [
    {
      id: '1',
      type: 'Pending Approval',
      title: 'Review new supplier donation transfer',
      status: 'Awaiting',
      due: 'Today',
    },
    {
      id: '2',
      type: 'Pending Approval',
      title: 'Confirm discounted product bundle campaign',
      status: 'Pending',
      due: 'Today',
    },
    {
      id: '3',
      type: 'Upcoming Event',
      title: 'Prepare homepage banner for Friday collection',
      status: 'Not Done',
      due: 'Tomorrow',
    },
    {
      id: '4',
      type: 'New Message',
      title: 'Reply to branch request on stock transfer',
      status: 'New',
      due: 'Tomorrow',
    },
    {
      id: '5',
      type: 'System Setup',
      title: 'Reconnect Stripe and verify settlement webhook',
      status: 'Awaiting',
      due: 'This Week',
    },
  ];

  const events: DashboardEventRow[] = [
    {
      id: '1',
      eventName: 'Friday Khutbah',
      dateTime: 'Sep 27, 2025 · 1:30 PM',
      location: 'Main Prayer Hall',
      status: 'Admin',
      category: 'Jummah',
      frequency: 'Weekly',
      tickets: 0,
      attendees: 450,
    },
    {
      id: '2',
      eventName: 'Youth Circle',
      dateTime: 'Sep 27, 2025 · 3:30 PM',
      location: 'Classroom A',
      status: 'Admin',
      category: 'Education',
      frequency: 'Weekly',
      tickets: 120,
      attendees: 110,
    },
    {
      id: '3',
      eventName: 'Community Dinner',
      dateTime: 'Sep 27, 2025 · 6:30 PM',
      location: 'Youth Room',
      status: 'Scheduled',
      category: 'Youth',
      frequency: 'Weekly',
      tickets: 250,
      attendees: 218,
    },
    {
      id: '4',
      eventName: 'Volunteer Meetup',
      dateTime: 'Sep 27, 2025 · 8:00 PM',
      location: 'Parking Lot',
      status: 'Draft',
      category: 'Service',
      frequency: 'One-time',
      tickets: 120,
      attendees: 108,
    },
  ];

  return (
    <Box sx={{ minHeight: '100%' }}>
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <Paper
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
            borderRadius: 3,
            background: theme =>
              `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                1
              )} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', lg: 'center' }}
          >
            <Stack spacing={1}>
              <Chip
                label='Dashboard'
                size='small'
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.dark',
                  fontWeight: 700,
                }}
              />
              <Typography variant='h4' sx={{ fontWeight: 800 }}>
                Performance overview for your retail workspace
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Track revenue, activity, alerts, and operational events in one
                clean control panel.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.25}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Button variant='outlined' color='inherit'>
                Export Report
              </Button>
              <Button variant='contained'>Create Campaign</Button>
            </Stack>
          </Stack>
        </Paper>

        <HomeStats
          totalSales={286}
          revenue={12867}
          customers={142}
          itemsInStock={412}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '1.65fr 1fr' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <SalesTrendChart data={salesTrendData} />
          <AlertsPanel items={alerts} />
        </Box>

        <EventsTable rows={events} />
      </Box>
    </Box>
  );
};
