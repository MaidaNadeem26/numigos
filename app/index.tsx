import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Typography } from 'heroui-native';
import { router } from 'expo-router';
import { ZoomIn } from 'react-native-reanimated';

import { BrandMark } from '@/components/auth/BrandMark';
import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { getAuthenticatedProfile, getTestSessionEmail, supabase } from '@/lib/supabase';
import { numigosTheme } from '@/lib/theme';

export default function SplashScreen() {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const spinnerTimer = setTimeout(() => setShowSpinner(true), 650);
    let isMounted = true;
    let didNavigate = false;

    const navigateSafely = (target: '/home' | '/login') => {
      if (!isMounted || didNavigate) return;
      didNavigate = true;
      router.replace(target);
    };

    const fallbackTimer = setTimeout(() => {
      navigateSafely('/login');
    }, 4000);

    const resolveSession = async () => {
      try {
        const testEmail = await getTestSessionEmail();
        if (testEmail) {
          navigateSafely('/home');
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          navigateSafely('/login');
          return;
        }

        const { profile } = await getAuthenticatedProfile(session.user.id);
        navigateSafely(profile?.is_verified ? '/home' : '/login');
      } catch {
        navigateSafely('/login');
      }
    };

    void resolveSession();

    return () => {
      isMounted = false;
      clearTimeout(spinnerTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <SafeAreaView className="bg-brand flex-1" edges={['top', 'bottom', 'left', 'right']}>
      <View className="flex-1 items-center justify-center px-8">
        <AnimatedView entering={ZoomIn.duration(380)} className="items-center">
          <BrandMark />
          <Typography className="font-display text-[38px] mt-7 text-white">Numigos</Typography>
        </AnimatedView>
      </View>

      <View className="h-16 items-center justify-center">
        {showSpinner ? (
          <ActivityIndicator color={numigosTheme.colors.surface} size="small" />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
