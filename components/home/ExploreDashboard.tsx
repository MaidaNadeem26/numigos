import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';
import { Typography } from 'heroui-native';

import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { numigosTheme } from '@/lib/theme';

const colors = numigosTheme.colors;

const FILTERS = ['All', 'Tech & AI', 'Societies', 'Cultural', 'Sports'];

const CLUBS = [
  { icon: 'code-slash' as const, name: 'ACM NUTECH', members: '440 Members', joined: false },
  { icon: 'musical-notes' as const, name: 'Music Club', members: '420 Members', joined: true },
];

const POPULAR = [
  {
    category: 'Tech | Coding',
    title: 'Speed Battle 2024\nCoders Arena',
    society: 'ACM NUTECH',
    date: 'Mon, Sep 28 · 10 AM',
    venue: 'CS Lab 3',
    tone: colors.brandMist,
    accent: colors.brand,
    route: '/event/event-innovation-night',
  },
  {
    category: 'Music & Arts',
    title: 'Acoustic Jam\nCampus Night',
    society: 'NU Music Soc',
    date: 'Tue, Sep 29 · 6:30 PM',
    venue: 'Open Amphitheater',
    tone: colors.errorSoft,
    accent: colors.eventCoral,
    route: '/event/event-cultural-evening',
  },
] as const;

function SectionHeader({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <View className="mb-2 flex-row items-center justify-between">
      <Typography className="text-foreground text-[13px] font-bold">{title}</Typography>
      <GesturePressable
        accessibilityLabel={`See all ${title}`}
        accessibilityRole="button"
        onPress={onPress}
      >
        <Typography className="text-accent text-[10px] font-semibold">See all &gt;</Typography>
      </GesturePressable>
    </View>
  );
}

function FeaturedCard() {
  return (
    <GesturePressable
      accessibilityLabel="Open Cloud Study Jam: AWS DeepRacer"
      accessibilityRole="button"
      className="overflow-hidden rounded-[15px]"
      onPress={() => router.push('/event/event-cloud-study-jam')}
    >
      <View className="bg-accent h-[96px] overflow-hidden rounded-t-[15px] px-3 py-2.5">
        <View
          className="absolute -top-5 -right-3 h-28 w-28 rounded-full"
          style={{ backgroundColor: 'rgba(104,177,154,0.25)' }}
        />
        <View
          className="absolute top-10 right-2 h-16 w-16 rotate-[28deg] rounded-full border"
          style={{
            borderColor: 'rgba(242,204,143,0.36)',
            backgroundColor: 'rgba(242,204,143,0.13)',
          }}
        />
        <View className="flex-row items-start justify-between">
          <View className="bg-home-highlight rounded-full px-2 py-0.5">
            <Typography className="text-foreground text-[8px] font-bold">★ Featured</Typography>
          </View>
          <View className="h-6 w-6 items-center justify-center rounded-full bg-white/90">
            <Ionicons color={colors.brand} name="bookmark-outline" size={12} />
          </View>
        </View>
        <View className="mt-auto">
          <View className="mb-0.5 flex-row items-center gap-1">
            <View
              className="h-3.5 w-3.5 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.brandDeep }}
            >
              <Ionicons color={colors.brandMist} name="cloud-outline" size={8} />
            </View>
            <Typography className="text-[9px] font-semibold text-white">
              AWS Cloud Club NUTECH
            </Typography>
          </View>
          <Typography className="text-[14px] leading-[17px] font-bold text-white" numberOfLines={1}>
            Cloud Study Jam: AWS DeepRacer
          </Typography>
        </View>
      </View>
      <View className="bg-white px-3 pt-2 pb-2.5">
        <View className="flex-row items-center gap-1">
          <Ionicons color={colors.inkMuted} name="time-outline" size={11} />
          <Typography className="text-muted text-[10px] font-semibold">
            Today · 2:00 PM – 5:00 PM
          </Typography>
        </View>
        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons color={colors.inkMuted} name="location-outline" size={11} />
          <Typography className="text-muted min-w-0 flex-1 text-[10px]" numberOfLines={1}>
            Main Auditorium, Academic Block 2
          </Typography>
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            {[0, 1, 2].map((item) => (
              <View
                className="-mr-1 h-4 w-4 rounded-full border border-white"
                key={item}
                style={{
                  backgroundColor:
                    item === 0
                      ? colors.eventCoral
                      : item === 1
                        ? colors.homeHighlight
                        : colors.brand,
                }}
              />
            ))}
            <Typography className="text-muted ml-2 text-[9px]">142 attending</Typography>
          </View>
          <View className="bg-accent items-center justify-center rounded-full px-4 py-1.5">
            <Typography className="text-[10px] font-bold text-white">Register</Typography>
          </View>
        </View>
      </View>
    </GesturePressable>
  );
}

