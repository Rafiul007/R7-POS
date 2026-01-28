import React from 'react';
import type { Control, ControllerProps, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { RadioProps } from '@mui/material';
import {
  Radio,
  FormControlLabel,
  RadioGroup,
  FormHelperText,
} from '@mui/material';

type RhfRadioProps<T extends FieldValues> = {
  control: Control<T>;
  options: Array<{ value: string | number; label: string }>;
  row?: boolean;
} & Omit<RadioProps, 'onChange' | 'checked'> &
  Omit<ControllerProps<T>, 'render' | 'control'>;

export const RhfRadio = <T extends FieldValues>({
  control,
  options,
  row = false,
  ...props
}: RhfRadioProps<T>) => {
  return (
    <Controller
      control={control}
      {...props}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <RadioGroup row={row} onChange={onChange} value={value || ''}>
            {options.map(option => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio {...props} />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </div>
      )}
    />
  );
};

export default RhfRadio;
