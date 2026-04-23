import { useMemo, useState } from 'react';
import { AuthContext, type AuthTokens } from './authContext';
import {
  getAccessToken,
  getStoredRole,
  setTokens,
  clearTokens,
} from './authStorage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken()
  );
  const [role, setRoleState] = useState<string | null>(getStoredRole());

  const login = (tokens: AuthTokens) => {
    setTokens(tokens.accessToken, tokens.role);
    setAccessTokenState(tokens.accessToken);
    setRoleState(tokens.role ?? null);
  };

  const logout = () => {
    clearTokens();
    setAccessTokenState(null);
    setRoleState(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(accessToken),
      accessToken,
      role,
      login,
      logout,
    }),
    [accessToken, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
