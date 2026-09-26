import { Typography } from 'heroui-native';
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { numigosTheme } from '@/lib/theme';
import type { EventFeedItem, PostFeedItem } from '@/lib/home-feed';

const cardShadow = {
  shadowColor: numigosTheme.colors.brandDeep,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.035,
  shadowRadius: 3,
  elevation: 1,
} as const;

function getEventColor(id: string) {
  if (id.includes('innovation')) return numigosTheme.colors.eventCoral;
  if (id.includes('futsal')) return '#82AC9D';
  return numigosTheme.colors.eventGold;
}

export function EventCard({ item, onPress }: { item: EventFeedItem; onPress: () => void }) {
  return (
    <View className="bg-surface rounded-[15px]" style={cardShadow}>
      <GesturePressable
        accessibilityLabel={`Open ${item.title}`}
        accessibilityRole="button"
        className="border-line bg-surface flex-row overflow-hidden rounded-[15px] border p-2.5 active:opacity-80"
        onPress={onPress}
      >
        <View
          className="h-[68px] w-[68px] rounded-[13px]"
          style={{ backgroundColor: getEventColor(item.id) }}
        />
        <View className="min-w-0 flex-1 justify-center pl-3">
          <Typography
            className="text-brand text-[7px] leading-[10px] font-bold uppercase"
            numberOfLines={1}
          >
            Event · {item.schedule.split('·')[0]?.trim()}
          </Typography>
          <Typography
            className="text-ink mt-0.5 text-[12px] leading-[15px] font-bold"
            numberOfLines={2}
          >
            {item.title}
          </Typography>
          <Typography className="text-ink-muted mt-0.5 text-[8px] leading-3" numberOfLines={1}>
            {item.society} · {item.schedule.split('·')[1]?.trim() ?? item.schedule}
          </Typography>
        </View>
      </GesturePressable>
    </View>
  );
}

export function SocietyPostCard({ item }: { item: PostFeedItem }) {
  return (
    <View className="bg-surface rounded-[15px]" style={cardShadow}>
      <View className="border-line bg-surface overflow-hidden rounded-[15px] border">
        <View className="px-3 py-3">
          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#F5C977]/55">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={item.logo}
                style={{ width: 22, height: 22 }}
              />
            </View>
            <View className="min-w-0 flex-1 pl-2.5">
              <Typography
                className="text-ink text-[10px] leading-[13px] font-bold"
                numberOfLines={2}
              >
                {item.society}
              </Typography>
              <Typography className="text-ink-muted text-[8px] leading-3">
                {item.timestamp}
              </Typography>
            </View>
            <Typography className="text-ink-muted text-[7px] font-semibold uppercase">
              Post
            </Typography>
          </View>

          <Typography className="text-ink mt-2.5 text-[10px] leading-[15px]" numberOfLines={4}>
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
