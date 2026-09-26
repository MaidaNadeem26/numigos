import { supabase } from '@/lib/supabase';
import { Button, Spinner, Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';

export default function HomeScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login');
        return;
      }
      setEmail(data.user.email ?? '');
      setIsLoading(false);
    });
  }, [router]);

  const signOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="mx-auto w-full max-w-lg flex-1 justify-between px-5 py-8">
        <View>
          <Typography className="text-foreground text-3xl font-bold">Numigos</Typography>
          <Typography className="text-foreground mt-6 text-xl font-semibold">
            You&apos;re signed in
          </Typography>
          {isLoading ? (
            <Spinner className="mt-4 self-start" size="sm" />
          ) : (
            <Typography className="text-muted mt-2">{email}</Typography>
          )}
        </View>
        <Button isDisabled={isSigningOut} size="lg" variant="outline" onPress={signOut}>
          {isSigningOut ? <Spinner size="sm" /> : null}
          <Button.Label>{isSigningOut ? 'Signing out' : 'Sign out'}</Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}
