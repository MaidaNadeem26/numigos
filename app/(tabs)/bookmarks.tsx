import { Typography } from 'heroui-native';
import { Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { EventListCard } from '@/components/events/EventListCard';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { getBookmarkedEvents } from '@/lib/home-feed';

export default function BookmarksScreen() {
  const router = useRouter();
  const events = getBookmarkedEvents();

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <View className="px-4 pt-3 pb-3">
        <Typography className="font-display text-home-ink text-[24px] leading-8 font-bold">
          Bookmarked events
        </Typography>
        <Typography className="text-home-muted mt-1 text-[11px]">
          Events you saved for later
        </Typography>
      </View>
      <FlatList
        className="mx-auto w-full max-w-[680px] flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 32,
          gap: 12,
          flexGrow: 1,
        }}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventListCard
            badge="Saved"
            event={item}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            description="Bookmark an event to find it here."
            icon={Bookmark}
            title="No saved events"
          />
        }
      />
    </SafeAreaView>
  );
}
