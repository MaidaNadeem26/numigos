import { Typography } from 'heroui-native';
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import type { EventFeedItem, PostFeedItem } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

const POST_PREVIEW_LENGTH = 138;

function getEventColor(id: string) {
  if (id.includes('innovation')) return numigosTheme.colors.eventCoral;
  if (id.includes('futsal')) return numigosTheme.colors.eventSage;
  return numigosTheme.colors.eventGold;
}

function getPostPreview(caption: string) {
  if (caption.length <= POST_PREVIEW_LENGTH) return caption;

  return `${caption.slice(0, POST_PREVIEW_LENGTH).trimEnd()}… more`;
}

export function EventCard({ item, onPress }: { item: EventFeedItem; onPress: () => void }) {
  const [relativeDay, time] = item.schedule.split('·').map((part) => part.trim());

  return (
    <GesturePressable
      accessibilityLabel={`Open ${item.title}`}
      accessibilityRole="button"
      className="border-home-card-border bg-surface w-full flex-row rounded-2xl border p-2.5 active:opacity-80"
      onPress={onPress}
    >
      <View
        className="h-16 w-16 shrink-0 rounded-xl"
        style={{ backgroundColor: getEventColor(item.id) }}
      />
      <View className="min-w-0 flex-1 justify-center pl-3">
        <Typography
          className="text-brand text-[8px] leading-[11px] font-bold uppercase"
          numberOfLines={1}
        >
          Event · {relativeDay}
        </Typography>
        <Typography
          className="text-home-ink mt-1 text-[13px] leading-4 font-bold"
          numberOfLines={2}
        >
          {item.title}
        </Typography>
        <Typography className="text-home-muted mt-1 text-[9px] leading-3" numberOfLines={1}>
          {item.society} · {time ?? item.schedule}
        </Typography>
      </View>
    </GesturePressable>
  );
}

export function SocietyPostCard({ item }: { item: PostFeedItem }) {
  return (
    <View className="border-home-card-border bg-surface w-full rounded-2xl border px-3 py-3">
      <View className="flex-row items-center">
        <View className="bg-home-chip h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={item.logo}
            style={{ width: 22, height: 22 }}
          />
        </View>
        <View className="min-w-0 flex-1 pl-2.5">
          <Typography
            className="text-home-ink text-[11px] leading-[14px] font-bold"
            numberOfLines={1}
          >
            {item.society}
          </Typography>
          <Typography className="text-home-muted mt-0.5 text-[8px] leading-3" numberOfLines={1}>
            {item.timestamp}
          </Typography>
        </View>
        <Typography className="text-home-muted shrink-0 text-[7px] font-semibold uppercase">
          Post
        </Typography>
      </View>

      <Typography className="text-home-ink mt-3 text-[10px] leading-[15px]" numberOfLines={3}>
        {getPostPreview(item.caption)}
      </Typography>

      <View className="mt-3 flex-row items-center">
        <View className="mr-4 flex-row items-center">
          <Heart color={numigosTheme.colors.homeMuted} size={13} strokeWidth={1.7} />
          <Typography className="text-home-muted ml-1 text-[9px]">{item.likes}</Typography>
        </View>
        <View className="flex-row items-center">
          <MessageCircle color={numigosTheme.colors.homeMuted} size={13} strokeWidth={1.7} />
          <Typography className="text-home-muted ml-1 text-[9px]">{item.comments}</Typography>
        </View>
        <Bookmark
          color={numigosTheme.colors.homeMuted}
          size={13}
          strokeWidth={1.7}
          style={{ marginLeft: 'auto' }}
        />
      </View>
    </View>
  );
}
