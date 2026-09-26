import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField } from '@/components/auth/FormField';
import {
  getAuthErrorMessage,
  normalizeEmail,
  validateLogin,
  type FieldErrors,
  type LoginFields,
} from '@/lib/auth-validation';
import { useAuthFlow } from '@/lib/auth-flow';
import { supabase } from '@/lib/supabase';
import { Button, Spinner, Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

const EMPTY_LOGIN: LoginFields = { email: '', password: '' };

export default function LoginScreen() {
  const router = useRouter();
  const { beginOtp } = useAuthFlow();
  const [fields, setFields] = useState(EMPTY_LOGIN);
  const [errors, setErrors] = useState<FieldErrors<LoginFields>>({});
  const [requestError, setRequestError] = useState('');
  const [loadingAction, setLoadingAction] = useState<'login' | 'reset' | null>(null);

  const updateField = (field: keyof LoginFields, value: string) => {
    const next = { ...fields, [field]: value };
    setFields(next);
    if (errors[field]) setErrors(validateLogin(next));
    setRequestError('');
  };

  const handleLogin = async () => {
    const nextErrors = validateLogin(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoadingAction('login');
    setRequestError('');
    const email = normalizeEmail(fields.email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: fields.password,
    });

    if (!error && data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_verified')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setLoadingAction(null);
        setRequestError('Your student profile is unavailable. Contact support.');
        return;
      }

      if (!profile.is_verified) {
        const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
        setLoadingAction(null);
        if (resendError) {
          setRequestError(getAuthErrorMessage(resendError));
          return;
        }
        beginOtp(email, 'signup');
        router.push({ pathname: '/verify', params: { email, purpose: 'signup' } });
        return;
      }

      if (profile.role !== 'student') {
        await supabase.auth.signOut();
        setLoadingAction(null);
        setRequestError('This app currently supports student accounts only.');
        return;
      }

      setLoadingAction(null);
      router.replace('/home');
      return;
    }

    if (error?.message.toLowerCase().includes('email not confirmed')) {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
      setLoadingAction(null);
      if (resendError) {
        setRequestError(getAuthErrorMessage(resendError));
        return;
      }
      beginOtp(email, 'signup');
      router.push({ pathname: '/verify', params: { email, purpose: 'signup' } });
      return;
    }

    setLoadingAction(null);
    setRequestError(getAuthErrorMessage(error));
  };

  const handleForgotPassword = async () => {
    const emailErrors = validateLogin({ email: fields.email, password: 'valid' });
    setErrors((current) => ({ ...current, email: emailErrors.email }));
    if (emailErrors.email) return;

    setLoadingAction('reset');
    setRequestError('');
    const email = normalizeEmail(fields.email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoadingAction(null);

    if (error) {
      setRequestError(getAuthErrorMessage(error));
      return;
    }

    beginOtp(email, 'recovery');
    router.push({ pathname: '/verify', params: { email, purpose: 'recovery' } });
  };

  return (
    <AuthScaffold
      title="Welcome back"
      footer={
        <Button variant="ghost" onPress={() => router.push('/signup')}>
          <Button.Label>Don&apos;t have an account? Sign up</Button.Label>
        </Button>
      }
    >
      <View className="gap-1">
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          keyboardType="email-address"
          label="University email"
          placeholder="name@nutech.edu.pk"
          value={fields.email}
          onChangeText={(value) => updateField('email', value)}
          onBlur={() =>
            setErrors(validateLogin({ ...fields, password: fields.password || 'valid' }))
          }
        />
        <FormField
          autoCapitalize="none"
          autoComplete="current-password"
          error={errors.password}
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={fields.password}
          onChangeText={(value) => updateField('password', value)}
        />

        <Button
          className="self-end"
          isDisabled={loadingAction !== null}
          size="sm"
          variant="ghost"
          onPress={handleForgotPassword}
        >
          {loadingAction === 'reset' ? <Spinner size="sm" /> : null}
          <Button.Label>Forgot password?</Button.Label>
        </Button>

        <View className="min-h-12 justify-center">
          {requestError ? (
            <Typography className="text-danger text-sm">{requestError}</Typography>
          ) : null}
        </View>

        <Button isDisabled={loadingAction !== null} size="lg" onPress={handleLogin}>
          {loadingAction === 'login' ? <Spinner size="sm" /> : null}
          <Button.Label>{loadingAction === 'login' ? 'Signing in' : 'Sign in'}</Button.Label>
        </Button>
      </View>
    </AuthScaffold>
  );
}
