import { useQuery } from '@tanstack/react-query';
import { getAllBranches } from '../../api/shift/branchApi';

export const useBranchesQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: getAllBranches,
    enabled,
    select: response =>
      response.branches.map(branch => ({
        id: branch._id,
        name: branch.branchName,
      })),
  });
};
