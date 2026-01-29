import { useMemo, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add } from '@mui/icons-material';
import {
  PaymentsFilters,
  PaymentsStats,
  PaymentsTable,
  type PaymentsFiltersState,
  type PaymentRecord,
} from '../components/Payments';

export const Payments = () => {
  const [data] = useState<PaymentRecord[]>([
    {
      id: 'pay_001',
      reference: 'PMT-1021',
      customer: 'Ariana Fields',
      method: 'card',
      status: 'paid',
      amount: 128.5,
      date: 'Jan 24, 2026',
    },
    {
      id: 'pay_002',
      reference: 'PMT-1022',
      customer: 'Noah Patel',
      method: 'cash',
      status: 'paid',
      amount: 42.0,
      date: 'Jan 24, 2026',
    },
    {
      id: 'pay_003',
      reference: 'PMT-1023',
      customer: 'Liam Ortiz',
      method: 'bank',
      status: 'pending',
      amount: 260.75,
      date: 'Jan 25, 2026',
    },
    {
      id: 'pay_004',
      reference: 'PMT-1024',
      customer: 'Mia Chen',
      method: 'card',
      status: 'failed',
      amount: 89.99,
      date: 'Jan 25, 2026',
    },
    {
      id: 'pay_005',
      reference: 'PMT-1025',
      customer: 'Ethan Brooks',
      method: 'wallet',
      status: 'paid',
      amount: 310.0,
      date: 'Jan 26, 2026',
    },
    {
      id: 'pay_006',
      reference: 'PMT-1026',
      customer: 'Sofia Alvarez',
      method: 'card',
      status: 'refunded',
      amount: 59.5,
      date: 'Jan 27, 2026',
    },
  ]);

  const [filters, setFilters] = useState<PaymentsFiltersState>({
    search: '',
    method: '',
    status: '',
  });

  const filteredData = useMemo(() => {
    return data.filter(payment => {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        const matchesSearch =
          payment.customer.toLowerCase().includes(term) ||
          payment.reference.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      if (filters.method && payment.method !== filters.method) {
        return false;
      }

      if (filters.status && payment.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

  const stats = useMemo(
    () => ({
      total: data.length,
      paid: data.filter(payment => payment.status === 'paid').length,
      pending: data.filter(payment => payment.status === 'pending').length,
      failed: data.filter(payment => payment.status === 'failed').length,
    }),
    [data]
  );

  const handleFiltersChange = (newFilters: PaymentsFiltersState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      method: '',
      status: '',
    });
  };

  const handleCreatePayment = () => {
    console.log('Create payment');
  };

  const handleViewPayment = (payment: PaymentRecord) => {
    console.log('View payment:', payment);
  };

  const handleRefundPayment = (payment: PaymentRecord) => {
    console.log('Refund payment:', payment);
  };

  return (
    <Box
      sx={{
        minHeight: '100%',
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.12
          )} 0%, ${alpha(theme.palette.info.main, 0)} 45%)`,
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Stack spacing={2}>
            <Typography
              variant='overline'
              sx={{
                letterSpacing: '0.22em',
                color: 'text.secondary',
                fontWeight: 600,
              }}
            >
              Payments
            </Typography>
          </Stack>

          <Tooltip title='New Payment'>
            <IconButton
              onClick={handleCreatePayment}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                p: 1.25,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
        </Box>

        <PaymentsStats
          totalPayments={stats.total}
          paidPayments={stats.paid}
          pendingPayments={stats.pending}
          failedPayments={stats.failed}
        />

        <PaymentsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        <PaymentsTable
          data={filteredData}
          onView={handleViewPayment}
          onRefund={handleRefundPayment}
        />
      </Box>
    </Box>
  );
};
