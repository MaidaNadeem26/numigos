import { Typography } from 'heroui-native';
import { ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { goBackOrReplace } from '@/lib/navigation';
import { numigosTheme } from '@/lib/theme';

export default function EventDetailPlaceholder() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-row items-center px-5 py-3">
        <GesturePressable
          accessibilityLabel="Back to Home"
          accessibilityRole="button"
          className="bg-surface h-11 w-11 items-center justify-center rounded-full active:opacity-70"
          onPress={() => goBackOrReplace('/(tabs)')}
        >
          <ArrowLeft color={numigosTheme.colors.ink} size={22} />
        </GesturePressable>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Typography className="text-ink text-xl font-semibold">Event details</Typography>
        <Typography className="text-ink-muted mt-2 text-sm">{id}</Typography>
      </View>
    </SafeAreaView>
  );
}
