import { useMemo, useState } from 'react';
import { AuthContext, type AuthTokens } from './authContext';
import {
  clearTokens,
  getAccessToken,
  getRoleFromAccessToken,
  normalizeAccessToken,
  setTokens,
} from './authStorage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken()
  );
  const [role, setRole] = useState<string | null>(() => {
    const token = getAccessToken();
    return token ? getRoleFromAccessToken(token) : null;
  });

  const login = (tokens: AuthTokens) => {
    const accessToken = normalizeAccessToken(tokens.accessToken);
    const resolvedRole =
      tokens.role ?? (accessToken ? getRoleFromAccessToken(accessToken) : null);

    if (!accessToken) {
      clearTokens();
      setAccessTokenState(null);
      setRole(null);
      return;
    }

    setTokens(accessToken);
    setAccessTokenState(accessToken);
    setRole(resolvedRole);
  };

  const logout = () => {
    clearTokens();
    setAccessTokenState(null);
    setRole(null);
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
