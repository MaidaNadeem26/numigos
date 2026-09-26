import { Typography } from 'heroui-native';
import { Bell, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';

import { EventCard, SocietyPostCard } from '@/components/home/FeedCards';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { HOME_FEED, type FeedItem } from '@/lib/home-feed';
import { HOME_HORIZONTAL_PADDING, isSmallPhone } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

const FILTERS = ['All', 'Events', 'Posts', 'Sports'] as const;
type FeedFilter = (typeof FILTERS)[number];

const INITIAL_ITEM_COUNT = 4;
const PAGE_SIZE = 2;

function matchesFilter(item: FeedItem, filter: FeedFilter) {
  if (filter === 'Events') return item.type === 'event';
  if (filter === 'Posts') return item.type === 'post';
  if (filter === 'Sports') return item.society.toLowerCase().includes('sports');
  return true;
}

function searchableText(item: FeedItem) {
  if (item.type === 'event') return `${item.title} ${item.society} ${item.schedule}`;
  return `${item.society} ${item.caption}`;
}

export default function HomeScreen() {
  const { width: viewportWidth } = useWindowDimensions();
  const compactWidth = isSmallPhone(viewportWidth);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('All');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEM_COUNT);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(new Date()),
    [],
  );
  const todayEventCount = useMemo(
    () =>
      HOME_FEED.filter(
        (item) => item.type === 'event' && item.schedule.toLowerCase().startsWith('today'),
      ).length,
    [],
  );

  const handleFilterChange = useCallback((filter: FeedFilter) => {
    setActiveFilter(filter);
    setVisibleCount(INITIAL_ITEM_COUNT);
  }, []);

  const handleSearchChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setVisibleCount(INITIAL_ITEM_COUNT);
  }, []);

  const filteredFeed = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return HOME_FEED.filter((item) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        searchableText(item).toLowerCase().includes(normalizedQuery);
      return matchesFilter(item, activeFilter) && matchesSearch;
    });
  }, [activeFilter, query]);

  const visibleFeed = useMemo(
    () => filteredFeed.slice(0, visibleCount),
    [filteredFeed, visibleCount],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setVisibleCount(INITIAL_ITEM_COUNT);
    setRefreshing(false);
  }, []);

  const loadNextPage = useCallback(() => {
    setVisibleCount((current) => Math.min(current + PAGE_SIZE, filteredFeed.length));
  }, [filteredFeed.length]);

  const renderFeedItem = useCallback(({ item }: { item: FeedItem }) => {
    return item.type === 'event' ? (
      <EventCard
        item={item}
        onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
      />
    ) : (
      <SocietyPostCard item={item} />
    );
  }, []);

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
                {todayEventCount === 1 ? 'event' : 'events'} happening today
              </Typography>
            </View>
          </View>

          <GesturePressable
            accessibilityLabel="Open notifications"
            accessibilityRole="button"
            className="relative h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 active:opacity-75"
          >
            <Bell color={numigosTheme.colors.surface} size={17} strokeWidth={2} />
            <View className="border-brand bg-home-highlight absolute top-[6px] right-[6px] h-2 w-2 rounded-full border" />
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
        <ScrollView
          className="mb-3"
          contentContainerStyle={{
            alignItems: 'center',
            columnGap: 8,
            paddingHorizontal: HOME_HORIZONTAL_PADDING,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, flexShrink: 0 }}
        >
          {FILTERS.map((filter) => {
            const selected = filter === activeFilter;
            return (
              <GesturePressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={`min-h-8 shrink-0 items-center justify-center rounded-full px-4 py-1.5 active:opacity-75 ${
                  selected ? 'bg-home-ink' : 'bg-home-chip'
                }`}
                key={filter}
                onPress={() => handleFilterChange(filter)}
              >
                <Typography
                  className={`text-[10px] leading-[14px] font-semibold ${
                    selected ? 'text-white' : 'text-home-muted'
                  }`}
                  numberOfLines={1}
                  style={{
                    color: selected ? numigosTheme.colors.surface : numigosTheme.colors.homeMuted,
                  }}
                >
                  {filter}
                </Typography>
              </GesturePressable>
            );
          })}
        </ScrollView>

        <FlatList
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: HOME_HORIZONTAL_PADDING,
            paddingBottom: 12,
            flexGrow: 1,
          }}
          data={visibleFeed}
          ItemSeparatorComponent={() => <View className="h-3" />}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-8 pb-20">
              <Typography className="text-ink text-sm font-semibold">
                No campus updates found
              </Typography>
              <Typography className="text-ink-muted mt-1 text-center text-xs">
                Try another search or filter.
              </Typography>
            </View>
          }
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.35}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          renderItem={renderFeedItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
