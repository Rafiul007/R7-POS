import { Add, Lock, LockOpen, Remove } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface ControlsCardProps {
  isShiftOpen: boolean;
  cashSales: number | null | undefined;
  onOpenShift: () => void;
  onCloseShift: () => void;
  onCashIn: () => void;
  onCashOut: () => void;
  onCashSalesChange: (value: string) => void;
}

export const ControlsCard = ({
  isShiftOpen,
  cashSales,
  onOpenShift,
  onCloseShift,
  onCashIn,
  onCashOut,
  onCashSalesChange,
}: ControlsCardProps) => (
  <Card
    sx={{
      flex: 1,
      borderRadius: 0,
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <CardContent>
      <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2 }}>
        Controls
      </Typography>

      <Stack direction='row' spacing={2} flexWrap='wrap'>
        <Button
          variant='contained'
          startIcon={<LockOpen />}
          disabled={isShiftOpen}
          onClick={onOpenShift}
          sx={{ borderRadius: 0 }}
        >
          Open Shift
        </Button>
        <Button
          variant='outlined'
          startIcon={<Lock />}
          disabled={!isShiftOpen}
          onClick={onCloseShift}
          sx={{ borderRadius: 0 }}
        >
          Close Shift
        </Button>
        <Button
          variant='contained'
          color='success'
          startIcon={<Add />}
          disabled={!isShiftOpen}
          onClick={onCashIn}
          sx={{ borderRadius: 0 }}
        >
          Cash In
        </Button>
        <Button
          variant='contained'
          color='warning'
          startIcon={<Remove />}
          disabled={!isShiftOpen}
          onClick={onCashOut}
          sx={{ borderRadius: 0 }}
        >
          Cash Out
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <TextField
        label='Cash sales total'
        type='number'
        fullWidth
        disabled={!isShiftOpen}
        value={cashSales ?? ''}
        onChange={event => onCashSalesChange(event.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>,
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
        helperText='Enter cash sales total if not synced from payments.'
      />
    </CardContent>
  </Card>
);
