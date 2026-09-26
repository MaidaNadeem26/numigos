import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField } from '@/components/auth/FormField';
import { getAuthErrorMessage } from '@/lib/auth-validation';
import { useAuthFlow, type OtpPurpose } from '@/lib/auth-flow';
import { supabase } from '@/lib/supabase';
import { Button, InputOTP, Spinner, Typography } from 'heroui-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

const RESEND_SECONDS = 45;

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; purpose?: string }>();
  const { otpEmail, otpPurpose, clearSignupDraft } = useAuthFlow();
  const email = otpEmail || params.email || '';
  const purpose: OtpPurpose = (params.purpose || otpPurpose) === 'recovery' ? 'recovery' : 'signup';

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const [recoveryVerified, setRecoveryVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const completionLock = useRef(false);

  useEffect(() => {
    const interval =
      cooldown > 0 ? setInterval(() => setCooldown((value) => value - 1), 1000) : undefined;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldown]);

  const verifyCode = async (token: string) => {
    if (!email || completionLock.current) return;
    completionLock.current = true;
    setIsVerifying(true);
    setErrorMessage('');

    const { error } = await supabase.auth.verifyOtp({ email, token, type: purpose });
    setIsVerifying(false);

    if (error) {
      completionLock.current = false;
      setCode('');
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }

    if (purpose === 'recovery') {
      setRecoveryVerified(true);
      completionLock.current = false;
      return;
    }

    clearSignupDraft();
    router.replace('/home');
  };

  const resendCode = async () => {
    if (cooldown > 0 || !email) return;
    setErrorMessage('');
    const { error } =
      purpose === 'signup'
        ? await supabase.auth.resend({ type: 'signup', email })
        : await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }
    setCode('');
    setCooldown(RESEND_SECONDS);
  };

  const updatePassword = async () => {
    const nextErrors: typeof passwordErrors = {};
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      nextErrors.password = 'Use 8 or more characters with at least one number.';
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your new password.';
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsVerifying(true);
    setErrorMessage('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsVerifying(false);
    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }
    router.replace('/home');
  };

  if (recoveryVerified) {
    return (
      <AuthScaffold title="Set new password" backFallback="/login">
        <View className="gap-1">
          <FormField
            autoComplete="new-password"
            error={passwordErrors.password}
            label="New password"
            placeholder="At least 8 characters"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <FormField
            autoComplete="new-password"
            error={passwordErrors.confirmPassword}
            label="Confirm new password"
            placeholder="Re-enter your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <View className="min-h-12 justify-center">
            {errorMessage ? (
              <Typography className="text-danger text-sm">{errorMessage}</Typography>
            ) : null}
          </View>
          <Button isDisabled={isVerifying} size="lg" onPress={updatePassword}>
            {isVerifying ? <Spinner size="sm" /> : null}
            <Button.Label>{isVerifying ? 'Updating password' : 'Update password'}</Button.Label>
          </Button>
        </View>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      title="Check your email"
      backFallback={purpose === 'signup' ? '/signup' : '/login'}
    >
      <View className="items-center">
        <Typography className="text-muted mb-7 text-center">
          Enter the 6-digit code sent to {email || 'your university email'}.
        </Typography>

        <InputOTP
          isDisabled={isVerifying}
          isInvalid={Boolean(errorMessage)}
          maxLength={6}
          textInputProps={{ autoFocus: true, textContentType: 'oneTimeCode' }}
          value={code}
          onChange={setCode}
          onComplete={verifyCode}
        >
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP>

        <View className="min-h-16 w-full items-center justify-center">
          {isVerifying ? <Spinner size="sm" /> : null}
          {errorMessage ? (
            <Typography className="text-danger text-center text-sm">{errorMessage}</Typography>
          ) : null}
        </View>

        <Button
          isDisabled={cooldown > 0 || isVerifying || !email}
          variant="ghost"
          onPress={resendCode}
        >
          <Button.Label>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </Button.Label>
        </Button>
      </View>
    </AuthScaffold>
  );
}
