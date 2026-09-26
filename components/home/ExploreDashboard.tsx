import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
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
      <Typography className="text-foreground text-[14px] font-bold">{title}</Typography>
      <GesturePressable accessibilityRole="button" onPress={onPress}>
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
      <View className="bg-accent h-[102px] overflow-hidden rounded-[15px] px-3 py-2.5">
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
          <View className="h-7 w-7 items-center justify-center rounded-full bg-white/90">
            <Ionicons color={colors.brand} name="bookmark-outline" size={14} />
          </View>
        </View>
        <View className="mt-auto">
          <View className="mb-1 flex-row items-center gap-1">
            <View
              className="h-3.5 w-3.5 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.brandDeep }}
            >
              <Ionicons color={colors.brandMist} name="cloud-outline" size={9} />
            </View>
            <Typography className="text-[7px] font-semibold text-white">
              AWS Cloud Club NUTECH
            </Typography>
          </View>
          <Typography className="text-[17px] leading-[19px] font-bold text-white">
            Cloud Study Jam: AWS DeepRacer
          </Typography>
        </View>
      </View>
      <View className="bg-white px-3 pt-2 pb-2.5">
        <View className="flex-row items-center gap-1">
          <Ionicons color={colors.inkMuted} name="time-outline" size={11} />
          <Typography className="text-muted text-[9px] font-semibold">
            Today · 2:00 PM – 5:00 PM
          </Typography>
        </View>
        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons color={colors.inkMuted} name="location-outline" size={11} />
          <Typography className="text-muted text-[9px]">
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
            <Typography className="text-muted ml-2 text-[8px]">142 attending</Typography>
          </View>
          <GesturePressable
            className="bg-accent rounded-full px-5 py-1.5"
            onPress={() => router.push('/event/event-cloud-study-jam')}
          >
            <Typography className="text-[9px] font-bold text-white">Register</Typography>
          </GesturePressable>
        </View>
      </View>
    </GesturePressable>
  );
}

function ClubCard({ club }: { club: (typeof CLUBS)[number] }) {
  return (
    <GesturePressable
      className="flex-1 flex-row items-center rounded-xl bg-white p-2"
      onPress={() => router.push('/societies')}
      style={{
        shadowColor: '#15251f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <View className="bg-brand-mist mr-2 h-8 w-8 items-center justify-center rounded-full">
        <Ionicons color={colors.brand} name={club.icon} size={15} />
      </View>
      <View className="min-w-0 flex-1">
        <Typography numberOfLines={1} className="text-foreground text-[9px] font-bold">
          {club.name}
        </Typography>
        <Typography className="text-muted text-[7px]">{club.members}</Typography>
      </View>
      <View
        className={
          club.joined ? 'bg-default rounded-full px-2 py-1' : 'bg-accent rounded-full px-2 py-1'
        }
      >
        <Typography
          className={
            club.joined
              ? 'text-muted text-[7px] font-semibold'
              : 'text-[7px] font-semibold text-white'
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
      className="flex-1 overflow-hidden rounded-xl bg-white"
      onPress={() => router.push(item.route)}
      style={{
        shadowColor: '#15251f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View className="h-[50px] px-2 py-2" style={{ backgroundColor: item.tone }}>
        <Typography className="text-[7px] font-semibold" style={{ color: item.accent }}>
          {item.category}
        </Typography>
      </View>
      <View className="min-h-[87px] px-2 pt-1.5 pb-2">
        <Typography
          numberOfLines={2}
          className="text-foreground text-[10px] leading-[12px] font-bold"
        >
          {item.title}
        </Typography>
        <View className="mt-1 flex-row items-center gap-1">
          <View className="bg-default h-2.5 w-2.5 rounded-full" />
          <Typography className="text-muted text-[7px]">{item.society}</Typography>
        </View>
        <View className="mt-auto flex-row items-end justify-between pt-2">
          <View>
            <Typography className="text-accent text-[7px] font-semibold">{item.date}</Typography>
            <Typography className="text-muted mt-0.5 text-[6px]">{item.venue}</Typography>
          </View>
          <Ionicons color={colors.inkMuted} name="bookmark-outline" size={12} />
        </View>
      </View>
    </GesturePressable>
  );
}

export function ExploreDashboard() {
  const { width } = useWindowDimensions();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const contentWidth = useMemo(() => Math.min(width, 560), [width]);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
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
            <Typography className="text-foreground text-[23px] font-extrabold tracking-[-0.7px]">
              Explore
            </Typography>
            <View className="flex-row items-center gap-2">
              <GesturePressable
                className="h-9 w-9 items-center justify-center rounded-full bg-white"
                onPress={() => router.push('/reminders')}
              >
                <Ionicons color={colors.ink} name="notifications-outline" size={18} />
                <View className="bg-danger absolute top-2 right-2 h-1.5 w-1.5 rounded-full" />
              </GesturePressable>
              <GesturePressable
                className="bg-default h-9 w-9 items-center justify-center rounded-full"
                onPress={() => router.push('/(tabs)/profile')}
              >
                <Ionicons color={colors.inkMuted} name="person" size={20} />
              </GesturePressable>
            </View>
          </View>

          <View className="mt-4 flex-row items-center gap-2">
            <View className="h-10 flex-1 flex-row items-center rounded-full bg-white px-3.5">
              <Ionicons color={colors.inkMuted} name="search-outline" size={16} />
              <TextInput
                className="text-foreground ml-2 flex-1 text-[11px]"
                placeholder="Search hackathons, clubs, expos..."
                placeholderTextColor={colors.inkMuted}
              />
            </View>
            <GesturePressable
              className="bg-accent h-10 w-10 items-center justify-center rounded-full"
              onPress={() => setActiveFilter('All')}
            >
              <Ionicons color="white" name="options-outline" size={18} />
            </GesturePressable>
          </View>

          <ScrollView
            className="-mx-4 mt-3"
            contentContainerClassName="gap-2 px-4"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {FILTERS.map((filter) => {
              const active = filter === activeFilter;
              return (
                <GesturePressable
                  className={
                    active
                      ? 'bg-accent rounded-full px-4 py-1.5'
                      : 'bg-default rounded-full px-4 py-1.5'
                  }
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Typography
                    className={
                      active
                        ? 'text-[8px] font-bold text-white'
                        : 'text-muted text-[8px] font-semibold'
                    }
                  >
                    {filter}
                  </Typography>
                </GesturePressable>
              );
            })}
          </ScrollView>

          <View className="mt-3">
            <FeaturedCard />
          </View>

          <View className="mt-4">
            <SectionHeader title="Clubs & Societies" onPress={() => router.push('/societies')} />
            <View className="flex-row gap-2">
              {CLUBS.map((club) => (
                <ClubCard club={club} key={club.name} />
              ))}
            </View>
          </View>

          <View className="mt-4">
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
