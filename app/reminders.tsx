import React, { useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { dbService, NotificationRecord } from "@/lib/supabase";
import { useStudentData } from "@/lib/student-data";
import { resolveClubLogoSource } from "@/lib/nutech-data";

const SERIF_FONT = FONT_SANS;

export default function RemindersScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { profile } = useStudentData();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      const data = await dbService.getNotifications(profile?.id);
      if (isMounted) {
        setNotifications(data || []);
        setLoading(false);
      }
    }
    void loadNotifications();
    return () => {
      isMounted = false;
    };
  }, [profile?.id]);

  const handlePress = (notif: NotificationRecord) => {
    setReadIds((prev) => [...prev, notif.id]);
    void dbService.markNotificationRead(notif.id);
    if (notif.target_route) {
      router.push(notif.target_route as any);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      <View
        style={{
          height: 48,
          paddingHorizontal: hPad,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.push("/(tabs)/explore"))}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#EFECE6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={15} color="#12221C" />
          </Pressable>
          <View>
            <Text style={{ fontSize: 7.5, fontWeight: "700", letterSpacing: 0.8, color: "#2A6350" }}>
              NUTECH NOTIFICATIONS
            </Text>
            <Text
              style={{
                fontFamily: SERIF_FONT,
                fontSize: 15.5,
                fontWeight: "700",
                color: "#12221C",
                marginTop: -1,
              }}
            >
              Reminders & Alerts
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: hPad,
          paddingTop: 8,
          paddingBottom: 28,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={25} distance={8}>
          {notifications.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "#EAE8E1",
                padding: 24,
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Ionicons name="notifications-off-outline" size={26} color="#144534" />
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 13.5,
                  fontWeight: "700",
                  color: "#12221C",
                  marginTop: 8,
                }}
              >
                No New Reminders
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#6E7773",
                  marginTop: 4,
                  textAlign: "center",
                  lineHeight: 14,
                  maxWidth: 260,
                }}
              >
                You&apos;re all caught up! Society event alerts and official announcements will be delivered here.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {notifications.map((item) => {
                const isRead = readIds.includes(item.id) || item.read;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handlePress(item)}
                    style={{
                      backgroundColor: isRead ? "#FFFFFF" : "#F4FBF7",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: isRead ? "#EAE8E1" : "#BCE3D2",
                      padding: 12,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: "#134635",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="notifications" size={16} color="#E9C48C" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#1E5D4B" }}>
                            {item.type ? item.type.toUpperCase() : "ALERT"}
                          </Text>
                          <Text style={{ fontSize: 8, color: "#8E9893" }}>
                            {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontFamily: SERIF_FONT,
                            fontSize: 12.5,
                            fontWeight: "700",
                            color: "#12221C",
                            marginTop: 2,
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text style={{ fontSize: 9.5, color: "#58635E", marginTop: 2, lineHeight: 14 }}>
                          {item.message}
                        </Text>
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
