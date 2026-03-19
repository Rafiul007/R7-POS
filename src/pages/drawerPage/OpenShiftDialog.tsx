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
import type { OpenShiftFormState } from './types';

export interface BranchOption {
  id: string;
  name: string;
  code?: string;
}

export interface DrawerOption {
  id: string;
  drawerName: string;
  branchId: string;
}

interface OpenShiftDialogProps {
  open: boolean;
  form: OpenShiftFormState;
  availableBranches: BranchOption[];
  availableDrawers: DrawerOption[];
  onClose: () => void;
  onBranchChange: (branchId: string) => void;
  onDrawerChange: (drawerId: string) => void;
  onOpeningCashChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isBranchesLoading?: boolean;
  isDrawersLoading?: boolean;
}

export const OpenShiftDialog = ({
  open,
  form,
  availableBranches,
  availableDrawers,
  onClose,
  onBranchChange,
  onDrawerChange,
  onOpeningCashChange,
  onNotesChange,
  onSubmit,
  isSubmitting = false,
  isBranchesLoading = false,
  isDrawersLoading = false,
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
        disabled={isBranchesLoading || isSubmitting}
      >
        {availableBranches.map(branch => (
          <MenuItem key={branch.id} value={branch.id}>
            {branch.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label='Drawer'
        value={form.drawerId}
        onChange={event => onDrawerChange(event.target.value)}
        fullWidth
        disabled={!form.branchId || isDrawersLoading || isSubmitting}
      >
        {availableDrawers.map(drawer => (
          <MenuItem key={drawer.id} value={drawer.id}>
            {drawer.drawerName}
          </MenuItem>
        ))}
      </TextField>

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
      <Button onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        variant='contained'
        onClick={onSubmit}
        disabled={isSubmitting || !form.branchId || !form.drawerId}
      >
        {isSubmitting ? 'Opening...' : 'Open'}
      </Button>
    </DialogActions>
  </Dialog>
);
