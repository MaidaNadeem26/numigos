import { Typography } from 'heroui-native';
import { ArrowLeft } from 'lucide-react-native';
import { FlatList, Image, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { FOLLOWED_SOCIETIES, type Society } from '@/lib/home-feed';
import { goBackOrReplace } from '@/lib/navigation';
import { numigosTheme } from '@/lib/theme';

function renderSociety({ item }: { item: Society }) {
  return (
    <View className="border-home-card-border bg-surface flex-row items-center rounded-2xl border p-3">
      <View className="bg-home-chip h-12 w-12 overflow-hidden rounded-full">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={item.logo}
          style={{ width: 48, height: 48 }}
        />
      </View>
      <View className="min-w-0 flex-1 pl-3">
        <Typography className="text-home-ink text-[13px] font-bold" numberOfLines={1}>
          {item.fullName}
        </Typography>
        <Typography className="text-home-muted mt-1 text-[10px]">{item.category}</Typography>
      </View>
    </View>
  );
}

export default function SocietiesScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-row items-center px-4 py-3">
        <GesturePressable
          accessibilityLabel="Back to Home"
          accessibilityRole="button"
          className="bg-surface h-11 w-11 items-center justify-center rounded-full active:opacity-70"
          onPress={() => goBackOrReplace('/(tabs)')}
        >
          <ArrowLeft color={numigosTheme.colors.ink} size={21} />
        </GesturePressable>
        <Typography className="font-display text-home-ink ml-3 text-lg font-bold">
          Explore societies
        </Typography>
      </View>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        data={FOLLOWED_SOCIETIES}
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyExtractor={(item) => item.id}
        renderItem={renderSociety}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
