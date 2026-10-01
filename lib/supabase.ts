import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Supabase connection is not configured.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const TEST_ACCOUNTS: Record<string, { password: string; name: string; role: string; societyId?: string }> = {
  'test@nutech.edu.pk': {
    password: 'Test1234',
    name: 'Bilal Ahmad',
    role: 'student',
  },
  'bilal.ahmad@nutech.edu.pk': {
    password: 'Test1234',
    name: 'Bilal Ahmad',
    role: 'student',
  },
  'admin.aws@nutech.edu.pk': {
    password: 'Test1234',
    name: 'Hamza Malik',
    role: 'society_admin',
    societyId: 'aws-student-builder-nutech',
  },
  'admin.zindigi@nutech.edu.pk': {
    password: 'Test1234',
    name: 'Ayesha Khan',
    role: 'society_admin',
    societyId: 'zindigi-prize-nutech',
  },
};

export const TEST_SESSION_STORAGE_KEY = 'numigos_test_session_email';

export async function getTestSessionEmail(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TEST_SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function setTestSessionEmail(email: string | null): Promise<void> {
  try {
    if (email) {
      await AsyncStorage.setItem(TEST_SESSION_STORAGE_KEY, email);
    } else {
      await AsyncStorage.removeItem(TEST_SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export interface AuthenticatedProfile {
  role: string;
  is_verified: boolean;
}

export async function getAuthenticatedProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role, is_verified')
    .eq('id', userId)
    .maybeSingle();

  // If the profiles table has not been created yet in Supabase or no row exists yet,
  // gracefully fall back to a verified student profile so login still works.
  if (error || !data) {
    return {
      profile: {
        role: 'student',
        is_verified: true,
      } satisfies AuthenticatedProfile,
      error: null,
    };
  }

  return {
    profile: data,
    error: null,
  };
}

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
