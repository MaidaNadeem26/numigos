import { useMemo, useState } from 'react';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { router } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField } from '@/components/auth/FormField';
import { mapAuthError, validateEmail, validateLogin } from '@/lib/auth-validation';
import { useAuthFlow } from '@/lib/auth-flow';
import { getAuthenticatedProfile, supabase } from '@/lib/supabase';
import { getAuthHeroHeight } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

export default function LoginScreen() {
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();
  const { beginRecovery } = useAuthFlow();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingRecovery, setIsSendingRecovery] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recoveryStatus, setRecoveryStatus] = useState('');

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const handleLogin = async () => {
    const nextErrors = validateLogin({ email: normalizedEmail, password });
    setErrors(nextErrors);
    setRecoveryStatus('');
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      setIsSubmitting(false);
      setErrors({ form: mapAuthError(error?.message ?? 'Unable to sign in.') });
      return;
    }

    const { profile, error: profileError } = await getAuthenticatedProfile(data.user.id);
    setIsSubmitting(false);

    if (profileError) {
      setErrors({ form: mapAuthError(profileError.message) });
      return;
    }

    if (!profile?.is_verified) {
      await supabase.auth.signOut();
      beginRecovery(normalizedEmail);
      router.push({ pathname: '/verify', params: { mode: 'signup' } });
      return;
    }

    router.replace('/home');
  };

  const handleRecovery = async () => {
    const emailError = validateEmail(normalizedEmail);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsSendingRecovery(true);
    setErrors({});
    setRecoveryStatus('');
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
    setIsSendingRecovery(false);

    if (error) {
      setErrors({ form: mapAuthError(error.message) });
      return;
    }

    beginRecovery(normalizedEmail);
    setRecoveryStatus('A recovery code is on its way.');
    router.push({ pathname: '/verify', params: { mode: 'recovery' } });
  };

  return (
    <AuthScaffold
      alignContentLeft
      dense
      heroHeight={getAuthHeroHeight(viewportHeight, viewportWidth)}
      hideHeroBrand
      useHeroArtwork
      subtitle={
        isRecoveryMode
          ? 'Enter your university email and we’ll send a secure recovery code.'
          : 'Sign in to discover what’s happening across campus.'
      }
      title={isRecoveryMode ? 'Reset your password' : 'Welcome back'}
    >
      <View className="gap-1">
        <FormField
          autoCapitalize="none"
          borderless
          compact
          error={errors.email}
          fieldTone="softNeutral"
          keyboardType="email-address"
          label="University email"
          onChangeText={setEmail}
          placeholder="you@nutech.edu.pk"
          textContentType="emailAddress"
          value={email}
        />

        {!isRecoveryMode ? (
          <FormField
            borderless
            compact
            error={errors.password}
            fieldTone="softNeutral"
            label="Password"
            onChangeText={setPassword}
            onToggleSecure={() => setShowPassword((current) => !current)}
            placeholder="Enter your password"
            preciseIconAlignment
            secureTextEntry={!showPassword}
            textContentType="password"
            value={password}
          />
        ) : null}

        <View className="min-h-8 justify-center">
          {errors.form ? (
            <View className="bg-error-soft rounded-xl px-4 py-3">
              <Typography className="text-error text-sm font-medium">{errors.form}</Typography>
            </View>
          ) : recoveryStatus ? (
            <View className="bg-success-soft rounded-xl px-4 py-3">
              <Typography className="text-success text-sm font-medium">{recoveryStatus}</Typography>
            </View>
          ) : null}
        </View>

        <Button
          className="rounded-action bg-brand mt-1 h-14"
          isDisabled={isSubmitting || isSendingRecovery}
          onPress={isRecoveryMode ? handleRecovery : handleLogin}
        >
          {isSubmitting || isSendingRecovery ? (
            <ActivityIndicator color={numigosTheme.colors.surface} />
          ) : (
            <Button.Label className="text-action font-semibold text-white">
              {isRecoveryMode ? 'Send recovery code' : 'Sign in'}
            </Button.Label>
          )}
        </Button>

        <Button
          className="mt-2 h-10 self-center rounded-full px-4"
          onPress={() => {
            setErrors({});
            setRecoveryStatus('');
            setIsRecoveryMode((current) => !current);
          }}
          variant="tertiary"
        >
          <Button.Label className="text-brand text-sm font-semibold">
            {isRecoveryMode ? 'Back to sign in' : 'Forgot password?'}
          </Button.Label>
        </Button>

        {!isRecoveryMode ? (
          <View className="mt-1 flex-row flex-wrap items-center justify-center">
            <Typography className="text-ink-muted font-sans text-sm">
              Don’t have an account?{' '}
            </Typography>
            <Button
              className="h-10 rounded-full px-2"
              onPress={() => router.push('/signup')}
              variant="tertiary"
            >
              <Button.Label className="text-brand text-sm font-semibold">Sign up</Button.Label>
            </Button>
          </View>
        ) : null}
      </View>
    </AuthScaffold>
  );
}
