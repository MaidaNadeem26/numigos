import { Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EventListCard } from '@/components/events/EventListCard';
import { ScreenHeader } from '@/components/student/ScreenHeader';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { PAST_EVENTS } from '@/lib/home-feed';

export default function EventHistoryScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScreenHeader
        fallback="/(tabs)/profile"
        title="Event history"
        subtitle="Events you attended"
      />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 12 }}
        data={PAST_EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventListCard
            badge="Attended"
            event={item}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
          />
        )}
        ListFooterComponent={
          <View className="items-center py-4">
            <Typography className="text-home-muted text-[10px]">
              That’s your recent activity
            </Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
}
