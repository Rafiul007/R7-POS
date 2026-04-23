import { createContext } from 'react';

export type AuthTokens = {
  accessToken: string;
  role?: string | null;
  employeeType?: string | null;
};

export interface AuthContextValue {
  isAuthenticated: boolean;
  accessToken: string | null;
  role: string | null;
  employeeType: string | null;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
