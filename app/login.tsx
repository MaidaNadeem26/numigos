import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField } from '@/components/auth/FormField';
import { mapAuthError, validateEmail, validateLogin } from '@/lib/auth-validation';
import { useAuthFlow } from '@/lib/auth-flow';
import { getAuthenticatedProfile, setTestSessionEmail, supabase, TEST_ACCOUNTS } from '@/lib/supabase';
import { getAuthHeroHeight } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

export default function LoginScreen() {
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();
  const isShortScreen = viewportHeight <= 660;
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

    const rawInput = email.trim();
    const normalizedInput = rawInput.toLowerCase();
    const candidateEmail = normalizedInput.includes('@')
      ? normalizedInput
      : `${normalizedInput}@nutech.edu.pk`;

    // 1. Check TEST_ACCOUNTS
    const testAccount = TEST_ACCOUNTS[candidateEmail] || TEST_ACCOUNTS[normalizedInput];
    if (testAccount) {
      if (password === testAccount.password) {
        await setTestSessionEmail(candidateEmail);
        setIsSubmitting(false);
        if (testAccount.role === "society_admin") {
          router.replace("/society-admin/dashboard");
        } else {
          router.replace("/home");
        }
        return;
      } else {
        setIsSubmitting(false);
        setErrors({ form: "Incorrect password" });
        return;
      }
    }

    // 2. Check if user exists in Supabase profiles
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('id, email, is_verified, role')
      .or(`email.eq.${candidateEmail},email.eq.${normalizedInput},roll_number.eq.${rawInput}`)
      .maybeSingle();

    if (!profileRow) {
      setIsSubmitting(false);
      setErrors({ form: "Username not found" });
      return;
    }

    // 3. User exists, authenticate password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: profileRow.email || candidateEmail,
      password,
    });

    if (error || !data.user) {
      setIsSubmitting(false);
      const msg = error?.message?.toLowerCase() || '';
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        setErrors({ form: "Incorrect password" });
      } else {
        setErrors({ form: mapAuthError(error?.message ?? 'Incorrect password') });
      }
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
      beginRecovery(profileRow.email || candidateEmail);
      router.push({ pathname: '/verify', params: { mode: 'signup' } });
      return;
    }

    if (profile?.role === "society_admin") {
      router.replace("/society-admin/dashboard");
    } else {
      router.replace("/home");
    }
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
      noScroll
      subtitle={
        isRecoveryMode
          ? 'Enter your university email and we’ll send a secure recovery code.'
          : 'Sign in to discover what’s happening across campus.'
      }
      title={isRecoveryMode ? 'Reset your password' : 'Welcome back'}
      useHeroArtwork
    >
      <View>
        <View style={{ gap: 8 }}>
          <FormField
            autoCapitalize="none"
            borderless
            compact
            error={errors.email}
            fieldTone="softNeutral"
            keyboardType="email-address"
            label="University email or username"
            onChangeText={setEmail}
            placeholder="you@nutech.edu.pk or username"
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
        </View>

        {errors.form ? (
          <View className="bg-error-soft mt-2 rounded-lg px-3 py-2">
            <Text style={{ color: numigosTheme.colors.error, fontSize: 11, fontWeight: '500' }}>
              {errors.form}
            </Text>
          </View>
        ) : recoveryStatus ? (
          <View className="bg-success-soft mt-2 rounded-lg px-3 py-2">
            <Text style={{ color: numigosTheme.colors.success, fontSize: 11, fontWeight: '500' }}>
              {recoveryStatus}
            </Text>
          </View>
        ) : null}

        <Pressable
          disabled={isSubmitting || isSendingRecovery}
          onPress={isRecoveryMode ? handleRecovery : handleLogin}
          style={{
            alignItems: 'center',
            backgroundColor: '#1B4336',
            borderRadius: 999,
            height: 37,
            justifyContent: 'center',
            marginTop: 12,
            opacity: isSubmitting || isSendingRecovery ? 0.7 : 1,
          }}
        >
          {isSubmitting || isSendingRecovery ? (
            <ActivityIndicator color={numigosTheme.colors.surface} size="small" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: '600' }}>
              {isRecoveryMode ? 'Send recovery code' : 'Sign in'}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            setErrors({});
            setRecoveryStatus('');
            setIsRecoveryMode((current) => !current);
          }}
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 10,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: '#18392E', fontSize: 11.5, fontWeight: '600' }}>
            {isRecoveryMode ? 'Back to sign in' : 'Forgot password?'}
          </Text>
        </Pressable>

        {!isRecoveryMode ? (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 8,
              paddingBottom: 4,
            }}
          >
            <Text style={{ color: '#66736E', fontSize: 11 }}>Don’t have an account? </Text>
            <Pressable onPress={() => router.push('/signup')}>
              <Text style={{ color: '#9E5A24', fontSize: 11, fontWeight: '700' }}>Sign up</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </AuthScaffold>
  );
}
