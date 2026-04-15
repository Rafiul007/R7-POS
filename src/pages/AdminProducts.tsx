import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add, Delete, Edit, Inventory2 } from '@mui/icons-material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useAuth } from '../auth';
import { useAlert, useCategories, useProducts } from '../hooks';
import { CreateProductDialog } from './CreateProductDialog';
import type { IProduct } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

export const AdminProducts = () => {
  const { role } = useAuth();
  const { showAlert } = useAlert();
  const isAdmin = role?.toLowerCase() === 'admin';
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isError, isLoading } = useProducts({ limit: 100 });
  const { data: categoryData } = useCategories({ limit: 100 });
  const products = data?.products ?? [];
  const handleUpdateProduct = useCallback(
    (product: IProduct) => {
      showAlert({
        message: `Update action selected for ${product.name}.`,
        severity: 'info',
      });
    },
    [showAlert]
  );

  const handleDeleteProduct = useCallback(
    (product: IProduct) => {
      showAlert({
        message: `Delete action selected for ${product.name}.`,
        severity: 'warning',
      });
    },
    [showAlert]
  );

  const columns = useMemo<MRT_ColumnDef<IProduct>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 260,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={500}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 160,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>() || 'N/A'}
            size='small'
            sx={{
              backgroundColor: theme => alpha(theme.palette.info.main, 0.1),
              color: 'info.dark',
              fontWeight: 600,
            }}
          />
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={600}>
            {formatPrice(cell.getValue<number>())}
          </Typography>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant='body2'>
            {cell.getValue<number>() ?? 0}
          </Typography>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        size: 110,
        Cell: ({ cell }) => {
          const isActive = cell.getValue<boolean>();

          return (
            <Chip
              size='small'
              label={isActive ? 'Active' : 'Inactive'}
              sx={{
                backgroundColor: theme =>
                  alpha(
                    isActive
                      ? theme.palette.success.main
                      : theme.palette.text.secondary,
                    0.12
                  ),
                color: isActive ? 'success.dark' : 'text.secondary',
                fontWeight: 700,
              }}
            />
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 120,
        enableSorting: false,
        Cell: ({ row }) => (
          <Stack direction='row' spacing={0.5} justifyContent='flex-end'>
            <Tooltip title='Update product'>
              <IconButton
                size='small'
                onClick={() => handleUpdateProduct(row.original)}
                sx={{
                  color: 'primary.main',
                  backgroundColor: theme =>
                    alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    backgroundColor: theme =>
                      alpha(theme.palette.primary.main, 0.14),
                  },
                }}
              >
                <Edit fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete product'>
              <IconButton
                size='small'
                onClick={() => handleDeleteProduct(row.original)}
                sx={{
                  color: 'error.main',
                  backgroundColor: theme =>
                    alpha(theme.palette.error.main, 0.08),
                  '&:hover': {
                    backgroundColor: theme =>
                      alpha(theme.palette.error.main, 0.14),
                  },
                }}
              >
                <Delete fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleDeleteProduct, handleUpdateProduct]
  );
  const table = useMaterialReactTable({
    columns,
    data: products,
    state: {
      isLoading,
    },
    enableColumnActions: false,
    enableColumnResizing: false,
    enablePagination: true,
    enableSorting: true,
    enableTopToolbar: false,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: 0,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: 'transparent',
        '& .mrt-table-body-row:hover > td': {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
        },
      },
    },
    muiTableBodyRowProps: {
      sx: {
        '& td': {
          borderBottom: 0,
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        py: 1.8,
        color: 'text.primary',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        borderBottom: 0,
        backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
        py: 2,
      },
    },
    muiBottomToolbarProps: {
      sx: {
        border: 0,
        boxShadow: 'none',
        backgroundColor: theme => alpha(theme.palette.primary.main, 0.035),
      },
    },
  });

  const categoryOptions = useMemo(() => {
    return (
      categoryData?.categories
        .filter(category => category.isActive)
        .map(category => ({
          value: category._id,
          label: category.name,
        })) ?? []
    );
  }, [categoryData]);

  return (
    <Box
      sx={{
        minHeight: '100%',
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent='space-between'
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Stack direction='row' spacing={2} alignItems='center'>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: theme =>
                  alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
              }}
            >
              <Inventory2 />
            </Avatar>
            <Stack spacing={0.5}>
              <Typography
                variant='overline'
                color='text.secondary'
                sx={{ letterSpacing: '0.16em', fontWeight: 700 }}
              >
                Admin
              </Typography>
              <Typography variant='h5' sx={{ fontWeight: 700 }}>
                Manage Products
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {products.length} products loaded
              </Typography>
            </Stack>
          </Stack>

          {isAdmin && (
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => setCreateOpen(true)}
              sx={{
                px: 2.5,
                py: 1.1,
                boxShadow: '0 14px 30px rgba(25, 118, 210, 0.24)',
              }}
            >
              Create Product
            </Button>
          )}
        </Stack>

        {isLoading ? (
          <Stack alignItems='center' sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : isError ? (
          <Alert severity='error'>Failed to load products.</Alert>
        ) : (
          <Box
            sx={{
              overflow: 'hidden',
            }}
          >
            <MaterialReactTable table={table} />
          </Box>
        )}
      </Stack>

      {createOpen && (
        <CreateProductDialog
          categoryOptions={categoryOptions}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </Box>
  );
};
