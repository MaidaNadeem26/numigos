import { Ionicons } from '@expo/vector-icons';
import { Button, FieldError, Input, Label, Select, TextField, Typography } from 'heroui-native';
import { View } from 'react-native';

import { numigosTheme } from '@/lib/theme';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  secureTextEntry?: boolean;
  onToggleSecure?: () => void;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
  textContentType?: 'emailAddress' | 'password' | 'newPassword' | 'name';
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  onToggleSecure,
  keyboardType = 'default',
  autoCapitalize = 'none',
  textContentType,
}: FormFieldProps) {
  return (
    <TextField className="gap-2" isInvalid={Boolean(error)}>
      <Label className="text-field-label text-ink font-semibold">{label}</Label>
      <View className="relative">
        <Input
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          className={`rounded-field bg-surface text-ink h-14 border px-4 pr-12 font-sans text-base ${
            error ? 'border-error' : 'border-line'
          }`}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderColorClassName="text-ink-muted"
          secureTextEntry={secureTextEntry}
          selectionColorClassName="accent-brand"
          textContentType={textContentType}
          value={value}
        />
        {onToggleSecure ? (
          <Button
            accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
            className="absolute top-1.5 right-1.5 size-11 rounded-full"
            isIconOnly
            onPress={onToggleSecure}
            variant="tertiary"
          >
            <Ionicons
              color={error ? numigosTheme.colors.error : numigosTheme.colors.inkMuted}
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={20}
            />
          </Button>
        ) : null}
      </View>
      <View className="min-h-5">
        {error ? <FieldError className="text-error font-sans text-sm">{error}</FieldError> : null}
      </View>
    </TextField>
  );
}

interface SelectFieldProps {
  label: string;
  value?: { value: string; label: string };
  options: readonly { value: string; label: string }[];
  onValueChange: (value?: { value: string; label: string }) => void;
  placeholder: string;
  error?: string;
}

export function SelectField({
  label,
  value,
  options,
  onValueChange,
  placeholder,
  error,
}: SelectFieldProps) {
  return (
    <View className="gap-2">
      <Typography className="text-field-label text-ink font-semibold">{label}</Typography>
      <Select onValueChange={onValueChange} value={value}>
        <Select.Trigger
          className={`rounded-field bg-surface h-14 border px-4 ${
            error ? 'border-error' : 'border-line'
          }`}
        >
          <Select.Value className="text-ink font-sans text-base" placeholder={placeholder} />
          <Select.TriggerIndicator className="text-brand" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Overlay />
          <Select.Content
            className="bg-surface pb-safe-offset-2 rounded-[22px] px-2"
            presentation="bottom-sheet"
          >
            <Select.ListLabel className="font-display-semibold text-ink text-lg">
              Choose department
            </Select.ListLabel>
            {options.map((option) => (
              <Select.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Select.Content>
        </Select.Portal>
      </Select>
      <View className="min-h-5">
        {error ? <Typography className="text-error font-sans text-sm">{error}</Typography> : null}
      </View>
    </View>
  );
}
