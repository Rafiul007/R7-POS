import { useQuery } from '@tanstack/react-query';
import { getAllDrawers } from '../../api/shift/drawerApi';

export const useDrawersQuery = (branchId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['drawers', branchId],
    queryFn: () => getAllDrawers(branchId as string),
    enabled: enabled && Boolean(branchId),
    select: response =>
      response.drawers.map(drawer => ({
        id: drawer._id,
        drawerName: drawer.drawerName,
        branchId: drawer.branchId?._id,
      })),
  });
};
