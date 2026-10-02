import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FONT_SANS } from "@/lib/responsive-motion";
import {
  getAuthenticatedProfile,
  getTestSessionEmail,
  supabase,
  TEST_ACCOUNTS,
} from "@/lib/supabase";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(6)).current;
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let didNavigate = false;

    // Subtle, smooth fade-in animation for logo and typography
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle loading indicator appears gently only if auth check takes more than 500ms
    const spinnerTimer = setTimeout(() => {
      if (isMounted && !didNavigate) {
        setShowSpinner(true);
      }
    }, 500);

    const navigateSafely = (target: string) => {
      if (!isMounted || didNavigate) return;
      didNavigate = true;
      router.replace(target as any);
    };

    // Clean safety timeout fallback to ensure the splash never hangs indefinitely
    const fallbackTimer = setTimeout(() => {
      navigateSafely("/login");
    }, 3500);

    const initializeAuthAndNavigate = async () => {
      // Intentional short duration (1100ms) for a calm, polished mobile app feel
      const minDurationPromise = new Promise((resolve) => setTimeout(resolve, 1100));

      const authCheckPromise = (async (): Promise<string> => {
        try {
          // 1. Check for active test session first
          const testEmail = await getTestSessionEmail();
          if (testEmail && TEST_ACCOUNTS[testEmail]) {
            const account = TEST_ACCOUNTS[testEmail];
            if (account.role === "society_admin") {
              return "/society-admin/dashboard";
            }
            return "/(tabs)/explore";
          }

          // 2. Silently check real Supabase session
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError || !session || !session.user) {
            return "/login";
          }

          // 3. Determine authorized role from Supabase profile
          const { profile } = await getAuthenticatedProfile(session.user.id);

          if (profile && !profile.is_verified) {
            return "/verify";
          }

          if (profile?.role === "society_admin") {
            return "/society-admin/dashboard";
          }

          return "/(tabs)/explore";
        } catch {
          return "/login";
        }
      })();

      const [_, targetRoute] = await Promise.all([minDurationPromise, authCheckPromise]);

      clearTimeout(fallbackTimer);
      clearTimeout(spinnerTimer);
      navigateSafely(targetRoute);
    };

    void initializeAuthAndNavigate();

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      clearTimeout(spinnerTimer);
    };
  }, [fadeAnim, translateYAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Top Spacer for Optical Balance */}
        <View style={styles.topSpacer} />

        {/* Center Content: Brand Logo & Description */}
        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          {/* Exact Numigos Brand Logo */}
          <Image
            source={require("../assets/images/numigos-brand-logo.png")}
            style={styles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="numigos logo"
          />

          {/* Short Description */}
          <Text style={styles.description}>
            Discover events, explore societies, and stay connected with campus life.
          </Text>
        </Animated.View>

        {/* Bottom Area: Minimal Non-Distracting Loading Indicator */}
        <View style={styles.bottomArea}>
          {showSpinner ? (
            <ActivityIndicator size="small" color="#1E5D4B" style={styles.spinner} />
          ) : (
            <View style={styles.spinnerPlaceholder} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  topSpacer: {
    height: 48,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 340,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  brandLogo: {
    width: 224,
    height: 70,
    marginBottom: 16,
  },
  description: {
    fontFamily: FONT_SANS,
    fontSize: 13.5,
    fontWeight: "400",
    color: "#60726A",
    textAlign: "center",
    lineHeight: 20.5,
    maxWidth: 275,
    letterSpacing: 0.1,
  },
  bottomArea: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  spinner: {
    opacity: 0.7,
  },
  spinnerPlaceholder: {
    height: 20,
  },
});
