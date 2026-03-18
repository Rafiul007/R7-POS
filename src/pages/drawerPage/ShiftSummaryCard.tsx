import { AccountBalanceWallet } from '@mui/icons-material';
import { Card, CardContent, Stack, Typography } from '@mui/material';

interface ShiftSummaryCardProps {
  shiftOpenedBy?: string;
  branchName?: string;
  drawerName?: string;
  openedAt?: string;
  openingCash: number;
  cashSales: number;
  expectedCash: number;
  notes?: string;
  isClosed: boolean;
  overShort: number | null;
}

export const ShiftSummaryCard = ({
  shiftOpenedBy,
  branchName,
  drawerName,
  openedAt,
  openingCash,
  cashSales,
  expectedCash,
  notes,
  isClosed,
  overShort,
}: ShiftSummaryCardProps) => (
  <Card
    sx={{
      flex: 1,
      borderRadius: 0,
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <CardContent>
      <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 2 }}>
        <AccountBalanceWallet color='primary' />
        <Typography variant='subtitle1' fontWeight={600}>
          Shift Summary
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant='body2'>Opened by: {shiftOpenedBy || '—'}</Typography>
        <Typography variant='body2'>Branch: {branchName || '—'}</Typography>
        <Typography variant='body2'>Drawer: {drawerName || '—'}</Typography>
        <Typography variant='body2'>
          Opened at: {openedAt ? new Date(openedAt).toLocaleString() : '—'}
        </Typography>
        <Typography variant='body2'>
          Opening cash: ${openingCash.toFixed(2)}
        </Typography>
        <Typography variant='body2'>Cash sales: ${cashSales.toFixed(2)}</Typography>
        <Typography variant='body2' fontWeight={600}>
          Expected cash: ${expectedCash.toFixed(2)}
        </Typography>
        {notes && <Typography variant='body2'>Note: {notes}</Typography>}
        {isClosed && (
          <Typography
            variant='body2'
            color={overShort && overShort < 0 ? 'error.main' : 'success.main'}
          >
            Over/Short: ${overShort?.toFixed(2) || '0.00'}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);
