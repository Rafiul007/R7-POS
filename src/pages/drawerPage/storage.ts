import { getBranchById } from '../../data/branches';
import { getDrawersByBranchId } from '../../data/drawers';
import { SHIFT_STORAGE_KEY } from '../../utils/drawer';
import type { CashMovement, DrawerState, ShiftData } from './types';

interface LegacyShiftData {
  id: string;
  status: 'open' | 'closed';
  branchId?: string;
  branch?: ShiftData['branch'];
  drawer?: ShiftData['drawer'];
  openedAt: string;
  openedBy: string;
  openingCash: number;
  cashSales: number;
  closedAt?: string;
  closedBy?: string;
  countedCash?: number;
  notes?: string;
}

interface StoredPayload {
  shift: LegacyShiftData | null;
  moves: CashMovement[];
}

const normalizeShift = (shift: LegacyShiftData | null): ShiftData | null => {
  if (!shift) return null;

  const branchId = shift.drawer?.branchId || shift.branchId;
  if (!branchId) return null;

  const branchRecord = getBranchById(branchId);
  const branch = shift.branch || {
    branchName: branchRecord.name,
    branchLocation: branchRecord.city,
  };
  const drawer =
    shift.drawer || {
      drawerName: getDrawersByBranchId(branchId)[0]?.drawerName || 'Main Drawer',
      branchId,
    };

  return {
    ...shift,
    branch,
    drawer,
  };
};

export const loadDrawerState = (): DrawerState => {
  const raw = localStorage.getItem(SHIFT_STORAGE_KEY);
  if (!raw) {
    return { shift: null, moves: [] };
  }

  try {
    const parsed = JSON.parse(raw) as StoredPayload;
    return {
      shift: normalizeShift(parsed.shift),
      moves: parsed.moves || [],
    };
  } catch {
    return { shift: null, moves: [] };
  }
};

export const saveDrawerState = (state: DrawerState) => {
  localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(state));
};
