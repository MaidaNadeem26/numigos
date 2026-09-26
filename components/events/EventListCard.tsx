import { Typography } from 'heroui-native';
import { CalendarDays, MapPin } from 'lucide-react-native';
import { View } from 'react-native';

import { ResilientImage } from '@/components/ui/ResilientImage';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import type { EventFeedItem } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

type EventListCardProps = {
  event: EventFeedItem;
  onPress: () => void;
  badge?: string;
};

export function EventListCard({ event, onPress, badge }: EventListCardProps) {
  return (
    <GesturePressable
      accessibilityLabel={`Open ${event.title}`}
      accessibilityRole="button"
      className="border-home-card-border bg-surface w-full flex-row overflow-hidden rounded-2xl border p-3 active:opacity-75"
      onPress={onPress}
    >
      <ResilientImage
        accessibilityIgnoresInvertColors
        accessibilityLabel={`${event.title} event image`}
        containerStyle={{ width: 86, height: 92, borderRadius: 12 }}
        source={event.image}
      />
      <View className="min-w-0 flex-1 pl-3">
        <View className="flex-row items-center justify-between gap-2">
          <Typography
            className="text-brand min-w-0 flex-1 text-xs leading-4 font-bold"
            numberOfLines={1}
          >
            {event.category}
          </Typography>
          {badge ? (
            <View className="bg-brand-mist rounded-full px-2 py-1">
              <Typography className="text-brand text-[11px] leading-[14px] font-semibold">
                {badge}
              </Typography>
            </View>
          ) : null}
        </View>
        <Typography
          className="text-home-ink mt-1 text-sm leading-[19px] font-bold"
          numberOfLines={2}
        >
          {event.title}
        </Typography>
        <View className="mt-1.5 flex-row items-center">
          <CalendarDays color={numigosTheme.colors.homeMuted} size={12} />
          <Typography
            className="text-home-muted ml-1 min-w-0 flex-1 text-xs leading-4"
            numberOfLines={1}
          >
            {event.schedule}
          </Typography>
        </View>
        <View className="mt-1 flex-row items-center">
          <MapPin color={numigosTheme.colors.homeMuted} size={12} />
          <Typography
            className="text-home-muted ml-1 min-w-0 flex-1 text-xs leading-4"
            numberOfLines={1}
          >
            {event.location ?? 'NUTECH Campus'}
          </Typography>
        </View>
      </View>
    </GesturePressable>
  );
}
