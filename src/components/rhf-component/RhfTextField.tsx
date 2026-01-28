import React from 'react';
import type { Control, ControllerProps, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';

// Create a generic type for the RhfTextField component
type RhfTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  onCustomChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add onCustomChange prop
  trim?: boolean; // Add a trim prop to enable/disable trimming
} & Omit<TextFieldProps, 'onChange' | 'value'> &
  Omit<ControllerProps<T>, 'render' | 'control'>;

export const RhfTextField = <T extends FieldValues>({
  control,
  onCustomChange,
  size = 'small',
  ...props
}: RhfTextFieldProps<T>) => {
  return (
    <Controller
      control={control}
      {...props}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleBlur = () => {
          let trimmedValue = value;

          if (typeof value === 'string') {
            trimmedValue = trimmedValue.trim(); // Trim leading and trailing spaces
            // If both values are not same, send trimmedValue to onChange
            trimmedValue = trimmedValue.replace(/\s+/g, ' ');
          }
          if (trimmedValue !== value) {
            onChange(trimmedValue);
          }
        };

        return (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onCustomChange || onChange}
            onBlur={handleBlur}
            value={value}
            {...props}
            size={size}
          />
        );
      }}
    />
  );
};

export default RhfTextField;
