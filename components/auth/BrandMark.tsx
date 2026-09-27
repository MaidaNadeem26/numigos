import { Image, View } from "react-native";

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  const size = compact ? 58 : 88;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: compact ? 16 : 24,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: "rgba(243, 208, 146, 0.45)",
        backgroundColor: "#11382B",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        accessibilityLabel="Numigos logo"
        resizeMode="cover"
        source={require("@/assets/images/numigos-logo.jpg")}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
