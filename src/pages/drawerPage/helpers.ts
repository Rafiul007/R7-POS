import { branches } from '../../data/branches';
import { getDrawersByBranchId } from '../../data/drawers';
import type {
  CloseShiftFormState,
  OpenShiftFormState,
  ShiftData,
  ShiftTotals,
} from './types';

export const createInitialOpenForm = (): OpenShiftFormState => {
  const branchId = branches[0]?.id || '';
  const drawerId = getDrawersByBranchId(branchId)[0]?.id || '';

  return {
    branchId,
    drawerId,
    openingCash: '0',
    notes: '',
  };
};

export const createCloseForm = (): CloseShiftFormState => ({
  countedCash: '',
  closedBy: '',
  notes: '',
});

export const getShiftTotals = (
  shift: ShiftData | null,
  cashMovements: { type: 'in' | 'out'; amount: number }[]
): ShiftTotals => {
  const totalIn = cashMovements
    .filter(movement => movement.type === 'in')
    .reduce((sum, movement) => sum + movement.amount, 0);
  const totalOut = cashMovements
    .filter(movement => movement.type === 'out')
    .reduce((sum, movement) => sum + movement.amount, 0);
  const openingCash = shift?.openingCash || 0;
  const cashSales = shift?.cashSales || 0;

  return {
    totalIn,
    totalOut,
    expectedCash: openingCash + cashSales + totalIn - totalOut,
  };
};

export const mergeShiftNotes = (
  existingNotes: string | undefined,
  closingNotes: string
) => [existingNotes, closingNotes.trim()].filter(Boolean).join('\n\n');
