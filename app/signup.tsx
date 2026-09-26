import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { router } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField, SelectField } from '@/components/auth/FormField';
import { useAuthFlow } from '@/lib/auth-flow';
import { mapAuthError, validateSignup } from '@/lib/auth-validation';
import { supabase } from '@/lib/supabase';
import { numigosTheme } from '@/lib/theme';

const departments = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering' },
  { value: 'Civil Engineering', label: 'Civil Engineering' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Business and Management', label: 'Business and Management' },
] as const;

export default function SignupScreen() {
  const { signupDraft, updateSignupDraft, beginSignupVerification } = useAuthFlow();
  const [confirmPassword, setConfirmPassword] = useState(signupDraft.password);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDepartment = departments.find(
    (department) => department.value === signupDraft.department,
  );

  const handleSignup = async () => {
    const nextErrors = validateSignup({
      ...signupDraft,
      confirmPassword,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const normalizedEmail = signupDraft.email.trim().toLowerCase();
    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
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
    setIsSubmitting(false);

    if (error) {
      setErrors({ form: mapAuthError(error.message) });
      return;
    }

    if (!data.user || data.user.identities?.length === 0) {
      setErrors({ form: 'An account already exists for this email. Sign in instead.' });
      return;
    }

    beginSignupVerification(normalizedEmail);
    router.push({ pathname: '/verify', params: { mode: 'signup' } });
  };

  return (
    <AuthScaffold
      compactHero
      onBack={() => router.back()}
      subtitle="Use your NUTECH email to join campus events and student societies."
      title="Create your account"
    >
      <View className="gap-1">
        <FormField
          autoCapitalize="words"
          error={errors.fullName}
          icon="person-outline"
          label="Full name"
          onChangeText={(fullName) => updateSignupDraft({ fullName })}
          placeholder="Your full name"
          textContentType="name"
          value={signupDraft.fullName}
        />
        <FormField
          error={errors.email}
          icon="mail-outline"
          keyboardType="email-address"
          label="University email"
          onChangeText={(email) => updateSignupDraft({ email })}
          placeholder="you@nutech.edu.pk"
          textContentType="emailAddress"
          value={signupDraft.email}
        />
        <FormField
          error={errors.rollNumber}
          icon="card-outline"
          label="Registration / roll number"
          onChangeText={(rollNumber) => updateSignupDraft({ rollNumber })}
          placeholder="e.g. F23-CS-001"
          value={signupDraft.rollNumber}
        />
        <SelectField
          error={errors.department}
          label="Department"
          onValueChange={(department) => updateSignupDraft({ department: department?.value ?? '' })}
          options={departments}
          placeholder="Choose your department"
          value={selectedDepartment}
        />
        <FormField
          error={errors.password}
          icon="lock-closed-outline"
          label="Password"
          onChangeText={(password) => updateSignupDraft({ password })}
          onToggleSecure={() => setShowPassword((current) => !current)}
          placeholder="At least 8 characters and 1 number"
          secureTextEntry={!showPassword}
          textContentType="newPassword"
          value={signupDraft.password}
        />
        <FormField
          error={errors.confirmPassword}
          icon="shield-checkmark-outline"
          label="Confirm password"
          onChangeText={setConfirmPassword}
          onToggleSecure={() => setShowConfirmPassword((current) => !current)}
          placeholder="Enter your password again"
          secureTextEntry={!showConfirmPassword}
          textContentType="newPassword"
          value={confirmPassword}
        />

        <View className="min-h-12 justify-center">
          {errors.form ? (
            <View className="bg-error-soft rounded-xl px-4 py-3">
              <Typography className="text-error text-sm font-medium">{errors.form}</Typography>
            </View>
          ) : null}
        </View>

        <Button
          className="action-shadow rounded-action bg-brand mt-2 h-14"
          isDisabled={isSubmitting}
          onPress={handleSignup}
        >
          {isSubmitting ? (
            <ActivityIndicator color={numigosTheme.colors.surface} />
          ) : (
            <Button.Label className="text-action font-semibold text-white">
              Create account
            </Button.Label>
          )}
        </Button>

        <View className="mt-6 flex-row items-center justify-center">
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
      </View>
    </AuthScaffold>
  );
}
