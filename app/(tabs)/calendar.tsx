import { Typography } from 'heroui-native';
import { CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { EventListCard } from '@/components/events/EventListCard';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { getRegisteredEvents } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

const DAYS = [
  { id: 'sunday', label: 'S' },
  { id: 'monday', label: 'M' },
  { id: 'tuesday', label: 'T' },
  { id: 'wednesday', label: 'W' },
  { id: 'thursday', label: 'T' },
  { id: 'friday', label: 'F' },
  { id: 'saturday', label: 'S' },
];
const CALENDAR_DAYS = Array.from({ length: 35 }, (_, index) => index - 1);
const EVENT_DAYS = new Set([8, 12, 18, 21, 26]);

export default function CalendarScreen() {
  const router = useRouter();
  const events = getRegisteredEvents();
  const [monthOffset, setMonthOffset] = useState(0);
  const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(
    new Date(2026, 8 + monthOffset, 1),
  );
  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-[680px]">
          <View className="px-4 pt-3 pb-3">
            <Typography className="font-display text-home-ink text-[24px] leading-8 font-bold">
              Calendar
            </Typography>
            <Typography className="text-home-muted mt-1 text-[11px]">
              Your campus schedule
            </Typography>
          </View>
          <View className="border-home-card-border bg-surface mx-4 rounded-2xl border p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <GesturePressable
                accessibilityLabel="Previous month"
                accessibilityRole="button"
                className="bg-home-chip h-11 w-11 items-center justify-center rounded-full"
                onPress={() => setMonthOffset((value) => value - 1)}
              >
                <ChevronLeft color={numigosTheme.colors.homeInk} size={18} />
              </GesturePressable>
              <Typography className="text-home-ink text-sm font-bold">{monthLabel}</Typography>
              <GesturePressable
                accessibilityLabel="Next month"
                accessibilityRole="button"
                className="bg-home-chip h-11 w-11 items-center justify-center rounded-full"
                onPress={() => setMonthOffset((value) => value + 1)}
              >
                <ChevronRight color={numigosTheme.colors.homeInk} size={18} />
              </GesturePressable>
            </View>
            <View className="flex-row">
              {DAYS.map((day) => (
                <View className="flex-1 items-center py-1" key={day.id}>
                  <Typography className="text-home-muted text-xs font-semibold">
                    {day.label}
                  </Typography>
                </View>
              ))}
            </View>
            <View className="flex-row flex-wrap">
              {CALENDAR_DAYS.map((day) => {
                const visible = day > 0 && day <= 30;
                const selected = day === 26;
                return (
                  <View className="w-[14.285%] items-center py-1.5" key={day}>
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-full ${selected ? 'bg-brand' : ''}`}
                    >
                      <Typography
                        className={`text-xs font-medium ${selected ? 'text-white' : visible ? 'text-home-ink' : 'text-transparent'}`}
                      >
                        {visible ? day : ''}
                      </Typography>
                      {visible && EVENT_DAYS.has(day) ? (
                        <View
                          className={`mt-0.5 h-1 w-1 rounded-full ${selected ? 'bg-home-highlight' : 'bg-event-coral'}`}
                        />
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <View className="px-4 pt-6 pb-2">
            <Typography className="font-display text-home-ink text-[17px] font-bold">
              Upcoming schedule
            </Typography>
          </View>
          <View className="gap-3 px-4">
            {events.length ? (
              events.map((event) => (
                <EventListCard
                  event={event}
                  key={event.id}
                  onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
                />
              ))
            ) : (
              <EmptyState
                description="Registered events will appear on your schedule."
                icon={CalendarX2}
                title="No events scheduled"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
