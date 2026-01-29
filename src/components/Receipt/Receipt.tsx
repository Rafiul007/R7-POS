import { Box, Divider, Typography, Stack } from '@mui/material';

export interface ReceiptItem {
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ReceiptPayment {
  method: string;
  amount: number;
  reference?: string | null;
  cardLastFour?: string | null;
}

export interface ReceiptData {
  reference: string;
  timestamp: string;
  customerName?: string;
  customerPhone?: string;
  items: ReceiptItem[];
  subtotal: number;
  vat: number;
  vatPercentage: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  payments: ReceiptPayment[];
  notes?: string | null;
}

interface ReceiptProps {
  data: ReceiptData;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

const Receipt = ({ data }: ReceiptProps) => {
  return (
    <Box sx={{ width: 320, mx: 'auto', color: 'text.primary' }}>
      <Stack spacing={1} sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant='h6' fontWeight={700}>
          R7-POS Receipt
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          Transaction {data.reference}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {new Date(data.timestamp).toLocaleString()}
        </Typography>
      </Stack>

      <Divider />

      <Box sx={{ my: 2 }}>
        <Typography variant='caption' color='text.secondary'>
          Customer
        </Typography>
        <Typography variant='body2' fontWeight={600}>
          {data.customerName || 'Walk-in'}
        </Typography>
        {data.customerPhone && (
          <Typography variant='caption' color='text.secondary'>
            {data.customerPhone}
          </Typography>
        )}
      </Box>

      <Divider />

      <Stack spacing={1} sx={{ my: 2 }}>
        {data.items.map(item => (
          <Box
            key={`${item.sku || item.name}-${item.quantity}`}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant='body2' fontWeight={600}>
                {item.name}
              </Typography>
              {item.sku && (
                <Typography variant='caption' color='text.secondary'>
                  {item.sku}
                </Typography>
              )}
              <Typography variant='caption' color='text.secondary'>
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </Typography>
            </Box>
            <Typography variant='body2' fontWeight={600}>
              {formatCurrency(item.totalPrice)}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider />

      <Stack spacing={1} sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2'>Subtotal</Typography>
          <Typography variant='body2'>
            {formatCurrency(data.subtotal)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2'>VAT ({data.vatPercentage}%)</Typography>
          <Typography variant='body2'>{formatCurrency(data.vat)}</Typography>
        </Box>
        {data.discountPercentage > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='body2'>
              Discount ({data.discountPercentage}%)
            </Typography>
            <Typography variant='body2'>
              -{formatCurrency(data.discountAmount)}
            </Typography>
          </Box>
        )}
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='subtitle1' fontWeight={700}>
            Total
          </Typography>
          <Typography variant='subtitle1' fontWeight={700}>
            {formatCurrency(data.total)}
          </Typography>
        </Box>
      </Stack>

      <Divider />

      <Stack spacing={1} sx={{ my: 2 }}>
        <Typography variant='caption' color='text.secondary'>
          Payments
        </Typography>
        {data.payments.length === 0 ? (
          <Typography variant='body2'>No payment details.</Typography>
        ) : (
          data.payments.map((payment, index) => (
            <Box
              key={`${payment.method}-${index}`}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant='body2'>
                {payment.method.toUpperCase()}
                {payment.cardLastFour ? ` • ${payment.cardLastFour}` : ''}
              </Typography>
              <Typography variant='body2'>
                {formatCurrency(payment.amount)}
              </Typography>
            </Box>
          ))
        )}
      </Stack>

      {data.notes && (
        <>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <Typography variant='caption' color='text.secondary'>
              Notes
            </Typography>
            <Typography variant='body2'>{data.notes}</Typography>
          </Box>
        </>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant='caption' color='text.secondary'>
          Thank you for your purchase.
        </Typography>
      </Box>
    </Box>
  );
};

export { Receipt };
export default Receipt;
