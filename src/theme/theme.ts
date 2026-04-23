import { alpha, createTheme } from '@mui/material/styles';

const colors = {
  primary: {
    main: '#18B67E',
    light: '#55D9A3',
    dark: '#0F8F63',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#7C6FF8',
    light: '#B6AEFF',
    dark: '#5B4FE0',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#1DBA71',
    light: '#6AD8A2',
    dark: '#0F8B56',
  },
  warning: {
    main: '#FF9A56',
    light: '#FFC08E',
    dark: '#D8752B',
  },
  error: {
    main: '#FF6276',
    light: '#FF99A7',
    dark: '#D9485B',
  },
  info: {
    main: '#1AB8CF',
    light: '#A6ECF5',
    dark: '#108696',
  },
  neutrals: {
    ink: '#111217',
    softInk: '#6B7280',
    line: '#E8EBF0',
    surface: '#FFFFFF',
    elevated: '#FCFCFD',
    canvas: '#F6F7FB',
    mist: '#EEF2F7',
    sidebar: '#0A0B0F',
    sidebarSoft: '#171921',
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    text: {
      primary: colors.neutrals.ink,
      secondary: colors.neutrals.softInk,
    },
    divider: colors.neutrals.line,
    background: {
      default: colors.neutrals.canvas,
      paper: colors.neutrals.surface,
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontSize: '2.4rem',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h3: {
      fontSize: '1.95rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontSize: '1.45rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontSize: '1.16rem',
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          colorScheme: 'light',
        },
        body: {
          background: `radial-gradient(circle at 15% 0%, ${alpha(
            colors.primary.light,
            0.16
          )} 0%, transparent 18%), radial-gradient(circle at 100% 0%, ${alpha(
            colors.secondary.light,
            0.12
          )} 0%, transparent 16%), linear-gradient(180deg, #FBFCFE 0%, ${
            colors.neutrals.canvas
          } 100%)`,
          color: colors.neutrals.ink,
        },
        '#root': {
          minHeight: '100vh',
        },
        '::selection': {
          backgroundColor: alpha(colors.primary.main, 0.2),
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundImage: 'none',
          borderRadius: 0,
          border: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: 'none',
          border: 'none',
          borderRadius: 0,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 10,
          border: `1px solid ${colors.neutrals.line}`,
          boxShadow: `0 12px 28px ${alpha(colors.neutrals.ink, 0.05)}`,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: `1px solid ${colors.neutrals.line}`,
          boxShadow: `0 12px 28px ${alpha(colors.neutrals.ink, 0.05)}`,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          paddingInline: 18,
          boxShadow: 'none',
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.info.main} 100%)`,
          color: colors.primary.contrastText,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.info.dark} 100%)`,
            boxShadow: `0 12px 24px ${alpha(colors.primary.dark, 0.18)}`,
          },
        },
        outlined: {
          borderColor: alpha(colors.neutrals.ink, 0.1),
          color: colors.neutrals.ink,
          '&:hover': {
            borderColor: alpha(colors.primary.main, 0.34),
            backgroundColor: alpha(colors.primary.main, 0.04),
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.neutrals.surface,
            '& fieldset': {
              borderColor: colors.neutrals.line,
            },
            '&:hover fieldset': {
              borderColor: alpha(colors.primary.main, 0.38),
            },
            '&.Mui-focused fieldset': {
              borderWidth: 1,
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.neutrals.surface,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
          border: `1px solid ${alpha(colors.neutrals.line, 0.9)}`,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: `1px solid ${alpha(colors.neutrals.line, 0.94)}`,
          boxShadow: `0 28px 70px ${alpha(colors.neutrals.ink, 0.14)}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: `1px solid ${alpha(colors.neutrals.line, 0.94)}`,
          boxShadow: `0 18px 42px ${alpha(colors.neutrals.ink, 0.1)}`,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: `0 8px 24px ${alpha(colors.neutrals.ink, 0.04)}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha(colors.neutrals.ink, 0.08),
        },
      },
    },
  },
});

export { theme };
export type Theme = typeof theme;
