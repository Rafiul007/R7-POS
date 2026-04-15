import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Add, DeleteOutline } from '@mui/icons-material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAlert, useCreateProduct } from '../hooks';
import { RhfSelect, RhfTextField } from '../components/rhf-component';
import {
  createEmptyVariant,
  createProductDefaultValues,
  createProductSchema,
  getCreateProductFields,
  getCreateProductVariantFields,
  toCreateProductPayload,
  type CreateProductFormValues,
  type SelectOption,
} from './adminProductFormConfig';

type CreateProductDialogProps = {
  categoryOptions: SelectOption[];
  onClose: () => void;
};

export const CreateProductDialog = ({
  categoryOptions,
  onClose,
}: CreateProductDialogProps) => {
  const { showAlert } = useAlert();
  const createProductMutation = useCreateProduct();
  const { control, handleSubmit } = useForm<CreateProductFormValues>({
    defaultValues: createProductDefaultValues,
    resolver: yupResolver(createProductSchema),
    mode: 'onSubmit',
    shouldUnregister: true,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const handleClose = () => {
    if (!createProductMutation.isPending) {
      onClose();
    }
  };

  const handleCreateProduct = (values: CreateProductFormValues) => {
    createProductMutation.mutate(toCreateProductPayload(values), {
      onSuccess: () => {
        showAlert({
          message: 'Product created successfully.',
          severity: 'success',
        });
        onClose();
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
    <Box
      role='presentation'
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: theme => theme.zIndex.modal,
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 4 },
        backgroundColor: 'rgba(15, 23, 42, 0.42)',
        backdropFilter: 'blur(4px)',
      }}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <Box
        sx={{
          width: 'min(900px, 100%)',
          maxHeight: 'min(760px, calc(100vh - 48px))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.24)',
        }}
      >
        <Box sx={{ px: 3, py: 2.25 }}>
          <Typography variant='h6' sx={{ fontWeight: 700 }}>
            Create Product
          </Typography>
        </Box>

        <Box sx={{ px: 3, pb: 3, overflow: 'auto' }}>
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
        </Box>

        <Stack
          direction='row'
          spacing={1.5}
          justifyContent='flex-end'
          sx={{ px: 3, py: 2, backgroundColor: 'rgba(15, 23, 42, 0.03)' }}
        >
          <Button
            onClick={handleClose}
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
        </Stack>
      </Box>
    </Box>
  );
};
