import { Typography } from 'heroui-native';
import { History } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
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
        className="mx-auto w-full max-w-[680px] flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12, flexGrow: 1 }}
        data={PAST_EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventListCard
            badge="Attended"
            event={item}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            description="Verified attendance records will appear here."
            icon={History}
            title="No attendance history"
          />
        }
        ListFooterComponent={
          <View className="items-center py-4">
            <Typography className="text-home-muted text-xs">That’s your recent activity</Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
}
