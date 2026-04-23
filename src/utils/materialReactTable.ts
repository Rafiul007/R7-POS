import { alpha } from '@mui/material/styles';
import type { MRT_RowData, MRT_TableOptions } from 'material-react-table';

const withSx = <T>(base: T, extra: unknown) => {
  return extra ? [base, extra] : base;
};

const getObjectProps = <T extends object>(
  value: T | ((...args: never[]) => T) | undefined
) => {
  return typeof value === 'function' ? undefined : value;
};

export const buildMrtOptions = <T extends MRT_RowData>(
  options: MRT_TableOptions<T>
): MRT_TableOptions<T> => {
  const paperProps = getObjectProps(options.muiTablePaperProps);
  const containerProps = getObjectProps(options.muiTableContainerProps);
  const bodyCellProps = getObjectProps(options.muiTableBodyCellProps);
  const headCellProps = getObjectProps(options.muiTableHeadCellProps);
  const paginationProps = getObjectProps(options.muiPaginationProps);

  return {
    enableTopToolbar: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableSorting: true,
    enablePagination: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    layoutMode: 'grid',
    ...options,
    muiTablePaperProps: {
      elevation: 0,
      ...paperProps,
      sx: withSx(
        theme => ({
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 14px 30px ${alpha(theme.palette.common.black, 0.05)}`,
          overflow: 'hidden',
        }),
        paperProps?.sx
      ),
    },
    muiTableContainerProps: {
      ...containerProps,
      sx: withSx(
        {
          flex: 1,
          '& .mrt-table': {
            borderCollapse: 'collapse',
          },
          '& .mrt-table-body-row:hover > td': {
            backgroundColor: theme => alpha(theme.palette.primary.main, 0.045),
          },
        },
        containerProps?.sx
      ),
    },
    muiTableBodyCellProps: {
      ...bodyCellProps,
      sx: withSx(
        {
          py: 1.4,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
        bodyCellProps?.sx
      ),
    },
    muiTableHeadCellProps: {
      ...headCellProps,
      sx: withSx(
        theme => ({
          fontWeight: 700,
          fontSize: '0.74rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          backgroundColor: alpha(theme.palette.primary.main, 0.045),
          color: alpha(theme.palette.text.secondary, 0.92),
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
          py: 1.5,
          px: 2,
        }),
        headCellProps?.sx
      ),
    },
    muiPaginationProps: {
      ...paginationProps,
      sx: withSx(
        {
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: theme =>
            alpha(theme.palette.background.default, 0.9),
        },
        paginationProps?.sx
      ),
    },
  };
};
