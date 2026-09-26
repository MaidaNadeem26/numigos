import { Typography } from 'heroui-native';
import { Bookmark, Heart, MessageCircle } from 'lucide-react-native';
import { Image, View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { numigosTheme } from '@/lib/theme';
import type { EventFeedItem, PostFeedItem } from '@/lib/home-feed';

const cardShadow = {
  shadowColor: numigosTheme.colors.brandDeep,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 2,
} as const;

export function EventCard({ item, onPress }: { item: EventFeedItem; onPress: () => void }) {
  return (
    <View className="bg-surface rounded-[22px]" style={cardShadow}>
      <GesturePressable
        accessibilityLabel={`Open ${item.title}`}
        accessibilityRole="button"
        className="border-line bg-surface flex-row overflow-hidden rounded-[22px] border p-3 active:opacity-80"
        onPress={onPress}
      >
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={item.image}
          style={{ width: 92, height: 92, borderRadius: 16 }}
        />
        <View className="min-w-0 flex-1 justify-center pl-3.5">
          <View className="bg-brand-mist mb-2 self-start rounded-full px-2.5 py-1">
            <Typography className="text-brand text-[10px] font-semibold">Event</Typography>
          </View>
          <Typography className="text-ink text-[15px] leading-5 font-semibold" numberOfLines={2}>
            {item.title}
          </Typography>
          <Typography className="text-ink-muted mt-1 text-xs" numberOfLines={1}>
            {item.society} · {item.schedule}
          </Typography>
        </View>
      </GesturePressable>
    </View>
  );
}

export function SocietyPostCard({ item }: { item: PostFeedItem }) {
  return (
    <View className="bg-surface rounded-[22px]" style={cardShadow}>
      <View className="border-line bg-surface overflow-hidden rounded-[22px] border">
        <View className="p-4">
          <View className="flex-row items-center">
            <View className="border-line bg-brand-mist h-10 w-10 items-center justify-center overflow-hidden rounded-full border">
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="contain"
                source={item.logo}
                style={{ width: 28, height: 28 }}
              />
            </View>
            <View className="min-w-0 flex-1 pl-3">
              <Typography className="text-ink text-sm font-semibold" numberOfLines={1}>
                {item.society}
              </Typography>
              <Typography className="text-ink-muted mt-0.5 text-[11px]">
                {item.timestamp}
              </Typography>
            </View>
            <View className="bg-brand-mist rounded-full px-2.5 py-1">
              <Typography className="text-brand text-[10px] font-semibold">Post</Typography>
            </View>
          </View>

          <Typography className="text-ink mt-3 text-[14px] leading-5" numberOfLines={3}>
            {item.caption}
          </Typography>
        </View>

        {item.image ? (
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            source={item.image}
            style={{ width: '100%', height: 178 }}
          />
        ) : null}

        <View className="border-line mx-4 flex-row items-center border-t py-3">
          <View className="mr-5 flex-row items-center">
            <Heart color={numigosTheme.colors.inkMuted} size={17} strokeWidth={1.9} />
            <Typography className="text-ink-muted ml-1.5 text-xs">{item.likes}</Typography>
          </View>
          <View className="flex-row items-center">
            <MessageCircle color={numigosTheme.colors.inkMuted} size={17} strokeWidth={1.9} />
            <Typography className="text-ink-muted ml-1.5 text-xs">{item.comments}</Typography>
          </View>
          <View className="ml-auto">
            <Bookmark color={numigosTheme.colors.inkMuted} size={18} strokeWidth={1.9} />
          </View>
        </View>
      </View>
    </View>
  );
}
