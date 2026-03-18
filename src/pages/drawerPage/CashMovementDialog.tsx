import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import type { CashFormState, ShiftTotals } from './types';

interface CashMovementDialogProps {
  mode: 'in' | 'out' | null;
  form: CashFormState;
  totals: ShiftTotals;
  onClose: () => void;
  onAmountChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
}

export const CashMovementDialog = ({
  mode,
  form,
  totals,
  onClose,
  onAmountChange,
  onReasonChange,
  onSubmit,
}: CashMovementDialogProps) => (
  <Dialog open={Boolean(mode)} onClose={onClose} fullWidth maxWidth='sm'>
    <DialogTitle>{mode === 'in' ? 'Cash in' : 'Cash out'}</DialogTitle>
    <DialogContent
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
    >
      <TextField
        label='Amount'
        type='number'
        value={form.amount}
        onChange={event => onAmountChange(event.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>,
        }}
        fullWidth
      />
      <TextField
        label='Reason'
        value={form.reason}
        onChange={event => onReasonChange(event.target.value)}
        fullWidth
      />
      {mode === 'out' && Number(form.amount) > totals.expectedCash && (
        <Typography variant='caption' color='error.main'>
          Amount exceeds expected cash in drawer.
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant='contained' onClick={onSubmit}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
);
