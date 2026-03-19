import axiosInstance from '../../lib/axiosInstance';

const DRAWERS_URL = 'shift/drawers';

export interface DrawerBranchResponse {
  _id: string;
  branchName: string;
  branchLocation?: string;
  branchManagerId?: string;
}

export interface DrawerResponse {
  _id: string;
  drawerName: string;
  branchId: DrawerBranchResponse;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface DrawerPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetAllDrawersResponse {
  drawers: DrawerResponse[];
  pagination?: DrawerPagination;
}

// Get all drawers for a branch
export const getAllDrawers = async (
  branchId: string
): Promise<GetAllDrawersResponse> => {
  if (!branchId) {
    throw new Error('Branch ID is required to fetch drawers.');
  }

  const res = await axiosInstance.get(`${DRAWERS_URL}/branch/${branchId}`);
  const payload = res.data?.data ?? res.data;
  const drawers = payload?.drawers;

  if (!Array.isArray(drawers)) {
    throw new Error('Drawers response payload is invalid.');
  }

  return {
    drawers: drawers as DrawerResponse[],
    pagination: payload?.pagination as DrawerPagination | undefined,
  };
};
