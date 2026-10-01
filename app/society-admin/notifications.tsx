import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData, SocietyNotification } from "@/lib/society-admin-data";

type NotifFilter = "All" | "Approvals" | "Registrations" | "Team";

export default function SocietyAdminNotificationsScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useSocietyAdminData();
  const [activeFilter, setActiveFilter] = useState<NotifFilter>("All");

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === "Approvals" && n.type !== "approval" && n.type !== "changes") return false;
    if (activeFilter === "Registrations" && n.type !== "registration") return false;
    if (activeFilter === "Team" && n.type !== "team") return false;
    return true;
  });

  const getNotifIcon = (type: SocietyNotification["type"]) => {
    switch (type) {
      case "approval":
        return { icon: "checkmark-circle", color: "#15803D", bg: "#E8F4EE" };
      case "changes":
        return { icon: "alert-circle", color: "#C44D2D", bg: "#FFF0EB" };
      case "registration":
        return { icon: "people", color: "#1E5D4B", bg: "#E8F4EE" };
      case "team":
        return { icon: "person-add", color: "#D97706", bg: "#FEF7EC" };
      default:
        return { icon: "notifications", color: "#1E5D4B", bg: "#E8F4EE" };
    }
  };

  const handlePressNotif = (notif: SocietyNotification) => {
    markNotificationRead(notif.id);
    if (notif.targetRoute) {
      router.push(notif.targetRoute as any);
    }
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
              NOTIFICATIONS
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Society Activity Alerts
            </Text>
          </View>
        </View>

        <Pressable
          onPress={markAllNotificationsRead}
          style={{
            backgroundColor: "#F2EFE9",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
          }}
        >
          <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "600", color: "#12221C" }}>
            Mark All Read
          </Text>
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
          {/* Filter Pills */}
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 14 }}>
            {(["All", "Approvals", "Registrations", "Team"] as NotifFilter[]).map((tab) => {
              const active = activeFilter === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveFilter(tab)}
                  style={{
                    flex: 1,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: active ? "#1E5D4B" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor: active ? "#1E5D4B" : "#EAE7DF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 9.5,
                      fontWeight: active ? "700" : "600",
                      color: active ? "#FFFFFF" : "#58635E",
                    }}
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Notifications List */}
          {filteredNotifs.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#EAE7DF",
                padding: 24,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Ionicons name="notifications-off-outline" size={26} color="#8D9692" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 12.5, fontWeight: "700", color: "#12221C", marginTop: 8 }}>
                No notifications in this category
              </Text>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {filteredNotifs.map((item) => {
                const conf = getNotifIcon(item.type);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handlePressNotif(item)}
                    style={({ pressed }) => [
                      {
                        backgroundColor: item.read ? "#FFFFFF" : "#FAFBF9",
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: item.read ? "#EAE7DF" : "#CBEAD9",
                        padding: 12,
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "flex-start",
                        transform: [{ scale: pressed ? 0.99 : 1 }],
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: conf.bg,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name={conf.icon as any} size={16} color={conf.color} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#12221C", flex: 1, paddingRight: 6 }}>
                          {item.title}
                        </Text>
                        {!item.read && (
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#E25C3D", marginTop: 4 }} />
                        )}
                      </View>

                      <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E", marginTop: 2, lineHeight: 14 }}>
                        {item.message}
                      </Text>

                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692" }}>
                          {item.timestamp}
                        </Text>
                        {item.targetRoute && (
                          <Text style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: "700", color: "#1E5D4B" }}>
                            View Details →
                          </Text>
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
