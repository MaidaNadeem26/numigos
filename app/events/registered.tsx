import { CalendarX2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
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
        className="mx-auto w-full max-w-[680px] flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12, flexGrow: 1 }}
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
          <EmptyState
            description="Events you register for will appear here."
            icon={CalendarX2}
            title="No registered events"
          />
        }
      />
    </SafeAreaView>
  );
}
