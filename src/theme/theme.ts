import { createTheme } from '@mui/material/styles';

const colors = {
  primary: {
    main: '#003366',
    light: '#2d5f93',
    dark: '#001f40',
    contrastText: '#f8fbff',
  },
  secondary: {
    main: '#0056b3',
    light: '#4d8bd1',
    dark: '#003f85',
    contrastText: '#f8fbff',
  },
  success: {
    main: '#00bfa5',
    light: '#56d8c7',
    dark: '#007f6f',
    contrastText: '#052b2a',
  },
  warning: {
    main: '#f59e0b',
    light: '#f8bc59',
    dark: '#c27c08',
    contrastText: '#1f2937',
  },
  error: {
    main: '#cf3e36',
    light: '#e16f69',
    dark: '#a92c25',
    contrastText: '#fffafb',
  },
  info: {
    main: '#00bfa5',
    light: '#56d8c7',
    dark: '#008f7d',
    contrastText: '#052b2a',
  },
  neutral: {
    50: '#ffffff',
    100: '#f8fafb',
    200: '#f1f3f4',
    300: '#e3e8eb',
    400: '#c8d1d8',
    500: '#90a0ad',
    600: '#637381',
    700: '#44515d',
    800: '#27323c',
    900: '#15202b',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: {
      default: colors.neutral[200],
      paper: colors.neutral[50],
    },
    text: {
      primary: '#15202b',
      secondary: '#637381',
      disabled: '#90a0ad',
    },
    divider: '#d7dee3',
    grey: colors.neutral,
    action: {
      hover: 'rgba(0, 51, 102, 0.06)',
      selected: 'rgba(0, 86, 179, 0.12)',
      focus: 'rgba(0, 51, 102, 0.14)',
      disabledBackground: '#dfe6ea',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      color: '#27323c',
    },
    body2: {
      color: '#44515d',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top left, rgba(0, 86, 179, 0.08), transparent 24%), radial-gradient(circle at top right, rgba(0, 191, 165, 0.08), transparent 22%), #f1f3f4',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
          borderRadius: 0,
          boxShadow: 'none',
          paddingInline: '1rem',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            boxShadow: 'none',
            backgroundColor: '#fbfcfd',
            '& fieldset': {
              borderRadius: 0,
              borderColor: '#d7dee3',
            },
            '&:hover fieldset': {
              borderColor: colors.secondary.main,
            },
            '&.Mui-focused fieldset': {
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 14px 40px rgba(0, 31, 64, 0.08)',
          border: '1px solid',
          borderColor: '#d7dee3',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 14px 40px rgba(0, 31, 64, 0.08)',
          border: '1px solid',
          borderColor: '#d7dee3',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 10px 30px rgba(0, 31, 64, 0.06)',
          border: '1px solid',
          borderColor: '#d7dee3',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        switchBase: {
          borderRadius: 0,
        },
        thumb: {
          borderRadius: 0,
        },
        track: {
          borderRadius: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 10px 24px rgba(0, 31, 64, 0.16)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          backgroundImage: 'none',
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
});

export type Theme = typeof theme;
