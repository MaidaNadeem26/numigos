import { Image, View } from 'react-native';

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View
      className={`bg-surface logo-shadow items-center justify-center overflow-hidden ${
        compact ? 'size-16 rounded-[20px] p-1.5' : 'rounded-logo size-28 p-2.5'
      }`}
    >
      {compact ? (
        <Image
          accessibilityLabel="NUTECH logo"
          resizeMode="contain"
          source={require('@/assets/images/nutech-logo.png')}
          style={{ height: 52, width: 52 }}
        />
      ) : (
        <Image
          accessibilityLabel="NUTECH logo"
          resizeMode="contain"
          source={require('@/assets/images/nutech-logo.png')}
          style={{ height: 92, width: 92 }}
        />
      )}
    </View>
  );
}
