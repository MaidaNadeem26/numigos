import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getAuthenticatedProfile, getTestSessionEmail, supabase } from "@/lib/supabase";

const SERIF_FONT = Platform.select({
  web: "Georgia, 'Times New Roman', serif",
  ios: "Georgia",
  default: "serif",
});

export default function SplashScreen() {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const spinnerTimer = setTimeout(() => setShowSpinner(true), 450);
    let isMounted = true;
    let didNavigate = false;

    const navigateSafely = (target: "/home" | "/login") => {
      if (!isMounted || didNavigate) return;
      didNavigate = true;
      router.replace(target);
    };

    const fallbackTimer = setTimeout(() => {
      navigateSafely("/login");
    }, 3200);

    const resolveSession = async () => {
      try {
        const testEmail = await getTestSessionEmail();
        if (testEmail) {
          setTimeout(() => navigateSafely("/home"), 900);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          setTimeout(() => navigateSafely("/login"), 900);
          return;
        }

        const { profile } = await getAuthenticatedProfile(session.user.id);
        setTimeout(() => navigateSafely(profile?.is_verified ? "/home" : "/login"), 900);
      } catch {
        setTimeout(() => navigateSafely("/login"), 900);
      }
    };

    void resolveSession();

    return () => {
      isMounted = false;
      clearTimeout(spinnerTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <LinearGradient
      colors={["#1B5240", "#11382B", "#0A231B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 28 }}>
        {/* Top Institutional Pill */}
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: "rgba(243,208,146,0.25)",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 5,
            }}
          >
            <View
              style={{
                width: 5.5,
                height: 5.5,
                borderRadius: 3,
                backgroundColor: "#F3D092",
              }}
            />
            <Text
              style={{
                fontSize: 8.5,
                fontWeight: "700",
                letterSpacing: 1,
                color: "#F3D092",
              }}
            >
              NUTECH STUDENT AFFAIRS PORTAL
            </Text>
          </View>
        </View>

        {/* Center Brand Crest & Typography */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.07)",
              borderWidth: 1.5,
              borderColor: "rgba(243,208,146,0.4)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <Image
              source={require("@/assets/images/numigos-logo.jpg")}
              style={{ width: 74, height: 74, borderRadius: 20 }}
              resizeMode="cover"
            />
          </View>

          <Text
            style={{
              fontFamily: SERIF_FONT,
              fontSize: 32,
              fontWeight: "700",
              color: "#FFFFFF",
              letterSpacing: 0.3,
            }}
          >
            Numigos
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 10.5,
              color: "#A3CBB9",
              textAlign: "center",
              lineHeight: 16,
              maxWidth: 240,
            }}
          >
            Official Campus Societies, Technical Events & Co-Curricular Transcript
          </Text>
        </View>

        {/* Bottom Status & Quick Continue */}
        <View style={{ alignItems: "center", gap: 10, marginBottom: 8 }}>
          {showSpinner ? (
            <ActivityIndicator color="#F3D092" size="small" />
          ) : (
            <View style={{ height: 20 }} />
          )}
          <Text
            style={{
              fontSize: 8,
              fontWeight: "700",
              letterSpacing: 1.1,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            SYNCING CAMPUS DIGITAL ID...
          </Text>

          <Pressable
            onPress={() => router.replace("/home")}
            style={{
              marginTop: 4,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: "600", color: "#F3D092" }}>
              Enter Campus Portal →
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
