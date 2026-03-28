export interface CashMovement {
  id: string;
  type: 'in' | 'out';
  amount: number;
  reason: string;
  timestamp: string;
}

export interface ShiftBranch {
  branchName: string;
  branchLocation?: string;
  branchManagerId?: string;
}

export interface ShiftDrawer {
  drawerName: string;
  branchId: string;
}

export interface ShiftData {
  id: string;
  status: 'open' | 'closed';
  branch: ShiftBranch;
  drawer: ShiftDrawer;
  openedAt: string;
  openedBy: string;
  openingCash: number;
  cashSales: number;
  closedAt?: string;
  closedBy?: string;
  countedCash?: number;
  notes?: string;
}

export interface OpenShiftFormState {
  branchId: string;
  drawerId: string;
  openingCash: string;
  notes: string;
}

export interface CashFormState {
  amount: string;
  reason: string;
}

export interface CloseShiftFormState {
  countedCash: string;
  notes: string;
}

export interface DrawerState {
  shift: ShiftData | null;
  moves: CashMovement[];
}

export interface ShiftTotals {
  totalIn: number;
  totalOut: number;
  expectedCash: number;
}
