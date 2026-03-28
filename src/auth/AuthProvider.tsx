import { useMemo, useState } from 'react';
import { AuthContext, type AuthTokens } from './authContext';
import { getAccessToken, setAccessToken, clearTokens } from './authStorage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken()
  );

  const login = (tokens: AuthTokens) => {
    setAccessToken(tokens.accessToken);
    setAccessTokenState(tokens.accessToken);
  };

  const logout = () => {
    clearTokens();
    setAccessTokenState(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(accessToken),
      accessToken,
      login,
      logout,
    }),
    [accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
