import React, { useState, useEffect } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { Ionicons } from "@expo/vector-icons";
import { dbService } from "@/lib/supabase";

const SERIF_FONT = FONT_SANS;

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface CalendarEvent {
  id: string;
  time: string;
  title: string;
  society: string;
  venue: string;
  tag: string;
  tagBg: string;
  tagText: string;
  date: string;
}

function getTagColors(category?: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("competition") || cat.includes("hackathon")) {
    return { tagBg: "#FCE4E4", tagText: "#B83B3B" };
  }
  if (cat.includes("workshop") || cat.includes("bootcamp")) {
    return { tagBg: "#F5DFB8", tagText: "#5D3B14" };
  }
  if (cat.includes("flagship")) {
    return { tagBg: "#CBEAD9", tagText: "#144534" };
  }
  return { tagBg: "#E4F2EC", tagText: "#144534" };
}

function getEventDayForMonth(eventDateStr: string, targetYear: number, targetMonth: number): number | null {
  if (!eventDateStr) return null;
  const parsed = new Date(eventDateStr);
  if (!isNaN(parsed.getTime())) {
    if (parsed.getFullYear() === targetYear && parsed.getMonth() === targetMonth) {
      return parsed.getDate();
    }
  }
  const match = eventDateStr.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (match) {
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const d = parseInt(match[3], 10);
    if (y === targetYear && m === targetMonth) return d;
  }
  return null;
}

export default function CalendarScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number>(() => new Date().getDate());

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      const res: any = await dbService.getEvents();
      if (mounted) {
        const list = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((e: any) => {
            const colors = getTagColors(e.category || e.badge);
            return {
              id: e.id,
              time: e.time || "TBD",
              title: e.title || "Campus Event",
              society: e.organizer || e.society_name || e.society || "NUTECH Society",
              venue: e.venue || e.location || "NUTECH Campus",
              tag: (e.badge || e.category || "EVENT").toUpperCase(),
              tagBg: colors.tagBg,
              tagText: colors.tagText,
              date: e.date || "",
            };
          });
          setEvents(mapped);
        } else {
          setEvents([]);
        }
        setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const currentMonthName = MONTH_NAMES[month];

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  events.forEach((ev) => {
    const day = getEventDayForMonth(ev.date, year, month);
    if (day !== null) {
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  });

  const daysWithEvents = Object.keys(eventsByDay).map(Number).sort((a, b) => a - b);
  const selectedEvents = eventsByDay[selectedDay] ?? [];

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

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
        showsVerticalScrollIndicator={false}
      >
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
                  {currentMonthName} {year}
                </Text>
                <Text style={{ fontSize: 8.5, color: "#7A8580", marginTop: 1 }}>
                  {daysWithEvents.length} {daysWithEvents.length === 1 ? "event" : "events"} scheduled
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 6 }}>
                <Pressable
                  onPress={handlePrevMonth}
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
                  onPress={handleNextMonth}
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
              {calendarCells.map((day, idx) => {
                const isSelected = day === selectedDay;
                const hasEvent = day !== null && Boolean(eventsByDay[day]);
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
          {daysWithEvents.length > 0 && (
            <View style={{ marginTop: 13 }}>
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                Dates with Events in {currentMonthName}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6, paddingVertical: 8 }}
              >
                {daysWithEvents.map((d) => {
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
                        {currentMonthName.slice(0, 3)} {d} ({eventsByDay[d]?.length})
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Selected Date Agenda */}
          <View style={{ marginTop: daysWithEvents.length > 0 ? 6 : 14 }}>
            <Text
              style={{
                fontFamily: SERIF_FONT,
                fontSize: 13,
                fontWeight: "700",
                color: "#12221C",
                marginBottom: 9,
              }}
            >
              Schedule for {currentMonthName.slice(0, 3)} {selectedDay}, {year}
            </Text>

            {loading ? (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <ActivityIndicator size="small" color="#144534" />
                <Text style={{ marginTop: 8, fontSize: 10, color: "#7A8580" }}>
                  Loading campus schedule...
                </Text>
              </View>
            ) : selectedEvents.length > 0 ? (
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
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <Ionicons name="calendar-outline" size={24} color="#8E9893" style={{ marginBottom: 6 }} />
                <Text style={{ fontFamily: SERIF_FONT, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
                  No events on {currentMonthName.slice(0, 3)} {selectedDay}
                </Text>
                <Text style={{ fontSize: 9.5, color: "#6E7773", marginTop: 4, textAlign: "center", lineHeight: 14 }}>
                  There are no campus events or sessions scheduled for this date.
                </Text>
              </View>
            )}
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
