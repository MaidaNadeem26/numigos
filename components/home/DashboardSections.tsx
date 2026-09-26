import { Typography } from 'heroui-native';
import { AlarmClock, Plus } from 'lucide-react-native';
import { Image, ScrollView, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { type DashboardStat, type DeadlineReminder, type Society } from '@/lib/home-feed';
import { HOME_HORIZONTAL_PADDING } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

const statColors: Record<DashboardStat['tone'], string> = {
  brand: numigosTheme.colors.brand,
  coral: numigosTheme.colors.eventCoral,
  sage: numigosTheme.colors.eventSage,
};

export function SectionHeading({ children }: { children: string }) {
  return (
    <Typography className="font-display text-home-ink text-[15px] leading-5 font-bold">
      {children}
    </Typography>
  );
}

export function QuickStats({ stats }: { stats: DashboardStat[] }) {
  return (
    <View
      accessibilityLabel="Your event statistics"
      className="flex-row gap-2.5"
      style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}
    >
      {stats.map((stat) => (
        <View className="bg-home-chip min-w-0 flex-1 rounded-2xl px-3 py-3" key={stat.id}>
          <Typography
            className="font-display text-[20px] leading-6 font-bold"
            style={{ color: statColors[stat.tone] }}
          >
            {stat.value}
          </Typography>
          <Typography className="text-home-muted mt-0.5 text-[9px] leading-3 font-medium">
            {stat.label}
          </Typography>
        </View>
      ))}
    </View>
  );
}

export function YourSocieties({
  societies,
  onExplore,
}: {
  societies: Society[];
  onExplore: () => void;
}) {
  return (
    <View className="mt-5">
      <View style={{ paddingHorizontal: HOME_HORIZONTAL_PADDING }}>
        <SectionHeading>Your societies</SectionHeading>
      </View>
      {societies.length === 0 ? (
        <View
          className="bg-home-chip mt-3 flex-row items-center justify-between rounded-2xl px-4 py-3"
          style={{ marginHorizontal: HOME_HORIZONTAL_PADDING }}
        >
          <Typography className="text-home-muted min-w-0 flex-1 text-[10px]">
            Follow societies to see them here
          </Typography>
          <GesturePressable accessibilityRole="button" onPress={onExplore}>
            <Typography className="text-brand ml-3 text-[10px] font-semibold">
              Explore societies
            </Typography>
          </GesturePressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            columnGap: 14,
            paddingHorizontal: HOME_HORIZONTAL_PADDING,
            paddingTop: 12,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {societies.map((society) => (
            <View className="w-[58px] items-center" key={society.id}>
              <View className="border-home-card-border h-12 w-12 overflow-hidden rounded-full border bg-white">
                <Image
                  accessibilityIgnoresInvertColors
                  resizeMode="cover"
                  source={society.logo}
                  style={{ width: 48, height: 48 }}
                />
              </View>
              <Typography
                className="text-home-ink mt-1.5 text-center text-[8px] leading-[11px] font-medium"
                numberOfLines={1}
              >
                {society.shortName}
              </Typography>
            </View>
          ))}
          <GesturePressable
            accessibilityLabel="Explore more societies"
            accessibilityRole="button"
            className="w-[58px] items-center active:opacity-70"
            onPress={onExplore}
          >
            <View className="border-home-muted h-12 w-12 items-center justify-center rounded-full border border-dashed">
              <Plus color={numigosTheme.colors.homeMuted} size={18} strokeWidth={2} />
            </View>
            <Typography className="text-home-muted mt-1.5 text-[8px] leading-[11px] font-medium">
              Explore
            </Typography>
          </GesturePressable>
        </ScrollView>
      )}
    </View>
  );
}

export function DeadlineBanner({
  reminder,
  onPress,
}: {
  reminder: DeadlineReminder;
  onPress: () => void;
}) {
  return (
    <GesturePressable
      accessibilityLabel={`Registration for ${reminder.eventName} closes in ${reminder.daysRemaining} days`}
      accessibilityRole="button"
      className="border-home-card-border mt-5 flex-row items-center rounded-2xl border px-3.5 py-3 active:opacity-75"
      onPress={onPress}
      style={{
        backgroundColor: numigosTheme.colors.errorSoft,
        marginHorizontal: HOME_HORIZONTAL_PADDING,
      }}
    >
      <View
        className="h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: numigosTheme.colors.surface }}
      >
        <AlarmClock color={numigosTheme.colors.eventCoral} size={17} strokeWidth={2} />
      </View>
      <Typography className="text-home-ink min-w-0 flex-1 pl-3 text-[10px] leading-[15px]">
        Registration for <Typography className="font-semibold">{reminder.eventName}</Typography>{' '}
        closes in {reminder.daysRemaining} days
      </Typography>
    </GesturePressable>
  );
}
