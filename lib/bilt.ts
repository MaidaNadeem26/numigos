import { createClient, asyncStorage } from '@biltme/backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

const biltUrl = process.env.EXPO_PUBLIC_BILT_URL || 'https://placeholder.bilt.me';
const biltAnonKey = process.env.EXPO_PUBLIC_BILT_ANON_KEY || 'placeholder_anon_key';

export const bilt = createClient(
  biltUrl,
  biltAnonKey,
  {
    auth: {
      storage: asyncStorage(AsyncStorage),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);

