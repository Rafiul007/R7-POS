import { memo, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { Add, DeleteForeverOutlined, EditOutlined } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useForm } from 'react-hook-form';
import { useAlert, useCategories, useCreateCategory } from '../hooks';
import { mapCategoryToOption } from '../hooks/useCategoryList';
import { RhfSelect, RhfTextField } from '../components/rhf-component';
import type { ProductCategory } from '../api/product/productApi';
import { buildMrtOptions } from '../utils/materialReactTable';
import {
  createCategoryDefaultValues,
  createCategoryFieldComponentMap,
  createCategorySchema,
  getCreateCategoryFormFields,
  toCreateCategoryPayload,
  type CreateCategoryField,
  type CreateCategoryFormValues,
} from './createCategoryFormConstant';

export const AdminCatalog = () => {
  const { showAlert } = useAlert();
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isError, isLoading } = useCategories({ limit: 100 });
  const createCategoryMutation = useCreateCategory();
  const categories = useMemo(() => data?.categories ?? [], [data]);
  const parentOptions = useMemo(
    () =>
      categories.filter(category => category.isActive).map(mapCategoryToOption),
    [categories]
  );
  const createCategoryFields = useMemo(
    () => getCreateCategoryFormFields(parentOptions),
    [parentOptions]
  );

  const { control, handleSubmit, reset } = useForm<CreateCategoryFormValues>({
    defaultValues: createCategoryDefaultValues,
    resolver: yupResolver(createCategorySchema),
    mode: 'onChange',
  });

  const closeCreateModal = () => {
    setCreateOpen(false);
    reset(createCategoryDefaultValues);
  };

  const handleCreateCategory = (values: CreateCategoryFormValues) => {
    createCategoryMutation.mutate(toCreateCategoryPayload(values), {
      onSuccess: () => {
        showAlert({
          message: 'Category created successfully.',
          severity: 'success',
        });
        closeCreateModal();
      },
      onError: () => {
        showAlert({
          message: 'Failed to create category.',
          severity: 'error',
        });
      },
    });
  };

  const categoryFieldRendererMap = {
    RhfSelect: (field: CreateCategoryField) => (
      <RhfSelect<CreateCategoryFormValues>
        control={control}
        name={field.name}
        label={field.label}
        options={field.options ?? []}
      />
    ),
    RhfTextField: (field: CreateCategoryField) => (
      <RhfTextField<CreateCategoryFormValues>
        control={control}
        name={field.name}
        label={field.label}
        placeholder={field.placeholder}
        multiline={field.multiline}
        rows={field.rows}
        fullWidth
      />
    ),
  };

  const renderCreateCategoryField = (field: CreateCategoryField) => {
    const componentKey = createCategoryFieldComponentMap[field.type];

    return (
      <Grid key={field.name} size={field.grid}>
        {categoryFieldRendererMap[componentKey](field)}
      </Grid>
    );
  };

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
            <Typography variant='h5' sx={{ fontWeight: 800 }}>
              Catalog
            </Typography>
          </Stack>

          <Button
            variant='contained'
            startIcon={<Add />}
            onClick={() => {
              reset(createCategoryDefaultValues);
              setCreateOpen(true);
            }}
            disabled={isLoading}
          >
            Create Category
          </Button>
        </Stack>

        {isLoading ? (
          <Stack alignItems='center' sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : isError ? (
          <Alert severity='error'>Failed to load categories.</Alert>
        ) : (
          <AdminCatalogTable categories={categories} />
        )}
      </Stack>

      <Dialog
        open={createOpen}
        onClose={() => {
          if (!createCategoryMutation.isPending) {
            closeCreateModal();
          }
        }}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <Stack
            id='create-category-form'
            component='form'
            spacing={2}
            sx={{ pt: 1 }}
            noValidate
            onSubmit={handleSubmit(handleCreateCategory)}
          >
            <Grid container spacing={2}>
              {createCategoryFields.map(renderCreateCategoryField)}
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeCreateModal}
            disabled={createCategoryMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='create-category-form'
            variant='contained'
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending
              ? 'Creating...'
              : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

type AdminCatalogTableProps = {
  categories: ProductCategory[];
};

const AdminCatalogTable = memo(({ categories }: AdminCatalogTableProps) => {
  const { showAlert } = useAlert();
  const categoryNameById = useMemo(
    () => new Map(categories.map(category => [category._id, category.name])),
    [categories]
  );

  const categoryColumns = useMemo<MRT_ColumnDef<ProductCategory>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 220,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={700}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
        size: 180,
        Cell: ({ cell }) => cell.getValue<string>() || '-',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 300,
        Cell: ({ cell }) => cell.getValue<string>() || '-',
      },
      {
        accessorKey: 'parent',
        header: 'Parent',
        size: 180,
        Cell: ({ cell }) => {
          const parentId = cell.getValue<string | null>();
          return parentId ? (categoryNameById.get(parentId) ?? '-') : 'Root';
        },
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
            <Tooltip title='Update category'>
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
            <Tooltip title='Delete category'>
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
    [categoryNameById, showAlert]
  );

  const tableOptions = useMemo(
    () =>
      buildMrtOptions({
        columns: categoryColumns,
        data: categories,
        autoResetPageIndex: false,
        muiTableBodyCellProps: {
          align: 'left',
        },
      }),
    [categoryColumns, categories]
  );

  const catalogTable = useMaterialReactTable(tableOptions);

  return <MaterialReactTable table={catalogTable} />;
});

AdminCatalogTable.displayName = 'AdminCatalogTable';
