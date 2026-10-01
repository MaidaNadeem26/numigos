import React, { useState, useMemo } from "react";
import { Alert, Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData, SocietyRegistrant } from "@/lib/society-admin-data";

type FilterStatus = "All" | "Registered" | "Attended" | "Absent";

export default function RegistrantsScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { hPad } = useResponsive();
  const { events, registrants, toggleAttendance, society } = useSocietyAdminData();

  const [selectedEventId, setSelectedEventId] = useState<string>(
    eventId || events.find((e) => e.registeredCount > 0)?.id || events[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [exported, setExported] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const eventRegistrants = useMemo(() => {
    return registrants.filter((r) => r.eventId === selectedEventId);
  }, [registrants, selectedEventId]);

  const filteredRegistrants = useMemo(() => {
    return eventRegistrants.filter((r) => {
      // Status filter
      if (statusFilter !== "All" && r.status !== statusFilter) return false;

      // Search filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.rollNumber.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [eventRegistrants, statusFilter, searchQuery]);

  const attendedCount = eventRegistrants.filter((r) => r.status === "Attended").length;
  const absentCount = eventRegistrants.filter((r) => r.status === "Absent").length;
  const registeredOnlyCount = eventRegistrants.filter((r) => r.status === "Registered").length;

  const handleExport = () => {
    setExported(true);
    if (Platform.OS === "web") {
      alert(`Attendance exported: ${selectedEvent.title} (CSV file created for OSA verification)`);
    } else {
      Alert.alert("Attendance Exported", `Attendance sheet for "${selectedEvent.title}" generated for OSA records.`);
    }
    setTimeout(() => setExported(false), 3000);
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
            onPress={() => router.canGoBack() ? router.back() : router.push("/society-admin/events")}
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
              EVENT MANAGEMENT
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Student Registrants
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleExport}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: exported ? "#1E5D4B" : "#FFFFFF",
            borderWidth: 1,
            borderColor: exported ? "#1E5D4B" : "#EAE7DF",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
          }}
        >
          <Ionicons name={exported ? "checkmark" : "download-outline"} size={13} color={exported ? "#FFFFFF" : "#12221C"} />
          <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: exported ? "#FFFFFF" : "#12221C" }}>
            {exported ? "Exported" : "Export CSV"}
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
          {/* Event Picker Pill Carousel */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#58635E", letterSpacing: 0.5, marginBottom: 6 }}>
              SELECT EVENT:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {events.map((ev) => {
                const isSelected = ev.id === selectedEventId;
                return (
                  <Pressable
                    key={ev.id}
                    onPress={() => setSelectedEventId(ev.id)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: isSelected ? "#1E5D4B" : "#FFFFFF",
                      borderWidth: 1,
                      borderColor: isSelected ? "#1E5D4B" : "#EAE7DF",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 10,
                        fontWeight: isSelected ? "700" : "500",
                        color: isSelected ? "#FFFFFF" : "#12221C",
                      }}
                    >
                      {ev.shortTitle}
                    </Text>
                    <View
                      style={{
                        backgroundColor: isSelected ? "rgba(255,255,255,0.25)" : "#F2EFE9",
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 8.5,
                          fontWeight: "700",
                          color: isSelected ? "#FFFFFF" : "#12221C",
                        }}
                      >
                        {ev.registeredCount}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Event Summary Overview Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
              {selectedEvent.title}
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 2 }}>
              {selectedEvent.dateLabel} · {selectedEvent.venue}
            </Text>

            {/* Attendance breakdown pills */}
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#F2EFE9" }}>
              <View style={{ flex: 1, backgroundColor: "#FAF9F5", padding: 8, borderRadius: 8, alignItems: "center" }}>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: "700", color: "#12221C" }}>
                  {eventRegistrants.length}
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#58635E", marginTop: 1 }}>
                  Registered
                </Text>
              </View>

              <View style={{ flex: 1, backgroundColor: "#E8F4EE", padding: 8, borderRadius: 8, alignItems: "center" }}>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: "700", color: "#1E5D4B" }}>
                  {attendedCount}
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#1E5D4B", marginTop: 1, fontWeight: "600" }}>
                  Attended
                </Text>
              </View>

              <View style={{ flex: 1, backgroundColor: "#FFF0EB", padding: 8, borderRadius: 8, alignItems: "center" }}>
                <Text style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: "700", color: "#C44D2D" }}>
                  {absentCount}
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#C44D2D", marginTop: 1, fontWeight: "600" }}>
                  Absent
                </Text>
              </View>
            </View>
          </View>

          {/* Search Box */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              paddingHorizontal: 10,
              height: 38,
              marginBottom: 10,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={15} color="#8D9692" />
            <TextInput
              placeholder="Search by student name or roll number..."
              placeholderTextColor="#8D9692"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[
              {
                flex: 1,
                fontFamily: FONT_SANS,
                fontSize: 10.5,
                color: "#12221C",
                height: "100%",
                            },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={15} color="#8D9692" />
              </Pressable>
            )}
          </View>

          {/* Filter Pills */}
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
            {(["All", "Registered", "Attended", "Absent"] as FilterStatus[]).map((filter) => {
              const active = statusFilter === filter;
              const count =
                filter === "All"
                  ? eventRegistrants.length
                  : filter === "Attended"
                  ? attendedCount
                  : filter === "Absent"
                  ? absentCount
                  : registeredOnlyCount;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setStatusFilter(filter)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 999,
                    backgroundColor: active ? "#1E5D4B" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor: active ? "#1E5D4B" : "#EAE7DF",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONT_SANS,
                      fontSize: 9.5,
                      fontWeight: active ? "700" : "500",
                      color: active ? "#FFFFFF" : "#58635E",
                    }}
                  >
                    {filter}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 8.5,
                      fontWeight: "700",
                      color: active ? "#FFFFFF" : "#8D9692",
                    }}
                  >
                    {count}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Registrants List */}
          {filteredRegistrants.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#EAE7DF",
                padding: 24,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <Ionicons name="people-outline" size={28} color="#8D9692" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 12.5, fontWeight: "700", color: "#12221C", marginTop: 8 }}>
                No students found
              </Text>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E", textAlign: "center", marginTop: 2 }}>
                Try adjusting your search query or status filter.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {filteredRegistrants.map((reg) => {
                const isAttended = reg.status === "Attended";
                const isAbsent = reg.status === "Absent";
                return (
                  <View
                    key={reg.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "#EAE7DF",
                      padding: 12,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, paddingRight: 6 }}>
                        {reg.avatar ? (
                          <Image source={{ uri: reg.avatar }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                        ) : (
                          <View
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              backgroundColor: "#1E5D4B",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#FAF9F5" }}>
                              {reg.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "S"}
                            </Text>
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#12221C" }}>
                              {reg.name}
                            </Text>
                            <Text
                              style={{
                                fontFamily: FONT_MONO,
                                fontSize: 9,
                                fontWeight: "600",
                                color: "#1E5D4B",
                                backgroundColor: "#E8F4EE",
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                borderRadius: 4,
                              }}
                            >
                              {reg.rollNumber}
                            </Text>
                          </View>
                          <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                            {reg.department} · {reg.semester}
                          </Text>
                        </View>
                      </View>

                      {/* Status Chip */}
                      <View
                        style={{
                          backgroundColor: isAttended ? "#E8F4EE" : isAbsent ? "#FFF0EB" : "#F3F4F6",
                          paddingHorizontal: 7,
                          paddingVertical: 2.5,
                          borderRadius: 999,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 8.5,
                            fontWeight: "700",
                            color: isAttended ? "#1E5D4B" : isAbsent ? "#C44D2D" : "#4B5563",
                          }}
                        >
                          {reg.status}
                        </Text>
                      </View>
                    </View>

                    {/* Attendance Marking Controls */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: "#F6F5F0",
                      }}
                    >
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692" }}>
                        Reg: {reg.registeredAt}
                      </Text>

                      <View style={{ flexDirection: "row", gap: 6 }}>
                        <Pressable
                          onPress={() => toggleAttendance(reg.id, "Attended")}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                            backgroundColor: isAttended ? "#1E5D4B" : "#F6F5F0",
                            paddingHorizontal: 8,
                            paddingVertical: 3.5,
                            borderRadius: 6,
                          }}
                        >
                          <Ionicons name="checkmark" size={11} color={isAttended ? "#FFFFFF" : "#58635E"} />
                          <Text
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: 9,
                              fontWeight: "600",
                              color: isAttended ? "#FFFFFF" : "#58635E",
                            }}
                          >
                            Attended
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => toggleAttendance(reg.id, "Absent")}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                            backgroundColor: isAbsent ? "#C44D2D" : "#F6F5F0",
                            paddingHorizontal: 8,
                            paddingVertical: 3.5,
                            borderRadius: 6,
                          }}
                        >
                          <Ionicons name="close" size={11} color={isAbsent ? "#FFFFFF" : "#58635E"} />
                          <Text
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: 9,
                              fontWeight: "600",
                              color: isAbsent ? "#FFFFFF" : "#58635E",
                            }}
                          >
                            Absent
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
