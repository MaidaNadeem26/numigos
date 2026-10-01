import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { Ionicons } from "@expo/vector-icons";

const SERIF_FONT = FONT_SANS;

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const MARCH_DAYS = Array.from({ length: 35 }, (_, idx) => {
  const dayNum = idx - 5; // March 1 starts on Saturday
  return dayNum >= 1 && dayNum <= 31 ? dayNum : null;
});

const EVENT_DATES: Record<
  number,
  Array<{
    id: string;
    time: string;
    title: string;
    society: string;
    venue: string;
    tag: string;
    tagBg: string;
    tagText: string;
  }>
> = {
  8: [
    {
      id: "event-innovation-night",
      time: "09:00 AM – 06:00 PM",
      title: "NUTECH Hackathon '25 Kickoff",
      society: "ACM Student Chapter",
      venue: "Innovation Center Hall, Block A",
      tag: "COMPETITION",
      tagBg: "#FCE4E4",
      tagText: "#B83B3B",
    },
  ],
  12: [
    {
      id: "event-ui-ux-bootcamp",
      time: "03:30 PM – 05:30 PM",
      title: "AI in Robotics Colloquium",
      society: "Robotics & Automation (RAS)",
      venue: "Main Auditorium · Ground Floor",
      tag: "COLLOQUIUM",
      tagBg: "#E4F2EC",
      tagText: "#144534",
    },
  ],
  15: [
    {
      id: "event-cloud-study-jam",
      time: "02:00 PM – 05:00 PM",
      title: "AWS Cloud Study Jam: Serverless & AI",
      society: "AWS Cloud Club NUTECH",
      venue: "CS Auditorium, Block B",
      tag: "ENROLLED PASS",
      tagBg: "#CBEAD9",
      tagText: "#144534",
    },
  ],
  18: [
    {
      id: "event-speed-programming",
      time: "11:30 AM – 02:00 PM",
      title: "UI/UX Design Systems Sprint",
      society: "NUTECH Arts & Design Guild",
      venue: "Design Studio, Lab 04",
      tag: "WORKSHOP",
      tagBg: "#F5DFB8",
      tagText: "#5D3B14",
    },
  ],
  24: [
    {
      id: "event-innovation-night",
      time: "10:00 AM – 04:00 PM",
      title: "Annual Tech Symposium 2025",
      society: "ACM Student Chapter",
      venue: "Main Auditorium, Admin Block",
      tag: "FLAGSHIP",
      tagBg: "#CBEAD9",
      tagText: "#144534",
    },
  ],
};

