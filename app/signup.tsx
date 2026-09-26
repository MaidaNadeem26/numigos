import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField } from '@/components/auth/FormField';
import {
  getAuthErrorMessage,
  normalizeEmail,
  validateSignup,
  type FieldErrors,
  type SignupFields,
} from '@/lib/auth-validation';
import { useAuthFlow } from '@/lib/auth-flow';
import { supabase } from '@/lib/supabase';
import { DEPARTMENTS } from '@/lib/theme';
import { Button, FieldError, Label, Select, Spinner, Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { Fragment, useState } from 'react';
import { View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const { signupDraft, setSignupDraft, beginOtp } = useAuthFlow();
  const [errors, setErrors] = useState<FieldErrors<SignupFields>>({});
  const [requestError, setRequestError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedDepartment = DEPARTMENTS.find(
    (department) => department.value === signupDraft.department,
  );

  const updateField = (field: keyof SignupFields, value: string) => {
    const next = { ...signupDraft, [field]: value };
    setSignupDraft(next);
    if (errors[field]) setErrors(validateSignup(next));
    setRequestError('');
  };

  const handleSignup = async () => {
    const nextErrors = validateSignup(signupDraft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    setRequestError('');
    const email = normalizeEmail(signupDraft.email);
    const { data, error } = await supabase.auth.signUp({
      email,
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
      setRequestError(getAuthErrorMessage(error));
      return;
    }
    if (data.user?.identities?.length === 0) {
      setRequestError('An account already exists for this email. Sign in instead.');
      return;
    }

    beginOtp(email, 'signup');
    router.push({ pathname: '/verify', params: { email, purpose: 'signup' } });
  };

  return (
    <AuthScaffold
      title="Create account"
      backFallback="/login"
      footer={
        <Button variant="ghost" onPress={() => router.replace('/login')}>
          <Button.Label>Already have an account? Sign in</Button.Label>
        </Button>
      }
    >
      <View className="gap-1">
        <FormField
          autoCapitalize="words"
          autoComplete="name"
          error={errors.fullName}
          label="Full name"
          placeholder="Your full name"
          value={signupDraft.fullName}
          onChangeText={(value) => updateField('fullName', value)}
        />
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          keyboardType="email-address"
          label="University email"
          placeholder="name@nutech.edu.pk"
          value={signupDraft.email}
          onChangeText={(value) => updateField('email', value)}
          onBlur={() => setErrors(validateSignup(signupDraft))}
        />
        <FormField
          autoCapitalize="none"
          autoComplete="new-password"
          error={errors.password}
          label="Password"
          placeholder="At least 8 characters"
          secureTextEntry
          value={signupDraft.password}
          onChangeText={(value) => updateField('password', value)}
        />
        <FormField
          autoCapitalize="none"
          autoComplete="new-password"
          error={errors.confirmPassword}
          label="Confirm password"
          placeholder="Re-enter your password"
          secureTextEntry
          value={signupDraft.confirmPassword}
          onChangeText={(value) => updateField('confirmPassword', value)}
        />
        <FormField
          autoCapitalize="characters"
          error={errors.rollNumber}
          label="Registration / roll number"
          placeholder="Enter your roll number"
          value={signupDraft.rollNumber}
          onChangeText={(value) => updateField('rollNumber', value)}
        />

        <View className="gap-2">
          <Label isRequired isInvalid={Boolean(errors.department)}>
            Department
          </Label>
          <Select
            value={selectedDepartment}
            onValueChange={(option) => updateField('department', option?.value ?? '')}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select your department" />
              <Select.TriggerIndicator />
            </Select.Trigger>
            <Select.Portal>
              <Select.Overlay />
              <Select.Content presentation="popover" width="trigger">
                {DEPARTMENTS.map((department) => (
                  <Fragment key={department.value}>
                    <Select.Item value={department.value} label={department.label} />
                  </Fragment>
                ))}
              </Select.Content>
            </Select.Portal>
          </Select>
          <View className="min-h-5">
            {errors.department ? <FieldError>{errors.department}</FieldError> : null}
          </View>
        </View>

        <View className="min-h-12 justify-center">
          {requestError ? (
            <Typography className="text-danger text-sm">{requestError}</Typography>
          ) : null}
        </View>

        <Button isDisabled={isLoading} size="lg" onPress={handleSignup}>
          {isLoading ? <Spinner size="sm" /> : null}
          <Button.Label>{isLoading ? 'Creating account' : 'Create account'}</Button.Label>
        </Button>
      </View>
    </AuthScaffold>
  );
}
