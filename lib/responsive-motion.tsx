import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

/**
 * Responsive metrics calibrated for all mobile devices:
 * - Compact phones (iPhone SE / mini: 320px - 375px)
 * - Standard phones (iPhone 14/15/16, Redmi Note, Pixel, Galaxy S: 380px - 414px)
 * - Large phones (Redmi Note Pro Max, iPhone Pro Max, Galaxy Ultra: 415px - 480px)
 * - Desktop framed preview (> 500px -> constrained to 393px frame)
 */
export const FONT_SANS = Platform.select({
  web: "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  ios: "Instrument Sans",
  android: "Instrument Sans",
  default: "sans-serif",
});

export const FONT_MONO = Platform.select({
  web: "'JetBrains Mono', ui-monospace, Menlo, Monaco, Consolas, monospace",
  ios: "JetBrains Mono",
  android: "JetBrains Mono",
  default: "monospace",
});

export function useResponsive() {
  const { width: rawWidth, height: rawHeight } = useWindowDimensions();
  const isDesktopFrame = Platform.OS === "web" && rawWidth > 500;
  const width = isDesktopFrame ? Math.min(rawWidth - 24, 393) : rawWidth;
  const height = isDesktopFrame ? Math.min(rawHeight - 20, 852) : rawHeight;

  const isCompact = width < 360;
  const isLarge = width >= 410;

  const scale = Math.min(Math.max(width / 390, 0.88), 1.12);
  const hPad = Math.round(14 * scale);
  const carouselCardWidth = Math.round(Math.min(Math.max(width * 0.68, 226), 284));

  const s = (size: number) => Math.round(size * scale * 10) / 10;

  return {
    width,
    height,
    isCompact,
    isLarge,
    isDesktopFrame,
    scale,
    hPad,
    carouselCardWidth,
    s,
  };
}

interface MotionViewProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Non-blocking entrance animation (fade + slide up) that never gets stuck in React StrictMode.
 */
export function MotionView({
  children,
  delay = 0,
  distance = 8,
  duration = 240,
  style,
}: MotionViewProps) {
  const [entered, setEntered] = useState(Platform.OS !== "web");
  const translateY = useRef(new Animated.Value(Platform.OS === "web" ? 0 : distance)).current;
  const opacity = useRef(new Animated.Value(Platform.OS === "web" ? 1 : 0.01)).current;

  useEffect(() => {
    if (Platform.OS === "web") {
      const timer = setTimeout(() => setEntered(true), Math.max(10, delay));
      return () => clearTimeout(timer);
    }

    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        damping: 18,
        stiffness: 180,
        mass: 0.7,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [delay, distance, duration, opacity, translateY]);

  if (Platform.OS === "web") {
    return (
      <View
        style={[
          style,
          {
            opacity: entered ? 1 : 0.01,
            transform: [{ translateY: entered ? 0 : distance }],
            transitionProperty: "opacity, transform",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          } as any,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

interface MotionPressableProps extends PressableProps {
  children: React.ReactNode;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tactile spring-animated pressable that preserves outer layout styles (width: "100%", flex, etc.).
 */
export function MotionPressable({
  children,
  scaleTo = 0.97,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: MotionPressableProps) {
  const [pressed, setPressed] = useState(false);

  const handlePressIn: PressableProps["onPressIn"] = (e) => {
    setPressed(true);
    onPressIn?.(e);
  };

  const handlePressOut: PressableProps["onPressOut"] = (e) => {
    setPressed(false);
    onPressOut?.(e);
  };

  return (
    <Pressable
      hitSlop={6}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        style,
        {
          transform: [{ scale: pressed ? scaleTo : 1 }],
          ...(Platform.OS === "web"
            ? {
                transitionProperty: "transform, opacity",
                transitionDuration: "140ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }
            : {}),
        } as any,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

/**
 * Subtle pulsing live indicator dot for active campus sessions and live events.
 */
export function PulseDot({
  size = 6,
  color = "#F3D092",
}: {
  size?: number;
  color?: string;
}) {
  const [dim, setDim] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDim((prev) => !prev);
    }, 950);
    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: dim ? 0.45 : 1,
        ...(Platform.OS === "web"
          ? {
              transitionProperty: "opacity",
              transitionDuration: "700ms",
              transitionTimingFunction: "ease-in-out",
            }
          : {}),
      } as any}
    />
  );
}
