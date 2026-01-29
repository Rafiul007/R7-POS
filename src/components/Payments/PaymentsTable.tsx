import { useMemo } from 'react';
import {
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Paper,
  Chip,
} from '@mui/material';
import { Visibility, Replay } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

export interface PaymentRecord {
  id: string;
  reference: string;
  customer: string;
  method: 'card' | 'cash' | 'bank' | 'wallet';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  amount: number;
  date: string;
}

interface PaymentsTableProps {
  data: PaymentRecord[];
  isLoading?: boolean;
  onView?: (payment: PaymentRecord) => void;
  onRefund?: (payment: PaymentRecord) => void;
}

const formatMethod = (value: PaymentRecord['method']) => {
  switch (value) {
    case 'card':
      return 'Card';
    case 'cash':
      return 'Cash';
    case 'bank':
      return 'Bank Transfer';
    case 'wallet':
      return 'Wallet';
    default:
      return value;
  }
};

const formatStatus = (value: PaymentRecord['status']) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const PaymentsTable = ({
  data,
  isLoading = false,
  onView,
  onRefund,
}: PaymentsTableProps) => {
  const columns = useMemo<MRT_ColumnDef<PaymentRecord>[]>(
    () => [
      {
        accessorKey: 'reference',
        header: 'Reference',
        size: 130,
        Cell: ({ cell }) => (
          <Typography
            variant='body2'
            fontWeight={600}
            sx={{ color: 'text.primary', letterSpacing: '0.04em' }}
          >
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        size: 220,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={500}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'method',
        header: 'Method',
        size: 140,
        Cell: ({ cell }) => (
          <Chip
            label={formatMethod(cell.getValue<PaymentRecord['method']>())}
            size='small'
            variant='outlined'
            sx={{
              borderRadius: 0,
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          />
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={600} color='text.primary'>
            ${cell.getValue<number>().toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            label={formatStatus(cell.getValue<PaymentRecord['status']>())}
            size='small'
            variant='outlined'
            sx={{
              borderRadius: 0,
              fontWeight: 600,
              borderColor: 'divider',
              color: 'primary.main',
            }}
          />
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 140,
        Cell: ({ cell }) => (
          <Typography variant='body2' color='text.secondary'>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 120,
        Cell: ({ row }) => (
          <Stack direction='row' spacing={0.5}>
            <Tooltip title='View'>
              <IconButton
                size='small'
                onClick={() => onView?.(row.original)}
                sx={{ color: 'primary.main' }}
              >
                <Visibility fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Refund'>
              <IconButton
                size='small'
                onClick={() => onRefund?.(row.original)}
                sx={{ color: 'error.main' }}
              >
                <Replay fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onRefund, onView]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading,
    },
    enableTopToolbar: false,
    enableColumnActions: false,
    enableSorting: true,
    enablePagination: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    layoutMode: 'grid',
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: theme => alpha(theme.palette.background.paper, 0.92),
        backdropFilter: 'blur(6px)',
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    muiTableContainerProps: {
      sx: {
        flex: 1,
        '& .mrt-table': {
          borderCollapse: 'collapse',
        },
        '& .mrt-table-body-row:hover > td': {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        py: 1.75,
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        backgroundColor: 'transparent',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 2,
        px: 2,
        color: 'text.secondary',
      },
    },
    muiPaginationProps: {
      sx: {
        borderTop: '1px solid',
        borderColor: 'divider',
      },
    },
  });

  return (
    <Paper
      sx={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MaterialReactTable table={table} />
    </Paper>
  );
};
