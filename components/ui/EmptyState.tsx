import { Typography } from 'heroui-native';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { MIN_TOUCH_TARGET } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View
      accessibilityRole="summary"
      className="w-full flex-1 items-center justify-center px-6 py-12"
    >
      <View className="bg-brand-mist h-14 w-14 items-center justify-center rounded-full">
        <Icon color={numigosTheme.colors.brand} size={26} />
      </View>
      <Typography className="text-ink mt-4 text-center text-lg font-bold">{title}</Typography>
      {description ? (
        <Typography className="text-ink-muted mt-2 max-w-[360px] text-center text-sm leading-5">
          {description}
        </Typography>
      ) : null}
      {actionLabel && onAction ? (
        <GesturePressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          className="bg-brand mt-5 items-center justify-center rounded-full px-5 active:opacity-80"
          onPress={onAction}
          style={{ minHeight: MIN_TOUCH_TARGET }}
        >
          <Typography className="text-surface text-sm font-semibold">{actionLabel}</Typography>
        </GesturePressable>
      ) : null}
    </View>
  );
}
