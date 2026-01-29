import { useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from './authStorage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(getAccessToken());

  const login = (newToken = 'mock-access-token') => {
    setAccessToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    clearAccessToken();
    setToken(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
