import { Image, type ImageProps, type StyleProp, View, type ViewStyle } from 'react-native';
import { useState } from 'react';

import { numigosTheme } from '@/lib/theme';

type ResilientImageProps = ImageProps & {
  aspectRatio?: number;
  containerStyle?: StyleProp<ViewStyle>;
  fallbackSource?: ImageProps['source'];
};

const DEFAULT_FALLBACK = require('@/assets/images/categories/default.png');

export function ResilientImage({
  aspectRatio,
  containerStyle,
  fallbackSource = DEFAULT_FALLBACK,
  onError,
  onLoad,
  source,
  style,
  ...props
}: ResilientImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <View
      style={[
        {
          width: '100%',
          aspectRatio,
          overflow: 'hidden',
          backgroundColor: numigosTheme.colors.brandMist,
        },
        containerStyle,
      ]}
    >
      <Image
        {...props}
        onError={(event) => {
          setFailed(true);
          setLoaded(true);
          onError?.(event);
        }}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        resizeMode={props.resizeMode ?? 'cover'}
        source={failed ? fallbackSource : source}
        style={[{ width: '100%', height: '100%', opacity: loaded ? 1 : 0 }, style]}
      />
    </View>
  );
}
