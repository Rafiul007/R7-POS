import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../../api/auth/authApi';
import { useAuth } from '../../auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login: setAuthTokens } = useAuth();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      setAuthTokens({
        accessToken: data.accessToken,
      });
      queryClient.invalidateQueries();
    },
  });

  return mutation;
};
