import React from 'react';
import type { Control, ControllerProps, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CheckboxProps } from '@mui/material';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

type RhfCheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  label?: string;
} & Omit<CheckboxProps, 'onChange' | 'checked'> &
  Omit<ControllerProps<T>, 'render' | 'control'>;

export const RhfCheckbox = <T extends FieldValues>({
  control,
  label,
  ...props
}: RhfCheckboxProps<T>) => {
  return (
    <Controller
      control={control}
      {...props}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <FormControlLabel
            control={
              <Checkbox checked={!!value} onChange={onChange} {...props} />
            }
            label={label}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </div>
      )}
    />
  );
};

export default RhfCheckbox;
