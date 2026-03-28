import { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Lock, LockOpen } from '@mui/icons-material';
import { openShift as openShiftApi } from '../../api/shift/shiftApi';
import { useAlert } from '../../hooks';
import { MESSAGES } from '../../constants';
import { setCurrentBranchId } from '../../data/branchInventoryStore';
import {
  createCloseForm,
  createInitialOpenForm,
  getShiftTotals,
  mergeShiftNotes,
} from './helpers';
import { loadDrawerState, saveDrawerState } from './storage';
import type { CashMovement, CashFormState, ShiftData } from './types';
import { CashMovementDialog } from './CashMovementDialog';
import { CashMovementsCard } from './CashMovementsCard';
import { CloseShiftDialog } from './CloseShiftDialog';
import { ControlsCard } from './ControlsCard';
import { OpenShiftDialog } from './OpenShiftDialog';
import { ShiftSummaryCard } from './ShiftSummaryCard';
import { useCloseShift } from '../../hooks/shifts/useCloseShift';
import { useDrawersQuery } from '../../hooks/shifts/useDrawers';
import { useBranchesQuery } from '../../hooks/shifts/useBranches';

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
  const [isOpeningShift, setIsOpeningShift] = useState(false);
  const [openForm, setOpenForm] = useState(() => {
    return {
      ...createInitialOpenForm(),
      branchId: '',
      drawerId: '',
    };
  });
  const { mutateAsync: closeShiftMutation, isPending: isClosingShift } =
    useCloseShift();
  const canLoadOpenShiftOptions = openShiftDialog && shift?.status !== 'open';
  const shouldLoadDrawers = canLoadOpenShiftOptions && Boolean(openForm.branchId);
  const { data: branches = [], isLoading: isBranchesLoading } =
    useBranchesQuery(canLoadOpenShiftOptions);
  const { data: drawers = [], isLoading: isDrawersLoading } = useDrawersQuery(
    openForm.branchId,
    shouldLoadDrawers
  );

  const [cashForm, setCashForm] = useState(initialCashForm);
  const [closeForm, setCloseForm] = useState(createCloseForm);

  useEffect(() => {
    saveDrawerState({ shift, moves });
  }, [shift, moves]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('drawer-shift-updated'));
  }, [shift]);

  const totals = useMemo(() => getShiftTotals(shift, moves), [moves, shift]);

  const availableDrawers = useMemo(() => drawers, [drawers]);

  useEffect(() => {
    if (!openForm.branchId) return;

    const drawerStillValid = availableDrawers.some(
      drawer => drawer.id === openForm.drawerId
    );

    if (!drawerStillValid) {
      setOpenForm(prev => ({
        ...prev,
        drawerId: availableDrawers[0]?.id || '',
      }));
    }
  }, [availableDrawers, openForm.branchId, openForm.drawerId]);

  const handleOpenShiftDialog = () => {
    if (shift?.status === 'open') return;

    setOpenForm(prev => ({
      ...prev,
      branchId: '',
      drawerId: '',
    }));
    setOpenShiftDialog(true);
  };

  const handleOpenShift = async () => {
    const openingCash = Number(openForm.openingCash || 0);
    const branch = branches.find(item => item.id === openForm.branchId);
    const drawer = availableDrawers.find(item => item.id === openForm.drawerId);

    if (!branch || !openForm.branchId || !drawer) return;

    try {
      setIsOpeningShift(true);

      const response = await openShiftApi({
        branchName: branch.name,
        drawerId: drawer.id,
        openingCash: Math.max(0, openingCash),
        notes: openForm.notes.trim() || undefined,
      });

      const newShift: ShiftData = {
        id: response._id,
        status: response.status,
        branch: response.branch,
        drawer: response.drawer,
        openedAt: response.openedAt,
        openedBy: response.openedBy,
        openingCash: response.openingCash,
        cashSales: response.cashSalesTotal,
        notes: response.notes,
      };

      setState({ shift: newShift, moves: [] });
      setCurrentBranchId(openForm.branchId);

      setOpenForm(prev => ({
        ...prev,
        openingCash: '0',
        notes: '',
      }));

      setOpenShiftDialog(false);
      showAlert({
        message: MESSAGES.DRAWER.SHIFT_OPENED,
        severity: 'success',
      });
    } catch (error) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : 'Unable to open shift.';

      showAlert({ message, severity: 'error' });
    } finally {
      setIsOpeningShift(false);
    }
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

  const handleCloseShift = async () => {
    if (!shift) return;

    const closeShiftPayload = {
      closingCash: Math.max(0, Number(closeForm.countedCash || 0)),
      cashSalesTotal: shift.cashSales || 0,
      notes: closeForm.notes.trim() || undefined,
    };

    try {
      const response = await closeShiftMutation({
        shiftId: shift.id,
        payload: closeShiftPayload,
      });

      const closedShift: ShiftData = {
        ...shift,
        status: response.status,
        branch: response.branch,
        drawer: response.drawer,
        openedAt: response.openedAt,
        openedBy: response.openedBy,
        openingCash: response.openingCash,
        cashSales: response.cashSalesTotal,
        closedAt: response.closedAt,
        closedBy: response.closedBy,
        countedCash: response.closingCash,
        notes: response.notes ?? mergeShiftNotes(shift.notes, closeForm.notes),
      };

      setState(prev => ({ shift: closedShift, moves: prev.moves }));
      setCloseForm(createCloseForm());
      setCloseShiftDialog(false);

      showAlert({
        message: MESSAGES.DRAWER.SHIFT_CLOSED,
        severity: 'success',
      });
    } catch (error) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : 'Unable to close shift.';

      showAlert({ message, severity: 'error' });
    }
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
            onOpenShift={handleOpenShiftDialog}
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
        availableBranches={branches}
        availableDrawers={availableDrawers}
        onClose={() => setOpenShiftDialog(false)}
        onBranchChange={branchId => {
          setCurrentBranchId(branchId);
          setOpenForm(prev => ({
            ...prev,
            branchId,
            drawerId: '',
          }));
        }}
        onDrawerChange={drawerId =>
          setOpenForm(prev => ({ ...prev, drawerId }))
        }
        onOpeningCashChange={openingCash =>
          setOpenForm(prev => ({ ...prev, openingCash }))
        }
        onNotesChange={notes => setOpenForm(prev => ({ ...prev, notes }))}
        onSubmit={handleOpenShift}
        isSubmitting={isOpeningShift}
        isBranchesLoading={isBranchesLoading}
        isDrawersLoading={isDrawersLoading}
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
        onNotesChange={notes => setCloseForm(prev => ({ ...prev, notes }))}
        onSubmit={handleCloseShift}
        isSubmitting={isClosingShift}
      />
    </Box>
  );
};
