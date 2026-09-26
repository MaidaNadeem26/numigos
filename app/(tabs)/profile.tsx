import { Typography } from 'heroui-native';
import { View } from 'react-native';

import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center px-6">
        <Typography className="text-foreground text-xl font-semibold">Profile</Typography>
      </View>
    </SafeAreaView>
  );
}
