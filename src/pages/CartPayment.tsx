import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  LocalOffer as CouponIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Notes as NotesIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCartItems, selectCartTotalPrice } from '../store/selectors';
import { clearCart } from '../store/cartSlice';
import { Receipt, type ReceiptData } from '../components/Receipt';

interface PaymentMethod {
  id: string;
  method: 'cash' | 'card' | 'digital';
  amount: number;
  saved?: boolean;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  reference?: string;
}

export const CartPayment = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'walk-in', // walk-in or registered
  });

  const [payments, setPayments] = useState<PaymentMethod[]>([
    {
      id: '1',
      method: 'cash',
      amount: 0,
      saved: false,
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState('');
  const [receiptOptions, setReceiptOptions] = useState({
    print: true,
    email: false,
    sms: false,
  });
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  // eslint-disable-next-line react-hooks/purity
  const [transactionRef, setTransactionRef] = useState(`TXN-${Date.now()}`);

  const subtotal = totalPrice;
  const vat = subtotal * 0.1; // 10% VAT
  const discountAmount = (subtotal + vat) * (discount / 100);
  const finalTotal = subtotal + vat - discountAmount;

  const roundToCents = (value: number) => Math.round(value * 100) / 100;

  const totalPaid = payments.reduce(
    (sum, payment) => sum + (payment.saved ? payment.amount : 0),
    0
  );
  const remainingAmount = roundToCents(finalTotal - totalPaid);

  // Check if payment is complete with tolerance for floating point errors
  const isPaymentComplete = Math.abs(remainingAmount) < 0.01;

  const remainingForPayment = (id: string) => {
    const otherTotal = payments.reduce(
      (sum, payment) =>
        sum + (payment.id === id || !payment.saved ? 0 : payment.amount),
      0
    );
    return Math.max(0, roundToCents(finalTotal - otherTotal));
  };

  // Fixed: Update single payment amount when finalTotal changes
  useEffect(() => {
    if (payments.length === 1 && !payments[0].saved) {
      const desiredAmount = Math.max(0, roundToCents(finalTotal));
      setPayments([{ ...payments[0], amount: desiredAmount }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTotal]);

  const handleApplyCoupon = () => {
    // Simple coupon logic - in real app, this would validate against backend
    if (couponCode.toLowerCase() === 'save10') {
      setDiscount(10);
    } else if (couponCode.toLowerCase() === 'save20') {
      setDiscount(20);
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const addPaymentMethod = () => {
    const remainingDue = Math.max(0, roundToCents(finalTotal - totalPaid));
    const newPayment: PaymentMethod = {
      id: Date.now().toString(),
      method: 'cash',
      amount: remainingDue,
      saved: false,
    };
    setPayments([...payments, newPayment]);
  };

  const removePaymentMethod = (id: string) => {
    if (payments.length > 1) {
      setPayments(payments.filter(payment => payment.id !== id));
    }
  };

  const updatePayment = (id: string, updates: Partial<PaymentMethod>) => {
    setPayments(
      payments.map(payment =>
        payment.id === id
          ? {
              ...payment,
              ...updates,
              amount:
                updates.amount !== undefined
                  ? roundToCents(
                      Math.min(updates.amount, remainingForPayment(id))
                    )
                  : payment.amount,
            }
          : payment
      )
    );
  };

  const togglePaymentSaved = (id: string, saved: boolean) => {
    const maxAllowed = remainingForPayment(id);
    setPayments(
      payments.map(payment =>
        payment.id === id
          ? {
              ...payment,
              saved,
              amount: saved
                ? roundToCents(Math.min(payment.amount, maxAllowed))
                : payment.amount,
            }
          : payment
      )
    );
  };

  const handlePayment = () => {
    // Validate required fields
    if (
      (customerInfo.type === 'walk-in' && !customerInfo.name) ||
      !customerInfo.phone
    ) {
      alert(
        customerInfo.type === 'walk-in'
          ? 'Please fill in customer name and phone number'
          : 'Please fill in customer phone number'
      );
      return;
    }

    // Validate payment amounts with tolerance for floating point errors
    const tolerance = 0.01;
    if (totalPaid < finalTotal - tolerance) {
      alert(
        `Payment amount ($${totalPaid.toFixed(2)}) is less than total ($${finalTotal.toFixed(2)})`
      );
      return;
    }

    if (totalPaid > finalTotal + tolerance) {
      alert(
        `Payment amount ($${totalPaid.toFixed(2)}) exceeds total ($${finalTotal.toFixed(2)})`
      );
      return;
    }

    // Validate card details for card payments
    for (const payment of payments) {
      if (
        payment.method === 'card' &&
        payment.saved &&
        (!payment.cardNumber || !payment.expiryDate || !payment.cvv)
      ) {
        alert('Please fill in all card details for card payments');
        return;
      }
    }

    // Prepare transaction data
    const transactionData = {
      transactionRef,
      timestamp: new Date().toISOString(),
      customer: customerInfo,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.product.discountPrice || item.product.price,
        totalPrice:
          (item.product.discountPrice || item.product.price) * item.quantity,
        notes: item.notes || null,
      })),
      pricing: {
        subtotal: roundToCents(subtotal),
        vat: roundToCents(vat),
        vatPercentage: 10,
        discountPercentage: discount,
        discountAmount: roundToCents(discountAmount),
        finalTotal: roundToCents(finalTotal),
      },
      payments: payments
        .filter(p => p.saved)
        .map(payment => ({
          method: payment.method,
          amount: roundToCents(payment.amount),
          reference: payment.reference || null,
          ...(payment.method === 'card' && {
            cardLastFour: payment.cardNumber?.slice(-4) || null,
          }),
        })),
      couponCode: couponCode || null,
      orderNotes: orderNotes || null,
      receiptOptions,
    };

    const receiptPayload: ReceiptData = {
      reference: transactionRef,
      timestamp: transactionData.timestamp,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      items: cartItems.map(item => ({
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.product.discountPrice || item.product.price,
        totalPrice:
          (item.product.discountPrice || item.product.price) * item.quantity,
      })),
      subtotal: roundToCents(subtotal),
      vat: roundToCents(vat),
      vatPercentage: 10,
      discountPercentage: discount,
      discountAmount: roundToCents(discountAmount),
      total: roundToCents(finalTotal),
      payments: payments
        .filter(p => p.saved)
        .map(payment => ({
          method: payment.method,
          amount: roundToCents(payment.amount),
          reference: payment.reference || null,
          cardLastFour: payment.cardNumber?.slice(-4) || null,
        })),
      notes: orderNotes || null,
    };

    // Log transaction data to console
    console.log('=== TRANSACTION DATA ===');
    console.log(JSON.stringify(transactionData, null, 2));
    console.log('========================');

    setReceiptData(receiptPayload);

    // Clear the cart after successful payment
    dispatch(clearCart());

    // Process payment logic here
    alert(
      `Payment processed successfully!\nTotal: $${finalTotal.toFixed(2)}\nReference: ${transactionRef}`
    );
    if (receiptOptions.print) {
      setTimeout(() => {
        window.print();
        navigate('/');
      }, 100);
      return;
    }

    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Box
        className='no-print'
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          p: 3,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            pb: 2,
            borderBottom: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{ mr: 2, color: 'primary.main' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant='h4'
            component='h1'
            fontWeight='bold'
            color='primary.main'
          >
            POS Checkout & Payment
          </Typography>
          <Box
            sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Typography variant='body2' color='text.secondary'>
              Transaction: {transactionRef}
            </Typography>
            <Chip
              label='Active'
              color='success'
              size='small'
              sx={{
                borderRadius: 0,
                backgroundColor: 'success.main',
                color: 'white',
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Customer & Payment Info */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Customer Information */}
            <Box
              sx={{
                mb: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <PersonIcon />
                  Customer Information
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl component='fieldset'>
                      <FormLabel component='legend' sx={{ mb: 1 }}>
                        Customer Type
                      </FormLabel>
                      <RadioGroup
                        row
                        value={customerInfo.type}
                        onChange={e =>
                          setCustomerInfo({
                            ...customerInfo,
                            type: e.target.value,
                          })
                        }
                      >
                        <FormControlLabel
                          value='walk-in'
                          control={<Radio />}
                          label='Walk-in'
                        />
                        <FormControlLabel
                          value='registered'
                          control={<Radio />}
                          label='Registered'
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='Transaction Reference'
                      value={transactionRef}
                      onChange={e => setTransactionRef(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          '& fieldset': { borderRadius: 0 },
                        },
                      }}
                    />
                  </Grid>
                  {customerInfo.type === 'walk-in' && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label='Full Name'
                        value={customerInfo.name}
                        onChange={e =>
                          setCustomerInfo({
                            ...customerInfo,
                            name: e.target.value,
                          })
                        }
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '& fieldset': { borderRadius: 0 },
                          },
                        }}
                      />
                    </Grid>
                  )}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='Phone Number'
                      value={customerInfo.phone}
                      onChange={e =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          '& fieldset': { borderRadius: 0 },
                        },
                      }}
                    />
                  </Grid>
                  {customerInfo.type === 'walk-in' && (
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label='Email (Optional)'
                        type='email'
                        value={customerInfo.email}
                        onChange={e =>
                          setCustomerInfo({
                            ...customerInfo,
                            email: e.target.value,
                          })
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '& fieldset': { borderRadius: 0 },
                          },
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>

            {/* Payment Information - Multiple Methods */}
            <Box
              sx={{
                mb: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CreditCardIcon />
                  Payment Methods
                </Typography>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={addPaymentMethod}
                  sx={{
                    backgroundColor: 'primary.contrastText',
                    color: 'primary.main',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'primary.contrastText',
                      opacity: 0.9,
                    },
                  }}
                >
                  Add Payment
                </Button>
              </Box>
              <Box sx={{ p: 3 }}>
                {payments.map((payment, index) => (
                  <Box
                    key={payment.id}
                    sx={{
                      mb: 3,
                      pb: 3,
                      borderBottom:
                        index < payments.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        gap: 2,
                      }}
                    >
                      <Typography variant='subtitle1' fontWeight='bold'>
                        Payment Method {index + 1}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() =>
                            togglePaymentSaved(payment.id, !payment.saved)
                          }
                          sx={{ borderRadius: 0 }}
                        >
                          {payment.saved ? 'Edit' : 'Save'}
                        </Button>
                        {payments.length > 1 && (
                          <IconButton
                            onClick={() => removePaymentMethod(payment.id)}
                            color='error'
                            size='small'
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth>
                          <InputLabel>Payment Type</InputLabel>
                          <Select
                            value={payment.method}
                            label='Payment Type'
                            onChange={e =>
                              updatePayment(payment.id, {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                method: e.target.value as any,
                              })
                            }
                            disabled={Boolean(payment.saved)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 0,
                                '& fieldset': { borderRadius: 0 },
                              },
                            }}
                          >
                            <MenuItem value='cash'>Cash</MenuItem>
                            <MenuItem value='card'>Credit/Debit Card</MenuItem>
                            <MenuItem value='digital'>Digital Wallet</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          label='Amount'
                          type='number'
                          value={payment.amount || ''}
                          onChange={e =>
                            updatePayment(payment.id, {
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                          disabled={Boolean(payment.saved)}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '& fieldset': { borderRadius: 0 },
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          label='Reference (Optional)'
                          value={payment.reference || ''}
                          onChange={e =>
                            updatePayment(payment.id, {
                              reference: e.target.value,
                            })
                          }
                          disabled={Boolean(payment.saved)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '& fieldset': { borderRadius: 0 },
                            },
                          }}
                        />
                      </Grid>

                      {payment.method === 'card' && (
                        <>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label='Card Number'
                              placeholder='1234 5678 9012 3456'
                              value={payment.cardNumber || ''}
                              onChange={e =>
                                updatePayment(payment.id, {
                                  cardNumber: e.target.value,
                                })
                              }
                              disabled={Boolean(payment.saved)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 0,
                                  '& fieldset': { borderRadius: 0 },
                                },
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <TextField
                              fullWidth
                              label='Expiry Date'
                              placeholder='MM/YY'
                              value={payment.expiryDate || ''}
                              onChange={e =>
                                updatePayment(payment.id, {
                                  expiryDate: e.target.value,
                                })
                              }
                              disabled={Boolean(payment.saved)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 0,
                                  '& fieldset': { borderRadius: 0 },
                                },
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <TextField
                              fullWidth
                              label='CVV'
                              placeholder='123'
                              value={payment.cvv || ''}
                              onChange={e =>
                                updatePayment(payment.id, {
                                  cvv: e.target.value,
                                })
                              }
                              disabled={Boolean(payment.saved)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 0,
                                  '& fieldset': { borderRadius: 0 },
                                },
                              }}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>
                ))}

                {/* Payment Summary */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.300',
                  }}
                >
                  <Typography
                    variant='subtitle2'
                    gutterBottom
                    fontWeight='bold'
                  >
                    Payment Summary
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant='body2'>Total Amount:</Typography>
                    <Typography variant='body2' fontWeight='bold'>
                      ${finalTotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant='body2'>Total Paid:</Typography>
                    <Typography
                      variant='body2'
                      color='success.main'
                      fontWeight='bold'
                    >
                      ${totalPaid.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='body2'>Remaining:</Typography>
                    <Typography
                      variant='body2'
                      color={
                        remainingAmount > 0
                          ? 'error.main'
                          : remainingAmount < 0
                            ? 'warning.main'
                            : 'success.main'
                      }
                      fontWeight='bold'
                    >
                      ${remainingAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Additional POS Features */}
            <Box
              sx={{
                mb: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Accordion
                sx={{
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  border: 'none',
                  '& .MuiAccordionSummary-root': {
                    borderRadius: 0,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    minHeight: 56,
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                  '& .MuiAccordionDetails-root': { borderRadius: 0, p: 3 },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />
                  }
                  sx={{ px: 3 }}
                >
                  <Typography
                    variant='h6'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <NotesIcon />
                    Order Details & Preferences
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {/* Order Notes */}
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label='Order Notes/Special Instructions'
                        placeholder='Any special instructions for this order...'
                        value={orderNotes}
                        onChange={e => setOrderNotes(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '& fieldset': { borderRadius: 0 },
                          },
                        }}
                      />
                    </Grid>

                    {/* Receipt Options */}
                    <Grid size={12}>
                      <Typography
                        variant='subtitle1'
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <ReceiptIcon />
                        Receipt Options
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={receiptOptions.print}
                              onChange={e =>
                                setReceiptOptions({
                                  ...receiptOptions,
                                  print: e.target.checked,
                                })
                              }
                              color='primary'
                            />
                          }
                          label='Print Receipt'
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={receiptOptions.email}
                              onChange={e =>
                                setReceiptOptions({
                                  ...receiptOptions,
                                  email: e.target.checked,
                                })
                              }
                              color='primary'
                            />
                          }
                          label='Email Receipt'
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={receiptOptions.sms}
                              onChange={e =>
                                setReceiptOptions({
                                  ...receiptOptions,
                                  sms: e.target.checked,
                                })
                              }
                              color='primary'
                            />
                          }
                          label='SMS Receipt'
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>

            {/* Coupon/Discount Section */}
            <Box
              sx={{
                mb: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'warning.main',
                  color: 'warning.contrastText',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CouponIcon />
                  Discount & Coupons
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}
                >
                  <TextField
                    fullWidth
                    label='Coupon Code'
                    placeholder='Enter coupon code'
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        '& fieldset': { borderRadius: 0 },
                      },
                    }}
                  />
                  <Button
                    variant='contained'
                    onClick={handleApplyCoupon}
                    sx={{
                      minWidth: 120,
                      borderRadius: 0,
                      backgroundColor: 'warning.main',
                      color: 'warning.contrastText',
                      '&:hover': { backgroundColor: 'warning.dark' },
                    }}
                  >
                    Apply
                  </Button>
                </Box>
                {discount > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={`${discount}% discount applied`}
                      color='success'
                      variant='outlined'
                      sx={{
                        borderRadius: 0,
                        borderColor: 'success.main',
                        color: 'success.main',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box
              sx={{
                position: 'sticky',
                top: 24,
                border: '2px solid',
                borderColor: 'primary.main',
                backgroundColor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                <Typography variant='h6' fontWeight='bold' textAlign='center'>
                  Order Summary
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Cart Items */}
                <List sx={{ mb: 3 }}>
                  {cartItems.map(item => (
                    <ListItem
                      key={item.product.id}
                      sx={{
                        px: 0,
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Avatar
                        src={item.product.image}
                        variant='square'
                        sx={{
                          width: 50,
                          height: 50,
                          mr: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 0,
                        }}
                      >
                        {item.product.name.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant='body1'
                            fontWeight='bold'
                            color='primary.main'
                          >
                            {item.product.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              component='span'
                              display='block'
                            >
                              SKU: {item.product.sku}
                            </Typography>
                            <Typography
                              variant='body2'
                              component='span'
                              display='block'
                            >
                              Qty: {item.quantity} × $
                              {(
                                item.product.discountPrice || item.product.price
                              ).toFixed(2)}
                            </Typography>
                            {item.notes && (
                              <Typography
                                variant='caption'
                                color='warning.main'
                                component='span'
                                display='block'
                              >
                                Note: {item.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Typography
                        variant='h6'
                        fontWeight='bold'
                        color='primary.main'
                      >
                        $
                        {(
                          (item.product.discountPrice || item.product.price) *
                          item.quantity
                        ).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                <Divider
                  sx={{ my: 2, borderColor: 'primary.main', borderWidth: 1 }}
                />

                {/* Totals */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant='body1'>Subtotal:</Typography>
                    <Typography variant='body1'>
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant='body1'>VAT (10%):</Typography>
                    <Typography variant='body1'>${vat.toFixed(2)}</Typography>
                  </Box>
                  {discount > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                        color: 'success.main',
                      }}
                    >
                      <Typography variant='body1' fontWeight='bold'>
                        Discount ({discount}%):
                      </Typography>
                      <Typography variant='body1' fontWeight='bold'>
                        -${discountAmount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Divider
                    sx={{ my: 2, borderColor: 'primary.main', borderWidth: 2 }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant='h5'
                      fontWeight='bold'
                      color='primary.main'
                    >
                      Total:
                    </Typography>
                    <Typography
                      variant='h5'
                      fontWeight='bold'
                      color='primary.main'
                    >
                      ${finalTotal.toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Payment Status */}
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: isPaymentComplete
                        ? 'success.light'
                        : remainingAmount > 0
                          ? 'error.light'
                          : 'warning.light',
                      border: '1px solid',
                      borderColor: isPaymentComplete
                        ? 'success.main'
                        : remainingAmount > 0
                          ? 'error.main'
                          : 'warning.main',
                    }}
                  >
                    <Typography
                      variant='body2'
                      fontWeight='bold'
                      textAlign='center'
                    >
                      {isPaymentComplete
                        ? 'Payment Complete'
                        : remainingAmount > 0
                          ? `Amount Due: $${remainingAmount.toFixed(2)}`
                          : `Change Due: $${Math.abs(remainingAmount).toFixed(2)}`}
                    </Typography>
                  </Box>
                </Box>

                {/* Payment Button */}
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={handlePayment}
                  disabled={!isPaymentComplete}
                  startIcon={<PaymentIcon />}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 0,
                    backgroundColor: isPaymentComplete
                      ? 'success.main'
                      : 'grey.400',
                    '&:hover': {
                      backgroundColor: isPaymentComplete
                        ? 'success.dark'
                        : 'grey.500',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'grey.300',
                      color: 'grey.500',
                    },
                  }}
                >
                  {isPaymentComplete
                    ? 'Complete Payment'
                    : 'Payment Incomplete'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {receiptData && (
        <Box className='print-only' sx={{ p: 3 }}>
          <Receipt data={receiptData} />
        </Box>
      )}
    </>
  );
};
