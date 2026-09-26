import { Typography } from 'heroui-native';
import { Bell, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';

import { FeaturedEventCard, SocietyPostCard, WeeklyEventCard } from '@/components/home/FeedCards';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import {
  FOLLOWED_SOCIETIES,
  getFeaturedEvent,
  getFollowedSocietyPosts,
  getThisWeekEvents,
  getTodayEventCount,
  type EventFeedItem,
  type PostFeedItem,
} from '@/lib/home-feed';
import { HOME_HORIZONTAL_PADDING, isSmallPhone } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

const INITIAL_POST_COUNT = 2;
const PAGE_SIZE = 2;
const HAS_UNREAD_NOTIFICATIONS = true;

function openEvent(item: EventFeedItem) {
  router.push({ pathname: '/event/[id]', params: { id: item.id } });
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Typography
        className="font-display text-home-ink min-w-0 flex-1 text-[15px] leading-5 font-bold"
        numberOfLines={1}
      >
        {title}
      </Typography>
      <GesturePressable
        accessibilityLabel={`See all ${title}`}
        accessibilityRole="button"
        onPress={onSeeAll}
      >
        <Typography className="text-brand text-[10px] leading-4 font-semibold">See all</Typography>
      </GesturePressable>
    </View>
  );
}

export default function HomeScreen() {
  const { width: viewportWidth } = useWindowDimensions();
  const compactWidth = isSmallPhone(viewportWidth);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(new Date()),
    [],
  );
  const todayEventCount = useMemo(() => getTodayEventCount(), []);
  const featuredEvent = useMemo(() => getFeaturedEvent(), []);
  const thisWeekEvents = useMemo(() => getThisWeekEvents(5), []);
  const followedPosts = useMemo(() => getFollowedSocietyPosts(), []);
  const hasFollowedSocieties = FOLLOWED_SOCIETIES.length > 0;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredWeekEvents = useMemo(() => {
    if (!normalizedQuery) return thisWeekEvents;
    return thisWeekEvents.filter((event) =>
      `${event.title} ${event.society} ${event.category}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, thisWeekEvents]);
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return followedPosts;
    return followedPosts.filter((post) =>
      `${post.society} ${post.caption} ${post.category}`.toLowerCase().includes(normalizedQuery),
    );
  }, [followedPosts, normalizedQuery]);
  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  const handleSearchChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setVisibleCount(INITIAL_POST_COUNT);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setVisibleCount(INITIAL_POST_COUNT);
    setRefreshing(false);
  }, []);

  const loadNextPage = useCallback(() => {
    setVisibleCount((current) => Math.min(current + PAGE_SIZE, filteredPosts.length));
  }, [filteredPosts.length]);

  const renderPost = useCallback(
    ({ item }: { item: PostFeedItem }) => (
      <View style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}>
        <SocietyPostCard item={item} />
      </View>
    ),
    [],
  );

  const listHeader = (
    <View>
      {featuredEvent ? (
        <View style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}>
          <FeaturedEventCard item={featuredEvent} onPress={() => openEvent(featuredEvent)} />
        </View>
      ) : null}

      <View className="mt-6">
        <View style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}>
          <SectionHeader title="This week" onSeeAll={() => router.push('/calendar')} />
        </View>
        {filteredWeekEvents.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              columnGap: 12,
              paddingHorizontal: HOME_HORIZONTAL_PADDING,
              paddingTop: 12,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {filteredWeekEvents.map((event) => (
              <WeeklyEventCard item={event} key={event.id} onPress={() => openEvent(event)} />
            ))}
          </ScrollView>
        ) : (
          <Typography
            className="text-home-muted mt-3 text-[10px]"
            style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}
          >
            No events match your search.
          </Typography>
        )}
      </View>

      {hasFollowedSocieties ? (
        <View className="mt-7 mb-3" style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}>
          <SectionHeader
            title="From societies you follow"
            onSeeAll={() => router.push('/societies')}
          />
        </View>
      ) : (
        <View
          className="bg-home-chip mt-7 flex-row items-center justify-between rounded-[13px] px-4 py-3"
          style={{ marginHorizontal: HOME_HORIZONTAL_PADDING }}
        >
          <Typography className="text-home-muted min-w-0 flex-1 text-[10px] leading-[14px]">
            Follow societies to see their updates here
          </Typography>
          <GesturePressable accessibilityRole="button" onPress={() => router.push('/societies')}>
            <Typography className="text-brand ml-3 text-[10px] font-semibold">
              Explore societies
            </Typography>
          </GesturePressable>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="bg-brand flex-1" edges={['top', 'left', 'right']}>
      <View className="bg-brand pt-2 pb-5" style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}>
        <View className="flex-row items-start justify-between">
          <View className="min-w-0 flex-1 pr-4">
            <Typography className="text-[11px] leading-4 font-medium text-white/65">
              {dateLabel}
            </Typography>
            <View className="mt-0.5 flex-row flex-wrap items-baseline">
              <Typography
                className={`font-display text-home-highlight leading-7 font-bold ${
                  compactWidth ? 'text-[18px]' : 'text-[20px]'
                }`}
              >
                {todayEventCount}
              </Typography>
              <Typography
                className={`font-display ml-1.5 leading-7 font-bold text-white ${
                  compactWidth ? 'text-[18px]' : 'text-[20px]'
                }`}
              >
                {todayEventCount === 1 ? 'event' : 'events'} today
              </Typography>
            </View>
          </View>

          <GesturePressable
            accessibilityLabel="Open notifications"
            accessibilityRole="button"
            className="relative h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 active:opacity-75"
            onPress={() => router.push('/reminders')}
          >
            <Bell color={numigosTheme.colors.surface} size={18} strokeWidth={2} />
            {HAS_UNREAD_NOTIFICATIONS ? (
              <View className="border-brand bg-home-highlight absolute top-[7px] right-[7px] h-2 w-2 rounded-full border" />
            ) : null}
          </GesturePressable>
        </View>

        <View className="mt-4 h-12 flex-row items-center rounded-full bg-white px-4">
          <Search color={numigosTheme.colors.homeMuted} size={16} strokeWidth={2} />
          <TextInput
            accessibilityLabel="Search events and societies"
            className="text-home-ink ml-2.5 h-12 flex-1 font-sans text-[11px]"
            onChangeText={handleSearchChange}
            placeholder="Search events & societies"
            placeholderTextColor={numigosTheme.colors.homeMuted}
            returnKeyType="search"
            value={query}
          />
        </View>
      </View>

      <View className="bg-surface flex-1 pt-4">
        <FlatList
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          data={hasFollowedSocieties ? visiblePosts : []}
          ItemSeparatorComponent={() => <View className="h-3" />}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            hasFollowedSocieties ? (
              <View className="items-center px-8 py-7">
                <Typography className="text-home-ink text-sm font-semibold">
                  No society updates found
                </Typography>
                <Typography className="text-home-muted mt-1 text-center text-xs">
                  Try another search.
                </Typography>
              </View>
            ) : null
          }
          ListHeaderComponent={listHeader}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.35}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}
