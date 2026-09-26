import { Ionicons } from '@expo/vector-icons';
import { Button, Typography } from 'heroui-native';
import { ImageBackground, View } from 'react-native';

import { numigosTheme } from '@/lib/theme';

const campusEventArtwork = require('@/assets/images/numigos-campus-event-hero.png');

interface CampusHeroProps {
  compact?: boolean;
  onBack?: () => void;
  useArtwork?: boolean;
}

export function CampusHero({ compact = false, onBack, useArtwork = false }: CampusHeroProps) {
  const heroHeight = compact ? numigosTheme.spacing.heroCompact : numigosTheme.spacing.hero;

  if (useArtwork) {
    return (
      <ImageBackground
        className="bg-brand relative overflow-hidden"
        imageStyle={{ height: '100%', width: '100%' }}
        resizeMode="cover"
        source={campusEventArtwork}
        style={{ height: heroHeight, width: '100%' }}
      >
        <View className="inset-x-auth-screen absolute top-5 flex-row items-center justify-between">
          {onBack ? (
            <Button
              accessibilityLabel="Go back"
              className="size-11 min-w-0 rounded-full border border-white/25 bg-black/20 px-0"
              onPress={onBack}
              variant="ghost"
            >
              <Ionicons color={numigosTheme.colors.surface} name="chevron-back" size={21} />
            </Button>
          ) : (
            <View className="size-11" />
          )}
          <Typography className="font-display text-hero-mark text-white">Numigos</Typography>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View
      className={`bg-brand px-auth-screen relative overflow-hidden ${
        compact ? 'h-auth-hero-compact' : 'h-auth-hero'
      }`}
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
