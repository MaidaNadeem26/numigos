import { Typography } from 'heroui-native';
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import type { EventFeedItem, PostFeedItem } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

const POST_PREVIEW_LENGTH = 138;

function getPostPreview(caption: string) {
  if (caption.length <= POST_PREVIEW_LENGTH) return caption;
  return `${caption.slice(0, POST_PREVIEW_LENGTH).trimEnd()}… more`;
}

export function FeaturedEventCard({ item, onPress }: { item: EventFeedItem; onPress: () => void }) {
  return (
    <GesturePressable
      accessibilityLabel={`Open featured event: ${item.title}`}
      accessibilityRole="button"
      className="w-full overflow-hidden rounded-[14px] active:opacity-85"
      onPress={onPress}
    >
      <LinearGradient
        className="h-[108px] justify-between p-3.5"
        colors={[numigosTheme.colors.eventCoral, numigosTheme.colors.brandStrong]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      >
        <View className="bg-home-highlight self-start rounded-full px-2.5 py-1">
          <Typography className="text-home-ink text-[8px] leading-[10px] font-bold">
            Featured
          </Typography>
        </View>
        <View className="min-w-0">
          <Typography
            className="font-display text-[16px] leading-5 font-bold text-white"
            numberOfLines={1}
          >
            {item.title}
          </Typography>
          <Typography className="mt-0.5 text-[9px] leading-3 text-white/80" numberOfLines={1}>
            {item.society} · {item.schedule}
          </Typography>
        </View>
      </LinearGradient>
    </GesturePressable>
  );
}

export function WeeklyEventCard({ item, onPress }: { item: EventFeedItem; onPress: () => void }) {
  return (
    <GesturePressable
      accessibilityLabel={`Open ${item.title}`}
      accessibilityRole="button"
      className="w-[90px] active:opacity-75"
      onPress={onPress}
    >
      <View className="bg-home-chip h-[62px] w-[90px] overflow-hidden rounded-xl">
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={item.image}
          style={{ width: 90, height: 62 }}
        />
      </View>
      <Typography
        className="text-home-ink mt-1.5 text-[10px] leading-[13px] font-semibold"
        numberOfLines={1}
      >
        {item.title}
      </Typography>
      <Typography className="text-home-muted mt-0.5 text-[8px] leading-[11px]" numberOfLines={1}>
        {item.relativeDay} · {item.time}
      </Typography>
    </GesturePressable>
  );
}

export function SocietyPostCard({ item }: { item: PostFeedItem }) {
  return (
    <View
      className="border-home-card-border bg-surface w-full border px-3 py-3"
      style={{ borderRadius: 13 }}
    >
      <View className="flex-row items-center">
        <View className="bg-home-chip h-9 w-9 shrink-0 overflow-hidden rounded-full">
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={item.logo}
            style={{ width: 36, height: 36 }}
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
          color={item.bookmarked ? numigosTheme.colors.brand : numigosTheme.colors.homeMuted}
          fill={item.bookmarked ? numigosTheme.colors.brand : 'transparent'}
          size={13}
          strokeWidth={1.7}
          style={{ marginLeft: 'auto' }}
        />
      </View>
    </View>
  );
}
