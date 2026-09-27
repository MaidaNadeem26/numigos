// oxlint-disable-next-line eslint-plugin-import/no-unassigned-import
import "../global.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Manrope_600SemiBold, Manrope_700Bold, useFonts } from "@expo-google-fonts/manrope";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Bookmark, Compass, UserRound } from "lucide-react-native";
import { Animated, Platform, Pressable, Text, useWindowDimensions, View } from "react-native";
import { useEffect, useRef } from "react";
import * as DevClient from "expo-dev-client";
import { HeroUINativeProvider } from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import {
  ErrorBoundary as ExpoErrorBoundary,
  type ErrorBoundaryProps,
  router,
  SplashScreen,
  Stack,
  usePathname,
} from "expo-router";

import { initPostHog } from "@/lib/posthog";
import { AuthFlowProvider } from "@/lib/auth-flow";
import { registerServiceWorker } from "@/lib/registerServiceWorker";
import { reportErrorToParent } from "@/lib/reportPreviewError";
import { InstallPrompt } from "@/components/InstallPrompt";

function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    if (Platform.OS === "web" && error) {
      const message = [error.message, error.stack].filter(Boolean).join("\n");
      reportErrorToParent(message);
    }
  }, [error]);
  return <ExpoErrorBoundary error={error} retry={retry} />;
}

export { ErrorBoundary };

Uniwind.setTheme("light");

void SplashScreen.preventAutoHideAsync();

const AUTH_PATHS = new Set(["/", "/login", "/signup", "/verify"]);

function AnimatedNavTab({
  label,
  active,
  onPress,
  Icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  Icon: any;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: "center",
          flex: 1,
          height: "100%",
          justifyContent: "center",
          transform: [{ scale: pressed ? 0.92 : 1 }],
        },
        Platform.OS === "web"
          ? ({
              transitionProperty: "transform, opacity",
              transitionDuration: "140ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            } as any)
          : null,
      ]}
    >
      <View
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 14,
            paddingVertical: 3.5,
            borderRadius: 999,
            backgroundColor: active ? "#E3F2EC" : "transparent",
          },
          Platform.OS === "web"
            ? ({
                transitionProperty: "background-color",
                transitionDuration: "180ms",
              } as any)
            : null,
        ]}
      >
        <Icon
          color={active ? "#134635" : "#8D9692"}
          size={18}
          strokeWidth={active ? 2.2 : 1.8}
        />
      </View>
      <Text
        style={{
          fontSize: 9.5,
          fontWeight: active ? "700" : "500",
          color: active ? "#134635" : "#8D9692",
          marginTop: 1.5,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function GlobalBottomNavBar({ pathname }: { pathname: string }) {
  const insets = useSafeAreaInsets();

  const isSaved = pathname.includes("/bookmarks");
  const isProfile =
    pathname.includes("/profile") ||
    pathname.startsWith("/events/") ||
    pathname.startsWith("/societies/register");
  const isExplore = !isSaved && !isProfile;

  const navItems = [
    {
      key: "explore",
      label: "Explore",
      active: isExplore,
      href: "/(tabs)/explore" as const,
      Icon: Compass,
    },
    {
      key: "bookmarks",
      label: "Saved",
      active: isSaved,
      href: "/(tabs)/bookmarks" as const,
      Icon: Bookmark,
    },
    {
      key: "profile",
      label: "Profile",
      active: isProfile,
      href: "/(tabs)/profile" as const,
      Icon: UserRound,
    },
  ];

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#FAF9F5",
        borderTopColor: "#EAE7DF",
        borderTopWidth: 1,
        flexDirection: "row",
        height: 52 + insets.bottom,
        justifyContent: "space-around",
        paddingBottom: Math.max(insets.bottom, 4),
        paddingTop: 4,
      }}
    >
      {navItems.map(({ key, label, active, href, Icon }) => (
        <AnimatedNavTab
          key={key}
          label={label}
          active={active}
          Icon={Icon}
          onPress={() => router.replace(href)}
        />
      ))}
    </View>
  );
}

function AppShell() {
  const pathname = usePathname();
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const isAuthScreen = AUTH_PATHS.has(pathname);
  // On mobile devices (Redmi, iPhone SE/15/Pro Max, Pixel, Galaxy <= 500px), render full-bleed 100% responsive.
  // On desktop browsers (> 500px), render a sleek responsive mobile viewport container.
  const isFramedWeb = Platform.OS === "web" && viewportWidth > 500 && !isAuthScreen;

  const stackContent = (
    <View style={{ backgroundColor: "#FAF9F5", flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: "#FAF9F5" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="verify" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="event/[id]" />
          <Stack.Screen name="events/registered" />
          <Stack.Screen name="events/history" />
          <Stack.Screen name="reminders" />
          <Stack.Screen name="societies" />
          <Stack.Screen name="societies/[id]" />
          <Stack.Screen name="societies/register" />
          <Stack.Screen name="home" />
        </Stack>
      </View>
      {!isAuthScreen ? <GlobalBottomNavBar pathname={pathname} /> : null}
    </View>
  );

  if (!isFramedWeb) {
    return stackContent;
  }

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#0B1813",
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          backgroundColor: "#FAF9F5",
          borderRadius: 28,
          flex: 1,
          maxHeight: Math.min(viewportHeight - 20, 852),
          maxWidth: 393,
          overflow: "hidden",
          width: "100%",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
        } as any}
      >
        {stackContent}
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return undefined;

    const handleError = (event: ErrorEvent) => {
      const message = event.error?.stack ?? event.message ?? "Unknown error";
      reportErrorToParent(message);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const err = event.reason;
      const message =
        err instanceof Error ? [err.message, err.stack].filter(Boolean).join("\n") : String(err);
      reportErrorToParent(message);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (__DEV__ && Platform.OS !== "web" && !isExpoGo) {
      const timer = setTimeout(() => {
        try {
          DevClient.closeMenu?.();
          DevClient.hideMenu?.();
        } catch {
          // Ignore when running inside Expo Go
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      initPostHog();
    }
  }, []);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <AuthFlowProvider>
          <AppShell />
          <InstallPrompt />
        </AuthFlowProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
