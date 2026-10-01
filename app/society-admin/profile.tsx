import React from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { setTestSessionEmail, supabase } from "@/lib/supabase";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";
import { resolveClubLogoSource } from "@/lib/nutech-data";

export default function SocietyAdminProfileScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { profile, society } = useSocietyAdminData();

  const signOut = async () => {
    await setTestSessionEmail(null);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Header Bar */}
      <View
        style={{
          height: 52,
          paddingHorizontal: hPad,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#134635",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="shield-checkmark" size={16} color="#F2CC8F" />
          </View>
          <View>
            <Text
              style={{
                fontSize: 8,
                fontWeight: "700",
                letterSpacing: 0.8,
                color: "#1E5D4B",
                textTransform: "uppercase",
              }}
            >
              NUTECH OSA PORTAL
            </Text>
            <Text
              style={{
                fontFamily: FONT_SANS,
                fontSize: 16,
                fontWeight: "700",
                color: "#12221C",
                marginTop: -1,
              }}
            >
              Admin Profile
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          onPress={() => router.push("/society-admin/notifications")}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#EAE7DF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="notifications-outline" size={17} color="#12221C" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36,
          paddingHorizontal: hPad,
          paddingTop: 12,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={20} distance={8}>
          {/* User Hero Card */}
          <LinearGradient
            colors={["#1E5D4B", "#134635", "#0E3528"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: "#F2CC8F",
                  backgroundColor: "#12221C",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profile.avatar ? (
                  <Image source={{ uri: profile.avatar }} style={{ width: "100%", height: "100%" }} />
                ) : (
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: "700", color: "#F2CC8F" }}>
                    {profile.name
                      ? profile.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "SA"}
                  </Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
                    {profile.name}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "rgba(242,204,143,0.25)",
                      borderWidth: 1,
                      borderColor: "#F2CC8F",
                      paddingHorizontal: 6,
                      paddingVertical: 1.5,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700", color: "#F2CC8F" }}>
                      SOCIETY ADMIN
                    </Text>
                  </View>
                </View>

                <Text style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#CBEAD9", marginTop: 2 }}>
                  {profile.rollNumber} · {profile.department}
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>
                  {profile.email}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Managed Society Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
                ASSIGNED SOCIETY MANAGEMENT
              </Text>
              <View style={{ backgroundColor: "#E8F4EE", paddingHorizontal: 7, paddingVertical: 2.5, borderRadius: 999 }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700", color: "#1E5D4B" }}>
                  OSA RECOGNIZED
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/society-admin/society-profile")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: "#FAF9F5",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#EAE7DF",
                padding: 10,
              }}
            >
              <Image
                source={resolveClubLogoSource(society.logo)}
                style={{ width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: "#E5E2DA" }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
                  {society.name}
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                  {society.membersCount} members · {society.eventsCount} events
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8D9692" />
            </Pressable>
          </View>

          {/* Role & Permissions Brief */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 14,
              gap: 8,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
              ADMINISTRATIVE PRIVILEGES
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={14} color="#1E5D4B" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#12221C" }}>
                Full management of {society.shortName} events & roster
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={14} color="#1E5D4B" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#12221C" }}>
                Submit official event proposals to NUTECH OSA
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="checkmark-circle" size={14} color="#1E5D4B" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#12221C" }}>
                Track student attendance & download registrant rosters
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="information-circle" size={14} color="#D97706" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#D97706" }}>
                Events are subject to OSA safety, venue, and date review
              </Text>
            </View>
          </View>

          {/* Navigation Links */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              overflow: "hidden",
              marginBottom: 14,
            }}
          >
            <Pressable
              onPress={() => router.push("/society-admin/edit-profile")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 13,
                borderBottomWidth: 1,
                borderBottomColor: "#F2EFE9",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="person-outline" size={17} color="#12221C" />
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                  Edit Personal Profile
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#8D9692" />
            </Pressable>


            <Pressable
              onPress={() => router.push("/society-admin/settings")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 13,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="settings-outline" size={17} color="#12221C" />
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                  Settings & Preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#8D9692" />
            </Pressable>
          </View>

          {/* Sign Out Button */}
          <Pressable
            onPress={signOut}
            style={{
              backgroundColor: "#FFF0EB",
              borderWidth: 1,
              borderColor: "#FAD4C0",
              borderRadius: 999,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            <Ionicons name="log-out-outline" size={16} color="#C44D2D" />
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "700", color: "#C44D2D" }}>
              Sign Out
            </Text>
          </Pressable>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
