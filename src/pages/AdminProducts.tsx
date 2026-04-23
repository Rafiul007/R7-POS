import { memo, useEffect, useMemo, useState } from 'react';
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
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add,
  DeleteOutline,
  EditOutlined,
  DeleteForeverOutlined,
} from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useAuth } from '../auth';
import {
  useAlert,
  useCategories,
  useCreateProduct,
  useProducts,
} from '../hooks';
import { mapCategoryToOption } from '../hooks/useCategoryList';
import { RhfSelect, RhfTextField } from '../components/rhf-component';
import type { IProduct } from '../types';
import { buildMrtOptions } from '../utils/materialReactTable';
import {
  createEmptyVariant,
  createProductDefaultValues,
  createProductFieldComponentMap,
  createProductSchema,
  getCreateProductFormSections,
  getCreateProductVariantFields,
  toCreateProductPayload,
  type CreateProductField,
  type CreateProductFormValues,
} from './createProductFormConstant';

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
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useCategories({ limit: 100 });
  const createProductMutation = useCreateProduct();
  const products = useMemo(() => data?.products ?? [], [data]);
  const categoryOptions = useMemo(() => {
    return (
      categoryData?.categories
        .filter(category => category.isActive)
        .map(mapCategoryToOption) ?? []
    );
  }, [categoryData]);
  const createProductSections = useMemo(
    () => getCreateProductFormSections(categoryOptions),
    [categoryOptions]
  );
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    defaultValues: createProductDefaultValues,
    resolver: yupResolver(createProductSchema),
    mode: 'onChange',
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });
  const watchedStock = useWatch({ control, name: 'stock' });
  const watchedVariants = useWatch({ control, name: 'variants' }) ?? [];
  const hasVariants = fields.length > 0;
  const variantStockTotal = watchedVariants.reduce(
    (sum, variant) => sum + (Number(variant?.stock) || 0),
    0
  );
  const variantErrorMessage =
    typeof errors.variants?.message === 'string'
      ? errors.variants.message
      : undefined;

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

  const openCreateModal = () => {
    reset(createProductDefaultValues);
    setCreateOpen(true);
  };

  useEffect(() => {
    if (!hasVariants) {
      return;
    }

    setValue('stock', variantStockTotal, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [hasVariants, setValue, variantStockTotal]);

  const productFieldRendererMap = {
    RhfSelect: (field: CreateProductField) => (
      <RhfSelect<CreateProductFormValues>
        control={control}
        name={field.name}
        label={field.label}
        options={field.options ?? []}
        disabled={isCategoryLoading || field.options?.length === 0}
      />
    ),
    RhfTextField: (field: CreateProductField) => (
      <RhfTextField<CreateProductFormValues>
        control={control}
        name={field.name}
        label={field.label}
        type={field.inputType ?? 'text'}
        placeholder={field.placeholder}
        InputProps={{
          readOnly: field.name === 'stock' && hasVariants,
        }}
        fullWidth
      />
    ),
  };

  const renderCreateProductField = (field: CreateProductField) => {
    const componentKey = createProductFieldComponentMap[field.type];

    return (
      <Grid key={field.name} size={field.grid}>
        {productFieldRendererMap[componentKey](field)}
      </Grid>
    );
  };

  const renderVariantField = (
    field: ReturnType<typeof getCreateProductVariantFields>[number]
  ) => (
    <Grid key={field.name} size={field.grid}>
      <RhfTextField<CreateProductFormValues>
        control={control}
        name={field.name}
        label={field.label}
        type={field.inputType ?? 'text'}
        placeholder={field.placeholder}
        fullWidth
      />
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
              onClick={openCreateModal}
              disabled={isLoading}
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
          <AdminProductsTable products={products} />
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
            noValidate
            onSubmit={handleSubmit(handleCreateProduct)}
          >
            {isCategoryError && (
              <Alert severity='error'>
                Failed to load categories. Reload the page and try again.
              </Alert>
            )}

            {createProductSections.map(section => (
              <Stack key={section.id} spacing={2}>
                <Typography variant='subtitle1'>{section.title}</Typography>
                <Grid container spacing={2}>
                  {section.fields.map(renderCreateProductField)}
                </Grid>
                {section.id === 'basic' && hasVariants && (
                  <Typography variant='caption' color='text.secondary'>
                    Product stock is auto-calculated from the sum of all variant
                    stocks.
                  </Typography>
                )}
              </Stack>
            ))}

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

              {fields.length === 0 ? (
                <Typography variant='body2' color='text.secondary'>
                  No variants added. Leave it like this if the product has no
                  variant options.
                </Typography>
              ) : (
                <>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent='space-between'
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Variant stock total: {variantStockTotal} /{' '}
                      {Number(watchedStock) || 0}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Main product stock is synced automatically from variants.
                    </Typography>
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
                          type='button'
                          size='small'
                          onClick={() => remove(index)}
                        >
                          <DeleteOutline fontSize='small' />
                        </IconButton>
                      </Stack>
                      <Grid container spacing={2}>
                        {getCreateProductVariantFields(index).map(
                          renderVariantField
                        )}
                      </Grid>
                    </Stack>
                  ))}
                </>
              )}

              {variantErrorMessage && (
                <Alert severity='error'>{variantErrorMessage}</Alert>
              )}
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
            disabled={
              createProductMutation.isPending ||
              isCategoryLoading ||
              isCategoryError ||
              categoryOptions.length === 0
            }
          >
            {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

type AdminProductsTableProps = {
  products: IProduct[];
};

const AdminProductsTable = memo(({ products }: AdminProductsTableProps) => {
  const { showAlert } = useAlert();

  const productColumns = useMemo<MRT_ColumnDef<IProduct>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 240,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={600}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 160,
        Cell: ({ cell }) => cell.getValue<string>() || '-',
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 140,
        Cell: ({ cell }) => formatPrice(cell.getValue<number>()),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        size: 100,
        Cell: ({ cell }) => cell.getValue<number>() ?? 0,
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        size: 130,
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
        header: 'Action',
        size: 120,
        Cell: ({ row }) => (
          <Stack direction='row' spacing={1} alignItems='center'>
            <Tooltip title='Update product'>
              <IconButton
                size='small'
                color='primary'
                onClick={() =>
                  showAlert({
                    message: `Update flow is not implemented yet for ${row.original.name}.`,
                    severity: 'info',
                  })
                }
              >
                <EditOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete product'>
              <IconButton
                size='small'
                color='error'
                onClick={() =>
                  showAlert({
                    message: `Delete flow is not implemented yet for ${row.original.name}.`,
                    severity: 'warning',
                  })
                }
              >
                <DeleteForeverOutlined fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [showAlert]
  );

  const tableOptions = useMemo(
    () =>
      buildMrtOptions({
        columns: productColumns,
        data: products,
        autoResetPageIndex: false,
        muiTableBodyCellProps: {
          align: 'left',
        },
      }),
    [productColumns, products]
  );

  const productsTable = useMaterialReactTable(tableOptions);

  return <MaterialReactTable table={productsTable} />;
});

AdminProductsTable.displayName = 'AdminProductsTable';
