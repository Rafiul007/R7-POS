import { useMemo } from 'react';
import {
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Paper,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Edit, Delete, MoreVert } from '@mui/icons-material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import type { IProduct } from '../../types';

interface InventoryTableProps {
  data: IProduct[];
  isLoading?: boolean;
  onEdit?: (product: IProduct) => void;
  onDelete?: (product: IProduct) => void;
  onMore?: (product: IProduct) => void;
}

export const InventoryTable = ({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  onMore,
}: InventoryTableProps) => {
  const columns = useMemo<MRT_ColumnDef<IProduct>[]>(
    () => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        size: 100,
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
        accessorKey: 'name',
        header: 'Product Name',
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={500}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 150,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>() || 'N/A'}
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
        accessorKey: 'price',
        header: 'Price',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={600} color='text.primary'>
            ${cell.getValue<number>().toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        size: 100,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();

          return (
            <Chip
              label={value.toString()}
              size='small'
              variant='outlined'
              sx={{
                borderRadius: 0,
                fontWeight: 700,
                borderColor: 'divider',
                color: 'primary.main',
              }}
            />
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        size: 110,
        Cell: ({ cell }) => {
          const isActive = cell.getValue<boolean>();
          return (
            <Chip
              label={isActive ? 'Active' : 'Inactive'}
              size='small'
              variant='outlined'
              sx={{
                borderRadius: 0,
                fontWeight: 600,
                borderColor: 'divider',
                color: isActive ? 'primary.main' : 'text.secondary',
              }}
            />
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 140,
        Cell: ({ row }) => (
          <Stack direction='row' spacing={0.5}>
            <Tooltip title='Edit'>
              <IconButton
                size='small'
                onClick={() => onEdit?.(row.original)}
                sx={{ color: 'primary.main' }}
              >
                <Edit fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                onClick={() => onDelete?.(row.original)}
                sx={{ color: 'error.main' }}
              >
                <Delete fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Branch availability'>
              <IconButton
                size='small'
                onClick={() => onMore?.(row.original)}
                sx={{ color: 'primary.main' }}
              >
                <MoreVert fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onEdit, onDelete, onMore]
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
