import React, { useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData, SocietyAdminEvent } from "@/lib/society-admin-data";

type TabKey = "upcoming" | "pending" | "completed" | "issues";

export default function MySocietyEventsScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { events, society } = useSocietyAdminData();
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((ev) => {
    // Filter by tab
    if (activeTab === "upcoming" && ev.status !== "Approved") return false;
    if (activeTab === "pending" && ev.status !== "Pending Approval") return false;
    if (activeTab === "completed" && ev.status !== "Completed") return false;
    if (activeTab === "issues" && ev.status !== "Changes Requested" && ev.status !== "Rejected") return false;

    // Filter by search
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return ev.title.toLowerCase().includes(q) || ev.venue.toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusBadge = (status: SocietyAdminEvent["status"]) => {
    switch (status) {
      case "Approved":
        return { bg: "#E8F4EE", text: "#1E5D4B", label: "APPROVED BY OSA", icon: "checkmark-circle" };
      case "Pending Approval":
        return { bg: "#FFF7ED", text: "#D97706", label: "PENDING OSA REVIEW", icon: "time" };
      case "Changes Requested":
        return { bg: "#FFF0EB", text: "#C44D2D", label: "CHANGES REQUESTED", icon: "alert-circle" };
      case "Rejected":
        return { bg: "#FEE2E2", text: "#DC2626", label: "REJECTED BY OSA", icon: "close-circle" };
      case "Completed":
        return { bg: "#F3F4F6", text: "#4B5563", label: "COMPLETED", icon: "checkmark-done" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563", label: status.toUpperCase(), icon: "ellipse" };
    }
  };

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: "upcoming", label: "Upcoming", count: events.filter((e) => e.status === "Approved").length },
    { key: "pending", label: "Pending", count: events.filter((e) => e.status === "Pending Approval").length },
    { key: "completed", label: "Completed", count: events.filter((e) => e.status === "Completed").length },
    { key: "issues", label: "Attention", count: events.filter((e) => e.status === "Changes Requested" || e.status === "Rejected").length },
  ];

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
            Society Events
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/society-admin/create-event")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "#1E5D4B",
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 999,
          }}
        >
          <Ionicons name="add" size={15} color="#FFFFFF" />
          <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#FFFFFF" }}>
            New Event
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
          {/* Search Bar */}
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
              marginBottom: 12,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={16} color="#8D9692" />
            <TextInput
              placeholder="Search society events..."
              placeholderTextColor="#8D9692"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[
              {
                flex: 1,
                fontFamily: FONT_SANS,
                fontSize: 11,
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

          {/* Filter Tabs */}
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 14 }}>
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    paddingVertical: 7,
                    borderRadius: 10,
                    backgroundColor: active ? "#1E5D4B" : "#FFFFFF",
                    borderWidth: 1,
                    borderColor: active ? "#1E5D4B" : "#EAE7DF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text
                      style={{
                        fontFamily: FONT_SANS,
                        fontSize: 10,
                        fontWeight: active ? "700" : "600",
                        color: active ? "#FFFFFF" : "#58635E",
                      }}
                    >
                      {tab.label}
                    </Text>
                    <View
                      style={{
                        backgroundColor: active ? "rgba(255,255,255,0.25)" : "#F2EFE9",
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
                          color: active ? "#FFFFFF" : "#12221C",
                        }}
                      >
                        {tab.count}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EAE7DF",
                padding: 24,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#F2EFE9",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Ionicons name="calendar-outline" size={22} color="#8D9692" />
              </View>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
                No events in this category
              </Text>
              <Text
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 10,
                  color: "#58635E",
                  textAlign: "center",
                  marginTop: 4,
                  maxWidth: 240,
                }}
              >
                {activeTab === "pending"
                  ? "You have no events currently waiting for OSA review."
                  : activeTab === "issues"
                  ? "All events are cleared. No actions or changes requested."
                  : "Organize workshops, hackathons or talks for NUTECH students."}
              </Text>

              {activeTab === "upcoming" && (
                <Pressable
                  onPress={() => router.push("/society-admin/create-event")}
                  style={{
                    marginTop: 14,
                    backgroundColor: "#1E5D4B",
                    paddingHorizontal: 16,
                    paddingVertical: 7,
                    borderRadius: 999,
                  }}
                >
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
                    Create New Event
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {filteredEvents.map((ev) => {
                const badge = getStatusBadge(ev.status);
                return (
                  <Pressable
                    key={ev.id}
                    onPress={() => router.push(`/society-admin/event/${ev.id}`)}
                    style={({ pressed }) => [
                      {
                        backgroundColor: "#FFFFFF",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#EAE7DF",
                        overflow: "hidden",
                        transform: [{ scale: pressed ? 0.99 : 1 }],
                      },
                    ]}
                  >
                    <Image source={{ uri: ev.image }} style={{ width: "100%", height: 120 }} resizeMode="cover" />

                    <View style={{ padding: 13 }}>
                      {/* Status Row */}
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <View
                          style={{
                            backgroundColor: badge.bg,
                            paddingHorizontal: 7,
                            paddingVertical: 2.5,
                            borderRadius: 999,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Ionicons name={badge.icon as any} size={11} color={badge.text} />
                          <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700", color: badge.text }}>
                            {badge.label}
                          </Text>
                        </View>

                        <Text style={{ fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: "600", color: "#58635E" }}>
                          {ev.registeredCount} / {ev.capacity} reg
                        </Text>
                      </View>

                      <Text style={{ fontFamily: FONT_SANS, fontSize: 13.5, fontWeight: "700", color: "#12221C", lineHeight: 18 }}>
                        {ev.title}
                      </Text>

                      {/* OSA Note if changes requested */}
                      {ev.osaNotes && (ev.status === "Changes Requested" || ev.status === "Pending Approval") && (
                        <View
                          style={{
                            backgroundColor: ev.status === "Changes Requested" ? "#FFF0EB" : "#FFF7ED",
                            borderRadius: 8,
                            padding: 8,
                            marginTop: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: 9,
                              color: ev.status === "Changes Requested" ? "#C44D2D" : "#D97706",
                              lineHeight: 13,
                            }}
                          >
                            {ev.osaNotes}
                          </Text>
                        </View>
                      )}

                      {/* Meta Info */}
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 9 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Ionicons name="time-outline" size={12} color="#58635E" />
                          <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E" }}>
                            {ev.dateLabel}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
                          <Ionicons name="location-outline" size={12} color="#58635E" />
                          <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E" }} numberOfLines={1}>
                            {ev.venue}
                          </Text>
                        </View>
                      </View>

                      {/* Action Links */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTopWidth: 1,
                          borderTopColor: "#F2EFE9",
                          paddingTop: 9,
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#1E5D4B" }}>
                          Manage Event & Registrants →
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color="#1E5D4B" />
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
