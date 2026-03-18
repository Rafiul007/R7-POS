import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import { branches } from '../../data/branches';
import type { DrawerOption } from '../../data/drawers'; // need to change
import type { OpenShiftFormState } from './types';

interface OpenShiftDialogProps {
  open: boolean;
  form: OpenShiftFormState;
  availableDrawers: DrawerOption[];
  onClose: () => void;
  onBranchChange: (branchId: string) => void;
  onDrawerChange: (drawerId: string) => void;
  onOpenedByChange: (value: string) => void;
  onOpeningCashChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
}

export const OpenShiftDialog = ({
  open,
  form,
  availableDrawers,
  onClose,
  onBranchChange,
  onDrawerChange,
  onOpenedByChange,
  onOpeningCashChange,
  onNotesChange,
  onSubmit,
}: OpenShiftDialogProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
    <DialogTitle>Open shift</DialogTitle>
    <DialogContent
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
    >
      <TextField
        select
        label='Branch'
        value={form.branchId}
        onChange={event => onBranchChange(event.target.value)}
        fullWidth
      >
        {branches.map(branch => (
          <MenuItem key={branch.id} value={branch.id}>
            {branch.name} · {branch.code}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label='Drawer'
        value={form.drawerId}
        onChange={event => onDrawerChange(event.target.value)}
        fullWidth
      >
        {availableDrawers.map(drawer => (
          <MenuItem key={drawer.id} value={drawer.id}>
            {drawer.drawerName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label='Opened by'
        value={form.openedBy}
        onChange={event => onOpenedByChange(event.target.value)}
        fullWidth
      />

      <TextField
        label='Opening cash'
        type='number'
        value={form.openingCash}
        onChange={event => onOpeningCashChange(event.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>,
        }}
        fullWidth
      />

      <TextField
        label='Note'
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
        Open
      </Button>
    </DialogActions>
  </Dialog>
);
