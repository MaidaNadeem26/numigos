import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Typography } from 'heroui-native';
import { useState } from 'react';
import { Image, useWindowDimensions, View } from 'react-native';

import { numigosTheme } from '@/lib/theme';

const campusEventArtwork = require('@/assets/images/numigos-campus-event-hero.png');
const ARTWORK_ASPECT_RATIO = 640 / 359;

interface CampusHeroProps {
  compact?: boolean;
  height?: number;
  onBack?: () => void;
  showBrand?: boolean;
  useArtwork?: boolean;
}

export function CampusHero({
  compact = false,
  height,
  onBack,
  showBrand = true,
  useArtwork = false,
}: CampusHeroProps) {
  const { width: viewportWidth } = useWindowDimensions();
  const fallbackHeight =
    height ?? (compact ? numigosTheme.spacing.heroCompact : numigosTheme.spacing.hero);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const activeWidth = layout.width > 0 ? layout.width : viewportWidth;
  const activeHeight = layout.height > 0 ? layout.height : fallbackHeight;

  if (useArtwork) {
    // True 359:640 aspect ratio (never squeezed) and centered vertically on the artwork
    const renderedWidth = Math.round(activeWidth * 1.03);
    const renderedHeight = Math.round(renderedWidth * ARTWORK_ASPECT_RATIO);
    const renderedLeft = -Math.round(activeWidth * 0.015);
    const renderedBottom = -Math.round(renderedHeight * 0.04);

    return (
      <View
        onLayout={(event) => {
          const nextWidth = Math.round(event.nativeEvent.layout.width);
          const nextHeight = Math.round(event.nativeEvent.layout.height);
          if (
            nextWidth > 0 &&
            nextHeight > 0 &&
            (nextWidth !== layout.width || nextHeight !== layout.height)
          ) {
            setLayout({ width: nextWidth, height: nextHeight });
          }
        }}
        style={{
          backgroundColor: '#123E34',
          flex: 1,
          minHeight: fallbackHeight,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        }}
      >
        <Image
          resizeMode="cover"
          source={campusEventArtwork}
          style={{
            bottom: renderedBottom,
            height: renderedHeight,
            left: renderedLeft,
            position: 'absolute',
            width: renderedWidth,
          }}
        />

        {onBack || showBrand ? (
          <View className="inset-x-auth-screen absolute top-4 z-10 flex-row items-center justify-between">
            {onBack ? (
              <Button
                accessibilityLabel="Go back"
                className="size-10 min-w-0 items-center justify-center rounded-full border border-white/25 bg-black/20 px-0"
                onPress={onBack}
                variant="ghost"
              >
                <Ionicons color={numigosTheme.colors.surface} name="chevron-back" size={20} />
              </Button>
            ) : (
              <View className="size-10" />
            )}
            {showBrand ? (
              <Typography className="font-display text-hero-mark text-white">Numigos</Typography>
            ) : null}
          </View>
        ) : null}

        <LinearGradient
          colors={[
            'rgba(250, 249, 245, 0)',
            'rgba(250, 249, 245, 0.32)',
            'rgba(250, 249, 245, 0.85)',
            '#FAF9F5',
          ]}
          locations={[0, 0.45, 0.8, 1]}
          style={{
            bottom: 0,
            height: Math.round(activeHeight * 0.18),
            left: 0,
            position: 'absolute',
            right: 0,
          }}
        />
      </View>
    );
  }

  return (
    <View
      className="bg-brand px-auth-screen relative overflow-hidden"
      style={{ height: fallbackHeight, width: '100%' }}
    >
      <View className="bg-brand-strong absolute -top-24 -right-20 size-72 rounded-full opacity-70" />
      <View className="bg-brand-soft absolute -bottom-36 -left-20 size-72 rounded-full opacity-10" />
      <View className="inset-x-auth-screen absolute top-5 flex-row items-center justify-between">
        {onBack ? (
          <Button
            accessibilityLabel="Go back"
            className="size-11 min-w-0 rounded-full border border-white/25 bg-white/10 px-0"
            onPress={onBack}
            variant="ghost"
          >
            <Ionicons color={numigosTheme.colors.surface} name="chevron-back" size={21} />
          </Button>
        ) : (
          <View className="size-11" />
        )}
        <View className="flex-row items-center gap-2">
          <View className="size-8 items-center justify-center rounded-full bg-white">
            <Ionicons color={numigosTheme.colors.brand} name="people" size={17} />
          </View>
          <Typography className="font-display text-hero-mark text-white">Numigos</Typography>
        </View>
      </View>

      <View className="inset-x-auth-screen absolute bottom-11 items-center">
        <View className="relative h-32 w-full max-w-[340px]">
          <View className="bg-night absolute right-5 bottom-0 left-5 h-11 rounded-t-[22px] opacity-95" />
          <View className="bg-event-coral absolute bottom-0 left-10 h-20 w-14 rounded-t-2xl" />
          <View className="bg-event-gold absolute bottom-0 left-[104px] h-14 w-16 rounded-t-xl" />
          <View className="bg-surface absolute bottom-0 left-[176px] h-24 w-16 rounded-t-2xl opacity-95" />
          <View className="bg-event-coral absolute right-11 bottom-0 h-16 w-14 rounded-t-xl" />
          <View className="bg-night absolute bottom-[88px] left-[198px] h-8 w-5 rounded-t-full" />
          <View className="absolute bottom-5 left-[122px] size-3 rounded-full bg-white" />
          <View className="absolute right-[70px] bottom-6 size-3 rounded-full bg-white" />
          <View className="absolute bottom-7 left-[59px] size-3 rounded-full bg-white" />
          <View className="absolute top-0 right-0 flex-row items-center gap-2 rounded-full bg-white px-3 py-2">
            <Ionicons color={numigosTheme.colors.eventCoral} name="calendar" size={15} />
            <Typography className="text-ink text-xs font-semibold">Campus events</Typography>
          </View>
          <View className="absolute top-7 left-0 flex-row items-center gap-2 rounded-full bg-white/95 px-3 py-2">
            <Ionicons color={numigosTheme.colors.brand} name="sparkles" size={15} />
            <Typography className="text-ink text-xs font-semibold">Meet your people</Typography>
          </View>
        </View>
      </View>
    </View>
  );
}
