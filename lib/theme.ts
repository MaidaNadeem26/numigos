export const appTheme = {
  colors: {
    brand: '#25324B',
    brandPressed: '#192238',
    accent: '#4664E6',
    background: '#F7F8FB',
    surface: '#FFFFFF',
    text: '#171A21',
    muted: '#697386',
    border: '#DCE1EA',
    danger: '#C52A3A',
    success: '#247A4B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 22,
  },
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
} as const;

export const DEPARTMENTS = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
  { value: 'Cyber Security', label: 'Cyber Security' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Civil Engineering', label: 'Civil Engineering' },
  { value: 'Engineering Technology', label: 'Engineering Technology' },
] as const;
