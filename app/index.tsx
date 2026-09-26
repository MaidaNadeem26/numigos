import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Typography } from 'heroui-native';
import { router } from 'expo-router';
import { ZoomIn } from 'react-native-reanimated';

import { BrandMark } from '@/components/auth/BrandMark';
import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { getAuthenticatedProfile, supabase } from '@/lib/supabase';
import { numigosTheme } from '@/lib/theme';

export default function SplashScreen() {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const spinnerTimer = setTimeout(() => setShowSpinner(true), 650);
    let isMounted = true;

    const resolveSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session) {
        router.replace('/login');
        return;
      }

      const { profile } = await getAuthenticatedProfile(session.user.id);
      if (!isMounted) return;
      router.replace(profile?.is_verified ? '/home' : '/login');
    };

    void resolveSession();

    return () => {
      isMounted = false;
      clearTimeout(spinnerTimer);
    };
  }, []);

  return (
    <SafeAreaView className="bg-brand flex-1" edges={['top', 'bottom', 'left', 'right']}>
      <View className="flex-1 items-center justify-center px-8">
        <AnimatedView entering={ZoomIn.duration(380)} className="items-center">
          <BrandMark />
          <Typography className="font-display text-brand mt-7 text-white">Numigos</Typography>
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
