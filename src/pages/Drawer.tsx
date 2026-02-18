import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  AccountBalanceWallet,
  Add,
  Remove,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import { useAlert } from '../hooks';
import { MESSAGES } from '../constants';
import { SHIFT_STORAGE_KEY } from '../utils/drawer';
import { branches, getBranchById } from '../data/branches';
import {
  getCurrentBranchId,
  setCurrentBranchId,
} from '../data/branchInventoryStore';

interface CashMovement {
  id: string;
  type: 'in' | 'out';
  amount: number;
  reason: string;
  timestamp: string;
}

interface ShiftData {
  id: string;
  status: 'open' | 'closed';
  branchId: string;
  openedAt: string;
  openedBy: string;
  openingCash: number;
  cashSales: number;
  closedAt?: string;
  closedBy?: string;
  countedCash?: number;
  notes?: string;
}

const STORAGE_KEY = SHIFT_STORAGE_KEY;

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw)
    return { shift: null as ShiftData | null, moves: [] as CashMovement[] };
  try {
    return JSON.parse(raw) as {
      shift: ShiftData | null;
      moves: CashMovement[];
    };
  } catch {
    return { shift: null as ShiftData | null, moves: [] as CashMovement[] };
  }
};

export const Drawer = () => {
  const { showAlert } = useAlert();
  const [{ shift, moves }, setState] = useState(loadState);
  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [cashDialog, setCashDialog] = useState<null | 'in' | 'out'>(null);
  const [closeShiftDialog, setCloseShiftDialog] = useState(false);

  const [openForm, setOpenForm] = useState({
    openedBy: '',
    openingCash: '0',
    branchId: getCurrentBranchId() || branches[0]?.id || '',
  });
  const [cashForm, setCashForm] = useState({
    amount: '',
    reason: '',
  });
  const [closeForm, setCloseForm] = useState({
    countedCash: '',
    closedBy: '',
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ shift, moves }));
  }, [shift, moves]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('drawer-shift-updated'));
  }, [shift]);

  const totals = useMemo(() => {
    const totalIn = moves
      .filter(m => m.type === 'in')
      .reduce((sum, m) => sum + m.amount, 0);
    const totalOut = moves
      .filter(m => m.type === 'out')
      .reduce((sum, m) => sum + m.amount, 0);
    const openingCash = shift?.openingCash || 0;
    const cashSales = shift?.cashSales || 0;
    const expectedCash = openingCash + cashSales + totalIn - totalOut;
    return { totalIn, totalOut, expectedCash };
  }, [moves, shift]);

  const handleOpenShift = () => {
    const openingCash = Number(openForm.openingCash || 0);
    if (!openForm.openedBy.trim() || !openForm.branchId) return;

    const newShift: ShiftData = {
      id: `shift_${Date.now()}`,
      status: 'open',
      branchId: openForm.branchId,
      openedAt: new Date().toISOString(),
      openedBy: openForm.openedBy.trim(),
      openingCash: Math.max(0, openingCash),
      cashSales: 0,
    };

    setState({ shift: newShift, moves: [] });
    setCurrentBranchId(openForm.branchId);
    setOpenForm({
      openedBy: '',
      openingCash: '0',
      branchId: openForm.branchId,
    });
    setOpenShiftDialog(false);
    showAlert({ message: MESSAGES.DRAWER.SHIFT_OPENED, severity: 'success' });
  };

  const handleAddMovement = () => {
    if (!shift || shift.status !== 'open') return;
    const amount = Number(cashForm.amount || 0);
    if (!cashForm.reason.trim() || amount <= 0) return;

    const next: CashMovement = {
      id: `move_${Date.now()}`,
      type: cashDialog || 'in',
      amount,
      reason: cashForm.reason.trim(),
      timestamp: new Date().toISOString(),
    };

    if (cashDialog === 'out' && amount > totals.expectedCash) {
      return;
    }

    setState(prev => ({ shift: prev.shift, moves: [next, ...prev.moves] }));
    setCashForm({ amount: '', reason: '' });
    setCashDialog(null);
    showAlert({
      message:
        cashDialog === 'out'
          ? MESSAGES.DRAWER.CASH_OUT_RECORDED
          : MESSAGES.DRAWER.CASH_IN_RECORDED,
      severity: 'success',
    });
  };

  const handleCloseShift = () => {
    if (!shift) return;
    const counted = Number(closeForm.countedCash || 0);
    if (!closeForm.closedBy.trim()) return;

    const closedShift: ShiftData = {
      ...shift,
      status: 'closed',
      closedAt: new Date().toISOString(),
      closedBy: closeForm.closedBy.trim(),
      countedCash: Math.max(0, counted),
      notes: closeForm.notes.trim(),
    };

    setState(prev => ({ shift: closedShift, moves: prev.moves }));
    setCloseForm({ countedCash: '', closedBy: '', notes: '' });
    setCloseShiftDialog(false);
    showAlert({ message: MESSAGES.DRAWER.SHIFT_CLOSED, severity: 'success' });
  };

  const handleCashSalesUpdate = (value: string) => {
    if (!shift) return;
    const cashSales = Math.max(0, Number(value || 0));
    setState(prev =>
      prev.shift
        ? { shift: { ...prev.shift, cashSales }, moves: prev.moves }
        : prev
    );
  };

  const overShort =
    shift?.status === 'closed' && shift.countedCash !== undefined
      ? shift.countedCash - totals.expectedCash
      : null;

  return (
    <Box
      sx={{
        minHeight: '100%',
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.info.main, 0)} 45%)`,
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
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack spacing={1}>
            <Typography
              variant='overline'
              sx={{ letterSpacing: '0.22em', color: 'text.secondary' }}
            >
              Drawer
            </Typography>
            <Typography variant='h5' fontWeight={600}>
              Cash drawer & shift management
            </Typography>
          </Stack>
          <Chip
            icon={shift?.status === 'open' ? <LockOpen /> : <Lock />}
            label={shift?.status === 'open' ? 'Shift Open' : 'Shift Closed'}
            color={shift?.status === 'open' ? 'success' : 'default'}
            variant='outlined'
            sx={{ borderRadius: 0 }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card
            sx={{
              flex: 1,
              borderRadius: 0,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Stack
                direction='row'
                spacing={1}
                alignItems='center'
                sx={{ mb: 2 }}
              >
                <AccountBalanceWallet color='primary' />
                <Typography variant='subtitle1' fontWeight={600}>
                  Shift Summary
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant='body2'>
                  Opened by: {shift?.openedBy || '—'}
                </Typography>
                <Typography variant='body2'>
                  Branch: {shift ? getBranchById(shift.branchId).name : '—'}
                </Typography>
                <Typography variant='body2'>
                  Opened at:{' '}
                  {shift ? new Date(shift.openedAt).toLocaleString() : '—'}
                </Typography>
                <Typography variant='body2'>
                  Opening cash: ${shift?.openingCash.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant='body2'>
                  Cash sales: ${shift?.cashSales.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant='body2' fontWeight={600}>
                  Expected cash: ${totals.expectedCash.toFixed(2)}
                </Typography>
                {shift?.status === 'closed' && (
                  <Typography
                    variant='body2'
                    color={
                      overShort && overShort < 0 ? 'error.main' : 'success.main'
                    }
                  >
                    Over/Short: ${overShort?.toFixed(2) || '0.00'}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              borderRadius: 0,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2 }}>
                Controls
              </Typography>
              <Stack direction='row' spacing={2} flexWrap='wrap'>
                <Button
                  variant='contained'
                  startIcon={<LockOpen />}
                  disabled={shift?.status === 'open'}
                  onClick={() => setOpenShiftDialog(true)}
                  sx={{ borderRadius: 0 }}
                >
                  Open Shift
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<Lock />}
                  disabled={!shift || shift.status !== 'open'}
                  onClick={() => setCloseShiftDialog(true)}
                  sx={{ borderRadius: 0 }}
                >
                  Close Shift
                </Button>
                <Button
                  variant='contained'
                  color='success'
                  startIcon={<Add />}
                  disabled={!shift || shift.status !== 'open'}
                  onClick={() => setCashDialog('in')}
                  sx={{ borderRadius: 0 }}
                >
                  Cash In
                </Button>
                <Button
                  variant='contained'
                  color='warning'
                  startIcon={<Remove />}
                  disabled={!shift || shift.status !== 'open'}
                  onClick={() => setCashDialog('out')}
                  sx={{ borderRadius: 0 }}
                >
                  Cash Out
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <TextField
                label='Cash sales total'
                type='number'
                fullWidth
                disabled={!shift || shift.status !== 'open'}
                value={shift?.cashSales ?? ''}
                onChange={e => handleCashSalesUpdate(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>$</InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                helperText='Enter cash sales total if not synced from payments.'
              />
            </CardContent>
          </Card>
        </Stack>

        <Card
          sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ mb: 2 }}
            >
              <Typography variant='subtitle1' fontWeight={600}>
                Cash movements
              </Typography>
              <Stack direction='row' spacing={2}>
                <Typography variant='body2'>
                  In: ${totals.totalIn.toFixed(2)}
                </Typography>
                <Typography variant='body2'>
                  Out: ${totals.totalOut.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {moves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No cash movements yet.</TableCell>
                  </TableRow>
                ) : (
                  moves.map(move => (
                    <TableRow key={move.id}>
                      <TableCell>
                        {move.type === 'in' ? 'Cash In' : 'Cash Out'}
                      </TableCell>
                      <TableCell>${move.amount.toFixed(2)}</TableCell>
                      <TableCell>{move.reason}</TableCell>
                      <TableCell>
                        {new Date(move.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={openShiftDialog}
        onClose={() => setOpenShiftDialog(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Open shift</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            select
            label='Branch'
            value={openForm.branchId}
            onChange={e =>
              setOpenForm(prev => ({ ...prev, branchId: e.target.value }))
            }
            fullWidth
          >
            {branches.map(branch => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name} · {branch.code}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Opened by'
            value={openForm.openedBy}
            onChange={e =>
              setOpenForm(prev => ({ ...prev, openedBy: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label='Opening cash'
            type='number'
            value={openForm.openingCash}
            onChange={e =>
              setOpenForm(prev => ({ ...prev, openingCash: e.target.value }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShiftDialog(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleOpenShift}>
            Open
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(cashDialog)}
        onClose={() => setCashDialog(null)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>
          {cashDialog === 'in' ? 'Cash in' : 'Cash out'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            label='Amount'
            type='number'
            value={cashForm.amount}
            onChange={e =>
              setCashForm(prev => ({ ...prev, amount: e.target.value }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            label='Reason'
            value={cashForm.reason}
            onChange={e =>
              setCashForm(prev => ({ ...prev, reason: e.target.value }))
            }
            fullWidth
          />
          {cashDialog === 'out' &&
            Number(cashForm.amount) > totals.expectedCash && (
              <Typography variant='caption' color='error.main'>
                Amount exceeds expected cash in drawer.
              </Typography>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCashDialog(null)}>Cancel</Button>
          <Button variant='contained' onClick={handleAddMovement}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={closeShiftDialog}
        onClose={() => setCloseShiftDialog(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Close shift</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <Typography variant='body2'>
            Expected cash: ${totals.expectedCash.toFixed(2)}
          </Typography>
          <TextField
            label='Counted cash'
            type='number'
            value={closeForm.countedCash}
            onChange={e =>
              setCloseForm(prev => ({ ...prev, countedCash: e.target.value }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>$</InputAdornment>
              ),
            }}
            fullWidth
          />
          <TextField
            label='Closed by'
            value={closeForm.closedBy}
            onChange={e =>
              setCloseForm(prev => ({ ...prev, closedBy: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label='Notes (optional)'
            value={closeForm.notes}
            onChange={e =>
              setCloseForm(prev => ({ ...prev, notes: e.target.value }))
            }
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseShiftDialog(false)}>Cancel</Button>
          <Button variant='contained' onClick={handleCloseShift}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
