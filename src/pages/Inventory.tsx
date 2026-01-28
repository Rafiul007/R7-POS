import { useState, useMemo } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
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

/* ───────────── Mock Data ───────────── */

const sampleInventoryData: IProduct[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    price: 89.99,
    stock: 15,
    isActive: true,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Organic Coffee Beans',
    sku: 'CF-002',
    category: 'Food & Beverage',
    price: 24.99,
    stock: 8,
    isActive: true,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Smart Fitness Watch',
    sku: 'FW-003',
    category: 'Electronics',
    price: 199.99,
    stock: 0,
    isActive: false,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Premium USB-C Cable',
    sku: 'UB-004',
    category: 'Accessories',
    price: 12.99,
    stock: 3,
    isActive: true,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Portable Phone Charger',
    sku: 'PC-005',
    category: 'Electronics',
    price: 34.99,
    stock: 25,
    isActive: true,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Desk Lamp LED',
    sku: 'DL-006',
    category: 'Office',
    price: 49.99,
    stock: 5,
    isActive: true,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Mechanical Keyboard',
    sku: 'MK-007',
    category: 'Electronics',
    price: 129.99,
    stock: 12,
    isActive: true,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Mouse Wireless',
    sku: 'MW-008',
    category: 'Accessories',
    price: 29.99,
    stock: 0,
    isActive: false,
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/* ───────────── Inventory Page ───────────── */

export const Inventory = () => {
  const [data, setData] = useState<IProduct[]>(sampleInventoryData);
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
    console.log('Delete product:', product);
    // TODO: Implement delete product confirmation
  };

  const handleMore = (product: IProduct) => {
    console.log('More actions for product:', product);
    // TODO: Implement more actions menu
  };

  const handleAddProduct = () => {
    setAddStockModal({ open: true, product: undefined });
  };

  const handleAddStockSubmit = (newProduct: IProduct) => {
    setData(prev => [newProduct, ...prev]);
    console.log('Added new product:', newProduct);
    // TODO: Replace with API call
  };

  const handleEditStockSubmit = (newQuantity: number) => {
    if (editStockModal.product) {
      const updatedData = data.map(p =>
        p.id === editStockModal.product!.id ? { ...p, stock: newQuantity } : p
      );
      setData(updatedData);
      console.log(
        'Updated stock for product:',
        editStockModal.product.name,
        'to',
        newQuantity
      );
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 4,
        py: 3,
        gap: 3,
        backgroundColor: '#fafafa',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant='h4' fontWeight={700}>
            Inventory Management
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            Manage and track your product inventory
          </Typography>
        </Box>

        <Tooltip title='Add New Product'>
          <IconButton
            onClick={handleAddProduct}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 1.5,
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
  );
};
