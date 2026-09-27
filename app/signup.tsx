import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, useWindowDimensions, View } from 'react-native';

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
  const isShortScreen = viewportHeight <= 660;
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
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: isShortScreen ? 10 : 14,
          }}
        >
          <View
            style={{
              backgroundColor: '#1B4336',
              borderRadius: 999,
              flex: 1,
              height: 3,
            }}
          />
          <View
            style={{
              backgroundColor: step === 2 ? '#1B4336' : '#E2E0D8',
              borderRadius: 999,
              flex: 1,
              height: 3,
            }}
          />
        </View>
      }
      heroHeight={getAuthHeroHeight(viewportHeight, viewportWidth)}
      hideHeroBrand
      noScroll
      subtitle={
        step === 1 ? 'Step 1 of 2 — your basic details' : 'Step 2 of 2 — your academic details'
      }
      title="Create your account"
      useHeroArtwork
    >
      <View style={{ flex: 1 }}>
        {step === 1 ? (
          <>
            <View style={{ gap: 7 }}>
              <FormField
                autoCapitalize="words"
                borderless
                compact
                error={errors.fullName}
                fieldTone="softNeutral"
                label="Full name"
                onChangeText={(fullName) => updateSignupDraft({ fullName })}
                placeholder="Your full name"
                textContentType="name"
                value={signupDraft.fullName}
              />
              <FormField
                borderless
                compact
                error={errors.email}
                fieldTone="softNeutral"
                keyboardType="email-address"
                label="University email"
                onChangeText={(email) => updateSignupDraft({ email })}
                placeholder="name@nutech.edu.pk"
                textContentType="emailAddress"
                value={signupDraft.email}
              />
              <FormField
                borderless
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
                borderless
                compact
                error={errors.confirmPassword}
                fieldTone="softNeutral"
                label="Confirm password"
                onChangeText={(confirmPassword) => updateSignupDraft({ confirmPassword })}
                onToggleSecure={() => setShowConfirmPassword((current) => !current)}
                placeholder="Repeat your password"
                secureTextEntry={!showConfirmPassword}
                textContentType="newPassword"
                value={signupDraft.confirmPassword}
              />
            </View>

            <Pressable
              onPress={handleContinue}
              style={{
                alignItems: 'center',
                backgroundColor: '#1B4336',
                borderRadius: 999,
                height: 37,
                justifyContent: 'center',
                marginTop: 12,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: '600' }}>
                Continue
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={{ gap: isShortScreen ? 8 : 12 }}>
              <FormField
                borderless
                compact
                error={errors.rollNumber}
                fieldTone="softNeutral"
                label="Registration/Roll number"
                onChangeText={(rollNumber) => updateSignupDraft({ rollNumber })}
                placeholder="F23608050"
                value={signupDraft.rollNumber}
              />
              <SelectField
                borderless
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
              <View className="bg-error-soft mt-2 rounded-lg px-3 py-2">
                <Text style={{ color: '#BA3F50', fontSize: 11 }}>{submitError}</Text>
              </View>
            ) : null}

            <Pressable
              disabled={isLoading}
              onPress={handleSignup}
              style={{
                alignItems: 'center',
                backgroundColor: '#1B4336',
                borderRadius: 999,
                height: 37,
                justifyContent: 'center',
                marginTop: 12,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: '600' }}>
                  Create account
                </Text>
              )}
            </Pressable>

            <Pressable
              disabled={isLoading}
              onPress={() => {
                setErrors({});
                setSubmitError('');
                setStep(1);
              }}
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
                gap: 4,
                marginTop: 10,
                paddingVertical: 4,
              }}
            >
              <Ionicons color="#66736E" name="chevron-back" size={14} />
              <Text style={{ color: '#66736E', fontSize: 11.5, fontWeight: '500' }}>Back</Text>
            </Pressable>
          </>
        )}

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
            paddingBottom: 4,
          }}
        >
          <Text style={{ color: '#66736E', fontSize: 11 }}>Already have an account? </Text>
          <Pressable onPress={() => router.replace('/login')}>
            <Text style={{ color: '#9E5A24', fontSize: 11, fontWeight: '700' }}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </AuthScaffold>
  );
}
