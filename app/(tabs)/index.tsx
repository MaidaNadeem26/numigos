import { Typography } from 'heroui-native';
import { Bell, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, TextInput, View } from 'react-native';

import { EventCard, SocietyPostCard } from '@/components/home/FeedCards';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { HOME_FEED, type FeedItem } from '@/lib/home-feed';
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
  const eventCount = useMemo(() => HOME_FEED.filter((item) => item.type === 'event').length, []);

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
    return (
      <View className="mb-2.5 px-5">
        {item.type === 'event' ? (
          <EventCard
            item={item}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
          />
        ) : (
          <SocietyPostCard item={item} />
        )}
      </View>
    );
  }, []);

  return (
    <SafeAreaView className="bg-brand flex-1" edges={['top']}>
      <View className="bg-brand px-5 pt-2 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Typography className="text-[11px] font-medium text-white/70">{dateLabel}</Typography>
            <Typography className="font-display mt-0.5 text-[20px] leading-6 font-bold text-white">
              {eventCount} events happening today
            </Typography>
          </View>

          <GesturePressable
            accessibilityLabel="Open notifications"
            accessibilityRole="button"
            className="relative h-9 w-9 items-center justify-center rounded-full bg-white/15 active:opacity-75"
          >
            <Bell color="#ffffff" size={18} strokeWidth={2} />
            <View className="border-brand absolute top-[7px] right-[7px] h-2 w-2 rounded-full border bg-[#E9A44F]" />
          </GesturePressable>
        </View>

        <View className="mt-3 h-11 flex-row items-center rounded-full bg-white px-4">
          <Search color={numigosTheme.colors.inkMuted} size={17} strokeWidth={2} />
          <TextInput
            accessibilityLabel="Search events and societies"
            className="text-ink ml-2.5 h-11 flex-1 font-sans text-[12px]"
            onChangeText={handleSearchChange}
            placeholder="Search events & societies"
            placeholderTextColor={numigosTheme.colors.inkMuted}
            returnKeyType="search"
            value={query}
          />
        </View>
      </View>

      <View className="bg-canvas flex-1 pt-3">
        <ScrollView
          className="mb-3 max-h-8"
          contentContainerClassName="gap-2 px-5"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {FILTERS.map((filter) => {
            const selected = filter === activeFilter;
            return (
              <GesturePressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={`h-7 items-center justify-center rounded-full px-3.5 active:opacity-75 ${
                  selected ? 'bg-brand' : 'border-line bg-surface border'
                }`}
                key={filter}
                onPress={() => handleFilterChange(filter)}
              >
                <Typography
                  className={`text-[10px] font-semibold ${selected ? 'text-white' : 'text-ink-muted'}`}
                >
                  {filter}
                </Typography>
              </GesturePressable>
            );
          })}
        </ScrollView>

        <FlatList
          contentContainerStyle={{ paddingBottom: 12, flexGrow: visibleFeed.length === 0 ? 1 : 0 }}
          data={visibleFeed}
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
