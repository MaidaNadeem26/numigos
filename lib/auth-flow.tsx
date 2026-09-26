import { EMPTY_SIGNUP_FIELDS, type SignupFields } from '@/lib/auth-validation';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type OtpPurpose = 'signup' | 'recovery';

type AuthFlowContextValue = {
  signupDraft: SignupFields;
  setSignupDraft: (draft: SignupFields) => void;
  updateSignupDraft: (draft: Partial<SignupFields>) => void;
  otpEmail: string;
  verificationEmail: string;
  otpPurpose: OtpPurpose;
  beginOtp: (email: string, purpose: OtpPurpose) => void;
  beginSignupVerification: (email: string) => void;
  beginRecovery: (email: string) => void;
  clearSignupDraft: () => void;
};

const AuthFlowContext = createContext<AuthFlowContextValue | null>(null);

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const [signupDraft, setSignupDraft] = useState<SignupFields>(EMPTY_SIGNUP_FIELDS);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPurpose, setOtpPurpose] = useState<OtpPurpose>('signup');

  const value = useMemo<AuthFlowContextValue>(
    () => ({
      signupDraft,
      setSignupDraft,
      updateSignupDraft: (draft) => setSignupDraft((current) => ({ ...current, ...draft })),
      otpEmail,
      verificationEmail: otpEmail,
      otpPurpose,
      beginOtp: (email, purpose) => {
        setOtpEmail(email);
        setOtpPurpose(purpose);
      },
      beginSignupVerification: (email) => {
        setOtpEmail(email);
        setOtpPurpose('signup');
      },
      beginRecovery: (email) => {
        setOtpEmail(email);
        setOtpPurpose('recovery');
      },
      clearSignupDraft: () => setSignupDraft(EMPTY_SIGNUP_FIELDS),
    }),
    [otpEmail, otpPurpose, signupDraft],
  );

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const context = useContext(AuthFlowContext);
  if (!context) throw new Error('useAuthFlow must be used inside AuthFlowProvider.');
  return context;
}
