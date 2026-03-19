import axiosInstance from '../../lib/axiosInstance';

const BRANCHES_URL = 'shift/branches';

export interface BranchResponse {
  _id: string;
  branchName: string;
  branchLocation?: string;
  branchManagerId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface BranchPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetAllBranchesResponse {
  branches: BranchResponse[];
  pagination?: BranchPagination;
}

// Get all branches
export const getAllBranches = async (): Promise<GetAllBranchesResponse> => {
  const res = await axiosInstance.get(BRANCHES_URL);
  const payload = res.data?.data ?? res.data;
  const branches = payload?.branches;

  if (!Array.isArray(branches)) {
    throw new Error('Branches response payload is invalid.');
  }

  return {
    branches: branches as BranchResponse[],
    pagination: payload?.pagination as BranchPagination | undefined,
  };
};
