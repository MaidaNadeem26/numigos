import React from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";

export default function SocietyAdminDashboard() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const {
    society,
    events,
    members,
    registrants,
    unreadNotificationsCount,
  } = useSocietyAdminData();

  const upcomingEvents = events.filter((e) => e.status === "Approved" || e.status === "Pending Approval");
  const pendingEventsCount = events.filter((e) => e.status === "Pending Approval" || e.status === "Changes Requested").length;
  const approvedUpcoming = events.filter((e) => e.status === "Approved");
  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Bar: Bell icon only */}
      <View
        style={{
          paddingHorizontal: hPad,
          paddingTop: 8,
          paddingBottom: 4,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: "#FAF9F5",
        }}
      >
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
            position: "relative",
          }}
        >
          <Ionicons name="notifications-outline" size={17} color="#12221C" />
          {unreadNotificationsCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 6,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: "#E25C3D",
              }}
            />
          )}
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
          {/* Welcome Banner Card */}
          <LinearGradient
            colors={["#1E5D4B", "#134635", "#0E3528"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    lineHeight: 22,
                  }}
                >
                  {society.name}
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 10,
                    color: "#CBEAD9",
                    marginTop: 4,
                    lineHeight: 14,
                  }}
                >
                  {society.tagline}
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/society-admin/society-profile")}
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "600", color: "#FFFFFF" }}>
                  View Profile
                </Text>
                <Ionicons name="arrow-forward" size={11} color="#FFFFFF" />
              </Pressable>
            </View>
          </LinearGradient>

          {/* Quick Actions Row */}
          <View style={{ marginBottom: 18 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
                QUICK ACTIONS
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {/* Primary Action: Create Event */}
              <Pressable
                onPress={() => router.push("/society-admin/create-event")}
                style={({ pressed }) => [
                  {
                    flex: 1.3,
                    backgroundColor: "#1E5D4B",
                    borderRadius: 14,
                    padding: 12,
                    justifyContent: "space-between",
                    minHeight: 80,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="add" size={18} color="#1E5D4B" />
                </View>
                <View>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>
                    Create Event
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#CBEAD9", marginTop: 1 }}>
                    Submit to OSA
                  </Text>
                </View>
              </Pressable>

              {/* Action 2: My Events */}
              <Pressable
                onPress={() => router.push("/society-admin/events")}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#EAE7DF",
                    padding: 12,
                    justifyContent: "space-between",
                    minHeight: 80,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#E8F4EE",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="calendar-outline" size={15} color="#1E5D4B" />
                </View>
                <View>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                    My Events
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#58635E", marginTop: 1 }}>
                    View & Track
                  </Text>
                </View>
              </Pressable>

              {/* Action 3: Society Profile */}
              <Pressable
                onPress={() => router.push("/society-admin/society-profile")}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#EAE7DF",
                    padding: 12,
                    justifyContent: "space-between",
                    minHeight: 80,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#FEF7EC",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="business-outline" size={15} color="#C47D15" />
                </View>
                <View>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                    Profile
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#58635E", marginTop: 1 }}>
                    Edit Details
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Society Overview Section */}
          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 8 }}>
              SOCIETY OVERVIEW
            </Text>

            <View style={{ gap: 8 }}>
              {/* Row 1: Upcoming Events & Pending OSA */}
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => router.push("/society-admin/events")}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "#EAE7DF",
                      padding: 12,
                      justifyContent: "space-between",
                      minHeight: 84,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#E8F4EE",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="calendar-outline" size={15} color="#1E5D4B" />
                  </View>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                      Upcoming Events
                    </Text>
                    <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: "#58635E", marginTop: 1 }}>
                      {upcomingEvents.length} active
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/society-admin/events")}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: pendingEventsCount > 0 ? "#F8DCB5" : "#EAE7DF",
                      padding: 12,
                      justifyContent: "space-between",
                      minHeight: 84,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: pendingEventsCount > 0 ? "#FEF7EC" : "#F3F4F6",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={15}
                      color={pendingEventsCount > 0 ? "#C47D15" : "#6B7280"}
                    />
                  </View>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                      Pending OSA
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 9,
                        color: pendingEventsCount > 0 ? "#C47D15" : "#58635E",
                        marginTop: 1,
                      }}
                    >
                      {pendingEventsCount} in review
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Row 2: Registrants & Team (exact requested cards) */}
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => router.push("/society-admin/registrants")}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "#EAE7DF",
                      padding: 12,
                      justifyContent: "space-between",
                      minHeight: 84,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#E8F4EE",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="people-outline" size={15} color="#1E5D4B" />
                  </View>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                      Registrants
                    </Text>
                    <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: "#58635E", marginTop: 1 }}>
                      {totalRegistrations} enrolled
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/society-admin/members")}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: "#FFFFFF",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "#EAE7DF",
                      padding: 12,
                      justifyContent: "space-between",
                      minHeight: 84,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: "#FEF7EC",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="shield-checkmark-outline" size={15} color="#C47D15" />
                  </View>
                  <View>
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                      Team
                    </Text>
                    <Text style={{ fontFamily: FONT_MONO, fontSize: 9, color: "#58635E", marginTop: 1 }}>
                      {members.length} members
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>


        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
