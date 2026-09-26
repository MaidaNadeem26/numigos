import { Typography } from 'heroui-native';
import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EventListCard } from '@/components/events/EventListCard';
import { ScreenHeader } from '@/components/student/ScreenHeader';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { getRegisteredEvents } from '@/lib/home-feed';

export default function RegisteredEventsScreen() {
  const router = useRouter();
  const events = getRegisteredEvents();
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScreenHeader
        fallback="/(tabs)/profile"
        title="My registered events"
        subtitle={`${events.length} upcoming events`}
      />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 12 }}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventListCard
            badge="Registered"
            event={item}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-24">
            <Typography className="text-home-ink text-base font-bold">
              No registrations yet
            </Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
}
