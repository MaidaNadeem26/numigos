import { Typography } from 'heroui-native';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { MIN_TOUCH_TARGET } from '@/lib/layout';
import { goBackOrReplace } from '@/lib/navigation';
import { numigosTheme } from '@/lib/theme';

type ScreenHeaderProps = {
  title: string;
  fallback?: '/(tabs)' | '/(tabs)/profile' | '/societies';
  right?: ReactNode;
  subtitle?: string;
};

export function ScreenHeader({ title, fallback = '/(tabs)', right, subtitle }: ScreenHeaderProps) {
  return (
    <View className="border-home-card-border bg-surface border-b px-4 pt-2 pb-3">
      <View className="flex-row items-center">
        <GesturePressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="bg-home-chip shrink-0 items-center justify-center rounded-full active:opacity-70"
          style={{ width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET }}
          onPress={() => goBackOrReplace(fallback)}
        >
          <ArrowLeft color={numigosTheme.colors.homeInk} size={20} />
        </GesturePressable>
        <View className="min-w-0 flex-1 px-3">
          <Typography
            className="font-display text-home-ink text-[18px] leading-6 font-bold"
            numberOfLines={1}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography className="text-home-muted mt-0.5 text-xs leading-4" numberOfLines={1}>
              {subtitle}
            </Typography>
          ) : null}
        </View>
        {right ?? <View className="w-10" />}
      </View>
    </View>
  );
}
