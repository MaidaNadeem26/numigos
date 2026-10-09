import React, { useEffect, useMemo, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { isEventPassed, mapDbEventToNutechEvent, NutechEvent, resolveClubLogoSource } from "@/lib/nutech-data";
import { RegistrationSuccessModal } from "@/components/events/RegistrationSuccessModal";
import { dbService } from "@/lib/supabase";
import { useStudentData } from "@/lib/student-data";

const SERIF_FONT = FONT_SANS;

const FILTERS = ["All Saved", "Hackathons", "Workshops", "Clubs", "Cultural"] as const;

export default function BookmarksScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { profile, bookmarkedEventIds, toggleBookmark, isRegistered, registerForEvent } = useStudentData();
  const [selectedFilter, setSelectedFilter] = useState<(typeof FILTERS)[number]>("All Saved");
  const [events, setEvents] = useState<NutechEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredModalEvent, setRegisteredModalEvent] = useState<NutechEvent | null>(null);

  useEffect(() => {
    let isMounted = true;
    dbService.getEvents().then((evs) => {
      if (isMounted) {
        setEvents((evs || []).map(mapDbEventToNutechEvent));
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRegisterEvent = async (eventToRegister: NutechEvent) => {
    if (isEventPassed(eventToRegister)) return;
    await registerForEvent(eventToRegister.id, {
      userName: profile?.full_name || profile?.name || "Student",
      userEmail: profile?.email || "",
      rollNumber: profile?.roll_number || "",
      department: profile?.department || "",
    });
    setRegisteredModalEvent(eventToRegister);
    setShowSuccessModal(true);
  };

  const visibleEvents = useMemo(() => {
    const base = events.filter((item) => bookmarkedEventIds.includes(item.id));
    if (selectedFilter === "All Saved") return base;
    return base.filter((item) => item.category === selectedFilter);
  }, [events, bookmarkedEventIds, selectedFilter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Header Bar */}
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
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#134635",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="bookmark" size={13.5} color="#E9C48C" />
          </View>
          <View>
            <Text
              style={{
                fontSize: 7.5,
                fontWeight: "700",
                letterSpacing: 0.8,
                color: "#2A6350",
              }}
            >
              NUTECH ISLAMABAD
            </Text>
            <Text
              style={{
                fontFamily: SERIF_FONT,
                fontSize: 16,
                fontWeight: "700",
                color: "#12221C",
                marginTop: -1,
              }}
            >
              Saved Events
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/reminders")}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#EFECE6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="notifications-outline" size={14} color="#12221C" />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: hPad,
          paddingTop: 4,
          paddingBottom: 28,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={25} distance={8}>
          {/* Saved Events List */}
          {visibleEvents.length === 0 ? (
            <View
              style={{
                marginTop: 18,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EAE8E1",
                padding: 24,
                alignItems: "center",
              }}
            >
              <Ionicons name="bookmark-outline" size={24} color="#144534" />
              <Text
                style={{
                  marginTop: 8,
                  fontFamily: SERIF_FONT,
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                No saved NUTECH events
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 10,
                  color: "#6E7773",
                  textAlign: "center",
                  lineHeight: 14,
                  maxWidth: 260,
                }}
              >
                Explore events across campus and bookmark them to keep track of schedules and deadlines.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/explore")}
                style={{
                  marginTop: 12,
                  backgroundColor: "#0E3A2B",
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 7.5,
                }}
              >
                <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#FFFFFF" }}>
                  Browse Events
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 10, marginTop: 4 }}>
              {visibleEvents.map((ev) => (
                <Pressable
                  key={ev.id}
                  onPress={() => router.push(`/event/${ev.id}` as any)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: "#EAE8E1",
                    overflow: "hidden",
                  }}
                >
                  <View style={{ flexDirection: "row", padding: 11 }}>
                    {ev.image ? (
                      <Image
                        source={{ uri: ev.image }}
                        style={{ width: 74, height: 74, borderRadius: 11 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: 74,
                          height: 74,
                          borderRadius: 11,
                          backgroundColor: "#134635",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="calendar-outline" size={26} color="#8FD1B8" />
                      </View>
                    )}

                    <View style={{ flex: 1, marginLeft: 11 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#E4F2EC",
                            borderRadius: 999,
                            paddingHorizontal: 7,
                            paddingVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 7.5,
                              fontWeight: "700",
                              color: "#144534",
                            }}
                          >
                            {ev.categoryTag}
                          </Text>
                        </View>

                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            void toggleBookmark(ev.id);
                          }}
                          hitSlop={8}
                        >
                          <Ionicons name="bookmark" size={15} color="#134635" />
                        </Pressable>
                      </View>

                      <Text
                        style={{
                          marginTop: 4,
                          fontFamily: SERIF_FONT,
                          fontSize: 12.5,
                          fontWeight: "700",
                          color: "#12221C",
                        }}
                        numberOfLines={1}
                      >
                        {ev.shortTitle || ev.title}
                      </Text>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
                        {ev.clubLogo ? (
                          <Image
                            source={resolveClubLogoSource(ev.clubLogo)}
                            style={{ width: 14, height: 14, borderRadius: 4 }}
                          />
                        ) : null}
                        <Text
                          numberOfLines={1}
                          style={{ fontSize: 8.5, fontWeight: "600", color: "#1E5D4B", flex: 1 }}
                        >
                          {ev.societyName}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: 4,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Ionicons name="calendar-outline" size={10} color="#6E7773" />
                        <Text style={{ fontSize: 8.5, color: "#6E7773" }}>{ev.dateLabel}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Register footer button on saved card */}
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: "#F3F4F6",
                      paddingHorizontal: 11,
                      paddingVertical: 7,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#FAF9F5",
                    }}
                  >
                    <Text style={{ fontSize: 8, color: "#6E7773", fontWeight: "500" }}>
                      {ev.joinedLabel}
                    </Text>

                    <Pressable
                      disabled={isEventPassed(ev)}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (!isEventPassed(ev) && !isRegistered(ev.id)) {
                          void handleRegisterEvent(ev);
                        }
                      }}
                      style={{
                        backgroundColor: isEventPassed(ev)
                          ? "#E5E7EB"
                          : isRegistered(ev.id)
                          ? "#CBEAD9"
                          : "#123F30",
                        borderRadius: 999,
                        paddingHorizontal: 11,
                        paddingVertical: 4.5,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3.5,
                        opacity: isEventPassed(ev) ? 0.75 : 1,
                      }}
                    >
                      {isRegistered(ev.id) && !isEventPassed(ev) ? (
                        <Ionicons color="#144534" name="checkmark" size={10.5} />
                      ) : isEventPassed(ev) ? (
                        <Ionicons color="#6B7280" name="time-outline" size={10.5} />
                      ) : null}
                      <Text
                        style={{
                          color: isEventPassed(ev)
                            ? "#6B7280"
                            : isRegistered(ev.id)
                            ? "#144534"
                            : "#FFFFFF",
                          fontSize: 8.5,
                          fontWeight: "700",
                        }}
                      >
                        {isEventPassed(ev)
                          ? "Event Ended"
                          : isRegistered(ev.id)
                          ? "✓ Registered"
                          : "Register"}
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </MotionView>
      </ScrollView>

      <RegistrationSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        event={registeredModalEvent}
        studentName={profile?.full_name || profile?.name || "Student"}
        rollNumber={profile?.roll_number}
      />
    </SafeAreaView>
  );
}
