import { Stack, useRouter } from 'expo-router';
import { MapPinOff } from 'lucide-react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { ResponsiveContent } from '@/components/ui/ResponsiveContent';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-canvas flex-1" edges={['top', 'right', 'bottom', 'left']}>
      <Stack.Screen options={{ title: 'Page not found' }} />
      <ResponsiveContent style={{ flex: 1 }}>
        <EmptyState
          actionLabel="Return home"
          description="The page may have moved or is no longer available."
          icon={MapPinOff}
          onAction={() => router.replace('/(tabs)/explore')}
          title="Page not found"
        />
      </ResponsiveContent>
    </SafeAreaView>
  );
}
