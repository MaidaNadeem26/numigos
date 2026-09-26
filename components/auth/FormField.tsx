import { FieldError, Input, Label, TextField } from 'heroui-native';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

type FormFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
};

export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <TextField className="gap-2" isInvalid={Boolean(error)} isRequired>
      <Label>{label}</Label>
      <Input {...inputProps} />
      <View className="min-h-5">{error ? <FieldError>{error}</FieldError> : null}</View>
    </TextField>
  );
}
