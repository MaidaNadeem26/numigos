import type { PropsWithChildren } from 'react';
import { View, type ViewProps, useWindowDimensions } from 'react-native';

import { getContentMaxWidth, getScreenHorizontalPadding } from '@/lib/layout';

type ResponsiveContentProps = PropsWithChildren<
  ViewProps & {
    kind?: 'standard' | 'detail';
    padded?: boolean;
  }
>;

export function ResponsiveContent({
  children,
  kind = 'standard',
  padded = true,
  style,
  ...props
}: ResponsiveContentProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = padded ? getScreenHorizontalPadding(width) : 0;

  return (
    <View
      {...props}
      style={[
        {
          alignSelf: 'center',
          width: '100%',
          maxWidth: getContentMaxWidth(width, kind),
          paddingHorizontal: horizontalPadding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
