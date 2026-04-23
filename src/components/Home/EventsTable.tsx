import { useMemo } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { buildMrtOptions } from '../../utils/materialReactTable';

export interface DashboardEventRow {
  id: string;
  eventName: string;
  dateTime: string;
  location: string;
  status: 'Admin' | 'Scheduled' | 'Draft';
  category: string;
  frequency: string;
  tickets: number;
  attendees: number;
}

interface EventsTableProps {
  rows: DashboardEventRow[];
}

export const EventsTable = ({ rows }: EventsTableProps) => {
  const theme = useTheme();

  const columns = useMemo<MRT_ColumnDef<DashboardEventRow>[]>(
    () => [
      {
        accessorKey: 'eventName',
        header: 'Event Name',
        size: 220,
        Cell: ({ cell }) => (
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      { accessorKey: 'dateTime', header: 'Date and Time', size: 180 },
      { accessorKey: 'location', header: 'Location', size: 160 },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        Cell: ({ cell }) => {
          const value = cell.getValue<DashboardEventRow['status']>();
          const colorMap = {
            Admin: {
              bg: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.dark,
            },
            Scheduled: {
              bg: alpha(theme.palette.warning.main, 0.12),
              color: theme.palette.warning.dark,
            },
            Draft: {
              bg: alpha(theme.palette.secondary.main, 0.12),
              color: theme.palette.secondary.dark,
            },
          }[value];

          return (
            <Chip
              label={value}
              size='small'
              sx={{
                bgcolor: colorMap.bg,
                color: colorMap.color,
                fontWeight: 700,
              }}
            />
          );
        },
      },
      { accessorKey: 'category', header: 'Category', size: 140 },
      { accessorKey: 'frequency', header: 'Frequency', size: 120 },
      { accessorKey: 'tickets', header: 'Tickets', size: 90 },
      { accessorKey: 'attendees', header: 'Attendees', size: 100 },
    ],
    [theme]
  );

  const table = useMaterialReactTable(
    buildMrtOptions({
      columns,
      data: rows,
      enablePagination: false,
      muiTablePaperProps: {
        sx: {
          borderRadius: 12,
        },
      },
    })
  );

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant='h6' sx={{ fontWeight: 800 }}>
          Event List
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Weekly schedule across branches and activity categories
        </Typography>
      </Stack>
      <MaterialReactTable table={table} />
    </Stack>
  );
};
