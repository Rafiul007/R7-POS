import { useMemo } from 'react';
import {
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Paper,
  Chip,
} from '@mui/material';
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
          <Typography variant='body2' fontWeight={600} color='primary'>
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
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={600} color='success.main'>
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
          let color: 'success' | 'warning' | 'error' = 'success';
          if (value === 0) color = 'error';
          else if (value <= 5) color = 'warning';

          return (
            <Chip
              label={value.toString()}
              size='small'
              color={color}
              variant='filled'
              sx={{
                borderRadius: 0,
                fontWeight: 700,
                color: 'white',
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
              variant='filled'
              sx={{
                borderRadius: 0,
                fontWeight: 600,
                backgroundColor: isActive ? '#4caf50' : '#e0e0e0',
                color: isActive ? 'white' : 'text.secondary',
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
                color='primary'
                onClick={() => onEdit?.(row.original)}
              >
                <Edit fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                color='error'
                onClick={() => onDelete?.(row.original)}
              >
                <Delete fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='More'>
              <IconButton size='small' onClick={() => onMore?.(row.original)}>
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
      },
    },
    muiTableContainerProps: {
      sx: {
        flex: 1,
        '& .mrt-table': {
          borderCollapse: 'collapse',
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        py: 2,
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 700,
        fontSize: '0.875rem',
        backgroundColor: '#fafafa',
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
