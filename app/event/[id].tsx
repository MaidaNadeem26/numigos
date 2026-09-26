import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Share2,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  Share,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { HOME_FEED, type EventFeedItem } from '@/lib/home-feed';
import { goBackOrReplace } from '@/lib/navigation';
import { numigosTheme } from '@/lib/theme';

const { colors } = numigosTheme;
const HERO_IMAGE = require('@/assets/images/numigos-campus-event-hero.png');

const eventDetails = {
  date: 'Saturday, Sep 26, 2024',
  timing: '2:00 PM – 5:00 PM PKT',
  duration: '3 Hours',
  venue: 'Main Auditorium, Academic Block 2',
  filled: 142,
  capacity: 200,
  description:
    'Get hands-on experience training reinforcement learning models with AWS DeepRacer and explore foundational Generative AI tools on AWS Cloud. Free cloud credits and official participation certificates provided by AWS Academic Alliance. Bring your laptops!',
  highlights: [
    'Hands-on AWS Console access with preloaded credits',
    'Live simulation races on the virtual DeepRacer track',
    'Networking with student cloud ambassadors and senior peers',
    'Refreshments provided by the student council',
  ],
};

function IconButton({
  accessibilityLabel,
  children,
  onPress,
  selected,
}: {
  accessibilityLabel: string;
  children: React.ReactNode;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <GesturePressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
    >
      {children}
    </GesturePressable>
  );
}

