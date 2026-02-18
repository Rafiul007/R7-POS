import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../../api/auth/authApi';
import { useAuth } from '../../auth';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: clearAuth } = useAuth();

  return useMutation({
    mutationFn: logout,
    onMutate: () => {
      clearAuth();
      queryClient.clear();
    },
  });
};
