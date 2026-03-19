import axiosInstance from '../../lib/axiosInstance';

const OPEN_SHIFTS_URL = 'shifts/open';

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

// export interface ShiftResponse {
//   _id: string;
//   branch: ShiftBranchResponse;
//   drawer: ShiftDrawerResponse;
//   openedBy: string;
//   openedAt: string;
//   openingCash: number;
//   cashSalesTotal: number;
//   cashInTotal: number;
//   cashOutTotal: number;
//   closingCash?: number;
//   closedAt?: string;
//   closedBy?: string;
//   expectedCash: number;
//   overShort: number;
//   status: ShiftStatus;
//   notes?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// Open a new shift
export const openShift = async (
  payload: OpenShiftPayload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const res = await axiosInstance.post(OPEN_SHIFTS_URL, payload);
  const responsePayload = res.data?.data ?? res.data;

  if (!responsePayload) {
    throw new Error('Open shift response payload is missing.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return responsePayload as any;
};
