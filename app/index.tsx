import { appTheme } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { Typography } from 'heroui-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (active) router.replace(data.session ? '/home' : '/login');
    });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-accent mb-5 size-24 items-center justify-center rounded-3xl">
          <Typography className="text-accent-foreground text-4xl font-bold">N</Typography>
        </View>
        <Typography className="text-foreground text-4xl font-bold">Numigos</Typography>
      </View>
      <View className="h-16 items-center justify-center">
        <ActivityIndicator color={appTheme.colors.accent} />
      </View>
    </SafeAreaView>
  );
}
