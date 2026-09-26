import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { Button, InputOTP, Typography } from 'heroui-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField } from '@/components/auth/FormField';
import { useAuthFlow } from '@/lib/auth-flow';
import { mapAuthError, validatePassword } from '@/lib/auth-validation';
import { supabase } from '@/lib/supabase';
import { numigosTheme } from '@/lib/theme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

type VerificationMode = 'signup' | 'recovery';

export default function VerificationScreen() {
  const params = useLocalSearchParams<{ mode?: VerificationMode }>();
  const { verificationEmail, signupDraft } = useAuthFlow();
  const mode: VerificationMode = params.mode === 'recovery' ? 'recovery' : 'signup';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [recoveryVerified, setRecoveryVerified] = useState(false);
  const lastSubmittedCode = useRef('');

  const maskedEmail = useMemo(() => {
    const [local, domain] = verificationEmail.split('@');
    if (!local || !domain) return verificationEmail || 'your university email';
    return `${local.slice(0, 2)}${'•'.repeat(Math.max(2, local.length - 2))}@${domain}`;
  }, [verificationEmail]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const verifyCode = useCallback(
    async (token: string) => {
      if (!verificationEmail) {
        setError('Your verification session has expired. Start again.');
        return;
      }

      setError('');
      setStatus('');
      setIsVerifying(true);
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: verificationEmail,
        token,
        type: mode,
      });
      setIsVerifying(false);

      if (verifyError) {
        setError(mapAuthError(verifyError.message));
        return;
      }

      if (mode === 'recovery') {
        setRecoveryVerified(true);
        setStatus('Code verified. Choose a new password.');
        return;
      }

      router.replace('/home');
    },
    [mode, verificationEmail],
  );

  useEffect(() => {
    if (code.length !== OTP_LENGTH || isVerifying || lastSubmittedCode.current === code) return;
    lastSubmittedCode.current = code;
    void verifyCode(code);
  }, [code, isVerifying, verifyCode]);

  const resendCode = async () => {
    if (cooldown > 0 || !verificationEmail) return;
    setIsResending(true);
    setError('');
    setStatus('');

    const { error: resendError } =
      mode === 'signup'
        ? await supabase.auth.resend({ email: verificationEmail, type: 'signup' })
        : await supabase.auth.resetPasswordForEmail(verificationEmail);

    setIsResending(false);

    if (resendError) {
      setError(mapAuthError(resendError.message));
      return;
    }

    setCode('');
    lastSubmittedCode.current = '';
    setCooldown(RESEND_SECONDS);
    setStatus('A new code has been sent.');
  };

  const updatePassword = async () => {
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsUpdatingPassword(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);

    if (updateError) {
      setError(mapAuthError(updateError.message));
      return;
    }

    await supabase.auth.signOut();
    router.replace('/login');
  };

  const handleBack = () => {
    if (mode === 'signup' && signupDraft.email) {
      router.replace('/signup');
      return;
    }
    router.replace('/login');
  };

  return (
    <AuthScaffold
      onBack={handleBack}
      subtitle={
        recoveryVerified
          ? 'Create a strong password you haven’t used before.'
          : `Enter the six-digit code sent to ${maskedEmail}.`
      }
      title={recoveryVerified ? 'Choose a new password' : 'Check your inbox'}
    >
      {recoveryVerified ? (
        <View className="gap-1">
          <FormField
            error={error}
            label="New password"
            onChangeText={setNewPassword}
            onToggleSecure={() => setShowPassword((current) => !current)}
            placeholder="At least 8 characters and 1 number"
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            value={newPassword}
          />
          <Button
            className="action-shadow rounded-action bg-brand mt-3 h-14"
            isDisabled={isUpdatingPassword}
            onPress={updatePassword}
          >
            {isUpdatingPassword ? (
              <ActivityIndicator color={numigosTheme.colors.surface} />
            ) : (
              <Button.Label className="text-action font-semibold text-white">
                Update password
              </Button.Label>
            )}
          </Button>
        </View>
      ) : (
        <View>
          <InputOTP
            className="w-full"
            inputMode="numeric"
            isDisabled={isVerifying}
            isInvalid={Boolean(error)}
            maxLength={OTP_LENGTH}
            onChange={(value) => {
              setCode(value);
              setError('');
              setStatus('');
              if (value.length < OTP_LENGTH) lastSubmittedCode.current = '';
            }}
            pattern="[0-9]*"
            textInputProps={{
              autoFocus: true,
              keyboardType: 'number-pad',
              textContentType: 'oneTimeCode',
            }}
            value={code}
          >
            <InputOTP.Group className="w-full flex-row justify-between gap-2">
              {Array.from({ length: OTP_LENGTH }, (_, index) => (
                <InputOTP.Slot
                  className="rounded-field border-line bg-surface h-16 flex-1 border"
                  index={index}
                  key={index}
                >
                  <InputOTP.SlotPlaceholder className="text-otp text-ink-muted" />
                  <InputOTP.SlotValue className="font-display-semibold text-otp text-ink" />
                  <InputOTP.SlotCaret className="bg-brand" />
                </InputOTP.Slot>
              ))}
            </InputOTP.Group>
            <TextInput className="hidden" />
          </InputOTP>

          <View className="min-h-16 items-center justify-center">
            {isVerifying ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color={numigosTheme.colors.brand} size="small" />
                <Typography className="text-ink-muted text-sm font-medium">
                  Checking code…
                </Typography>
              </View>
            ) : error ? (
              <View className="bg-error-soft w-full rounded-xl px-4 py-3">
                <Typography className="text-error text-center text-sm font-medium">
                  {error}
                </Typography>
              </View>
            ) : status ? (
              <View className="bg-success-soft w-full rounded-xl px-4 py-3">
                <Typography className="text-success text-center text-sm font-medium">
                  {status}
                </Typography>
              </View>
            ) : null}
          </View>

          <View className="mt-1 items-center">
            <Typography className="text-ink-muted font-sans text-sm">
              Didn’t receive the code?
            </Typography>
            <Button
              className="mt-1 h-11 rounded-full px-5"
              isDisabled={cooldown > 0 || isResending}
              onPress={resendCode}
              variant="tertiary"
            >
              {isResending ? (
                <ActivityIndicator color={numigosTheme.colors.brand} size="small" />
              ) : (
                <Button.Label className="text-brand text-sm font-semibold">
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </Button.Label>
              )}
            </Button>
          </View>
        </View>
      )}
    </AuthScaffold>
  );
}
