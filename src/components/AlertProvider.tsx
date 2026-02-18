import { Alert, Snackbar, Slide } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import {
  CheckCircle,
  Error as ErrorIcon,
  Info,
  Warning,
} from '@mui/icons-material';
import {
  AlertContext,
  type AlertItem,
  type AlertPayload,
} from './alertContext';

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [, setQueue] = useState<AlertItem[]>([]);
  const [active, setActive] = useState<AlertItem | null>(null);

  const showAlert = useCallback(
    (payload: AlertPayload) => {
      const item: AlertItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        message: payload.message,
        severity: payload.severity || 'info',
        duration: payload.duration ?? 3000,
      };
      setQueue(prev => {
        if (active) {
          return [...prev, item];
        }
        setActive(item);
        return prev;
      });
    },
    [active]
  );

  const handleExited = () => {
    setActive(null);
    setQueue(prev => {
      if (prev.length === 0) {
        return prev;
      }
      const [next, ...rest] = prev;
      setActive(next);
      return rest;
    });
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setActive(null);
  };

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Snackbar
        open={Boolean(active)}
        autoHideDuration={active?.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
        TransitionProps={{ onExited: handleExited }}
        sx={{ mt: 2, mr: 2 }}
      >
        {active ? (
          <Alert
            onClose={handleClose}
            severity={active.severity}
            variant='filled'
            iconMapping={{
              success: <CheckCircle fontSize='small' />,
              error: <ErrorIcon fontSize='small' />,
              warning: <Warning fontSize='small' />,
              info: <Info fontSize='small' />,
            }}
            sx={{
              borderRadius: 0,
              fontWeight: 600,
              letterSpacing: '0.01em',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.2)',
              minWidth: 280,
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            {active.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </AlertContext.Provider>
  );
};
