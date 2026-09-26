import { Typography } from 'heroui-native';
import {
  Bell,
  Building2,
  CalendarCheck,
  ChevronRight,
  Clock3,
  FilePlus2,
  LogOut,
  Mail,
  UserRound,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { supabase } from '@/lib/supabase';
import { numigosTheme } from '@/lib/theme';

type MenuItemProps = { icon: typeof Bell; label: string; detail?: string; onPress: () => void };
function MenuItem({ icon: Icon, label, detail, onPress }: MenuItemProps) {
  return (
    <GesturePressable
      accessibilityRole="button"
      className="border-home-card-border flex-row items-center border-b px-4 py-3.5 active:opacity-65"
      onPress={onPress}
    >
      <View className="bg-brand-mist h-10 w-10 items-center justify-center rounded-full">
        <Icon color={numigosTheme.colors.brand} size={18} />
      </View>
      <View className="min-w-0 flex-1 px-3">
        <Typography className="text-home-ink text-[12px] font-semibold" numberOfLines={1}>
          {label}
        </Typography>
        {detail ? (
          <Typography className="text-home-muted mt-0.5 text-[9px]" numberOfLines={1}>
            {detail}
          </Typography>
        ) : null}
      </View>
      <ChevronRight color={numigosTheme.colors.homeMuted} size={17} />
    </GesturePressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };
  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-safe-offset-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-3 pb-3">
          <Typography className="font-display text-home-ink text-[24px] leading-8 font-bold">
            Profile
          </Typography>
        </View>
        <View className="bg-brand mx-4 items-center rounded-3xl px-5 py-6">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <UserRound color="white" size={34} />
          </View>
          <Typography className="font-display mt-3 text-[20px] font-bold text-white">
            Areeba Khan
          </Typography>
          <View className="mt-1 flex-row items-center">
            <Mail color="rgba(255,255,255,0.68)" size={12} />
            <Typography className="ml-1 text-[10px] text-white/70">
              areeba.khan@nutech.edu.pk
            </Typography>
          </View>
          <View className="mt-4 flex-row gap-2">
            <View className="rounded-full bg-white/15 px-3 py-1.5">
              <Typography className="text-[9px] font-semibold text-white">
                BS Computer Science
              </Typography>
            </View>
            <View className="rounded-full bg-white/15 px-3 py-1.5">
              <Typography className="text-[9px] font-semibold text-white">Semester 5</Typography>
            </View>
          </View>
        </View>

        <Typography className="text-home-muted px-5 pt-6 pb-2 text-[9px] font-bold">
          MY CAMPUS
        </Typography>
        <View className="border-home-card-border bg-surface mx-4 overflow-hidden rounded-2xl border">
          <MenuItem
            detail="3 upcoming events"
            icon={CalendarCheck}
            label="My registered events"
            onPress={() => router.push('/events/registered')}
          />
          <MenuItem
            detail="Your attended events"
            icon={Clock3}
            label="Event history"
            onPress={() => router.push('/events/history')}
          />
          <MenuItem
            detail="Updates and deadlines"
            icon={Bell}
            label="Reminders & notifications"
            onPress={() => router.push('/reminders')}
          />
        </View>

        <Typography className="text-home-muted px-5 pt-6 pb-2 text-[9px] font-bold">
          SOCIETIES
        </Typography>
        <View className="border-home-card-border bg-surface mx-4 overflow-hidden rounded-2xl border">
          <MenuItem
            detail="Find clubs on campus"
            icon={Building2}
            label="Explore societies"
            onPress={() => router.push('/societies')}
          />
          <MenuItem
            detail="Send a request to Student Affairs"
            icon={FilePlus2}
            label="Register a society"
            onPress={() => router.push('/societies/register')}
          />
        </View>

        <GesturePressable
          accessibilityRole="button"
          className="border-error/20 bg-error-soft mx-4 mt-6 h-12 flex-row items-center justify-center rounded-full border active:opacity-75"
          onPress={() => void signOut()}
        >
          <LogOut color={numigosTheme.colors.error} size={17} />
          <Typography className="text-error ml-2 text-[12px] font-bold">Sign out</Typography>
        </GesturePressable>
      </ScrollView>
    </SafeAreaView>
  );
}
