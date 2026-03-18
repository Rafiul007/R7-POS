import {
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { CashMovement } from './types';

interface CashMovementsCardProps {
  moves: CashMovement[];
  totalIn: number;
  totalOut: number;
}

export const CashMovementsCard = ({
  moves,
  totalIn,
  totalOut,
}: CashMovementsCardProps) => (
  <Card
    sx={{ borderRadius: 0, border: '1px solid', borderColor: 'divider' }}
  >
    <CardContent>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{ mb: 2 }}
      >
        <Typography variant='subtitle1' fontWeight={600}>
          Cash movements
        </Typography>
        <Stack direction='row' spacing={2}>
          <Typography variant='body2'>In: ${totalIn.toFixed(2)}</Typography>
          <Typography variant='body2'>Out: ${totalOut.toFixed(2)}</Typography>
        </Stack>
      </Stack>

      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {moves.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No cash movements yet.</TableCell>
            </TableRow>
          ) : (
            moves.map(move => (
              <TableRow key={move.id}>
                <TableCell>{move.type === 'in' ? 'Cash In' : 'Cash Out'}</TableCell>
                <TableCell>${move.amount.toFixed(2)}</TableCell>
                <TableCell>{move.reason}</TableCell>
                <TableCell>{new Date(move.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
