import { createContext } from 'react';

export type AuthTokens = {
  accessToken: string;
};

export interface AuthContextValue {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
