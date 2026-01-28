import type { Control, ControllerProps, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { SelectProps } from '@mui/material';
import {
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
} from '@mui/material';

type RhfSelectProps<T extends FieldValues> = {
  control: Control<T>;
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  size?: 'small' | 'medium';
} & Omit<SelectProps, 'onChange' | 'value'> &
  Omit<ControllerProps<T>, 'render' | 'control'>;

export const RhfSelect = <T extends FieldValues>({
  control,
  label,
  options,
  size = 'small',
  ...props
}: RhfSelectProps<T>) => {
  return (
    <Controller
      control={control}
      {...props}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl fullWidth size={size} error={!!error}>
          {label && <InputLabel>{label}</InputLabel>}
          <Select
            label={label}
            onChange={onChange}
            value={value || ''}
            {...props}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default RhfSelect;
