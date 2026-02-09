import { createContext } from 'react';

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

export interface AlertPayload {
  message: string;
  severity?: AlertSeverity;
  duration?: number;
}

export interface AlertItem {
  id: number;
  message: string;
  severity: AlertSeverity;
  duration: number;
}

export interface AlertContextValue {
  showAlert: (payload: AlertPayload) => void;
}

export const AlertContext = createContext<AlertContextValue | undefined>(
  undefined
);
