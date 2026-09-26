import { Typography } from 'heroui-native';
import { Bell, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, TextInput, View } from 'react-native';

import { EventCard, SocietyPostCard } from '@/components/home/FeedCards';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { HOME_FEED, type FeedItem } from '@/lib/home-feed';
import { supabase } from '@/lib/supabase';
import { numigosTheme } from '@/lib/theme';

const FILTERS = ['All', 'Events', 'Society posts', 'Sports'] as const;
type FeedFilter = (typeof FILTERS)[number];

const INITIAL_ITEM_COUNT = 4;
const PAGE_SIZE = 2;

function matchesFilter(item: FeedItem, filter: FeedFilter) {
  if (filter === 'Events') return item.type === 'event';
  if (filter === 'Society posts') return item.type === 'post';
  if (filter === 'Sports') return item.society.toLowerCase().includes('sports');
  return true;
}

function searchableText(item: FeedItem) {
  if (item.type === 'event') return `${item.title} ${item.society} ${item.schedule}`;
  return `${item.society} ${item.caption}`;
}

export default function HomeScreen() {
  const [firstName, setFirstName] = useState('Student');
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('All');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEM_COUNT);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      const metadata = data.session?.user.user_metadata;
      const fullName =
        typeof metadata?.full_name === 'string'
          ? metadata.full_name
          : typeof metadata?.name === 'string'
            ? metadata.name
            : '';
      const nextFirstName = fullName.trim().split(/\s+/)[0];
      if (nextFirstName) setFirstName(nextFirstName);
    });
  }, []);

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
      <View className="mb-4 px-4">
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
      <View className="bg-brand rounded-b-[30px] px-5 pt-3 pb-5">
        <View className="flex-row items-center">
          <View className="min-w-0 flex-1 pr-3">
            <Typography className="font-display text-[23px] font-bold text-white" numberOfLines={1}>
              Hi, {firstName} 👋
            </Typography>
            <Typography className="mt-0.5 text-[13px] text-white/75">
              What&apos;s happening on campus
            </Typography>
          </View>

          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Bell color="#ffffff" size={20} strokeWidth={2} />
            <View className="border-brand bg-error absolute top-2 right-2 h-2 w-2 rounded-full border" />
          </View>

          <GesturePressable
            accessibilityLabel="Open Profile"
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white/70 bg-white active:opacity-80"
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={require('@/assets/images/nutech-logo.png')}
              style={{ width: 29, height: 29 }}
            />
          </GesturePressable>
        </View>

        <View
          className="mt-4 h-12 flex-row items-center rounded-full px-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
        >
          <Search color={numigosTheme.colors.inkMuted} size={19} strokeWidth={2} />
          <TextInput
            accessibilityLabel="Search events and societies"
            className="text-ink ml-2.5 h-12 flex-1 font-sans text-sm"
            onChangeText={handleSearchChange}
            placeholder="Search events & societies"
            placeholderTextColor={numigosTheme.colors.inkMuted}
            returnKeyType="search"
            value={query}
          />
        </View>
      </View>

      <View className="bg-canvas flex-1 pt-4">
        <ScrollView
          className="mb-4 max-h-10"
          contentContainerClassName="gap-2 px-4"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {FILTERS.map((filter) => {
            const selected = filter === activeFilter;
            return (
              <GesturePressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={`h-9 items-center justify-center rounded-full border px-4 active:opacity-75 ${
                  selected ? 'border-brand bg-brand' : 'border-line bg-surface'
                }`}
                key={filter}
                onPress={() => handleFilterChange(filter)}
              >
                <Typography
                  className={`text-xs font-semibold ${selected ? 'text-white' : 'text-ink-muted'}`}
                >
                  {filter}
                </Typography>
              </GesturePressable>
            );
          })}
        </ScrollView>

        <FlatList
          contentContainerStyle={{ paddingBottom: 16, flexGrow: visibleFeed.length === 0 ? 1 : 0 }}
          data={visibleFeed}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-8 pb-20">
              <Typography className="text-ink text-base font-semibold">
                No campus updates found
              </Typography>
              <Typography className="text-ink-muted mt-1 text-center text-sm">
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
