import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { FormField } from '@/components/auth/FormField';
import { useAuthFlow } from '@/lib/auth-flow';
import { mapAuthError, validatePassword } from '@/lib/auth-validation';
import { supabase } from '@/lib/supabase';
import { getAuthHeroHeight } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

type VerificationMode = 'signup' | 'recovery';

export default function VerificationScreen() {
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();
  const params = useLocalSearchParams<{ mode?: VerificationMode }>();
  const { verificationEmail, signupDraft } = useAuthFlow();
  const mode: VerificationMode = params.mode === 'recovery' ? 'recovery' : 'signup';
  const [code, setCode] = useState('');
  const [isOtpFocused, setIsOtpFocused] = useState(false);
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
  const otpInputRef = useRef<TextInput>(null);

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
      alignContentLeft
      dense
      heroHeight={getAuthHeroHeight(viewportHeight, viewportWidth)}
      hideHeroBrand
      noScroll
      subtitle={
        recoveryVerified
          ? 'Create a strong password you haven’t used before.'
          : `Enter the six-digit code sent to ${maskedEmail}.`
      }
      title={recoveryVerified ? 'Choose a new password' : 'Check your inbox'}
      useHeroArtwork
    >
      {recoveryVerified ? (
        <View style={{ width: '100%' }}>
          <FormField
            borderless
            compact
            error={error}
            fieldTone="softNeutral"
            label="New password"
            onChangeText={setNewPassword}
            onToggleSecure={() => setShowPassword((current) => !current)}
            placeholder="At least 8 characters and 1 number"
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            value={newPassword}
          />
          <Pressable
            disabled={isUpdatingPassword}
            onPress={updatePassword}
            style={{
              alignItems: 'center',
              backgroundColor: '#1B4336',
              borderRadius: 999,
              height: 37,
              justifyContent: 'center',
              marginTop: 12,
              opacity: isUpdatingPassword ? 0.7 : 1,
              width: '100%',
            }}
          >
            {isUpdatingPassword ? (
              <ActivityIndicator color={numigosTheme.colors.surface} size="small" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: '600' }}>
                Update password
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleBack}
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
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          <Text
            style={{
              color: '#1A2822',
              fontSize: 11,
              fontWeight: '600',
              lineHeight: 14,
              marginBottom: 4,
              marginLeft: 2,
            }}
          >
            Verification code
          </Text>

          <Pressable
            onPress={() => otpInputRef.current?.focus()}
            style={{
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'space-between',
              position: 'relative',
              width: '100%',
            }}
          >
            {Array.from({ length: OTP_LENGTH }, (_, index) => {
              const char = code[index] ?? '';
              const isActiveSlot =
                isOtpFocused &&
                (index === code.length || (code.length === OTP_LENGTH && index === OTP_LENGTH - 1));

              return (
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#EFECE6',
                    borderColor: error
                      ? numigosTheme.colors.error
                      : isActiveSlot
                        ? numigosTheme.colors.brand
                        : 'transparent',
                    borderRadius: 9,
                    borderWidth: error || isActiveSlot ? 1.25 : 1,
                    flex: 1,
                    height: 38,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: char ? '#162620' : '#8B9490',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    {char}
                  </Text>
                </View>
              );
            })}

            <TextInput
              autoFocus
              caretHidden
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              onBlur={() => setIsOtpFocused(false)}
              onChangeText={(value) => {
                const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
                setCode(digitsOnly);
                setError('');
                setStatus('');
                if (digitsOnly.length < OTP_LENGTH) lastSubmittedCode.current = '';
              }}
              onFocus={() => setIsOtpFocused(true)}
              ref={otpInputRef}
              style={[
                {
                  bottom: 0,
                  color: 'transparent',
                  left: 0,
                  opacity: 0.01,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: '100%',
                },
                Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
              ]}
              textContentType="oneTimeCode"
              value={code}
            />
          </Pressable>

          {error ? (
            <View className="bg-error-soft mt-2 rounded-lg px-3 py-2">
              <Text
                style={{
                  color: numigosTheme.colors.error,
                  fontSize: 11,
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                {error}
              </Text>
            </View>
          ) : status ? (
            <View className="bg-success-soft mt-2 rounded-lg px-3 py-2">
              <Text
                style={{
                  color: numigosTheme.colors.success,
                  fontSize: 11,
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                {status}
              </Text>
            </View>
          ) : null}

          <Pressable
            disabled={isVerifying}
            onPress={() => {
              if (code.length < OTP_LENGTH) {
                setError('Enter the 6-digit verification code.');
                return;
              }
              void verifyCode(code);
            }}
            style={{
              alignItems: 'center',
              backgroundColor: '#1B4336',
              borderRadius: 999,
              height: 37,
              justifyContent: 'center',
              marginTop: 12,
              opacity: isVerifying ? 0.7 : 1,
              width: '100%',
            }}
          >
            {isVerifying ? (
              <ActivityIndicator color={numigosTheme.colors.surface} size="small" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: '600' }}>
                Verify code
              </Text>
            )}
          </Pressable>

          <Pressable
            disabled={isVerifying}
            onPress={handleBack}
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

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 8,
              paddingBottom: 4,
            }}
          >
            <Text style={{ color: '#66736E', fontSize: 11 }}>Didn’t receive the code? </Text>
            <Pressable
              disabled={cooldown > 0 || isResending}
              onPress={() => void resendCode()}
            >
              {isResending ? (
                <ActivityIndicator color={numigosTheme.colors.brand} size="small" />
              ) : (
                <Text
                  style={{
                    color: cooldown > 0 ? '#8B9490' : '#9E5A24',
                    fontSize: 11,
                    fontWeight: '700',
                  }}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
    </AuthScaffold>
  );
}
