import { Typography } from 'heroui-native';
import { Bookmark, CalendarDays, Check, MapPin, Share2, Users } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';

import { ScreenHeader } from '@/components/student/ScreenHeader';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { getEventById, STUDENT_BOOKMARK_IDS, STUDENT_REGISTRATION_IDS } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = getEventById(id);
  const [bookmarked, setBookmarked] = useState(Boolean(id && STUDENT_BOOKMARK_IDS.includes(id)));
  const [registered, setRegistered] = useState(
    Boolean(id && STUDENT_REGISTRATION_IDS.includes(id)),
  );

  if (!event) {
    return (
      <SafeAreaView className="bg-background flex-1">
        <ScreenHeader title="Event details" />
        <View className="flex-1 items-center justify-center px-6">
          <Typography className="text-home-ink text-lg font-bold">Event not found</Typography>
          <Typography className="text-home-muted mt-2 text-center text-sm">
            This event is no longer available.
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <ScreenHeader
        title="Event details"
        right={
          <GesturePressable
            accessibilityLabel="Share event"
            accessibilityRole="button"
            className="bg-home-chip h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          >
            <Share2 color={numigosTheme.colors.homeInk} size={18} />
          </GesturePressable>
        }
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-safe-offset-28"
        showsVerticalScrollIndicator={false}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={event.image}
          style={{ width: '100%', height: 220 }}
        />
        <View className="px-4 py-5">
          <View className="bg-brand-mist self-start rounded-full px-2.5 py-1">
            <Typography className="text-brand text-[9px] font-bold">{event.category}</Typography>
          </View>
          <Typography className="font-display text-home-ink mt-3 text-[25px] leading-8 font-bold">
            {event.title}
          </Typography>
          <Typography className="text-brand mt-2 text-[12px] font-semibold">
            Hosted by {event.society}
          </Typography>

          <View className="border-home-card-border bg-surface mt-5 gap-4 rounded-2xl border p-4">
            <View className="flex-row items-center">
              <View className="bg-brand-mist h-9 w-9 items-center justify-center rounded-full">
                <CalendarDays color={numigosTheme.colors.brand} size={17} />
              </View>
              <View className="min-w-0 flex-1 pl-3">
                <Typography className="text-home-ink text-[12px] font-semibold">
                  {event.schedule}
                </Typography>
                <Typography className="text-home-muted mt-0.5 text-[9px]">
                  Add to your campus calendar
                </Typography>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-brand-mist h-9 w-9 items-center justify-center rounded-full">
                <MapPin color={numigosTheme.colors.brand} size={17} />
              </View>
              <View className="min-w-0 flex-1 pl-3">
                <Typography className="text-home-ink text-[12px] font-semibold">
                  {event.location ?? 'NUTECH Main Campus'}
                </Typography>
                <Typography className="text-home-muted mt-0.5 text-[9px]">Islamabad</Typography>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-brand-mist h-9 w-9 items-center justify-center rounded-full">
                <Users color={numigosTheme.colors.brand} size={17} />
              </View>
              <View className="min-w-0 flex-1 pl-3">
                <Typography className="text-home-ink text-[12px] font-semibold">
                  {event.attendees ?? 64} students attending
                </Typography>
                <Typography className="text-home-muted mt-0.5 text-[9px]">
                  Open to all NUTECH students
                </Typography>
              </View>
            </View>
          </View>

          <Typography className="font-display text-home-ink mt-6 text-[17px] font-bold">
            About this event
          </Typography>
          <Typography className="text-ink-muted mt-2 text-[12px] leading-5">
            {event.description ??
              `Join ${event.society} for ${event.title}, a student-led campus event designed to help you meet people, learn something new, and take part in university life.`}
          </Typography>
        </View>
      </ScrollView>
      <View className="border-home-card-border bg-surface pb-safe-offset-3 flex-row gap-3 border-t px-4 pt-3">
        <GesturePressable
          accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
          accessibilityRole="button"
          className="border-home-card-border h-12 w-12 items-center justify-center rounded-full border active:opacity-70"
          onPress={() => setBookmarked((value) => !value)}
        >
          <Bookmark
            color={bookmarked ? numigosTheme.colors.brand : numigosTheme.colors.homeMuted}
            fill={bookmarked ? numigosTheme.colors.brand : 'transparent'}
            size={20}
          />
        </GesturePressable>
        <GesturePressable
          accessibilityRole="button"
          className={`h-12 flex-1 flex-row items-center justify-center rounded-full ${registered ? 'bg-brand-soft' : 'bg-brand'} active:opacity-80`}
          onPress={() => setRegistered((value) => !value)}
        >
          {registered ? <Check color={numigosTheme.colors.brand} size={18} /> : null}
          <Typography
            className={`ml-1 text-[13px] font-bold ${registered ? 'text-brand' : 'text-white'}`}
          >
            {registered ? 'Registered' : 'Register now'}
          </Typography>
        </GesturePressable>
      </View>
    </SafeAreaView>
  );
}
