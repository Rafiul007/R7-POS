import { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Lock, LockOpen } from '@mui/icons-material';
import { useAlert } from '../../hooks';
import { MESSAGES } from '../../constants';
import { getDrawerById, getDrawersByBranchId } from '../../data/drawers';
import {
  getCurrentBranchId,
  setCurrentBranchId,
} from '../../data/branchInventoryStore';
import {
  createCloseForm,
  createInitialOpenForm,
  getShiftTotals,
  mergeShiftNotes,
  normalizeShiftBranch,
} from './helpers';
import { loadDrawerState, saveDrawerState } from './storage';
import type { CashMovement, CashFormState, ShiftData } from './types';
import { CashMovementDialog } from './CashMovementDialog';
import { CashMovementsCard } from './CashMovementsCard';
import { CloseShiftDialog } from './CloseShiftDialog';
import { ControlsCard } from './ControlsCard';
import { OpenShiftDialog } from './OpenShiftDialog';
import { ShiftSummaryCard } from './ShiftSummaryCard';

const initialCashForm: CashFormState = {
  amount: '',
  reason: '',
};

export const Drawer = () => {
  const { showAlert } = useAlert();
  const [{ shift, moves }, setState] = useState(loadDrawerState);
  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [cashDialog, setCashDialog] = useState<null | 'in' | 'out'>(null);
  const [closeShiftDialog, setCloseShiftDialog] = useState(false);
  const [openForm, setOpenForm] = useState(() => {
    const branchId = getCurrentBranchId() || createInitialOpenForm().branchId;
    return {
      ...createInitialOpenForm(),
      branchId,
      drawerId: getDrawersByBranchId(branchId)[0]?.id || '',
    };
  });
  const [cashForm, setCashForm] = useState(initialCashForm);
  const [closeForm, setCloseForm] = useState(createCloseForm);

  useEffect(() => {
    saveDrawerState({ shift, moves });
  }, [shift, moves]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('drawer-shift-updated'));
  }, [shift]);

  const totals = useMemo(() => getShiftTotals(shift, moves), [moves, shift]);
  const availableDrawers = useMemo(
    () => getDrawersByBranchId(openForm.branchId),
    [openForm.branchId]
  );

  const handleOpenShift = () => {
    const openingCash = Number(openForm.openingCash || 0);
    const drawer = getDrawerById(openForm.drawerId);
    if (!openForm.openedBy.trim() || !openForm.branchId || !drawer) return;

    const newShift: ShiftData = {
      id: `shift_${Date.now()}`,
      status: 'open',
      branch: normalizeShiftBranch(openForm.branchId),
      drawer: {
        drawerName: drawer.drawerName,
        branchId: drawer.branchId,
      },
      openedAt: new Date().toISOString(),
      openedBy: openForm.openedBy.trim(),
      openingCash: Math.max(0, openingCash),
      cashSales: 0,
      notes: openForm.notes.trim() || undefined,
    };

    setState({ shift: newShift, moves: [] });
    setCurrentBranchId(openForm.branchId);
    setOpenForm(prev => ({
      ...prev,
      openedBy: '',
      openingCash: '0',
      notes: '',
    }));
    setOpenShiftDialog(false);
    showAlert({ message: MESSAGES.DRAWER.SHIFT_OPENED, severity: 'success' });
  };

  const handleAddMovement = () => {
    if (!shift || shift.status !== 'open') return;

    const amount = Number(cashForm.amount || 0);
    if (!cashForm.reason.trim() || amount <= 0) return;
    if (cashDialog === 'out' && amount > totals.expectedCash) return;

    const next: CashMovement = {
      id: `move_${Date.now()}`,
      type: cashDialog || 'in',
      amount,
      reason: cashForm.reason.trim(),
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({ shift: prev.shift, moves: [next, ...prev.moves] }));
    setCashForm(initialCashForm);
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
    if (!shift || !closeForm.closedBy.trim()) return;

    const closedShift: ShiftData = {
      ...shift,
      status: 'closed',
      closedAt: new Date().toISOString(),
      closedBy: closeForm.closedBy.trim(),
      countedCash: Math.max(0, Number(closeForm.countedCash || 0)),
      notes: mergeShiftNotes(shift.notes, closeForm.notes),
    };

    setState(prev => ({ shift: closedShift, moves: prev.moves }));
    setCloseForm(createCloseForm());
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
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
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
          <ShiftSummaryCard
            shiftOpenedBy={shift?.openedBy}
            branchName={shift?.branch.branchName}
            drawerName={shift?.drawer.drawerName}
            openedAt={shift?.openedAt}
            openingCash={shift?.openingCash || 0}
            cashSales={shift?.cashSales || 0}
            expectedCash={totals.expectedCash}
            notes={shift?.notes}
            isClosed={shift?.status === 'closed'}
            overShort={overShort}
          />

          <ControlsCard
            isShiftOpen={shift?.status === 'open'}
            cashSales={shift?.cashSales}
            onOpenShift={() => setOpenShiftDialog(true)}
            onCloseShift={() => setCloseShiftDialog(true)}
            onCashIn={() => setCashDialog('in')}
            onCashOut={() => setCashDialog('out')}
            onCashSalesChange={handleCashSalesUpdate}
          />
        </Stack>

        <CashMovementsCard
          moves={moves}
          totalIn={totals.totalIn}
          totalOut={totals.totalOut}
        />
      </Box>

      <OpenShiftDialog
        open={openShiftDialog}
        form={openForm}
        availableDrawers={availableDrawers}
        onClose={() => setOpenShiftDialog(false)}
        onBranchChange={branchId => {
          setCurrentBranchId(branchId);
          setOpenForm(prev => ({
            ...prev,
            branchId,
            drawerId: getDrawersByBranchId(branchId)[0]?.id || '',
          }));
        }}
        onDrawerChange={drawerId =>
          setOpenForm(prev => ({ ...prev, drawerId }))
        }
        onOpenedByChange={openedBy =>
          setOpenForm(prev => ({ ...prev, openedBy }))
        }
        onOpeningCashChange={openingCash =>
          setOpenForm(prev => ({ ...prev, openingCash }))
        }
        onNotesChange={notes => setOpenForm(prev => ({ ...prev, notes }))}
        onSubmit={handleOpenShift}
      />

      <CashMovementDialog
        mode={cashDialog}
        form={cashForm}
        totals={totals}
        onClose={() => setCashDialog(null)}
        onAmountChange={amount => setCashForm(prev => ({ ...prev, amount }))}
        onReasonChange={reason => setCashForm(prev => ({ ...prev, reason }))}
        onSubmit={handleAddMovement}
      />

      <CloseShiftDialog
        open={closeShiftDialog}
        form={closeForm}
        expectedCash={totals.expectedCash}
        onClose={() => setCloseShiftDialog(false)}
        onCountedCashChange={countedCash =>
          setCloseForm(prev => ({ ...prev, countedCash }))
        }
        onClosedByChange={closedBy =>
          setCloseForm(prev => ({ ...prev, closedBy }))
        }
        onNotesChange={notes => setCloseForm(prev => ({ ...prev, notes }))}
        onSubmit={handleCloseShift}
      />
    </Box>
  );
};
