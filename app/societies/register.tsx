import { FieldError, Label, TextArea, TextField, Typography } from 'heroui-native';
import { CheckCircle2 } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { FormField, SelectField } from '@/components/auth/FormField';
import { ScreenHeader } from '@/components/student/ScreenHeader';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { EVENT_CATEGORIES } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

const CATEGORY_OPTIONS = EVENT_CATEGORIES.map((category) => ({
  value: category.toLowerCase(),
  label: category,
}));

export default function RegisterSocietyScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<{ value: string; label: string }>();
  const [purpose, setPurpose] = useState('');
  const [advisor, setAdvisor] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const valid =
    name.trim().length >= 3 &&
    Boolean(category) &&
    purpose.trim().length >= 20 &&
    advisor.trim().length >= 3;

  if (submitted)
    return (
      <SafeAreaView className="bg-background flex-1">
        <ScreenHeader fallback="/societies" title="Register society" />
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-success-soft h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 color={numigosTheme.colors.success} size={30} />
          </View>
          <Typography className="font-display text-home-ink mt-5 text-center text-[21px] font-bold">
            Request submitted
          </Typography>
          <Typography className="text-ink-muted mt-2 text-center text-[12px] leading-5">
            Student Affairs will review your society request and contact you through your NUTECH
            email.
          </Typography>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <ScreenHeader
        fallback="/societies"
        title="Register society"
        subtitle="Submit a request to Student Affairs"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-safe-offset-8 pt-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormField
            autoCapitalize="words"
            error={showErrors && name.trim().length < 3 ? 'Enter a society name.' : undefined}
            label="Society name"
            onChangeText={setName}
            placeholder="e.g. Data Science Society"
            value={name}
          />
          <SelectField
            error={showErrors && !category ? 'Choose a category.' : undefined}
            label="Category"
            onValueChange={setCategory}
            options={CATEGORY_OPTIONS}
            placeholder="Choose category"
            showIcon={false}
            value={category}
          />
          <TextField className="gap-2" isInvalid={showErrors && purpose.trim().length < 20}>
            <Label className="text-ink ml-1 font-semibold">Purpose and activities</Label>
            <TextArea
              className="border-line bg-field text-ink min-h-[120px] rounded-[22px] border px-4 py-3 text-sm"
              onChangeText={setPurpose}
              placeholder="Describe the society’s purpose and planned activities"
              placeholderColorClassName="text-ink-muted"
              value={purpose}
            />
            <View className="min-h-5 pl-1">
              {showErrors && purpose.trim().length < 20 ? (
                <FieldError className="text-error text-sm">Add at least 20 characters.</FieldError>
              ) : null}
            </View>
          </TextField>
          <FormField
            autoCapitalize="words"
            error={
              showErrors && advisor.trim().length < 3 ? 'Enter the proposed advisor.' : undefined
            }
            label="Proposed faculty advisor"
            onChangeText={setAdvisor}
            placeholder="Faculty member name"
            value={advisor}
          />
          <GesturePressable
            accessibilityRole="button"
            className="bg-brand mt-2 h-13 items-center justify-center rounded-full active:opacity-80"
            onPress={() => {
              setShowErrors(true);
              if (valid) setSubmitted(true);
            }}
          >
            <Typography className="text-[14px] font-bold text-white">Submit request</Typography>
          </GesturePressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
