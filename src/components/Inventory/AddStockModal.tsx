import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import type { IProduct } from '../../types';

interface AddStockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: IProduct) => void;
  product?: IProduct;
}

type ProductFormState = {
  name: string;
  sku: string;
  barcode: string;
  category: string;
  price: string;
  discountPrice: string;
  stock: string;
  image: string;
  description: string;
  isActive: boolean;
};

export const AddStockModal = ({
  open,
  onClose,
  onSubmit,
  product,
}: AddStockModalProps) => {
  const getInitialFormState = (existing?: IProduct): ProductFormState => ({
    name: existing?.name ?? '',
    sku: existing?.sku ?? '',
    barcode: existing?.barcode ?? '',
    category: existing?.category ?? '',
    price: existing?.price !== undefined ? existing.price.toString() : '',
    discountPrice:
      existing?.discountPrice !== undefined
        ? existing.discountPrice.toString()
        : '',
    stock: existing?.stock !== undefined ? existing.stock.toString() : '',
    image: existing?.image ?? '',
    description: existing?.description ?? '',
    isActive: existing?.isActive ?? true,
  });

  const [form, setForm] = useState<ProductFormState>(() =>
    getInitialFormState(product)
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormState, string>>
  >({});

  const handleFieldChange =
    (key: keyof ProductFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        key === 'isActive'
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm(prev => ({
        ...prev,
        [key]: value,
      }));
      if (errors[key]) {
        setErrors(prev => ({ ...prev, [key]: '' }));
      }
    };

  const generateId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `prod-${Date.now()}`;
  };

  const handleSubmit = () => {
    const nextErrors: Partial<Record<keyof ProductFormState, string>> = {};
    const priceValue = Number(form.price);
    const discountValue = form.discountPrice
      ? Number(form.discountPrice)
      : undefined;
    const stockValue = form.stock ? Number(form.stock) : undefined;

    if (!form.name.trim()) {
      nextErrors.name = 'Product name is required';
    }
    if (!form.image.trim()) {
      nextErrors.image = 'Image is required';
    }
    if (form.price === '' || isNaN(priceValue) || priceValue < 0) {
      nextErrors.price = 'Price must be a non-negative number';
    }
    if (
      form.discountPrice &&
      (isNaN(Number(form.discountPrice)) || Number(form.discountPrice) < 0)
    ) {
      nextErrors.discountPrice = 'Discount price must be a non-negative number';
    }
    if (
      form.discountPrice &&
      !nextErrors.price &&
      discountValue !== undefined &&
      discountValue > priceValue
    ) {
      nextErrors.discountPrice = 'Discount price cannot exceed price';
    }
    if (form.stock && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
      nextErrors.stock = 'Stock must be a non-negative number';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const now = new Date();
    const nextProduct: IProduct = {
      id: product?.id ?? generateId(),
      name: form.name.trim(),
      price: priceValue,
      discountPrice: discountValue,
      image: form.image.trim(),
      category: form.category.trim() || undefined,
      stock: stockValue ?? 0,
      description: form.description.trim() || undefined,
      sku: form.sku.trim() || undefined,
      barcode: form.barcode.trim() || undefined,
      isActive: form.isActive,
      createdAt: product?.createdAt ?? now,
      updatedAt: now,
    };

    onSubmit(nextProduct);
    setForm(getInitialFormState(product));
    onClose();
  };

  const handleClose = () => {
    setForm(getInitialFormState(product));
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      TransitionProps={{
        onEntering: () => {
          setForm(getInitialFormState(product));
          setErrors({});
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: '1.25rem',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        Add New Product
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 0,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              Required fields are marked with *
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label='Product Name *'
              value={form.name}
              onChange={handleFieldChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
            <TextField
              fullWidth
              label='SKU'
              value={form.sku}
              onChange={handleFieldChange('sku')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
            <TextField
              fullWidth
              label='Barcode'
              value={form.barcode}
              onChange={handleFieldChange('barcode')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
            <TextField
              fullWidth
              label='Category'
              value={form.category}
              onChange={handleFieldChange('category')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label='Price *'
              type='number'
              value={form.price}
              onChange={handleFieldChange('price')}
              inputProps={{ min: 0, step: 0.01 }}
              error={!!errors.price}
              helperText={errors.price}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
            <TextField
              fullWidth
              label='Discount Price'
              type='number'
              value={form.discountPrice}
              onChange={handleFieldChange('discountPrice')}
              inputProps={{ min: 0, step: 0.01 }}
              error={!!errors.discountPrice}
              helperText={errors.discountPrice}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
            <TextField
              fullWidth
              label='Stock'
              type='number'
              value={form.stock}
              onChange={handleFieldChange('stock')}
              inputProps={{ min: 0, step: 1 }}
              error={!!errors.stock}
              helperText={errors.stock}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                },
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={handleFieldChange('isActive')}
                  color='success'
                />
              }
              label={
                <Typography variant='body2' fontWeight={600}>
                  Active Product
                </Typography>
              }
              sx={{ m: 0, alignItems: 'center' }}
            />
          </Box>

          <TextField
            fullWidth
            label='Image URL *'
            type='url'
            value={form.image}
            onChange={handleFieldChange('image')}
            error={!!errors.image}
            helperText={errors.image}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          />

          <TextField
            fullWidth
            label='Description'
            value={form.description}
            onChange={handleFieldChange('description')}
            multiline
            minRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          variant='outlined'
          sx={{
            textTransform: 'none',
            borderRadius: 0,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          startIcon={<AddCircleOutline />}
          disabled={!form.name.trim() || !form.price || !form.image.trim()}
          sx={{
            textTransform: 'none',
            borderRadius: 0,
          }}
        >
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};
