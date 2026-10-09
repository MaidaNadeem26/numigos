export const UNIVERSITY_EMAIL_DOMAIN = '@nutech.edu.pk';

export const DEPARTMENTS = [
  { value: 'computer-science', label: 'Computer Science' },
  { value: 'software-engineering', label: 'Software Engineering' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
  { value: 'electrical-engineering', label: 'Electrical Engineering' },
  { value: 'mechanical-engineering', label: 'Mechanical Engineering' },
  { value: 'civil-engineering', label: 'Civil Engineering' },
] as const;

export type SignupFields = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  rollNumber: string;
  department: string;
};

export type LoginFields = {
  email: string;
  password: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const EMPTY_SIGNUP_FIELDS: SignupFields = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  rollNumber: '',
  department: '',
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isUniversityEmail(email: string) {
  const normalized = normalizeEmail(email);
  return /^[^@\s]+@nutech\.edu\.pk$/.test(normalized);
}

export function validateEmail(email: string) {
  if (!email.trim()) return 'University email is required.';
  if (!isUniversityEmail(email)) return `Use your ${UNIVERSITY_EMAIL_DOMAIN} email.`;
  return undefined;
}

export function validatePassword(password: string) {
  if (!password) return 'Password is required.';
  if (password.length < 8 || !/\d/.test(password)) {
    return 'Use 8 or more characters with at least one number.';
  }
  return undefined;
}

export function validateSignup(fields: SignupFields): FieldErrors<SignupFields> {
  const errors: FieldErrors<SignupFields> = {};

  if (!fields.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!fields.email.trim()) {
    errors.email = 'University email is required.';
  } else if (!isUniversityEmail(fields.email)) {
    errors.email = `Use your ${UNIVERSITY_EMAIL_DOMAIN} email.`;
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8 || !/\d/.test(fields.password)) {
    errors.password = 'Use 8 or more characters with at least one number.';
  }
  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!fields.rollNumber.trim()) errors.rollNumber = 'Roll number is required.';
  if (!fields.department) errors.department = 'Department is required.';

  return errors;
}

export function validateLogin(fields: LoginFields): FieldErrors<LoginFields> {
  const errors: FieldErrors<LoginFields> = {};
  if (!fields.email.trim()) {
    errors.email = 'University email or username is required.';
  }
  if (!fields.password) errors.password = 'Password is required.';
  return errors;
}

export function getAuthErrorMessage(error: unknown): string {
  const message =
    typeof error === 'string'
      ? error.toLowerCase()
      : error instanceof Error
        ? error.message.toLowerCase()
        : '';

  if (message.includes('network') || message.includes('fetch')) {
    return 'No internet connection. Check your connection and try again.';
  }
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account already exists for this email. Sign in instead.';
  }
  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return 'Incorrect password';
  }
  if (message.includes('user not found') || message.includes('username not found')) {
    return 'Username not found';
  }
  if (message.includes('email not confirmed')) {
    return 'Verify your university email before signing in.';
  }
  if (message.includes('expired') || message.includes('token has expired')) {
    return 'This code has expired. Request a new code.';
  }
  if (message.includes('invalid token') || message.includes('token is invalid')) {
    return 'That code is incorrect. Check the email and try again.';
  }
  if (message.includes('password') && (message.includes('weak') || message.includes('least'))) {
    return 'Use 8 or more characters with at least one number.';
  }
  if (message.includes('@nutech.edu.pk') || message.includes('database error saving new user')) {
    return 'Use a valid @nutech.edu.pk university email.';
  }
  if (message.includes('rate limit') || message.includes('security purposes')) {
    return 'Too many attempts. Wait a moment before trying again.';
  }

  return 'We could not complete that request. Check your details and try again.';
}

export const mapAuthError = getAuthErrorMessage;
