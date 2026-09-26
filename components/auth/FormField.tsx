import { Ionicons } from '@expo/vector-icons';
import { Button, FieldError, Input, Label, Select, TextField, Typography } from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';

import { numigosTheme } from '@/lib/theme';

type FieldIcon = keyof typeof Ionicons.glyphMap;

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon?: FieldIcon;
  compact?: boolean;
  error?: string;
  preciseIconAlignment?: boolean;
  borderless?: boolean;
  fieldTone?: 'default' | 'softNeutral';
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
  icon,
  compact = false,
  error,
  preciseIconAlignment = false,
  borderless = false,
  fieldTone = 'default',
  secureTextEntry,
  onToggleSecure,
  keyboardType = 'default',
  autoCapitalize = 'none',
  textContentType,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextField className={compact ? 'gap-1' : 'gap-2'} isInvalid={Boolean(error)}>
      <Label
        className={`${compact ? 'text-signup-label' : 'text-field-label'} text-ink ml-1 font-semibold`}
      >
        {label}
      </Label>
      <View className="relative">
        {icon ? (
          <View
            className={`h-auth-control absolute top-0 left-4 z-10 justify-center ${
              preciseIconAlignment ? 'w-5 items-center' : ''
            }`}
          >
            <Ionicons
              color={
                error
                  ? numigosTheme.colors.error
                  : isFocused
                    ? numigosTheme.colors.brand
                    : numigosTheme.colors.inkMuted
              }
              name={icon}
              size={19}
            />
          </View>
        ) : null}
        <Input
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          className={`rounded-field text-ink border pr-12 font-sans text-base ${
            compact ? 'h-signup-control' : 'h-auth-control'
          } ${
            fieldTone === 'softNeutral' ? 'bg-login-field' : 'bg-field'
          } ${icon ? 'pl-12' : 'pl-5'} ${
            error
              ? 'border-error'
              : isFocused
                ? 'field-focus-shadow border-brand'
                : borderless
                  ? 'border-transparent'
                  : 'border-line'
          }`}
          keyboardType={keyboardType}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
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
            className={`absolute right-1 min-w-0 items-center justify-center rounded-full px-0 ${
              compact ? 'size-signup-control top-0' : 'top-1.5 size-11'
            }`}
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
      <View className={compact && !error ? 'h-1 pl-1' : 'min-h-5 pl-1'}>
        {error ? (
          <FieldError className={`text-error font-sans ${compact ? 'text-xs' : 'text-sm'}`}>
            {error}
          </FieldError>
        ) : null}
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
  compact?: boolean;
  borderless?: boolean;
  fieldTone?: 'default' | 'softNeutral';
  showIcon?: boolean;
}

export function SelectField({
  label,
  value,
  options,
  onValueChange,
  placeholder,
  error,
  compact = false,
  borderless = false,
  fieldTone = 'default',
  showIcon = true,
}: SelectFieldProps) {
  return (
    <View className={compact ? 'gap-1' : 'gap-2'}>
      <Typography
        className={`${compact ? 'text-signup-label' : 'text-field-label'} text-ink ml-1 font-semibold`}
      >
        {label}
      </Typography>
      <Select onValueChange={onValueChange} value={value}>
        <Select.Trigger
          className={`rounded-field border pr-5 ${compact ? 'h-signup-control' : 'h-auth-control'} ${showIcon ? 'pl-4' : 'pl-5'} ${
            fieldTone === 'softNeutral' ? 'bg-login-field' : 'bg-field'
          } ${error ? 'border-error' : borderless ? 'border-transparent' : 'border-line'}`}
        >
          {showIcon ? (
            <View className="mr-3">
              <Ionicons
                color={error ? numigosTheme.colors.error : numigosTheme.colors.inkMuted}
                name="school-outline"
                size={19}
              />
            </View>
          ) : null}
          <Select.Value className="text-ink flex-1 font-sans text-base" placeholder={placeholder} />
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
      <View className={compact && !error ? 'h-1 pl-1' : 'min-h-5 pl-1'}>
        {error ? (
          <Typography className={`text-error font-sans ${compact ? 'text-xs' : 'text-sm'}`}>
            {error}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}
