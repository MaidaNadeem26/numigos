import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button, Typography } from 'heroui-native';
import { useState } from 'react';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField, SelectField } from '@/components/auth/FormField';
import { useAuthFlow } from '@/lib/auth-flow';
import {
  DEPARTMENTS,
  type FieldErrors,
  type SignupFields,
  validateSignup,
} from '@/lib/auth-validation';
import { getAuthHeroHeight } from '@/lib/layout';
import { supabase } from '@/lib/supabase';

type SignupErrors = FieldErrors<SignupFields>;

const BASIC_DETAIL_KEYS: (keyof SignupErrors)[] = [
  'fullName',
  'email',
  'password',
  'confirmPassword',
];

export default function SignupScreen() {
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();
  const { signupDraft, updateSignupDraft, beginSignupVerification } = useAuthFlow();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    const validationErrors = validateSignup(signupDraft);
    const basicErrors = Object.fromEntries(
      BASIC_DETAIL_KEYS.filter((key) => validationErrors[key]).map((key) => [
        key,
        validationErrors[key],
      ]),
    ) as SignupErrors;

    setErrors(basicErrors);
    setSubmitError('');

    if (Object.keys(basicErrors).length === 0) {
      setStep(2);
    }
  };

  const handleSignup = async () => {
    const validationErrors = validateSignup(signupDraft);
    setErrors(validationErrors);
    setSubmitError('');

    if (Object.keys(validationErrors).length > 0) {
      if (BASIC_DETAIL_KEYS.some((key) => validationErrors[key])) {
        setStep(1);
      }
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: signupDraft.email.trim(),
      password: signupDraft.password,
      options: {
        data: {
          full_name: signupDraft.fullName.trim(),
          roll_number: signupDraft.rollNumber.trim(),
          department: signupDraft.department,
          role: 'student',
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    beginSignupVerification(signupDraft.email.trim());
    router.push('/verify');
  };

  return (
    <AuthScaffold
      alignContentLeft
      dense
      header={
        <View className="mb-3 flex-row gap-2">
          <View className="bg-brand h-1 flex-1 rounded-full" />
          <View className={`h-1 flex-1 rounded-full ${step === 2 ? 'bg-brand' : 'bg-line'}`} />
        </View>
      }
      heroHeight={getAuthHeroHeight(viewportHeight, viewportWidth)}
      hideHeroBrand
      subtitle={
        step === 1 ? 'Step 1 of 2 — your basic details' : 'Step 2 of 2 — your academic details'
      }
      title="Create your account"
      useHeroArtwork
    >
      {step === 1 ? (
        <>
          <View className="gap-1">
            <FormField
              autoCapitalize="words"
              compact
              error={errors.fullName}
              fieldTone="softNeutral"
              label="Full Name"
              onChangeText={(fullName) => updateSignupDraft({ fullName })}
              placeholder="Your full name"
              textContentType="name"
              value={signupDraft.fullName}
            />
            <FormField
              compact
              error={errors.email}
              fieldTone="softNeutral"
              keyboardType="email-address"
              label="University Email"
              onChangeText={(email) => updateSignupDraft({ email })}
              placeholder="name@nutech.edu.pk"
              textContentType="emailAddress"
              value={signupDraft.email}
            />
            <FormField
              compact
              error={errors.password}
              fieldTone="softNeutral"
              label="Password"
              onChangeText={(password) => updateSignupDraft({ password })}
              onToggleSecure={() => setShowPassword((current) => !current)}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              textContentType="newPassword"
              value={signupDraft.password}
            />
            <FormField
              compact
              error={errors.confirmPassword}
              fieldTone="softNeutral"
              label="Confirm Password"
              onChangeText={(confirmPassword) => updateSignupDraft({ confirmPassword })}
              onToggleSecure={() => setShowConfirmPassword((current) => !current)}
              placeholder="Repeat your password"
              secureTextEntry={!showConfirmPassword}
              textContentType="newPassword"
              value={signupDraft.confirmPassword}
            />
          </View>

          <Button className="bg-brand h-12 w-full rounded-full" onPress={handleContinue}>
            <Button.Label className="font-semibold text-white">Continue</Button.Label>
          </Button>

          <View className="mt-1 flex-row flex-wrap items-center justify-center">
            <Typography className="text-ink-muted font-sans text-sm">
              Already have an account?{' '}
            </Typography>
            <Button
              className="h-10 rounded-full px-2"
              onPress={() => router.replace('/login')}
              variant="tertiary"
            >
              <Button.Label className="text-brand text-sm font-semibold">Sign in</Button.Label>
            </Button>
          </View>
        </>
      ) : (
        <>
          <View className="gap-1">
            <FormField
              compact
              error={errors.rollNumber}
              fieldTone="softNeutral"
              label="Registration/Roll Number"
              onChangeText={(rollNumber) => updateSignupDraft({ rollNumber })}
              placeholder="Your registration number"
              value={signupDraft.rollNumber}
            />
            <SelectField
              compact
              error={errors.department}
              fieldTone="softNeutral"
              label="Department"
              onValueChange={(option) => updateSignupDraft({ department: option?.value ?? '' })}
              options={DEPARTMENTS}
              placeholder="Choose your department"
              showIcon={false}
              value={DEPARTMENTS.find((option) => option.value === signupDraft.department)}
            />
          </View>

          {submitError ? (
            <View className="bg-error-soft border-error rounded-status mb-3 border px-4 py-3">
              <Typography className="text-error font-sans text-sm">{submitError}</Typography>
            </View>
          ) : null}

          <Button
            className="bg-brand h-12 w-full rounded-full"
            isDisabled={isLoading}
            onPress={handleSignup}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Button.Label className="font-semibold text-white">Create account</Button.Label>
            )}
          </Button>

          <Button
            className="mt-1 self-center px-4"
            isDisabled={isLoading}
            onPress={() => {
              setErrors({});
              setSubmitError('');
              setStep(1);
            }}
            variant="tertiary"
          >
            <Ionicons name="chevron-back" size={16} />
            <Button.Label className="text-ink-muted font-sans text-sm font-medium">
              Back
            </Button.Label>
          </Button>
        </>
      )}
    </AuthScaffold>
  );
}
