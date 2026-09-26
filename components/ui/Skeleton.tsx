import { View, type ViewProps } from 'react-native';

import { numigosTheme } from '@/lib/theme';

type SkeletonProps = ViewProps & {
  height: number;
  width?: number | `${number}%`;
  radius?: number;
};

export function Skeleton({ height, radius = 12, style, width = '100%', ...props }: SkeletonProps) {
  return (
    <View
      {...props}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: numigosTheme.colors.brandMist,
        },
        style,
      ]}
    />
  );
}

export function EventCardSkeleton() {
  return (
    <View className="border-home-card-border bg-surface w-full flex-row rounded-2xl border p-3">
      <Skeleton height={92} radius={12} width={86} />
      <View className="min-w-0 flex-1 gap-2 pl-3">
        <Skeleton height={12} width="35%" />
        <Skeleton height={18} width="90%" />
        <Skeleton height={18} width="72%" />
        <Skeleton height={12} width="65%" />
      </View>
    </View>
  );
}
