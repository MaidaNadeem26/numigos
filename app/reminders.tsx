import { Typography } from 'heroui-native';
import { Bell, CalendarClock, Megaphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';

import { ScreenHeader } from '@/components/student/ScreenHeader';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { STUDENT_NOTIFICATIONS } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

export default function RemindersScreen() {
  const router = useRouter();
  const [readIds, setReadIds] = useState<string[]>([]);
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScreenHeader title="Reminders & notifications" />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 10 }}
        data={STUDENT_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const unread = item.unread && !readIds.includes(item.id);
          const Icon =
            item.kind === 'deadline' ? CalendarClock : item.kind === 'society' ? Megaphone : Bell;
          return (
            <GesturePressable
              accessibilityRole="button"
              className={`border-home-card-border flex-row rounded-2xl border p-3.5 active:opacity-75 ${unread ? 'bg-brand-mist' : 'bg-surface'}`}
              onPress={() => {
                setReadIds((current) =>
                  current.includes(item.id) ? current : [...current, item.id],
                );
                if (item.eventId)
                  router.push({ pathname: '/event/[id]', params: { id: item.eventId } });
              }}
            >
              <View className="bg-surface h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Icon color={numigosTheme.colors.brand} size={18} />
              </View>
              <View className="min-w-0 flex-1 pl-3">
                <View className="flex-row items-center">
                  <Typography
                    className="text-home-ink min-w-0 flex-1 text-[12px] font-bold"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Typography>
                  {unread ? <View className="bg-event-coral ml-2 h-2 w-2 rounded-full" /> : null}
                </View>
                <Typography
                  className="text-ink-muted mt-1 text-[10px] leading-[15px]"
                  numberOfLines={2}
                >
                  {item.message}
                </Typography>
                <Typography className="text-home-muted mt-2 text-[8px]">{item.time}</Typography>
              </View>
            </GesturePressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