function DetailCard({
  icon,
  label,
  children,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <View className="border-border flex-row items-center rounded-[22px] border bg-white p-4">
      <View className="bg-surface-secondary mr-4 h-14 w-14 items-center justify-center rounded-2xl">
        {icon}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-muted text-xs font-semibold uppercase">{label}</Text>
        {children}
      </View>
      {trailing}
    </View>
  );
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const [registered, setRegistered] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const event = useMemo(
    () => HOME_FEED.find((item): item is EventFeedItem => item.type === 'event' && item.id === id),
    [id],
  );

  if (!event) {
    return (
      <SafeAreaView
        className="bg-background flex-1 items-center justify-center px-6"
        edges={['top', 'right', 'bottom', 'left']}
      >
        <Text className="text-foreground text-xl font-bold">Event not found</Text>
        <GesturePressable
          accessibilityLabel="Back to Explore"
          accessibilityRole="button"
          onPress={() => goBackOrReplace('/(tabs)/explore')}
          className="bg-accent mt-5 rounded-full px-6 py-3"
        >
          <Text className="font-semibold text-white">Back to Explore</Text>
        </GesturePressable>
      </SafeAreaView>
    );
  }

  const contentWidth = Math.min(width, 760);
  const heroHeight = Math.min(
    360,
    Math.max(height < 700 ? 220 : 260, Math.min(width * 0.7, height * 0.46)),
  );
  const fillPercent = Math.round((eventDetails.filled / eventDetails.capacity) * 100);

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'right', 'bottom', 'left']}>
      <View className="flex-1 self-center" style={{ width: contentWidth }}>
        <View className="flex-row items-center px-4 py-3">
          <IconButton
            accessibilityLabel="Go back"
            onPress={() => goBackOrReplace('/(tabs)/explore')}
          >
            <ArrowLeft size={24} color={colors.ink} strokeWidth={2.2} />
          </IconButton>
          <Text className="text-foreground ml-3 flex-1 text-2xl font-bold">Event Details</Text>
          <View className="bg-accent-soft h-11 w-11 items-center justify-center rounded-full border-2 border-white">
            <UserRound size={22} color={colors.brand} />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 108, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={HERO_IMAGE}
            resizeMode="cover"
            imageStyle={{ borderRadius: 26 }}
            style={{ width: '100%', height: heroHeight }}
          >
            <LinearGradient
              colors={['rgba(3,49,41,0.03)', 'rgba(3,49,41,0.9)']}
              className="flex-1 justify-between rounded-[26px] p-4"
            >
              <View className="flex-row flex-wrap justify-between gap-2">
                <View className="flex-row items-center rounded-full bg-white px-3.5 py-2">
                  <View className="bg-accent mr-2 h-2.5 w-2.5 rounded-full" />
                  <Text className="text-foreground font-semibold">Technology & Cloud</Text>
                </View>
                <View className="flex-row items-center rounded-full bg-[#FFD39B] px-3.5 py-2">
                  <Star size={17} color="#68421F" />
                  <Text className="ml-2 font-semibold text-[#4A2D14]">Featured Event</Text>
                </View>
              </View>
              <View>
                <View className="mb-3 flex-row items-center self-start rounded-full bg-[#A8D8C9] px-3.5 py-2">
                  <BriefcaseBusiness size={17} color={colors.brand} />
                  <Text className="text-primary ml-2 font-semibold">Workshop & Hackathon</Text>
                </View>
                <Text className="text-[30px] leading-9 font-bold text-white">{event.title}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>

          <GesturePressable
            accessibilityLabel="Open AWS Cloud Club NUTECH"
            accessibilityRole="button"
            onPress={() => router.push('/societies/aws-cloud-club')}
            className="border-border flex-row items-center rounded-[22px] border bg-white p-4"
          >
            <Image
              source={event.image}
              resizeMode="cover"
              style={{ width: 58, height: 58, borderRadius: 29 }}
            />
            <View className="ml-3 min-w-0 flex-1">
              <View className="flex-row items-center">
                <Text className="text-foreground shrink text-lg font-bold" numberOfLines={1}>
                  AWS Cloud Club NUTECH
                </Text>
                <ShieldCheck className="ml-1" size={19} color={colors.brand} />
              </View>
              <Text className="text-muted mt-0.5 text-sm">
                Student Society Chapter · 480 Members
              </Text>
            </View>
            <View className="bg-surface-secondary ml-2 flex-row items-center rounded-2xl px-3 py-2.5">
              <Text className="text-primary text-xl">＋</Text>
              <Text className="text-primary ml-1 font-semibold">Join</Text>
            </View>
          </GesturePressable>

          <DetailCard
            icon={<CalendarDays size={25} color={colors.brand} />}
            label="Date & schedule"
            trailing={
              <View className="rounded-full bg-[#FFE0B3] px-3 py-1.5">
                <Text className="text-xs font-bold text-[#704515]">This Week</Text>
              </View>
            }
          >
            <Text className="text-foreground mt-1 text-lg font-semibold">{eventDetails.date}</Text>
          </DetailCard>

          <DetailCard
            icon={<Clock3 size={25} color="#875118" />}
            label="Session timing"
            trailing={<Text className="text-muted text-sm">{eventDetails.duration}</Text>}
          >
            <Text className="text-foreground mt-1 text-lg font-semibold">
              {eventDetails.timing}
            </Text>
          </DetailCard>

          <DetailCard
            icon={<MapPin size={26} color="#972D36" />}
            label="Campus venue"
            trailing={<ChevronRight size={22} color={colors.inkMuted} />}
          >
            <Text className="text-foreground mt-1 text-lg font-semibold" numberOfLines={2}>
              {eventDetails.venue}
            </Text>
          </DetailCard>

          <View className="border-border rounded-[22px] border bg-white p-5">
            <View className="flex-row flex-wrap items-baseline gap-x-2 gap-y-1">
              <View className="bg-accent h-3 w-3 rounded-full" />
              <Text className="text-foreground text-xl font-bold">Capacity Status</Text>
              <Text className="text-primary text-base font-semibold">
                {eventDetails.filled} / {eventDetails.capacity} seats filled ({fillPercent}%)
              </Text>
            </View>
            <View className="bg-surface-secondary mt-4 h-3 overflow-hidden rounded-full">
              <LinearGradient
                colors={[colors.brand, '#39856E']}
                className="h-full rounded-full"
                style={{ width: `${fillPercent}%` }}
              />
            </View>
            <View className="mt-5 flex-row items-center self-start rounded-xl bg-[#FDE2E3] px-3 py-2">
              <Clock3 size={17} color="#922F39" />
              <Text className="ml-2 font-semibold text-[#8C2C35]">
                Registration closes in: 4 hours
              </Text>
            </View>
            <View className="bg-surface-secondary mt-2 flex-row items-center self-start rounded-xl px-3 py-2">
              <GraduationCap size={18} color={colors.inkMuted} />
              <Text className="text-muted ml-2 text-sm">Open to all NUTECH Undergraduates</Text>
            </View>
          </View>

          <View className="border-border rounded-[22px] border bg-white p-5">
            <View className="flex-row items-center">
              <BriefcaseBusiness size={24} color={colors.ink} />
              <Text className="text-foreground ml-3 text-2xl font-bold">About Event</Text>
            </View>
            <Text className="text-foreground mt-5 text-base leading-7">
              {eventDetails.description}
            </Text>
            <View className="bg-surface-secondary mt-5 rounded-2xl p-4">
              <Text className="text-muted mb-3 text-xs font-bold uppercase">
                Key highlights & perks
              </Text>
              {eventDetails.highlights.map((highlight) => (
                <View key={highlight} className="mb-3 flex-row items-start last:mb-0">
                  <View className="mt-0.5 mr-3 h-6 w-6 items-center justify-center rounded-full bg-white">
                    <Check size={14} color={colors.brand} strokeWidth={3} />
                  </View>
                  <Text className="text-foreground min-w-0 flex-1 text-sm leading-6">
                    {highlight}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="border-border rounded-[22px] border bg-white p-5">
            <Text className="text-muted text-xs font-bold uppercase">Organized by</Text>
            <View className="mt-4 flex-row items-center">
              <View className="bg-accent-soft h-12 w-12 items-center justify-center rounded-full">
                <UserRound size={23} color={colors.brand} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-foreground text-base font-bold">Usman Tariq</Text>
                <Text className="text-muted text-sm">
                  President, BS Computer Science ’25 · Student Lead
                </Text>
              </View>
            </View>
            <View className="mt-4 flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#FFF1DF]">
                <GraduationCap size={24} color="#875118" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-foreground text-base font-bold">Dr. Kamran Ahsan</Text>
                <Text className="text-muted text-sm">Faculty Advisor, Dept. of Computing</Text>
              </View>
            </View>
            <GesturePressable
              accessibilityLabel="Contact organizer by email"
              accessibilityRole="button"
              className="bg-surface-secondary mt-5 min-h-11 flex-row items-center justify-center rounded-2xl py-3.5"
              onPress={() => {
                void Linking.openURL('mailto:studentaffairs@nutech.edu.pk').catch(() => {
                  Alert.alert(
                    'Email unavailable',
                    'Please contact Student Affairs through the NUTECH portal.',
                  );
                });
              }}
            >
              <Mail size={20} color={colors.inkMuted} />
              <Text className="text-foreground ml-2 font-semibold">Contact Organizer</Text>
            </GesturePressable>
          </View>
        </ScrollView>

        <View className="border-border flex-row gap-3 border-t bg-white px-4 py-3">
          <IconButton
            accessibilityLabel={bookmarked ? 'Remove saved event' : 'Save event'}
            onPress={() => setBookmarked((value) => !value)}
            selected={bookmarked}
          >
            <Bookmark
              size={23}
              color={bookmarked ? colors.brand : colors.ink}
              fill={bookmarked ? colors.brand : 'transparent'}
            />
          </IconButton>
          <IconButton
            accessibilityLabel="Share event"
            onPress={() => {
              void Share.share({ message: `${event.title} at NUTECH — ${eventDetails.date}` });
            }}
          >
            <Share2 size={23} color={colors.ink} />
          </IconButton>
          <GesturePressable
            accessibilityLabel={registered ? 'Cancel event registration' : 'Register for event'}
            accessibilityRole="button"
            accessibilityState={{ selected: registered }}
            onPress={() => setRegistered((value) => !value)}
            className="bg-accent min-h-11 flex-1 flex-row items-center justify-center rounded-2xl px-4"
          >
            <Text className="text-base font-bold text-white">
              {registered ? 'Registration Confirmed' : 'Register for Event'}
            </Text>
            {registered ? (
              <Check className="ml-2" size={20} color="white" />
            ) : (
              <ArrowRight className="ml-2" size={20} color="white" />
            )}
          </GesturePressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
