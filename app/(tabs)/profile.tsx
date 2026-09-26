import type { LucideIcon } from 'lucide-react-native';
import {
  Bell,
  BellRing,
  Bookmark,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  FileBadge,
  GraduationCap,
  IdCard,
  Lightbulb,
  LogOut,
  Mail,
  PlusCircle,
  ShieldCheck,
  TicketCheck,
  UserRound,
  UsersRound,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Typography } from 'heroui-native';
import { Alert, Image, ScrollView, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { FOLLOWED_SOCIETIES } from '@/lib/home-feed';
import { supabase } from '@/lib/supabase';
import { numigosTheme } from '@/lib/theme';

const PROFILE = {
  name: 'Bilal Ahmad',
  email: 'bilal.ahmad@nutech.edu.pk',
  registration: 'NUTECH-21-CS-084',
  department: 'Department of Computer Science (Batch of 2025)',
  semester: 'Semester 7',
};

const ICON_COLORS = {
  emerald: '#005F49',
  gold: '#8B641D',
  ink: '#17231F',
  muted: '#747B78',
  red: '#D63A3A',
};

function showPortalNotice(title: string) {
  Alert.alert(title, 'This option is managed through the NUTECH student portal.');
}

type StatCardProps = {
  value: number;
  label: string;
  icon: LucideIcon;
  tone?: 'emerald' | 'gold';
};

function StatCard({ value, label, icon: Icon, tone = 'emerald' }: StatCardProps) {
  const color = tone === 'gold' ? ICON_COLORS.gold : ICON_COLORS.emerald;
  const backgroundColor = tone === 'gold' ? '#FFF8EE' : '#F1F8F5';

  return (
    <View className="border-home-card-border bg-surface min-w-0 flex-1 flex-row items-center justify-between rounded-xl border px-3 py-3">
      <View className="min-w-0 flex-1">
        <Typography className="text-home-ink text-[20px] leading-6 font-bold">{value}</Typography>
        <Typography className="text-home-muted mt-1 text-xs font-semibold" numberOfLines={1}>
          {label}
        </Typography>
      </View>
      <View
        className="h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor }}
      >
        <Icon color={color} size={18} strokeWidth={1.7} />
      </View>
    </View>
  );
}

type SettingRowProps = {
  icon: LucideIcon;
  label: string;
  detail: string;
  onPress: () => void;
  destructive?: boolean;
  last?: boolean;
};

function SettingRow({
  icon: Icon,
  label,
  detail,
  onPress,
  destructive = false,
  last = false,
}: SettingRowProps) {
  const color = destructive ? ICON_COLORS.red : ICON_COLORS.ink;

  return (
    <GesturePressable
      accessibilityRole="button"
      className={`mx-3 min-h-16 flex-row items-center py-3 active:opacity-65 ${last ? '' : 'border-home-card-border border-b'}`}
      onPress={onPress}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: destructive ? '#FFF3F3' : '#F3F2EF' }}
      >
        <Icon color={color} size={17} strokeWidth={1.7} />
      </View>
      <View className="min-w-0 flex-1 px-3">
        <Typography
          className={`text-[12px] font-semibold ${destructive ? 'text-error' : 'text-home-ink'}`}
          numberOfLines={1}
        >
          {label}
        </Typography>
        <Typography className="text-home-muted mt-0.5 text-xs" numberOfLines={1}>
          {detail}
        </Typography>
      </View>
      {destructive ? (
        <LogOut color={ICON_COLORS.red} size={17} strokeWidth={1.7} />
      ) : (
        <ChevronRight color={ICON_COLORS.muted} size={16} strokeWidth={1.7} />
      )}
    </GesturePressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const societies = FOLLOWED_SOCIETIES.slice(0, 4);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch {
      Alert.alert("Couldn't sign out", 'Check your connection and try again.');
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-safe-offset-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-[680px]">
          <View className="h-12 flex-row items-center justify-between px-4">
            <View className="flex-row items-center">
              <Image
                accessibilityLabel="NUTECH logo"
                resizeMode="contain"
                source={require('@/assets/images/nutech-logo.png')}
                style={{ height: 16, width: 30 }}
              />
              <Typography className="font-display text-home-ink ml-2 text-[18px] font-bold">
                Profile
              </Typography>
            </View>
            <View className="flex-row items-center gap-3">
              <GesturePressable
                accessibilityLabel="Notification preferences"
                accessibilityRole="button"
                className="relative h-11 w-11 items-center justify-center rounded-full active:bg-black/5"
                onPress={() => router.push('/reminders')}
              >
                <Bell color={ICON_COLORS.ink} size={19} strokeWidth={1.7} />
                <View className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#8B641D]" />
              </GesturePressable>
              <View className="border-brand h-11 w-11 items-center justify-center rounded-full border bg-[#EEF4F1]">
                <UserRound color={numigosTheme.colors.brand} size={20} strokeWidth={1.7} />
              </View>
            </View>
          </View>

          <View className="border-home-card-border bg-surface mx-4 mt-1 items-center rounded-xl border px-4 py-5">
            <View className="border-brand h-[76px] w-[76px] items-center justify-center rounded-full border-2 bg-[#E4F0EB]">
              <UserRound color={numigosTheme.colors.brand} size={38} strokeWidth={1.5} />
            </View>
            <View className="bg-brand -mt-2 flex-row items-center rounded-full px-2.5 py-1">
              <GraduationCap color="white" size={11} strokeWidth={2} />
              <Typography className="ml-1 text-[11px] font-bold text-white">STUDENT</Typography>
            </View>
            <Typography className="font-display text-home-ink mt-2 text-[20px] leading-6 font-bold">
              {PROFILE.name}
            </Typography>
            <View className="mt-2 flex-row items-center rounded-full bg-[#EDF5F2] px-3 py-1">
              <ShieldCheck color={ICON_COLORS.emerald} size={12} strokeWidth={1.8} />
              <Typography className="text-home-ink ml-1.5 text-xs" numberOfLines={1}>
                {PROFILE.email}
              </Typography>
            </View>
            <View className="mt-2 flex-row items-center rounded-sm bg-[#F3F1ED] px-2.5 py-1">
              <IdCard color={ICON_COLORS.ink} size={12} strokeWidth={1.7} />
              <Typography className="text-home-ink ml-1.5 text-xs font-medium">
                Reg No: {PROFILE.registration}
              </Typography>
            </View>
            <Typography className="text-home-muted mt-2 text-center text-xs leading-4">
              {PROFILE.department}
            </Typography>
            <View className="mt-1.5 flex-row items-center">
              <View className="bg-brand mr-1.5 h-1.5 w-1.5 rounded-full" />
              <Typography className="text-brand text-[11px] font-semibold">
                Active Enrolled · {PROFILE.semester}
              </Typography>
            </View>
          </View>

          <View className="mt-4 gap-2 px-4">
            <View className="flex-row gap-2">
              <StatCard icon={CalendarCheck} label="Registered" value={3} />
              <StatCard icon={UsersRound} label="Societies" tone="gold" value={4} />
            </View>
            <View className="flex-row gap-2">
              <StatCard icon={Bookmark} label="Bookmarked" value={8} />
              <StatCard icon={CheckCircle2} label="Attended" value={12} />
            </View>
          </View>

          <View className="mt-4 flex-row items-center justify-between px-4">
            <Typography className="font-display text-home-ink text-[17px] font-bold">
              Campus Activity
            </Typography>
            <Typography className="text-brand text-[11px] font-semibold">
              Fall Semester 2024
            </Typography>
          </View>

          <View className="border-home-card-border bg-surface mx-4 mt-3 rounded-xl border p-3">
            <GesturePressable
              accessibilityRole="button"
              className="flex-row items-center active:opacity-65"
              onPress={() => router.push('/events/registered')}
            >
              <View className="bg-brand h-9 w-9 items-center justify-center rounded-lg">
                <CalendarCheck color="white" size={18} strokeWidth={1.8} />
              </View>
              <View className="min-w-0 flex-1 px-3">
                <Typography className="text-home-ink text-[12px] font-semibold">
                  My Registered Events
                </Typography>
                <Typography className="text-home-muted mt-0.5 text-xs">
                  1 event scheduled for today
                </Typography>
              </View>
              <ChevronRight color={ICON_COLORS.muted} size={16} />
            </GesturePressable>

            <View className="mt-3 flex-row items-center rounded-lg bg-[#F3F2F0] p-2.5">
              <View className="min-w-0 flex-1">
                <View className="flex-row items-center">
                  <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#8B641D]" />
                  <Typography className="text-[11px] font-semibold text-[#75561D]">
                    UPCOMING TODAY
                  </Typography>
                </View>
                <Typography className="text-home-ink mt-0.5 text-[15px] font-semibold">
                  Cloud Study Jam
                </Typography>
                <View className="mt-1 flex-row items-center">
                  <Clock3 color={ICON_COLORS.muted} size={11} />
                  <Typography className="text-home-muted ml-1 text-[11px]">
                    2:00 PM · NUTECH Auditorium 2
                  </Typography>
                </View>
              </View>
              <GesturePressable
                accessibilityRole="button"
                className="bg-brand rounded-sm px-3 py-2 active:opacity-75"
                onPress={() => router.push('/event/event-cloud-study-jam')}
              >
                <Typography className="text-xs font-bold text-white">View Ticket</Typography>
              </GesturePressable>
            </View>
          </View>

          <View className="border-home-card-border bg-surface mx-4 mt-3 rounded-xl border p-3">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#FFF8EE]">
                <UsersRound color={ICON_COLORS.gold} size={18} strokeWidth={1.7} />
              </View>
              <View className="min-w-0 flex-1 px-3">
                <Typography className="text-home-ink text-[12px] font-semibold">
                  My Societies
                </Typography>
                <Typography className="text-home-muted mt-0.5 text-xs">
                  4 active memberships
                </Typography>
              </View>
              <GesturePressable
                accessibilityRole="button"
                className="min-h-11 items-center justify-center px-3 active:opacity-60"
                onPress={() => router.push('/societies')}
              >
                <Typography className="text-brand text-xs font-semibold">Explore All</Typography>
              </GesturePressable>
            </View>
            <View className="mt-4 flex-row justify-between">
              {societies.map((society) => (
                <GesturePressable
                  key={society.id}
                  accessibilityLabel={society.fullName}
                  accessibilityRole="button"
                  className="min-h-11 min-w-[22%] flex-1 items-center justify-center active:opacity-65"
                  onPress={() => router.push(`/societies/${society.id}`)}
                >
                  <View className="border-home-card-border h-11 w-11 items-center justify-center overflow-hidden rounded-full border bg-[#F3F7F5]">
                    <Image
                      resizeMode="cover"
                      source={society.logo}
                      style={{ height: 44, width: 44 }}
                    />
                  </View>
                  <Typography
                    className="text-home-ink mt-1.5 text-center text-[11px] font-medium"
                    numberOfLines={1}
                  >
                    {society.shortName}
                  </Typography>
                </GesturePressable>
              ))}
            </View>
          </View>

          <GesturePressable
            accessibilityRole="button"
            className="border-home-card-border bg-surface mx-4 mt-3 min-h-16 flex-row items-center rounded-xl border px-3 py-3 active:opacity-65"
            onPress={() => router.push('/bookmarks')}
          >
            <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#F1F8F5]">
              <Bookmark color={ICON_COLORS.emerald} size={17} strokeWidth={1.7} />
            </View>
            <View className="min-w-0 flex-1 px-3">
              <Typography className="text-home-ink text-[12px] font-semibold">
                Saved &amp; Bookmarked Events
              </Typography>
              <Typography className="text-home-muted mt-0.5 text-xs">
                8 sessions saved for later review
              </Typography>
            </View>
            <ChevronRight color={ICON_COLORS.muted} size={16} />
          </GesturePressable>

          <View className="border-home-card-border bg-surface mx-4 mt-3 rounded-xl border p-3">
            <GesturePressable
              accessibilityRole="button"
              className="flex-row items-center active:opacity-65"
              onPress={() => router.push('/events/history')}
            >
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#F1F8F5]">
                <TicketCheck color={ICON_COLORS.emerald} size={17} strokeWidth={1.7} />
              </View>
              <View className="min-w-0 flex-1 px-3">
                <Typography className="text-home-ink text-[12px] font-semibold">
                  Event Attendance History
                </Typography>
                <Typography className="text-home-muted mt-0.5 text-xs">
                  12 verified attendance records
                </Typography>
              </View>
              <ChevronRight color={ICON_COLORS.muted} size={16} />
            </GesturePressable>
            <GesturePressable
              accessibilityRole="button"
              className="mt-3 min-h-11 flex-row items-center justify-center rounded-md bg-[#F0F1EF] active:opacity-65"
              onPress={() => showPortalNotice('Co-Curricular Transcript')}
            >
              <Download color={ICON_COLORS.emerald} size={13} strokeWidth={1.8} />
              <Typography className="text-home-ink ml-2 text-xs font-medium">
                Download Co-Curricular Transcript (PDF)
              </Typography>
            </GesturePressable>
          </View>

          <View className="bg-brand mx-4 mt-4 rounded-xl p-4">
            <View className="flex-row items-start justify-between">
              <View className="min-w-0 flex-1 pr-3">
                <View className="self-start rounded-sm bg-white/15 px-2 py-1">
                  <Typography className="text-[11px] font-bold text-white">
                    OSA INITIATIVE HUB
                  </Typography>
                </View>
                <Typography className="font-display mt-2 text-[16px] leading-5 font-bold text-white">
                  Register a New Student Society
                </Typography>
                <Typography className="mt-1.5 text-xs leading-4 text-white/75">
                  Have an idea for a new club? Submit a formal charter proposal to the Office of
                  Student Affairs (OSA).
                </Typography>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <Lightbulb color="white" size={19} strokeWidth={1.6} />
              </View>
            </View>
            <GesturePressable
              accessibilityRole="button"
              className="mt-4 min-h-11 flex-row items-center justify-center rounded-md bg-white active:opacity-80"
              onPress={() => router.push('/societies/register')}
            >
              <PlusCircle color={ICON_COLORS.emerald} size={15} strokeWidth={1.8} />
              <Typography className="text-home-ink ml-2 text-xs font-medium">
                Register New Society
              </Typography>
            </GesturePressable>
          </View>

          <View className="border-home-card-border bg-surface mx-4 mt-4 overflow-hidden rounded-xl border">
            <SettingRow
              detail="Event reminders & announcements"
              icon={BellRing}
              label="Notification Preferences"
              onPress={() => router.push('/reminders')}
            />
            <SettingRow
              detail="NUTECH Portal SSO managed"
              icon={FileBadge}
              label="University Credentials & Password"
              onPress={() => showPortalNotice('University Credentials')}
            />
            <SettingRow
              detail="Office of Student Affairs guidance"
              icon={CircleHelp}
              label="Help & OSA Contact"
              onPress={() => showPortalNotice('Help & OSA Contact')}
            />
            <SettingRow
              destructive
              detail="Sign out from NUTECH Portal"
              icon={LogOut}
              label="Logout"
              last
              onPress={() => void signOut()}
            />
          </View>

          <View className="mt-6 flex-row items-center justify-center px-4">
            <Mail color={ICON_COLORS.muted} size={10} strokeWidth={1.6} />
            <Typography className="text-home-muted ml-1.5 text-center text-[11px] font-semibold">
              National University of Technology · Student Portal v2.4.1
            </Typography>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
