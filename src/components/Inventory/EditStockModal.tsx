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
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import type { IProduct } from '../../types';

interface EditStockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  product?: IProduct;
}

export const EditStockModal = ({
  open,
  onClose,
  onSubmit,
  product,
}: EditStockModalProps) => {
  const [quantity, setQuantity] = useState(product?.stock?.toString() || '0');
  const [error, setError] = useState('');

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    setError('');

    if (value && (isNaN(Number(value)) || Number(value) < 0)) {
      setError('Please enter a valid positive number');
    }
  };

  const handleSubmit = () => {
    if (!quantity || error) {
      setError('Please enter a valid quantity');
      return;
    }

    const newQuantity = Number(quantity);
    if (newQuantity === product?.stock) {
      setError('Stock quantity is unchanged');
      return;
    }

    onSubmit(newQuantity);
    setQuantity('');
    onClose();
  };

  const handleClose = () => {
    setQuantity(product?.stock?.toString() || '0');
    setError('');
    onClose();
  };

  const difference =
    quantity && product ? Number(quantity) - (product.stock || 0) : 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
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
        Edit Stock Level
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          {/* Product Info */}
          {product && (
            <Box
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 0,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack spacing={1}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Product
                  </Typography>
                  <Typography fontWeight={600}>{product.name}</Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    SKU
                  </Typography>
                  <Typography fontWeight={600} color='primary'>
                    {product.sku}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Quantity Input */}
          <TextField
            fullWidth
            label='Stock Quantity'
            type='number'
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 0, step: 1 }}
            error={!!error}
            helperText={error}
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          />

          {/* Change Summary */}
          {quantity && !error && product && (
            <Box
              sx={{
                p: 2,
                backgroundColor:
                  difference > 0 ? 'success.light' : 'warning.light',
                borderRadius: 0,
                border: '1px solid',
                borderColor: difference > 0 ? 'success.main' : 'warning.main',
              }}
            >
              <Stack spacing={1}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Current Stock
                  </Typography>
                  <Typography fontWeight={600}>
                    {product.stock} units
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    New Stock
                  </Typography>
                  <Typography fontWeight={600}>{quantity} units</Typography>
                </Box>
                <Box
                  sx={{
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'currentColor',
                    opacity: 0.3,
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Change
                  </Typography>
                  <Typography
                    fontWeight={700}
                    color={
                      difference > 0
                        ? 'success.main'
                        : difference < 0
                          ? 'error.main'
                          : 'text.secondary'
                    }
                  >
                    {difference > 0 ? '+' : ''}
                    {difference} units
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
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
          startIcon={<Edit />}
          disabled={!quantity || !!error}
          sx={{
            textTransform: 'none',
            borderRadius: 0,
          }}
        >
          Update Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};
