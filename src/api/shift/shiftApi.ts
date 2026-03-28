import axiosInstance from '../../lib/axiosInstance';

const OPEN_SHIFTS_URL = 'shift/shifts/open';
const CLOSE_SHIFTS_URL = 'shift/shifts';

// export enum ShiftStatus {
//   OPEN = 'open',
//   CLOSED = 'closed',
// }

export interface ShiftBranchResponse {
  branchName: string;
  branchLocation?: string;
  branchManagerId?: string;
}

export interface ShiftDrawerResponse {
  drawerName: string;
  branchId: string;
}

export interface OpenShiftPayload {
  branchName: string;
  drawerId: string;
  openingCash: number;
  notes?: string;
}

export interface ShiftResponse {
  _id: string;
  branch: ShiftBranchResponse;
  drawer: ShiftDrawerResponse;
  openedBy: string;
  openedAt: string;
  openingCash: number;
  cashSalesTotal: number;
  cashInTotal: number;
  cashOutTotal: number;
  closingCash?: number;
  closedAt?: string;
  closedBy?: string;
  expectedCash?: number;
  overShort?: number;
  status: 'open' | 'closed';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CloseShiftPayload {
  closingCash: number;
  cashSalesTotal: number;
  notes?: string;
}

interface CloseShiftOptions {
  accessToken?: string | null;
}

// Open a new shift
export const openShift = async (
  payload: OpenShiftPayload
): Promise<ShiftResponse> => {
  const res = await axiosInstance.post(OPEN_SHIFTS_URL, payload);
  const responsePayload = res.data?.data ?? res.data;

  if (!responsePayload) {
    throw new Error('Open shift response payload is missing.');
  }

  return responsePayload as ShiftResponse;
};

// Close an existing shift
export const closeShift = async (
  shiftId: string,
  payload: CloseShiftPayload,
  options?: CloseShiftOptions
): Promise<ShiftResponse> => {
  if (!shiftId) {
    throw new Error('Shift ID is required to close a shift.');
  }

  const res = await axiosInstance.post(
    `${CLOSE_SHIFTS_URL}/${shiftId}/close`,
    payload,
    options?.accessToken
      ? {
          headers: {
            Authorization: `Bearer ${options.accessToken}`,
          },
        }
      : undefined
  );
  const responsePayload = res.data?.data ?? res.data;

  if (!responsePayload) {
    throw new Error('Close shift response payload is missing.');
  }

  return responsePayload as ShiftResponse;
};
