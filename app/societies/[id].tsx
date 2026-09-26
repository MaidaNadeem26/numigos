import { Typography } from 'heroui-native';
import { CalendarDays, Check, Plus, Users } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';

import { EventListCard } from '@/components/events/EventListCard';
import { SocietyPostCard } from '@/components/home/FeedCards';
import { ScreenHeader } from '@/components/student/ScreenHeader';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import {
  FOLLOWED_SOCIETIES,
  getAllEvents,
  getFollowedSocietyPosts,
  getSocietyById,
} from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

export default function SocietyProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const society = getSocietyById(id);
  const [followed, setFollowed] = useState(FOLLOWED_SOCIETIES.some((item) => item.id === id));
  const societyEvents = useMemo(
    () =>
      society
        ? getAllEvents()
            .filter((event) => event.society === society.fullName)
            .slice(0, 2)
        : [],
    [society],
  );
  const societyPosts = useMemo(
    () =>
      society
        ? getFollowedSocietyPosts()
            .filter((post) => post.society === society.fullName)
            .slice(0, 1)
        : [],
    [society],
  );

  if (!society)
    return (
      <SafeAreaView className="bg-background flex-1">
        <ScreenHeader fallback="/societies" title="Society profile" />
        <View className="flex-1 items-center justify-center">
          <Typography className="text-home-ink font-bold">Society not found</Typography>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <ScreenHeader fallback="/societies" title="Society profile" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-safe-offset-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center px-4 pt-6 pb-5">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={society.logo}
            style={{ width: 92, height: 92, borderRadius: 46 }}
          />
          <Typography className="font-display text-home-ink mt-4 text-center text-[22px] leading-7 font-bold">
            {society.fullName}
          </Typography>
          <Typography className="text-brand mt-1 text-[11px] font-semibold">
            {society.category}
          </Typography>
          <View className="mt-3 flex-row items-center">
            <Users color={numigosTheme.colors.homeMuted} size={14} />
            <Typography className="text-home-muted ml-1 text-[10px]">
              {society.members ?? 120} members
            </Typography>
            <View className="bg-home-muted mx-2 h-1 w-1 rounded-full" />
            <CalendarDays color={numigosTheme.colors.homeMuted} size={14} />
            <Typography className="text-home-muted ml-1 text-[10px]">
              Est. {society.founded ?? '2022'}
            </Typography>
          </View>
          <GesturePressable
            accessibilityRole="button"
            className={`mt-5 h-11 min-w-[140px] flex-row items-center justify-center rounded-full px-5 ${followed ? 'bg-brand-mist' : 'bg-brand'} active:opacity-80`}
            onPress={() => setFollowed((value) => !value)}
          >
            {followed ? (
              <Check color={numigosTheme.colors.brand} size={17} />
            ) : (
              <Plus color="white" size={17} />
            )}
            <Typography
              className={`ml-1.5 text-[12px] font-bold ${followed ? 'text-brand' : 'text-white'}`}
            >
              {followed ? 'Following' : 'Follow society'}
            </Typography>
          </GesturePressable>
        </View>
        <View className="border-home-card-border bg-surface mx-4 rounded-2xl border p-4">
          <Typography className="font-display text-home-ink text-[16px] font-bold">
            About
          </Typography>
          <Typography className="text-ink-muted mt-2 text-[11px] leading-[18px]">
            {society.description ??
              `${society.fullName} connects NUTECH students through workshops, events, collaborative projects, and a welcoming campus community.`}
          </Typography>
        </View>
        {societyEvents.length ? (
          <View className="px-4 pt-6">
            <Typography className="font-display text-home-ink mb-3 text-[16px] font-bold">
              Upcoming events
            </Typography>
            <View className="gap-3">
              {societyEvents.map((event) => (
                <EventListCard
                  event={event}
                  key={event.id}
                  onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
                />
              ))}
            </View>
          </View>
        ) : null}
        {societyPosts.length ? (
          <View className="px-4 pt-6">
            <Typography className="font-display text-home-ink mb-3 text-[16px] font-bold">
              Latest update
            </Typography>
            {societyPosts.map((post) => (
              <SocietyPostCard item={post} key={post.id} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
