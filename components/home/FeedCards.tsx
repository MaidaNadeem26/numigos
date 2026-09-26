import { Typography } from 'heroui-native';
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { numigosTheme } from '@/lib/theme';
import type { EventFeedItem, PostFeedItem } from '@/lib/home-feed';

const cardShadow = {
  shadowColor: numigosTheme.colors.brandDeep,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 1,
} as const;

const eventColors = [
  numigosTheme.colors.eventCoral,
  '#82AC9D',
  numigosTheme.colors.eventGold,
] as const;

function getEventColor(id: string) {
  const characterTotal = Array.from(id).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  return eventColors[characterTotal % eventColors.length];
}

export function EventCard({ item, onPress }: { item: EventFeedItem; onPress: () => void }) {
  return (
    <View className="bg-surface rounded-[16px]" style={cardShadow}>
      <GesturePressable
        accessibilityLabel={`Open ${item.title}`}
        accessibilityRole="button"
        className="border-line bg-surface flex-row overflow-hidden rounded-[16px] border p-2.5 active:opacity-80"
        onPress={onPress}
      >
        <View
          className="h-[66px] w-[66px] rounded-[13px]"
          style={{ backgroundColor: getEventColor(item.id) }}
        />
        <View className="min-w-0 flex-1 justify-center pl-3">
          <Typography className="text-brand text-[8px] font-bold uppercase" numberOfLines={1}>
            Event · {item.schedule.split('·')[0]?.trim()}
          </Typography>
          <Typography className="text-ink mt-0.5 text-[13px] leading-4 font-bold" numberOfLines={2}>
            {item.title}
          </Typography>
          <Typography className="text-ink-muted mt-1 text-[9px]" numberOfLines={1}>
            {item.society} · {item.schedule.split('·')[1]?.trim() ?? item.schedule}
          </Typography>
        </View>
      </GesturePressable>
    </View>
  );
}

export function SocietyPostCard({ item }: { item: PostFeedItem }) {
  return (
    <View className="bg-surface rounded-[16px]" style={cardShadow}>
      <View className="border-line bg-surface overflow-hidden rounded-[16px] border">
        <View className="px-3 py-3">
          <View className="flex-row items-center">
            <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#F5C977]/55">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={item.logo}
                style={{ width: 21, height: 21 }}
              />
            </View>
            <View className="min-w-0 flex-1 pl-2.5">
              <Typography className="text-ink text-[11px] leading-4 font-bold" numberOfLines={2}>
                {item.society}
              </Typography>
              <Typography className="text-ink-muted text-[9px]">{item.timestamp}</Typography>
            </View>
            <Typography className="text-ink-muted text-[8px] font-semibold uppercase">
              Post
            </Typography>
          </View>

          <Typography className="text-ink mt-2 text-[11px] leading-4" numberOfLines={3}>
            {item.caption}
          </Typography>
        </View>

        {item.image ? (
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={item.image}
            style={{ width: '100%', height: 132 }}
          />
        ) : null}

        <View className="border-line mx-3 flex-row items-center border-t py-2">
          <View className="mr-4 flex-row items-center">
            <Heart color={numigosTheme.colors.inkMuted} size={13} strokeWidth={1.7} />
            <Typography className="text-ink-muted ml-1 text-[9px]">{item.likes}</Typography>
          </View>
          <View className="flex-row items-center">
            <MessageCircle color={numigosTheme.colors.inkMuted} size={13} strokeWidth={1.7} />
            <Typography className="text-ink-muted ml-1 text-[9px]">{item.comments}</Typography>
          </View>
          <Bookmark
            color={numigosTheme.colors.inkMuted}
            size={13}
            strokeWidth={1.7}
            style={{ marginLeft: 'auto' }}
          />
        </View>
      </View>
    </View>
  );
}
