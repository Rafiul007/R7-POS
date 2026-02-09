import type { IProduct } from '../types';

export const SHIFT_STORAGE_KEY = 'pos.drawer.shift.v1';

interface StoredShift {
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

interface StoredPayload {
  shift: StoredShift | null;
  moves: unknown[];
}

export const getShiftStatus = () => {
  const raw = localStorage.getItem(SHIFT_STORAGE_KEY);
  if (!raw) {
    return {
      status: 'closed' as const,
      openedBy: undefined,
      branchId: undefined,
    };
  }
  try {
    const parsed = JSON.parse(raw) as StoredPayload;
    if (parsed.shift && parsed.shift.status === 'open') {
      return {
        status: 'open' as const,
        openedBy: parsed.shift.openedBy,
        branchId: parsed.shift.branchId,
      };
    }
    return {
      status: 'closed' as const,
      openedBy: parsed.shift?.openedBy,
      branchId: parsed.shift?.branchId,
    };
  } catch {
    return {
      status: 'closed' as const,
      openedBy: undefined,
      branchId: undefined,
    };
  }
};

export const isShiftOpen = () => getShiftStatus().status === 'open';

export const getShiftBranchId = () => getShiftStatus().branchId;

export const canAddToCart = (product: IProduct) => {
  if (!isShiftOpen()) return false;
  if (product.stock === 0) return false;
  return true;
};
