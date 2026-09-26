import { Typography } from 'heroui-native';
import { Bookmark } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EventListCard } from '@/components/events/EventListCard';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { getBookmarkedEvents } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

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
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 12 }}
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
          <View className="flex-1 items-center justify-center px-8 py-24">
            <View className="bg-brand-mist h-14 w-14 items-center justify-center rounded-full">
              <Bookmark color={numigosTheme.colors.brand} size={24} />
            </View>
            <Typography className="text-home-ink mt-4 text-base font-bold">
              No saved events
            </Typography>
            <Typography className="text-home-muted mt-1 text-center text-xs">
              Bookmark an event to find it here.
            </Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
}
