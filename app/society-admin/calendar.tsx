import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";

const DAYS_STRIP = [
  { day: "Wed", date: 25, month: "Mar" },
  { day: "Thu", date: 26, month: "Mar" },
  { day: "Fri", date: 27, month: "Mar" },
  { day: "Sat", date: 28, month: "Mar" },
  { day: "Sun", date: 29, month: "Mar" },
  { day: "Mon", date: 30, month: "Mar" },
  { day: "Tue", date: 31, month: "Mar" },
  { day: "Wed", date: 1, month: "Apr" },
  { day: "Thu", date: 2, month: "Apr" },
  { day: "Fri", date: 3, month: "Apr" },
  { day: "Sat", date: 4, month: "Apr" },
  { day: "Sun", date: 5, month: "Apr" },
];

export default function SocietyCalendarScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { events, society } = useSocietyAdminData();
  const [selectedDay, setSelectedDay] = useState(27);

  // Group events by day or schedule
  const activeEvents = events.filter((e) => e.status === "Approved" || e.status === "Pending Approval");

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
        <View>
          <Text style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: "700", letterSpacing: 0.8, color: "#1E5D4B" }}>
            {society.shortName.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
            Society Calendar
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/society-admin/create-event")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#1E5D4B",
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 999,
          }}
        >
          <Ionicons name="add" size={14} color="#FFFFFF" />
          <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
            Schedule Event
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
          {/* Month Indicator & Info */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
              March – April 2026
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#1E5D4B" }} />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E" }}>
                {activeEvents.length} events scheduled
              </Text>
            </View>
          </View>

          {/* Date Selector Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingBottom: 12 }}
          >
            {DAYS_STRIP.map((item) => {
              const isSelected = selectedDay === item.date;
              const hasEvent = item.date === 27 || item.date === 5 || item.date === 19;
              return (
                <Pressable
                  key={`${item.month}-${item.date}`}
                  onPress={() => setSelectedDay(item.date)}
                  style={{
                    width: 44,
                    height: 60,
                    borderRadius: 12,
                    backgroundColor: isSelected ? "#1E5D4B" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor: isSelected ? "#1E5D4B" : "#EAE7DF",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 9,
                      fontWeight: "600",
                      color: isSelected ? "#FFFFFF" : "#8D9692",
                    }}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 14,
                      fontWeight: "700",
                      color: isSelected ? "#FFFFFF" : "#12221C",
                      marginTop: 2,
                    }}
                  >
                    {item.date}
                  </Text>

                  {hasEvent && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 4,
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: isSelected ? "#F2CC8F" : "#1E5D4B",
                      }}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Weekly Society Milestones Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 12,
              marginBottom: 14,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 8 }}>
              WEEKLY SOCIETY ROUTINE
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#E8F4EE", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="repeat-outline" size={17} color="#1E5D4B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "700", color: "#12221C" }}>
                  Weekly Core Team Meeting
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                  {society.meetingSchedule}
                </Text>
              </View>
            </View>
          </View>

          {/* Agenda Feed for the Society */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 10 }}>
              UPCOMING AGENDA & SESSIONS
            </Text>

            <View style={{ gap: 10 }}>
              {activeEvents.map((ev) => {
                const isApproved = ev.status === "Approved";
                return (
                  <Pressable
                    key={ev.id}
                    onPress={() => router.push(`/society-admin/event/${ev.id}`)}
                    style={({ pressed }) => [
                      {
                        backgroundColor: "#FFFFFF",
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#EAE7DF",
                        padding: 12,
                        flexDirection: "row",
                        gap: 12,
                        transform: [{ scale: pressed ? 0.99 : 1 }],
                      },
                    ]}
                  >
                    <Image source={{ uri: ev.image }} style={{ width: 68, height: 68, borderRadius: 10 }} resizeMode="cover" />

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                        <View
                          style={{
                            backgroundColor: isApproved ? "#E8F4EE" : "#FFF7ED",
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: 8,
                              fontWeight: "700",
                              color: isApproved ? "#1E5D4B" : "#D97706",
                            }}
                          >
                            {isApproved ? "APPROVED" : "PENDING OSA"}
                          </Text>
                        </View>

                        <Text style={{ fontFamily: FONT_MONO, fontSize: 9, fontWeight: "600", color: "#58635E" }}>
                          {ev.registeredCount} reg
                        </Text>
                      </View>

                      <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#12221C", lineHeight: 16 }} numberOfLines={1}>
                        {ev.title}
                      </Text>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                        <Ionicons name="time-outline" size={11} color="#58635E" />
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#58635E" }}>
                          {ev.dateLabel}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Ionicons name="location-outline" size={11} color="#58635E" />
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#58635E" }} numberOfLines={1}>
                          {ev.venue}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
