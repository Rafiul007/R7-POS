import { useMemo, useState } from 'react';
import { AuthContext, type AuthTokens } from './authContext';
import {
  getAccessToken,
  getStoredEmployeeType,
  getStoredRole,
  setTokens,
  clearTokens,
} from './authStorage';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken()
  );
  const [role, setRoleState] = useState<string | null>(getStoredRole());
  const [employeeType, setEmployeeTypeState] = useState<string | null>(
    getStoredEmployeeType()
  );

  const login = (tokens: AuthTokens) => {
    setTokens(tokens.accessToken, tokens.role, tokens.employeeType);
    setAccessTokenState(tokens.accessToken);
    setRoleState(tokens.role ?? null);
    setEmployeeTypeState(tokens.employeeType ?? null);
  };

  const logout = () => {
    clearTokens();
    setAccessTokenState(null);
    setRoleState(null);
    setEmployeeTypeState(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(accessToken),
      accessToken,
      role,
      employeeType,
      login,
      logout,
    }),
    [accessToken, employeeType, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