export default function CalendarScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const selectedEvents = EVENT_DATES[selectedDay] ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Header Bar */}
      <View
        style={{
          height: 48,
          paddingHorizontal: 14,
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
            <Text
              style={{
                fontSize: 7.5,
                fontWeight: "700",
                letterSpacing: 0.8,
                color: "#2A6350",
              }}
            >
              ACADEMIC & EVENT SCHEDULE
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
              Campus Calendar
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/events/registered")}
          style={{
            backgroundColor: "#E3F2EC",
            borderRadius: 999,
            paddingHorizontal: 9,
            paddingVertical: 4,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Ionicons name="ticket-outline" size={11.5} color="#144534" />
          <Text style={{ fontSize: 8, fontWeight: "700", color: "#144534" }}>
            My Passes
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: hPad, paddingTop: 6, paddingBottom: 28, maxWidth: 520, width: "100%", alignSelf: "center" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <MotionView delay={25} distance={8}>
        {/* Month Grid Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#EAE8E1",
            padding: 13,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 14.5,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                March 2025
              </Text>
              <Text style={{ fontSize: 8.5, color: "#7A8580", marginTop: 1 }}>
                Spring Semester · Week 6
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 6 }}>
              <Pressable
                onPress={() => setSelectedDay(12)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#F6F5F0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="chevron-back" size={13} color="#12221C" />
              </Pressable>
              <Pressable
                onPress={() => setSelectedDay(18)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#F6F5F0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="chevron-forward" size={13} color="#12221C" />
              </Pressable>
            </View>
          </View>

          {/* Weekday Headers */}
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            {WEEKDAYS.map((day) => (
              <View key={day} style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}>
                <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#8E9893" }}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Cells */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {MARCH_DAYS.map((day, idx) => {
              const isSelected = day === selectedDay;
              const hasEvent = day !== null && Boolean(EVENT_DATES[day]);
              return (
                <View
                  key={idx}
                  style={{
                    width: "14.285%",
                    alignItems: "center",
                    paddingVertical: 3,
                  }}
                >
                  {day ? (
                    <Pressable
                      onPress={() => setSelectedDay(day)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: isSelected
                          ? "#134635"
                          : hasEvent
                            ? "#E4F2EC"
                            : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: isSelected || hasEvent ? "700" : "500",
                          color: isSelected ? "#FFFFFF" : hasEvent ? "#144534" : "#26332E",
                        }}
                      >
                        {day}
                      </Text>
                      {hasEvent && (
                        <View
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: isSelected ? "#F3D092" : "#144534",
                            marginTop: 1,
                          }}
                        />
                      )}
                    </Pressable>
                  ) : (
                    <View style={{ width: 32, height: 32 }} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Jump Event Date Chips */}
        <View style={{ marginTop: 13 }}>
          <Text
            style={{
              fontFamily: SERIF_FONT,
              fontSize: 13,
              fontWeight: "700",
              color: "#12221C",
            }}
          >
            Scheduled for Mar {selectedDay}, 2025
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingVertical: 8 }}
          >
            {[8, 12, 15, 18, 24].map((d) => {
              const active = selectedDay === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => setSelectedDay(d)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4.5,
                    borderRadius: 999,
                    backgroundColor: active ? "#134635" : "#EFECE6",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 8.5,
                      fontWeight: "700",
                      color: active ? "#FFFFFF" : "#4A5450",
                    }}
                  >
                    Mar {d}
                  </Text>
                </Pressable>
              );
            })}
      </ScrollView>
        </View>

        {/* Selected Date Agenda */}
        {selectedEvents.length > 0 ? (
          <View style={{ gap: 9 }}>
            {selectedEvents.map((ev) => (
              <Pressable
                key={ev.id}
                onPress={() => router.push(`/event/${ev.id}` as any)}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: "#EAE8E1",
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="time-outline" size={12} color="#144534" />
                    <Text style={{ fontSize: 8.5, fontWeight: "700", color: "#144534" }}>
                      {ev.time}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: ev.tagBg,
                      borderRadius: 999,
                      paddingHorizontal: 7.5,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontSize: 7.5, fontWeight: "700", color: ev.tagText }}>
                      {ev.tag}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: SERIF_FONT,
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#12221C",
                  }}
                >
                  {ev.title}
                </Text>
                <Text style={{ marginTop: 2, fontSize: 9, fontWeight: "600", color: "#1E5D4B" }}>
                  {ev.society}
                </Text>

                <View
                  style={{
                    marginTop: 7,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F6F5F0",
                    borderRadius: 9,
                    paddingHorizontal: 9,
                    paddingVertical: 6.5,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Ionicons name="location-outline" size={11} color="#58635E" />
                    <Text style={{ fontSize: 8.5, color: "#58635E" }}>{ev.venue}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={13} color="#144534" />
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#EAE8E1",
              padding: 18,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: SERIF_FONT, fontSize: 12.5, fontWeight: "700", color: "#12221C" }}>
              No society sessions on Mar {selectedDay}
            </Text>
            <Text style={{ fontSize: 9, color: "#6E7773", marginTop: 3, textAlign: "center" }}>
              Select a highlighted date (Mar 8, 12, 15, 18, or 24) to view scheduled campus events.
            </Text>
          </View>
        )}
              </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
