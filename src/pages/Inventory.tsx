import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Add } from '@mui/icons-material';
import {
  InventoryStats,
  InventoryFilters,
  InventoryTable,
  AddStockModal,
  EditStockModal,
  type InventoryFiltersState,
} from '../components/Inventory';
import type { IProduct } from '../types';
import {
  getBranchInventoryMap,
  getBranchMovements,
  ensureInventoryForProduct,
  removeInventoryForProduct,
  upsertBranchStock,
} from '../data/branchInventoryStore';
import {
  getAllProducts,
  removeProductById,
  upsertProducts,
} from '../data/productStore';
import { getBranchById } from '../data/branches';
import { useAlert } from '../hooks';
import { getShiftStatus } from '../utils/drawer';
import { getCurrentBranchId } from '../data/branchInventoryStore';

/* ───────────── Inventory Page ───────────── */

export const Inventory = () => {
  const { showAlert } = useAlert();
  const [shiftInfo, setShiftInfo] = useState(() => getShiftStatus());
  const [version, setVersion] = useState(0);
  const [filters, setFilters] = useState<InventoryFiltersState>({
    search: '',
    category: '',
    stockStatus: '',
    status: '',
  });
  // Modal states
  const [addStockModal, setAddStockModal] = useState({
    open: false,
    product: undefined as IProduct | undefined,
  });
  const [editStockModal, setEditStockModal] = useState({
    open: false,
    product: undefined as IProduct | undefined,
  });
  const branchId = shiftInfo.branchId || getCurrentBranchId() || '';

  const data = useMemo(() => {
    void version;
    const stockMap = getBranchInventoryMap(branchId);
    return getAllProducts().map(product => ({
      ...product,
      stock: stockMap.get(product.id) ?? product.stock ?? 0,
    }));
  }, [branchId, version]);
  // Get unique categories from data
  const categories = useMemo(() => {
    const cats = data.filter(p => p.category).map(p => p.category as string);
    return Array.from(new Set(cats)).sort();
  }, [data]);

  // Filter data based on filters
  const filteredData = useMemo(() => {
    return data.filter(product => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          product.name?.toLowerCase().includes(searchTerm) ||
          product.sku?.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Stock status filter
      if (filters.stockStatus) {
        if (
          filters.stockStatus === 'low' &&
          !(product.stock && product.stock > 0 && product.stock <= 5)
        ) {
          return false;
        }
        if (filters.stockStatus === 'out' && product.stock !== 0) {
          return false;
        }
        if (
          filters.stockStatus === 'in' &&
          !(product.stock && product.stock > 0)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status) {
        const isActive = filters.status === 'active';
        if (product.isActive !== isActive) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters]);

  // Calculate stats from filtered data
  const stats = useMemo(
    () => ({
      total: data.length,
      low: data.filter(p => p.stock && p.stock > 0 && p.stock <= 5).length,
      out: data.filter(p => p.stock === 0).length,
      active: data.filter(p => p.isActive).length,
    }),
    [data]
  );

  const handleFiltersChange = (newFilters: InventoryFiltersState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      stockStatus: '',
      status: '',
    });
  };

  const handleEdit = (product: IProduct) => {
    setEditStockModal({ open: true, product });
  };

  const handleDelete = (product: IProduct) => {
    removeProductById(product.id);
    removeInventoryForProduct(product.id);
    setVersion(prev => prev + 1);
    window.dispatchEvent(new CustomEvent('inventory-updated'));
    showAlert({ message: 'Product removed.', severity: 'info' });
  };

  const handleMore = () => {
    return;
  };

  const handleAddProduct = () => {
    setAddStockModal({ open: true, product: undefined });
  };

  const handleAddStockSubmit = (newProduct: IProduct) => {
    upsertProducts([newProduct]);
    ensureInventoryForProduct(newProduct.id, newProduct.stock ?? 0, branchId);
    setVersion(prev => prev + 1);
    window.dispatchEvent(new CustomEvent('inventory-updated'));
    showAlert({ message: 'Product added to inventory.', severity: 'success' });
  };

  const handleEditStockSubmit = (newQuantity: number) => {
    if (editStockModal.product) {
      upsertBranchStock(
        branchId,
        editStockModal.product.id,
        newQuantity,
        'Manual stock adjustment'
      );
      setVersion(prev => prev + 1);
      window.dispatchEvent(new CustomEvent('inventory-updated'));
      showAlert({ message: 'Stock updated.', severity: 'success' });
    }
  };

  useEffect(() => {
    const handleShiftUpdate = () => {
      setShiftInfo(getShiftStatus());
    };
    window.addEventListener('drawer-shift-updated', handleShiftUpdate);
    return () =>
      window.removeEventListener('drawer-shift-updated', handleShiftUpdate);
  }, []);

  const movements = useMemo(() => {
    void version;
    return getBranchMovements(branchId)
      .filter(movement => movement.type === 'adjustment')
      .slice(0, 8);
  }, [branchId, version]);

  const getProductLabel = (productId: string) =>
    data.find(product => product.id === productId)?.name || productId;

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
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Stack spacing={2}>
            <Typography
              variant='overline'
              sx={{
                letterSpacing: '0.22em',
                color: 'text.secondary',
                fontWeight: 600,
              }}
            >
              Inventory
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Branch: {getBranchById(branchId).name}
            </Typography>
          </Stack>

          <Tooltip title='Add New Product'>
            <IconButton
              onClick={handleAddProduct}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                p: 1.25,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats Section */}
        <InventoryStats
          totalProducts={stats.total}
          lowStock={stats.low}
          outOfStock={stats.out}
          activeProducts={stats.active}
        />

        {/* Filters Section */}
        <InventoryFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          onReset={handleResetFilters}
        />

        {/* Table Section */}
        <InventoryTable
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMore={handleMore}
        />

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
            Recent Stock Adjustments
          </Typography>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Change</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No adjustments yet.</TableCell>
                </TableRow>
              ) : (
                movements.map(movement => (
                  <TableRow key={movement.id}>
                    <TableCell>{getProductLabel(movement.productId)}</TableCell>
                    <TableCell>
                      {movement.quantity > 0 ? '+' : ''}
                      {movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reason || movement.type}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* Add Stock Modal */}
        <AddStockModal
          open={addStockModal.open}
          onClose={() => setAddStockModal({ open: false, product: undefined })}
          onSubmit={handleAddStockSubmit}
          product={addStockModal.product}
        />

        {/* Edit Stock Modal */}
        <EditStockModal
          open={editStockModal.open}
          onClose={() => setEditStockModal({ open: false, product: undefined })}
          onSubmit={handleEditStockSubmit}
          product={editStockModal.product}
        />
      </Box>
    </Box>
  );
};