function ClubCard({ club }: { club: (typeof CLUBS)[number] }) {
  return (
    <GesturePressable
      accessibilityLabel={`Open ${club.name}`}
      accessibilityRole="button"
      className="flex-1 flex-row items-center rounded-xl bg-white p-2.5"
      onPress={() => router.push('/societies')}
      style={{
        shadowColor: '#15251f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <View className="bg-brand-mist mr-2 h-7 w-7 items-center justify-center rounded-full">
        <Ionicons color={colors.brand} name={club.icon} size={13} />
      </View>
      <View className="min-w-0 flex-1">
        <Typography numberOfLines={1} className="text-foreground text-[10px] font-bold">
          {club.name}
        </Typography>
        <Typography className="text-muted text-[8px]">{club.members}</Typography>
      </View>
      <View
        className={
          club.joined ? 'bg-default rounded-full px-2 py-1' : 'bg-accent rounded-full px-2 py-1'
        }
      >
        <Typography
          className={
            club.joined
              ? 'text-muted text-[8px] font-semibold'
              : 'text-[8px] font-semibold text-white'
          }
        >
          {club.joined ? 'Joined' : 'Join'}
        </Typography>
      </View>
    </GesturePressable>
  );
}

function PopularCard({ item }: { item: (typeof POPULAR)[number] }) {
  return (
    <GesturePressable
      accessibilityLabel={`Open ${item.title.replace('\n', ' ')}`}
      accessibilityRole="button"
      className="min-w-0 flex-1 overflow-hidden rounded-xl bg-white"
      onPress={() => router.push(item.route)}
      style={{
        shadowColor: '#15251f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View className="h-[44px] px-2 py-1.5" style={{ backgroundColor: item.tone }}>
        <Typography className="text-[8px] font-semibold" style={{ color: item.accent }}>
          {item.category}
        </Typography>
      </View>
      <View className="min-h-[82px] px-2 pt-1.5 pb-2">
        <Typography
          numberOfLines={2}
          className="text-foreground text-[10px] leading-[13px] font-bold"
        >
          {item.title}
        </Typography>
        <View className="mt-1 flex-row items-center gap-1">
          <View className="bg-default h-2 w-2 rounded-full" />
          <Typography className="text-muted min-w-0 flex-1 text-[8px]" numberOfLines={1}>
            {item.society}
          </Typography>
        </View>
        <View className="mt-auto flex-row items-end justify-between pt-2">
          <View>
            <Typography className="text-accent text-[8px] font-semibold">{item.date}</Typography>
            <Typography className="text-muted mt-0.5 text-[7px]" numberOfLines={1}>
              {item.venue}
            </Typography>
          </View>
          <Ionicons color={colors.inkMuted} name="bookmark-outline" size={11} />
        </View>
      </View>
    </GesturePressable>
  );
}

export function ExploreDashboard() {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentWidth = useMemo(() => Math.min(width, 680), [width]);

  useEffect(
    () => () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    },
    [],
  );

  const refresh = () => {
    setRefreshing(true);
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 18 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.brand} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="self-center px-4 pt-1" style={{ width: contentWidth }}>
          <View className="flex-row items-center justify-between">
            <Typography className="text-foreground text-[19px] font-extrabold tracking-[-0.5px]">
              Explore
            </Typography>
            <View className="flex-row items-center gap-2">
              <GesturePressable
                accessibilityLabel="Open notifications"
                accessibilityRole="button"
                className="h-8 w-8 items-center justify-center rounded-full bg-white"
                onPress={() => router.push('/reminders')}
              >
                <Ionicons color={colors.ink} name="notifications-outline" size={15} />
                <View className="bg-danger absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full" />
              </GesturePressable>
              <GesturePressable
                accessibilityLabel="Open profile"
                accessibilityRole="button"
                className="bg-default h-8 w-8 items-center justify-center rounded-full"
                onPress={() => router.push('/(tabs)/profile')}
              >
                <Ionicons color={colors.inkMuted} name="person" size={15} />
              </GesturePressable>
            </View>
          </View>

          <View className="mt-3 flex-row items-center gap-2">
            <View className="h-9 flex-1 flex-row items-center rounded-full bg-white px-3">
              <Ionicons color={colors.inkMuted} name="search-outline" size={14} />
              <TextInput
                accessibilityLabel="Search events and societies"
                className="text-foreground ml-2 min-w-0 flex-1 text-[11px]"
                onChangeText={setQuery}
                placeholder="Search hackathons, clubs, expos..."
                placeholderTextColor={colors.inkMuted}
                returnKeyType="search"
                value={query}
              />
            </View>
            <GesturePressable
              accessibilityLabel="Reset event filters"
              accessibilityRole="button"
              className="bg-accent h-9 w-9 items-center justify-center rounded-full"
              onPress={() => setActiveFilter('All')}
            >
              <Ionicons color="white" name="options-outline" size={15} />
            </GesturePressable>
          </View>

          <ScrollView
            className="-mx-4 mt-2.5"
            contentContainerClassName="gap-1.5 px-4"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {FILTERS.map((filter) => {
              const active = filter === activeFilter;
              return (
                <GesturePressable
                  accessibilityLabel={`Filter by ${filter}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  className={
                    active
                      ? 'bg-accent items-center justify-center rounded-full px-3.5 py-1.5'
                      : 'bg-default items-center justify-center rounded-full px-3.5 py-1.5'
                  }
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Typography
                    className={
                      active
                        ? 'text-[10px] font-bold text-white'
                        : 'text-muted text-[10px] font-semibold'
                    }
                  >
                    {filter}
                  </Typography>
                </GesturePressable>
              );
            })}
          </ScrollView>

          <View className="mt-2.5">
            <FeaturedCard />
          </View>

          <View className="mt-3.5">
            <SectionHeader title="Clubs & Societies" onPress={() => router.push('/societies')} />
            <View className="flex-row gap-2">
              {CLUBS.map((club) => (
                <ClubCard club={club} key={club.name} />
              ))}
            </View>
          </View>

          <View className="mt-3.5">
            <SectionHeader
              title="Popular This Month"
              onPress={() => router.push('/(tabs)/calendar')}
            />
            <View className="flex-row gap-2">
              {POPULAR.map((item) => (
                <PopularCard item={item} key={item.title} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
