import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Chip,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Search } from '@mui/icons-material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
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
import { buildMrtOptions } from '../utils/materialReactTable';

type TransferRequestRow = {
  id: string;
  product: string;
  from: string;
  to: string;
  quantity: number;
  status: string;
};

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

  const productLabels = useMemo(
    () => new Map(products.map(product => [product.id, product.name] as const)),
    [products]
  );

  const transferRequestRows = useMemo<TransferRequestRow[]>(
    () =>
      requests.map(request => ({
        id: request.id,
        product: productLabels.get(request.productId) ?? request.productId,
        from: getBranchById(request.fromBranchId).code,
        to: getBranchById(request.toBranchId).code,
        quantity: request.quantity,
        status: request.status,
      })),
    [requests, productLabels]
  );

  const inventoryColumns = useMemo<MRT_ColumnDef<IProduct>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Product',
        size: 220,
        Cell: ({ cell }) => (
          <Typography variant='body2' fontWeight={600}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        size: 120,
        Cell: ({ cell }) => cell.getValue<string>() || '—',
      },
      {
        id: 'current',
        header: 'Current',
        size: 90,
        accessorFn: row =>
          availabilityMap.get(row.id)?.get(branchId) ?? row.stock ?? 0,
      },
      ...branches.map<MRT_ColumnDef<IProduct>>(branch => ({
        id: `branch-${branch.id}`,
        header: branch.code,
        size: 90,
        accessorFn: row => availabilityMap.get(row.id)?.get(branch.id) ?? 0,
      })),
      {
        id: 'request',
        header: 'Request',
        size: 140,
        Cell: ({ row }) => (
          <Button
            size='small'
            variant='outlined'
            onClick={() =>
              setAvailabilityModal({ open: true, product: row.original })
            }
          >
            Request
          </Button>
        ),
      },
    ],
    [availabilityMap, branchId]
  );

  const requestColumns = useMemo<MRT_ColumnDef<TransferRequestRow>[]>(
    () => [
      { accessorKey: 'product', header: 'Product', size: 220 },
      { accessorKey: 'from', header: 'From', size: 90 },
      { accessorKey: 'to', header: 'To', size: 90 },
      { accessorKey: 'quantity', header: 'Qty', size: 80 },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 140,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>()}
            size='small'
            variant='outlined'
          />
        ),
      },
    ],
    []
  );

  const inventoryTable = useMaterialReactTable(
    buildMrtOptions({
      columns: inventoryColumns,
      data: filtered,
      enablePagination: filtered.length > 10,
    })
  );

  const requestsTable = useMaterialReactTable(
    buildMrtOptions({
      columns: requestColumns,
      data: transferRequestRows,
      enablePagination: transferRequestRows.length > 8,
    })
  );

  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: 'background.default',
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

        <MaterialReactTable table={inventoryTable} />

        <Stack spacing={1.5}>
          <Typography variant='subtitle2' fontWeight={700}>
            Recent Transfer Requests
          </Typography>
          <MaterialReactTable table={requestsTable} />
        </Stack>

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
