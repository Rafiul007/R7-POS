import { useMemo, useState } from 'react';
import { AuthContext, type AuthTokens } from './authContext';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './authStorage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken()
  );
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    getRefreshToken()
  );

  const login = (tokens: AuthTokens) => {
    setTokens(tokens.accessToken, tokens.refreshToken);
    setAccessTokenState(tokens.accessToken);
    setRefreshTokenState(tokens.refreshToken);
  };

  const logout = () => {
    clearTokens();
    setAccessTokenState(null);
    setRefreshTokenState(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(accessToken),
      accessToken,
      refreshToken,
      login,
      logout,
    }),
    [accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
