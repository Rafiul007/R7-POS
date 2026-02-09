import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { branches } from '../data/branches';
import { setCurrentBranchId } from '../data/branchInventoryStore';

interface BranchSelectProps {
  value: string;
  onChange: (branchId: string) => void;
  size?: 'small' | 'medium';
}

export const BranchSelect = ({
  value,
  onChange,
  size = 'small',
}: BranchSelectProps) => {
  return (
    <FormControl size={size} sx={{ minWidth: 220 }}>
      <InputLabel id='branch-select-label'>Branch</InputLabel>
      <Select
        labelId='branch-select-label'
        label='Branch'
        value={value}
        onChange={event => {
          const next = event.target.value as string;
          setCurrentBranchId(next);
          onChange(next);
        }}
      >
        {branches.map(branch => (
          <MenuItem key={branch.id} value={branch.id}>
            {branch.name} · {branch.code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
