import {
  Paper,
  TextField,
  Select,
  MenuItem,
  Stack,
  Button,
} from '@mui/material';
import { Search, Tune, Refresh } from '@mui/icons-material';

export interface InventoryFiltersState {
  search: string;
  category: string;
  stockStatus: string;
  status: string;
}

interface InventoryFiltersProps {
  filters: InventoryFiltersState;
  onFiltersChange: (filters: InventoryFiltersState) => void;
  categories: string[];
  onReset: () => void;
}

export const InventoryFilters = ({
  filters,
  onFiltersChange,
  categories,
  onReset,
}: InventoryFiltersProps) => {
  const handleChange = (key: keyof InventoryFiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'flex-end' },
      }}
    >
      {/* Search */}
      <TextField
        placeholder='Search by name, SKU...'
        size='small'
        value={filters.search}
        onChange={e => handleChange('search', e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{
          flex: 1,
          minWidth: { xs: '100%', md: '300px' },
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
          },
        }}
      />

      {/* Category Filter */}
      <Select
        size='small'
        value={filters.category}
        onChange={e => handleChange('category', e.target.value)}
        displayEmpty
        sx={{
          minWidth: { xs: '100%', md: '200px' },
          borderRadius: 0,
        }}
      >
        <MenuItem value=''>All Categories</MenuItem>
        {categories.map(cat => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>

      {/* Stock Status Filter */}
      <Select
        size='small'
        value={filters.stockStatus}
        onChange={e => handleChange('stockStatus', e.target.value)}
        displayEmpty
        sx={{
          minWidth: { xs: '100%', md: '200px' },
          borderRadius: 0,
        }}
      >
        <MenuItem value=''>All Stock Levels</MenuItem>
        <MenuItem value='low'>Low Stock</MenuItem>
        <MenuItem value='out'>Out of Stock</MenuItem>
        <MenuItem value='in'>In Stock</MenuItem>
      </Select>

      {/* Status Filter */}
      <Select
        size='small'
        value={filters.status}
        onChange={e => handleChange('status', e.target.value)}
        displayEmpty
        sx={{
          minWidth: { xs: '100%', md: '200px' },
          borderRadius: 0,
        }}
      >
        <MenuItem value=''>All Status</MenuItem>
        <MenuItem value='active'>Active</MenuItem>
        <MenuItem value='inactive'>Inactive</MenuItem>
      </Select>

      {/* Action Buttons */}
      <Stack direction='row' gap={1}>
        <Button
          variant='outlined'
          size='small'
          startIcon={<Refresh />}
          onClick={onReset}
          sx={{
            textTransform: 'none',
            borderRadius: 0,
          }}
        >
          Reset
        </Button>
        <Button
          variant='contained'
          size='small'
          startIcon={<Tune />}
          sx={{
            textTransform: 'none',
            borderRadius: 0,
          }}
        >
          Apply
        </Button>
      </Stack>
    </Paper>
  );
};
