import React from 'react';
import type { Control, ControllerProps, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { SwitchProps } from '@mui/material';
import { Switch, FormControlLabel, FormHelperText } from '@mui/material';

type RhfSwitchProps<T extends FieldValues> = {
  control: Control<T>;
  label?: string;
} & Omit<SwitchProps, 'onChange' | 'checked'> &
  Omit<ControllerProps<T>, 'render' | 'control'>;

export const RhfSwitch = <T extends FieldValues>({
  control,
  label,
  ...props
}: RhfSwitchProps<T>) => {
  return (
    <Controller
      control={control}
      {...props}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <FormControlLabel
            control={
              <Switch checked={!!value} onChange={onChange} {...props} />
            }
            label={label}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </div>
      )}
    />
  );
};

export default RhfSwitch;
