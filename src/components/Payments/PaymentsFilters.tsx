import {
  Paper,
  TextField,
  Select,
  MenuItem,
  Stack,
  Button,
} from '@mui/material';
import { Search, Tune, Refresh } from '@mui/icons-material';

export interface PaymentsFiltersState {
  search: string;
  method: string;
  status: string;
}

interface PaymentsFiltersProps {
  filters: PaymentsFiltersState;
  onFiltersChange: (filters: PaymentsFiltersState) => void;
  onReset: () => void;
}

export const PaymentsFilters = ({
  filters,
  onFiltersChange,
  onReset,
}: PaymentsFiltersProps) => {
  const handleChange = (key: keyof PaymentsFiltersState, value: string) => {
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
      <TextField
        placeholder='Search by customer, reference...'
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

      <Select
        size='small'
        value={filters.method}
        onChange={e => handleChange('method', e.target.value)}
        displayEmpty
        sx={{
          minWidth: { xs: '100%', md: '200px' },
          borderRadius: 0,
        }}
      >
        <MenuItem value=''>All Methods</MenuItem>
        <MenuItem value='card'>Card</MenuItem>
        <MenuItem value='cash'>Cash</MenuItem>
        <MenuItem value='bank'>Bank Transfer</MenuItem>
        <MenuItem value='wallet'>Wallet</MenuItem>
      </Select>

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
        <MenuItem value='paid'>Paid</MenuItem>
        <MenuItem value='pending'>Pending</MenuItem>
        <MenuItem value='failed'>Failed</MenuItem>
        <MenuItem value='refunded'>Refunded</MenuItem>
      </Select>

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
