import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  Avatar,
  TextField,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCartItems, selectCartTotalPrice } from '../store/selectors';
import { updateQuantity, removeItem, clearCart } from '../store/cartSlice';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  open,
  onClose,
  onProceedToPayment,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeItem(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const subtotal = totalPrice;
  const vat = subtotal * 0.1; // 10% VAT
  const total = subtotal + vat;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', lg: '40%' },
          backgroundColor: theme.palette.background.paper,
          borderRadius: 0,
          boxShadow: 'none',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCartIcon />
            <Typography variant="h6" fontWeight="bold">
              Cart ({cartItems.length})
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {cartItems.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: theme.palette.text.secondary,
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                Your cart is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add some products to get started
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {cartItems.map((item) => (
                <Paper
                  key={item.product.id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: theme.palette.background.paper,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <ListItem sx={{ px: 0, py: 0 }}>
                    <Avatar
                      src={item.product.image}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    >
                      {item.product.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SKU: {item.product.sku}
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        ${(item.product.discountPrice || item.product.price).toFixed(2)}
                      </Typography>
                    </Box>
                  </ListItem>

                  {/* Quantity Controls */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        color="error"
                        sx={{ border: 1, borderColor: 'divider' }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          handleQuantityChange(item.product.id, value);
                        }}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                        sx={{ width: 60 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        color="success"
                        disabled={item.product.stock ? item.quantity >= item.product.stock : false}
                        sx={{ border: 1, borderColor: 'divider' }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </List>
          )}
        </Box>

        {/* Summary Section */}
        {cartItems.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>VAT (10%):</Typography>
                <Typography>${vat.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Clear Cart Button */}
            <Box sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleClearCart}
                sx={{ py: 1 }}
              >
                Clear Cart
              </Button>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                sx={{ py: 1.5 }}
              >
                Close
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={onProceedToPayment}
                startIcon={<PaymentIcon />}
                sx={{ py: 1.5 }}
              >
                Proceed to Payment
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};