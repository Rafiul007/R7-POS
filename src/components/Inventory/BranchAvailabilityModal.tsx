import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import type { IProduct } from '../../types';
import { branches } from '../../data/branches';

interface BranchAvailability {
  branchId: string;
  stock: number;
}

interface BranchAvailabilityModalProps {
  open: boolean;
  product?: IProduct;
  currentBranchId: string;
  availability: BranchAvailability[];
  onClose: () => void;
  onRequest: (payload: {
    productId: string;
    fromBranchId: string;
    toBranchId: string;
    quantity: number;
    note?: string;
  }) => { ok: boolean; error?: string };
}

export const BranchAvailabilityModal = ({
  open,
  product,
  currentBranchId,
  availability,
  onClose,
  onRequest,
}: BranchAvailabilityModalProps) => {
  const [fromBranchId, setFromBranchId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const availableBranches = useMemo(
    () =>
      availability
        .filter(row => row.branchId !== currentBranchId && row.stock > 0)
        .map(row => ({
          branchId: row.branchId,
          stock: row.stock,
        })),
    [availability, currentBranchId]
  );

  const handleRequest = () => {
    if (!product) return;
    if (!fromBranchId) {
      setError('Select a source branch.');
      return;
    }
    const qty = Number(quantity);
    if (!quantity || Number.isNaN(qty) || qty <= 0) {
      setError('Enter a valid quantity.');
      return;
    }
    const result = onRequest({
      productId: product.id,
      fromBranchId,
      toBranchId: currentBranchId,
      quantity: qty,
      note: note.trim() || undefined,
    });

    if (!result.ok) {
      setError(result.error || 'Unable to create request.');
      return;
    }

    setError('');
    setQuantity('1');
    setFromBranchId('');
    setNote('');
    onClose();
  };

  const handleClose = () => {
    setError('');
    setQuantity('1');
    setFromBranchId('');
    setNote('');
    onClose();
  };

  const getBranchName = (branchId: string) =>
    branches.find(branch => branch.id === branchId)?.name || branchId;

  const canRequest = availableBranches.length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 700,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        Branch Availability
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {product && (
          <Stack spacing={2}>
            <Box>
              <Typography variant='subtitle1' fontWeight={600}>
                {product.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                SKU: {product.sku || '—'}
              </Typography>
            </Box>

            <Box>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Branch</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availability.map(row => {
                    const isCurrent = row.branchId === currentBranchId;
                    return (
                      <TableRow key={row.branchId}>
                        <TableCell>
                          {getBranchName(row.branchId)}
                          {isCurrent && (
                            <Chip
                              label='Current'
                              size='small'
                              sx={{ ml: 1, borderRadius: 0 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{row.stock}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.stock > 0 ? 'Available' : 'Out'}
                            size='small'
                            color={row.stock > 0 ? 'success' : 'default'}
                            variant='outlined'
                            sx={{ borderRadius: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1 }}>
                Request Transfer
              </Typography>
              {!canRequest && (
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 1 }}
                >
                  No stock available in other branches.
                </Typography>
              )}
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  select
                  label='Source Branch'
                  value={fromBranchId}
                  onChange={e => {
                    setFromBranchId(e.target.value);
                    setError('');
                  }}
                  fullWidth
                  disabled={!canRequest}
                >
                  {availableBranches.map(branch => (
                    <MenuItem key={branch.branchId} value={branch.branchId}>
                      {getBranchName(branch.branchId)} · {branch.stock}{' '}
                      available
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label='Quantity'
                  type='number'
                  value={quantity}
                  onChange={e => {
                    setQuantity(e.target.value);
                    setError('');
                  }}
                  inputProps={{ min: 1 }}
                  fullWidth
                  disabled={!canRequest}
                />
              </Stack>
              <TextField
                label='Note'
                value={note}
                onChange={e => setNote(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                disabled={!canRequest}
              />
              {error && (
                <Typography color='error' variant='body2' sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions
        sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}
      >
        <Button
          onClick={handleClose}
          variant='outlined'
          sx={{ borderRadius: 0 }}
        >
          Close
        </Button>
        <Button
          onClick={handleRequest}
          variant='contained'
          sx={{ borderRadius: 0 }}
          disabled={!canRequest}
        >
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};
