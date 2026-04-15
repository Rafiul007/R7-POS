import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add, Delete, DeleteOutline, Edit } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useAuth } from '../auth';
import {
  useAlert,
  useCategories,
  useCreateProduct,
  useProducts,
} from '../hooks';
import { RhfSelect, RhfTextField } from '../components/rhf-component';
import {
  createEmptyVariant,
  createProductDefaultValues,
  createProductSchema,
  getCreateProductFields,
  getCreateProductVariantFields,
  toCreateProductPayload,
  type CreateProductFormValues,
} from './adminProductFormConfig';
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
  const createProductMutation = useCreateProduct();
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
            variant='outlined'
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
              color={isActive ? 'success' : 'default'}
              variant='outlined'
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
                sx={{ color: 'primary.main' }}
              >
                <Edit fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete product'>
              <IconButton
                size='small'
                onClick={() => handleDeleteProduct(row.original)}
                sx={{ color: 'error.main' }}
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
    enableColumnResizing: true,
    enablePagination: true,
    enableSorting: true,
    enableTopToolbar: false,
    columnResizeMode: 'onChange',
    layoutMode: 'grid',
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      },
    },
    muiTableContainerProps: {
      sx: {
        '& .mrt-table-body-row:hover > td': {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.04),
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'text.secondary',
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
  const { control, handleSubmit, reset } = useForm<CreateProductFormValues>({
    defaultValues: createProductDefaultValues,
    resolver: yupResolver(createProductSchema),
    mode: 'onChange',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const closeCreateModal = () => {
    setCreateOpen(false);
    reset(createProductDefaultValues);
  };

  const handleCreateProduct = (values: CreateProductFormValues) => {
    const payload = toCreateProductPayload(values);
    createProductMutation.mutate(payload, {
      onSuccess: () => {
        showAlert({
          message: 'Product created successfully.',
          severity: 'success',
        });
        closeCreateModal();
      },
      onError: () => {
        showAlert({
          message: 'Failed to create product.',
          severity: 'error',
        });
      },
    });
  };

  const renderCreateProductField = (
    field: ReturnType<typeof getCreateProductFields>[number]
  ) => (
    <Grid key={field.name} size={field.grid}>
      {field.type === 'select' ? (
        <RhfSelect<CreateProductFormValues>
          control={control}
          name={field.name}
          label={field.label}
          options={field.options ?? []}
        />
      ) : (
        <RhfTextField<CreateProductFormValues>
          control={control}
          name={field.name}
          label={field.label}
          type={field.inputType ?? 'text'}
          placeholder={field.placeholder}
          fullWidth
        />
      )}
    </Grid>
  );

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent='space-between'
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Stack spacing={1}>
            <Typography variant='overline' color='text.secondary'>
              Admin
            </Typography>
            <Typography variant='h5'>Manage Products</Typography>
          </Stack>

          {isAdmin && (
            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => setCreateOpen(true)}
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
          <Paper sx={{ overflow: 'hidden' }}>
            <MaterialReactTable table={table} />
          </Paper>
        )}
      </Stack>

      <Dialog
        open={createOpen}
        onClose={() => {
          if (!createProductMutation.isPending) {
            closeCreateModal();
          }
        }}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent>
          <Stack
            id='create-product-form'
            component='form'
            spacing={3}
            sx={{ pt: 1 }}
            onSubmit={handleSubmit(handleCreateProduct)}
          >
            <Grid container spacing={2}>
              {getCreateProductFields(categoryOptions).map(
                renderCreateProductField
              )}
            </Grid>

            <Divider />

            <Stack spacing={2}>
              <Stack
                direction='row'
                spacing={2}
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography variant='subtitle1'>Variants</Typography>
                <Button
                  type='button'
                  variant='outlined'
                  size='small'
                  startIcon={<Add />}
                  onClick={() => append(createEmptyVariant())}
                >
                  Add Variant
                </Button>
              </Stack>

              {fields.map((variant, index) => (
                <Stack key={variant.id} spacing={1}>
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Variant {index + 1}
                    </Typography>
                    <IconButton
                      size='small'
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <DeleteOutline fontSize='small' />
                    </IconButton>
                  </Stack>
                  <Grid container spacing={2}>
                    {getCreateProductVariantFields(index).map(
                      renderCreateProductField
                    )}
                  </Grid>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeCreateModal}
            disabled={createProductMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='create-product-form'
            variant='contained'
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
