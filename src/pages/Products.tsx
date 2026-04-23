import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { QrCodeScanner, Search } from '@mui/icons-material';
import { ProductGridItem } from '../components';
import { useAppDispatch } from '../store/hooks';
import { addItem } from '../store/cartSlice';
import { useAlert, useBarcodeScanner, useProducts } from '../hooks';
import { MESSAGES } from '../constants';
import { isShiftOpen } from '../utils/drawer';

export const Products = () => {
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const [search, setSearch] = useState('');
  const [scanValue, setScanValue] = useState('');
  const [scanStatus, setScanStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [scanMessage, setScanMessage] = useState('Ready to scan');
  const [autoCapture, setAutoCapture] = useState(true);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);
  const { data, isError, isLoading } = useProducts({ search });
  const products = useMemo(() => data?.products ?? [], [data]);
  const totalProducts = data?.pagination.total ?? products.length;

  const handleBarcode = useCallback(
    (barcode: string) => {
      if (!barcode) return;
      if (!isShiftOpen()) {
        setScanStatus('error');
        setScanMessage(MESSAGES.DRAWER.SHIFT_REQUIRED);
        showAlert({
          message: MESSAGES.DRAWER.SHIFT_REQUIRED,
          severity: 'warning',
        });
        return;
      }
      const product = products.find(
        item => item.barcode === barcode || item.sku === barcode
      );
      if (!product) {
        setScanStatus('error');
        setScanMessage(MESSAGES.BARCODE.NOT_FOUND(barcode));
        showAlert({
          message: MESSAGES.BARCODE.NOT_FOUND(barcode),
          severity: 'error',
        });
        return;
      }
      if (product.stock === 0) {
        setScanStatus('error');
        setScanMessage(MESSAGES.BARCODE.OUT_OF_STOCK(product.name));
        showAlert({
          message: MESSAGES.BARCODE.OUT_OF_STOCK(product.name),
          severity: 'warning',
        });
        return;
      }
      dispatch(addItem(product));
      setScanStatus('ok');
      setScanMessage(MESSAGES.BARCODE.ADDED(product.name));
      showAlert({
        message: MESSAGES.BARCODE.ADDED(product.name),
        severity: 'success',
      });
    },
    [dispatch, showAlert, products]
  );

  useBarcodeScanner({
    enabled: autoCapture,
    onScan: handleBarcode,
    minLength: 4,
    timeoutMs: 100,
    captureWhenFocused: false,
  });

  return (
    <Box
      sx={{
        minHeight: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
        backgroundColor: 'background.default',
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Box>
            <Typography
              variant='overline'
              sx={{
                letterSpacing: '0.18em',
                color: 'text.secondary',
                fontWeight: 700,
              }}
            >
              POS
            </Typography>
            <Typography variant='h5' sx={{ fontWeight: 800 }}>
              Products
            </Typography>
          </Box>

          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
            <Chip
              label={isLoading ? 'Loading...' : `${totalProducts} products`}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={scanMessage}
              color={
                scanStatus === 'ok'
                  ? 'success'
                  : scanStatus === 'error'
                    ? 'error'
                    : 'default'
              }
              variant='outlined'
              sx={{ fontWeight: 700 }}
            />
          </Stack>
        </Stack>

        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 4,
            background: theme =>
              `linear-gradient(180deg, ${alpha(
                theme.palette.background.paper,
                1
              )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <TextField
                placeholder='Search by name, SKU, or category'
                variant='outlined'
                fullWidth
                size='small'
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search fontSize='small' />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <TextField
                placeholder='Scan barcode and press Enter'
                variant='outlined'
                fullWidth
                size='small'
                inputRef={barcodeInputRef}
                value={scanValue}
                onChange={e => setScanValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleBarcode(scanValue.trim());
                    setScanValue('');
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <QrCodeScanner fontSize='small' />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 2 }}>
              <Button
                fullWidth
                variant='outlined'
                onClick={() => barcodeInputRef.current?.focus()}
                sx={{ height: '100%' }}
              >
                Focus Scanner
              </Button>
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            justifyContent='space-between'
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ mt: 1.5 }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={autoCapture}
                  onChange={e => setAutoCapture(e.target.checked)}
                />
              }
              label='Auto-capture scanner'
            />
            <Typography variant='body2' color='text.secondary'>
              Select a product or scan a code to add it to the sale.
            </Typography>
          </Stack>
        </Paper>

        {isLoading ? (
          <Stack alignItems='center' sx={{ py: 8 }}>
            <CircularProgress />
          </Stack>
        ) : isError ? (
          <Alert severity='error'>Failed to load products.</Alert>
        ) : products.length === 0 ? (
          <Alert severity='info'>No products found.</Alert>
        ) : (
          <Grid container spacing={2}>
            {products.map(product => (
              <ProductGridItem key={product.id} product={product} />
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};
