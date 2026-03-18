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
import type { CloseShiftFormState } from './types';

interface CloseShiftDialogProps {
  open: boolean;
  form: CloseShiftFormState;
  expectedCash: number;
  onClose: () => void;
  onCountedCashChange: (value: string) => void;
  onClosedByChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
}

export const CloseShiftDialog = ({
  open,
  form,
  expectedCash,
  onClose,
  onCountedCashChange,
  onClosedByChange,
  onNotesChange,
  onSubmit,
}: CloseShiftDialogProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
    <DialogTitle>Close shift</DialogTitle>
    <DialogContent
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
    >
      <Typography variant='body2'>
        Expected cash: ${expectedCash.toFixed(2)}
      </Typography>

      <TextField
        label='Counted cash'
        type='number'
        value={form.countedCash}
        onChange={event => onCountedCashChange(event.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>,
        }}
        fullWidth
      />

      <TextField
        label='Closed by'
        value={form.closedBy}
        onChange={event => onClosedByChange(event.target.value)}
        fullWidth
      />

      <TextField
        label='Notes (optional)'
        value={form.notes}
        onChange={event => onNotesChange(event.target.value)}
        fullWidth
        multiline
        rows={3}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant='contained' onClick={onSubmit}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
