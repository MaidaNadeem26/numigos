import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { setTestSessionEmail, supabase } from "@/lib/supabase";

export default function SocietyAdminSettingsScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();

  const [approvalNotifs, setApprovalNotifs] = useState(true);
  const [registrationsNotifs, setRegistrationsNotifs] = useState(true);
  const [chatNotifs, setChatNotifs] = useState(true);

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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#EFECE6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={16} color="#12221C" />
          </Pressable>
          <View>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: "700", letterSpacing: 0.8, color: "#1E5D4B" }}>
              PREFERENCES
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Settings & Security
            </Text>
          </View>
        </View>
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
          {/* Notifications Card */}
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
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 12 }}>
              NOTIFICATION PREFERENCES
            </Text>

            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                    OSA Approval Updates
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                    Instant alerts when an event is approved, rejected, or changes requested
                  </Text>
                </View>
                <Switch
                  value={approvalNotifs}
                  onValueChange={setApprovalNotifs}
                  trackColor={{ false: "#E5E2DA", true: "#1E5D4B" }}
                />
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                    Student Registrations
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                    Notifications for capacity milestones and new student enrollments
                  </Text>
                </View>
                <Switch
                  value={registrationsNotifs}
                  onValueChange={setRegistrationsNotifs}
                  trackColor={{ false: "#E5E2DA", true: "#1E5D4B" }}
                />
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                    Team Chat Notifications
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                    Receive messages from core team and executive leads
                  </Text>
                </View>
                <Switch
                  value={chatNotifs}
                  onValueChange={setChatNotifs}
                  trackColor={{ false: "#E5E2DA", true: "#1E5D4B" }}
                />
              </View>
            </View>
          </View>

          {/* Account Security */}
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
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 10 }}>
              ACCOUNT & SECURITY
            </Text>

            <Pressable
              onPress={() => {
                if (Platform.OS === "web") {
                  alert("Password reset code sent to your official NUTECH email address.");
                } else {
                  Alert.alert("Password Reset", "A secure verification code has been sent to your university email.");
                }
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#F2EFE9",
              }}
            >
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                  Reset Account Password
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                  Verification code sent to registered university email
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#8D9692" />
            </Pressable>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                  Two-Factor Authentication
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#15803D", marginTop: 1 }}>
                  Enforced via NUTECH University Email
                </Text>
              </View>
              <Ionicons name="shield-checkmark" size={18} color="#15803D" />
            </View>
          </View>

          {/* App Info Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 8 }}>
              SYSTEM INFORMATION
            </Text>

            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E" }}>Application</Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "600", color: "#12221C" }}>Numigos NUTECH</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E" }}>Module</Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "600", color: "#1E5D4B" }}>Society Admin Portal</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E" }}>Governing Office</Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "600", color: "#12221C" }}>Directorate of Student Life (DSL)</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E" }}>Version</Text>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: "600", color: "#12221C" }}>v2.4.0 (Build 2026)</Text>
              </View>
            </View>
          </View>

          {/* Sign Out */}
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
