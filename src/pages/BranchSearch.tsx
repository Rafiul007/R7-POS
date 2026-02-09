import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Search } from '@mui/icons-material';
import { BranchAvailabilityModal } from '../components/Inventory';
import { getAllProducts } from '../data/productStore';
import {
  getBranchAvailability,
  getBranchInventoryMap,
  createTransferRequest,
  getTransferRequests,
} from '../data/branchInventoryStore';
import { branches, getBranchById } from '../data/branches';
import { useAlert } from '../hooks';
import { getShiftStatus } from '../utils/drawer';
import { getCurrentBranchId } from '../data/branchInventoryStore';
import type { IProduct } from '../types';

export const BranchSearch = () => {
  const { showAlert } = useAlert();
  const [shiftInfo, setShiftInfo] = useState(() => getShiftStatus());
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState('');
  const [availabilityModal, setAvailabilityModal] = useState({
    open: false,
    product: undefined as IProduct | undefined,
  });

  const branchId = shiftInfo.branchId || getCurrentBranchId() || '';

  const products = useMemo(() => {
    void version;
    const stockMap = getBranchInventoryMap(branchId);
    return getAllProducts().map(product => ({
      ...product,
      stock: stockMap.get(product.id) ?? product.stock ?? 0,
    }));
  }, [branchId, version]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter(product => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term) ||
        product.barcode?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    });
  }, [products, search]);

  const availabilityMap = useMemo(() => {
    void version;
    const map = new Map<string, Map<string, number>>();
    for (const product of filtered) {
      const entries = new Map<string, number>();
      getBranchAvailability(product.id).forEach(entry => {
        entries.set(entry.branchId, entry.stock);
      });
      map.set(product.id, entries);
    }
    return map;
  }, [filtered, version]);

  const requests = useMemo(() => {
    void version;
    return getTransferRequests()
      .filter(
        request =>
          request.toBranchId === branchId || request.fromBranchId === branchId
      )
      .slice(0, 8);
  }, [branchId, version]);

  const handleRequest = (payload: {
    productId: string;
    fromBranchId: string;
    toBranchId: string;
    quantity: number;
    note?: string;
  }) => {
    const result = createTransferRequest(payload);
    if (result.ok) {
      showAlert({ message: 'Transfer request sent.', severity: 'success' });
      setVersion(prev => prev + 1);
      window.dispatchEvent(new CustomEvent('inventory-updated'));
    } else {
      showAlert({
        message: result.error || 'Unable to create request.',
        severity: 'error',
      });
    }
    return result;
  };

  useEffect(() => {
    const handleShiftUpdate = () => {
      setShiftInfo(getShiftStatus());
    };
    const handleInventoryUpdate = () => {
      setVersion(prev => prev + 1);
    };
    window.addEventListener('drawer-shift-updated', handleShiftUpdate);
    window.addEventListener('inventory-updated', handleInventoryUpdate);
    return () => {
      window.removeEventListener('drawer-shift-updated', handleShiftUpdate);
      window.removeEventListener('inventory-updated', handleInventoryUpdate);
    };
  }, []);

  const getProductLabel = (productId: string) =>
    products.find(product => product.id === productId)?.name || productId;

  return (
    <Box
      sx={{
        minHeight: '100%',
        background: theme =>
          `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, ${alpha(theme.palette.info.main, 0)} 45%)`,
        '& .MuiTypography-root': {
          fontFamily: '"Space Grotesk", "Helvetica", "Arial", sans-serif',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Stack spacing={1}>
          <Typography
            variant='overline'
            sx={{
              letterSpacing: '0.22em',
              color: 'text.secondary',
              fontWeight: 600,
            }}
          >
            Branch Search
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Destination branch:{' '}
            {branchId ? getBranchById(branchId).name : 'No branch selected'}
          </Typography>
        </Stack>

        <TextField
          placeholder='Search products by name, SKU, barcode, or category'
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
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme =>
                alpha(theme.palette.background.paper, 0.95),
            },
          }}
        />

        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Current</TableCell>
                {branches.map(branch => (
                  <TableCell key={branch.id}>{branch.code}</TableCell>
                ))}
                <TableCell align='right'>Request</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4 + branches.length}>
                    No products match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(product => {
                  const stocks = availabilityMap.get(product.id) || new Map();
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku || '—'}</TableCell>
                      <TableCell>
                        {stocks.get(branchId) ?? product.stock ?? 0}
                      </TableCell>
                      {branches.map(branch => (
                        <TableCell key={branch.id}>
                          {stocks.get(branch.id) ?? 0}
                        </TableCell>
                      ))}
                      <TableCell align='right'>
                        <Button
                          size='small'
                          variant='outlined'
                          sx={{ borderRadius: 0 }}
                          onClick={() =>
                            setAvailabilityModal({ open: true, product })
                          }
                        >
                          Request
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 2 }}>
            Recent Transfer Requests
          </Typography>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No requests yet.</TableCell>
                </TableRow>
              ) : (
                requests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>{getProductLabel(request.productId)}</TableCell>
                    <TableCell>
                      {getBranchById(request.fromBranchId).code}
                    </TableCell>
                    <TableCell>
                      {getBranchById(request.toBranchId).code}
                    </TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        size='small'
                        variant='outlined'
                        sx={{ borderRadius: 0 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        <BranchAvailabilityModal
          open={availabilityModal.open}
          product={availabilityModal.product}
          currentBranchId={branchId}
          availability={
            availabilityModal.product
              ? getBranchAvailability(availabilityModal.product.id)
              : []
          }
          onClose={() =>
            setAvailabilityModal({ open: false, product: undefined })
          }
          onRequest={handleRequest}
        />
      </Box>
    </Box>
  );
};
