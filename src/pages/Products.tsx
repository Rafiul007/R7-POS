import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Search, QrCodeScanner } from '@mui/icons-material';
import { ProductGridItem } from '../components';
import { useAppDispatch } from '../store/hooks';
import { addItem } from '../store/cartSlice';
import { getAllProducts } from '../data/productStore';
import { useAlert, useBarcodeScanner } from '../hooks';
import { MESSAGES } from '../constants';
import { isShiftOpen } from '../utils/drawer';
import { getBranchInventoryMap } from '../data/branchInventoryStore';
import { getShiftStatus } from '../utils/drawer';
import { getCurrentBranchId } from '../data/branchInventoryStore';

export const Products = () => {
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const [shiftInfo, setShiftInfo] = useState(() => getShiftStatus());
  const [version, setVersion] = useState(0);
  const products = useMemo(() => {
    void version;
    const effectiveBranchId = shiftInfo.branchId || getCurrentBranchId() || '';
    const stockMap = getBranchInventoryMap(effectiveBranchId);
    return getAllProducts().map(product => ({
      ...product,
      stock: stockMap.get(product.id) ?? product.stock ?? 0,
    }));
  }, [shiftInfo, version]);
  const [scanValue, setScanValue] = useState('');
  const [scanStatus, setScanStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [scanMessage, setScanMessage] = useState('Ready to scan');
  const [autoCapture, setAutoCapture] = useState(true);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

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
      const product = products.find(item => item.barcode === barcode);
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

  useEffect(() => {
    const handleInventoryUpdate = () => {
      setVersion(prev => prev + 1);
    };
    window.addEventListener('inventory-updated', handleInventoryUpdate);
    return () =>
      window.removeEventListener('inventory-updated', handleInventoryUpdate);
  }, []);

  useEffect(() => {
    const handleShiftUpdate = () => {
      setShiftInfo(getShiftStatus());
    };
    window.addEventListener('drawer-shift-updated', handleShiftUpdate);
    return () =>
      window.removeEventListener('drawer-shift-updated', handleShiftUpdate);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100%',
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 4, md: 6 },
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.12
          )} 0%, ${alpha(theme.palette.info.main, 0)} 45%)`,
      }}
    >
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Stack spacing={2} sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant='overline'
            sx={{
              letterSpacing: '0.22em',
              color: 'text.secondary',
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            Products
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: 'text.secondary', textAlign: 'left' }}
          >
            {products.length} items available
          </Typography>
        </Stack>

        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
            backgroundColor: theme =>
              alpha(theme.palette.background.paper, 0.85),
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant='subtitle2' sx={{ letterSpacing: '0.12em' }}>
                FIND & SCAN
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Search inventory or scan barcode to add to cart
              </Typography>
            </Stack>
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
              sx={{ borderRadius: 0, fontWeight: 600 }}
            />
          </Box>

          <Divider />

          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              gap: 2,
            }}
          >
            <TextField
              placeholder='Search products by name, SKU, or category'
              variant='outlined'
              fullWidth
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search fontSize='small' />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme =>
                    alpha(theme.palette.background.paper, 0.95),
                },
              }}
            />

            <Stack spacing={1}>
              <TextField
                label='Barcode'
                placeholder='Scan or type then press Enter'
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme =>
                      alpha(theme.palette.background.paper, 0.95),
                  },
                }}
              />
              <Stack direction='row' spacing={1} alignItems='center'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoCapture}
                      onChange={e => setAutoCapture(e.target.checked)}
                    />
                  }
                  label='Auto-capture scanner'
                />
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => barcodeInputRef.current?.focus()}
                  sx={{ borderRadius: 0 }}
                >
                  Focus Scanner
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Grid container spacing={1} justifyContent='flex-start'>
          {products.map(product => (
            <ProductGridItem key={product.id} product={product} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
