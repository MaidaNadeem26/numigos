import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';

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
  borderless = false,
  fieldTone = 'default',
  secureTextEntry,
  onToggleSecure,
  keyboardType = 'default',
  autoCapitalize = 'none',
  textContentType,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isSoftNeutral = fieldTone === 'softNeutral';
  const controlHeight = compact ? 35 : 42;

  return (
    <View style={{ gap: 3 }}>
      <Text
        style={{
          color: '#1A2822',
          fontSize: 11,
          fontWeight: '600',
          lineHeight: 14,
          marginLeft: 2,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: isSoftNeutral ? '#EFECE6' : '#F6F8F7',
          borderColor: error
            ? numigosTheme.colors.error
            : isFocused
              ? numigosTheme.colors.brand
              : borderless
                ? 'transparent'
                : '#DBE4E0',
          borderRadius: isSoftNeutral ? 9 : 12,
          borderWidth: error ? 1.25 : 1,
          flexDirection: 'row',
          height: controlHeight,
          paddingLeft: icon ? 10 : 12,
          paddingRight: onToggleSecure ? 6 : 12,
        }}
      >
        {icon ? (
          <View style={{ marginRight: 8 }}>
            <Ionicons
              color={
                error
                  ? numigosTheme.colors.error
                  : isFocused
                    ? numigosTheme.colors.brand
                    : numigosTheme.colors.inkMuted
              }
              name={icon}
              size={15}
            />
          </View>
        ) : null}
        <TextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="#8B9490"
          secureTextEntry={secureTextEntry}
          selectionColor={numigosTheme.colors.brand}
          style={[
            {
              color: '#162620',
              flex: 1,
              fontSize: 12,
              height: '100%',
              paddingVertical: 0,
            },
            Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
          ]}
          textContentType={textContentType}
          value={value}
        />
        {onToggleSecure ? (
          <Pressable
            accessibilityLabel={secureTextEntry ? 'Show password' : 'Hide password'}
            onPress={onToggleSecure}
            style={{
              alignItems: 'center',
              height: controlHeight,
              justifyContent: 'center',
              width: 30,
            }}
          >
            <Ionicons
              color={error ? numigosTheme.colors.error : '#687570'}
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              size={16}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
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
  const [isOpen, setIsOpen] = useState(false);
  const isSoftNeutral = fieldTone === 'softNeutral';
  const controlHeight = compact ? 35 : 42;

  return (
    <View style={{ gap: 3 }}>
      <Text
        style={{
          color: '#1A2822',
          fontSize: 11,
          fontWeight: '600',
          lineHeight: 14,
          marginLeft: 2,
        }}
      >
        {label}
      </Text>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={{
          alignItems: 'center',
          backgroundColor: isSoftNeutral ? '#EFECE6' : '#F6F8F7',
          borderColor: error
            ? numigosTheme.colors.error
            : isOpen
              ? numigosTheme.colors.brand
              : borderless
                ? 'transparent'
                : '#DBE4E0',
          borderRadius: isSoftNeutral ? 9 : 12,
          borderWidth: error ? 1.25 : 1,
          flexDirection: 'row',
          height: controlHeight,
          paddingLeft: showIcon ? 10 : 12,
          paddingRight: 12,
        }}
      >
        {showIcon ? (
          <View style={{ marginRight: 8 }}>
            <Ionicons
              color={error ? numigosTheme.colors.error : numigosTheme.colors.inkMuted}
              name="school-outline"
              size={15}
            />
          </View>
        ) : null}
        <Text
          numberOfLines={1}
          style={{
            color: value?.label ? '#162620' : '#8B9490',
            flex: 1,
            fontSize: 12,
          }}
        >
          {value?.label || placeholder}
        </Text>
        <Ionicons
          color="#687570"
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={15}
        />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}
      >
        <Pressable
          onPress={() => setIsOpen(false)}
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(11, 24, 19, 0.45)',
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FAF9F5',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxWidth: 440,
              paddingBottom: 16,
              paddingHorizontal: 14,
              paddingTop: 10,
              width: '100%',
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: '#D5D3CC',
                borderRadius: 999,
                height: 3.5,
                marginBottom: 10,
                width: 32,
              }}
            />
            <Text
              style={{
                color: '#162620',
                fontSize: 12.5,
                fontWeight: '700',
                marginBottom: 6,
                paddingHorizontal: 6,
              }}
            >
              Choose department
            </Text>
            {options.map((option) => {
              const isSelected = value?.value === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onValueChange(option);
                    setIsOpen(false);
                  }}
                  style={{
                    alignItems: 'center',
                    backgroundColor: isSelected ? '#EFECE6' : 'transparent',
                    borderRadius: 8,
                    flexDirection: 'row',
                    height: 34,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? '#1B4336' : '#162620',
                      fontSize: 12,
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <Ionicons color="#1B4336" name="checkmark" size={15} />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
