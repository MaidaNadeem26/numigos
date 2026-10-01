import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotionView, PulseDot, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { NutechEvent, NUTECH_SOCIETIES } from "@/lib/nutech-data";
import { dbService } from "@/lib/supabase";
import { useStudentData } from "@/lib/student-data";

const SERIF_FONT = FONT_SANS;

export default function RegisteredEventsScreen() {
  const router = useRouter();
  const { eventId, id } = useLocalSearchParams<{ eventId?: string; id?: string }>();
  const { hPad } = useResponsive();
  const { profile, registeredEventIds } = useStudentData();

  const [bookmarked, setBookmarked] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);
  const [event, setEvent] = useState<NutechEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const targetEventId = eventId || id || registeredEventIds[0];

  useEffect(() => {
    let isMounted = true;
    async function loadEvent() {
      if (!targetEventId) {
        setLoading(false);
        return;
      }
      const data = await dbService.getEventById(targetEventId);
      if (isMounted) {
        if (data) {
          const societyInfo = NUTECH_SOCIETIES[data.society_id];
          setEvent({
            id: data.id,
            title: data.title || "Campus Event",
            shortTitle: data.title || "Campus Event",
            societyId: data.society_id || "",
            societyName: data.society_name || societyInfo?.name || "NUTECH Society",
            category: (data.category as any) || "Hackathons",
            categoryTag: (data.category || "EVENT").toUpperCase(),
            badge: data.date ? new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Upcoming",
            dateLabel: data.date ? new Date(data.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "TBA",
            timeLabel: data.time || "TBA",
            dateTimeFull: `${data.date || ""} ${data.time || ""}`,
            venue: data.venue || "NUTECH Campus",
            wing: data.wing || "Main Campus",
            joinedLabel: `${data.registrations_count || 0} registered`,
            deadlineText: data.deadline ? `Deadline: ${new Date(data.deadline).toLocaleDateString()}` : "Open registration",
            urgent: false,
            image: data.image || "",
            clubLogo: data.club_logo || societyInfo?.logo || "local:entrepreneurship",
            description: data.description || "",
          });
        }
        setLoading(false);
      }
    }
    void loadEvent();
    return () => {
      isMounted = false;
    };
  }, [targetEventId]);

  const handleShare = async () => {
    if (!event) return;
    try {
      await Share.share({
        message: `${event.title} — ${event.dateLabel} (${event.timeLabel}) at ${event.venue} | NUTECH Entry Pass`,
      });
    } catch {
      // Ignore share cancellation
    }
  };

  const studentName = profile?.name || "Student";
  const studentRoll = profile?.roll_number || "NUTECH Student";
  const studentDept = profile?.department || "Undergraduate";
  const studentInitials = studentName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top App Bar */}
      <View
        style={{
          height: 46,
          paddingHorizontal: hPad,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.push("/(tabs)/profile"))}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={17} color="#12221C" />
          </Pressable>
          <Text
            style={{
              fontFamily: SERIF_FONT,
              fontSize: 14.5,
              fontWeight: "700",
              color: "#12221C",
            }}
          >
            Event Pass
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
          <Pressable onPress={() => setBookmarked((prev) => !prev)} hitSlop={8}>
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={15.5}
              color="#2C3A34"
            />
          </Pressable>
          <Pressable onPress={handleShare} hitSlop={8}>
            <Ionicons name="share-social-outline" size={15.5} color="#2C3A34" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: hPad,
          paddingTop: 6,
          paddingBottom: 28,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={25} distance={8}>
          {!event && !loading ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "#EAE8E1",
                padding: 28,
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Ionicons name="ticket-outline" size={32} color="#1E5D4B" />
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#12221C",
                  marginTop: 10,
                }}
              >
                No Active Entry Pass
              </Text>
              <Text
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 11.5,
                  color: "#58635E",
                  marginTop: 4,
                  textAlign: "center",
                  maxWidth: 280,
                }}
              >
                You haven&apos;t registered for any upcoming events yet. Register for a campus event to generate your digital gate pass.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/explore")}
                style={{
                  marginTop: 16,
                  backgroundColor: "#1E5D4B",
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#FFFFFF" }}>
                  Browse Upcoming Events
                </Text>
              </Pressable>
            </View>
          ) : event ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "#EAE8E1",
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
              }}
            >
              {/* Forest Green Gradient Hero Header */}
              <LinearGradient
                colors={["#1B5240", "#144233", "#0E3327"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 14 }}
              >
                {/* Institutional Pill */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 9,
                  }}
                >
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 2.5,
                      backgroundColor: "#F3D092",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 8,
                      fontWeight: "700",
                      letterSpacing: 0.7,
                      color: "#F3D092",
                    }}
                  >
                    NUTECH STUDENT ENTRY PASS
                  </Text>
                </View>

                {/* Top Row: Club Icon + Title + CONFIRMED Badge */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: "rgba(255,255,255,0.12)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.16)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="calendar-outline" size={17} color="#E9C48C" />
                    </View>

                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 7.5,
                          fontWeight: "700",
                          letterSpacing: 0.6,
                          color: "#A9D1C2",
                        }}
                      >
                        {event.societyName.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          marginTop: 2,
                          fontFamily: SERIF_FONT,
                          fontSize: 16,
                          fontWeight: "700",
                          lineHeight: 20,
                          color: "#FFFFFF",
                        }}
                      >
                        {event.title}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3.5,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: 999,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.14)",
                    }}
                  >
                    <PulseDot color="#7BE495" size={4.5} />
                    <Text
                      style={{
                        fontSize: 8,
                        fontWeight: "700",
                        letterSpacing: 0.4,
                        color: "#7BE495",
                      }}
                    >
                      CONFIRMED
                    </Text>
                  </View>
                </View>

                {/* Attendee Frosted Pill Card */}
                <View
                  style={{
                    marginTop: 13,
                    backgroundColor: "rgba(255,255,255,0.09)",
                    borderRadius: 12,
                    paddingHorizontal: 11,
                    paddingVertical: 9.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: "#CBEAD9",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: "700", color: "#12382B" }}>
                        {studentInitials}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>
                        {studentName}
                      </Text>
                      <Text style={{ fontSize: 8.5, color: "#9EC5B5", marginTop: 1 }}>
                        {studentRoll}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: 7,
                        fontWeight: "700",
                        letterSpacing: 0.5,
                        color: "#E9C48C",
                      }}
                    >
                      DEPARTMENT
                    </Text>
                    <Text
                      style={{
                        fontSize: 9.5,
                        fontWeight: "700",
                        color: "#FFFFFF",
                        marginTop: 1.5,
                      }}
                    >
                      {studentDept}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Ticket Dashed Divider */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  backgroundColor: "#F5F4EE",
                }}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 6,
                      height: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#DCD8CE",
                    }}
                  />
                ))}
              </View>

              {/* Session Details 2x2 Grid */}
              <View style={{ paddingHorizontal: 14, paddingBottom: 14, paddingTop: 4 }}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 7.5,
                        fontWeight: "700",
                        letterSpacing: 0.5,
                        color: "#6E7773",
                      }}
                    >
                      DATE
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 3.5,
                      }}
                    >
                      <Ionicons name="calendar-outline" size={12} color="#1E5D4B" />
                      <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                        {event.dateLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 7.5,
                        fontWeight: "700",
                        letterSpacing: 0.5,
                        color: "#6E7773",
                      }}
                    >
                      SESSION TIME
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 3.5,
                      }}
                    >
                      <Ionicons name="time-outline" size={12} color="#1E5D4B" />
                      <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                        {event.timeLabel}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#F0EDE6",
                    marginVertical: 10,
                  }}
                />

                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 7.5,
                        fontWeight: "700",
                        letterSpacing: 0.5,
                        color: "#6E7773",
                      }}
                    >
                      VENUE
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 3.5,
                      }}
                    >
                      <Ionicons name="location-outline" size={12} color="#1E5D4B" />
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C", flex: 1 }}
                      >
                        {event.venue}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 7.5,
                        fontWeight: "700",
                        letterSpacing: 0.5,
                        color: "#6E7773",
                      }}
                    >
                      CAMPUS BLOCK
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 3.5,
                      }}
                    >
                      <Ionicons name="business-outline" size={12} color="#1E5D4B" />
                      <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                        {event.wing}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* QR Verification Card */}
              <View
                style={{
                  marginHorizontal: 12,
                  marginBottom: 12,
                  backgroundColor: "#F7F6F1",
                  borderRadius: 14,
                  padding: 13,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#EAE7DF",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    padding: 9,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                  }}
                >
                  <Ionicons name="qr-code" size={118} color="#12221C" />
                </View>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 8.5,
                    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
                    letterSpacing: 1.2,
                    color: "#58635E",
                    fontWeight: "700",
                  }}
                >
                  PASS ID: NUT-{event.id.slice(-6).toUpperCase()}-{profile?.id?.slice(-4).toUpperCase() || "ST01"}
                </Text>

                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 8,
                    color: "#8E9893",
                  }}
                >
                  Scan at NUTECH main gate or session entrance for instant check-in
                </Text>
              </View>

              {/* Add to Calendar Action */}
              <Pressable
                onPress={() => setAddedToCalendar(true)}
                style={{
                  marginHorizontal: 12,
                  marginBottom: 12,
                  backgroundColor: addedToCalendar ? "#E8F4EE" : "#F2EFE9",
                  borderRadius: 10,
                  height: 36,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Ionicons
                  name={addedToCalendar ? "checkmark-circle" : "calendar-outline"}
                  size={13}
                  color={addedToCalendar ? "#1E5D4B" : "#12221C"}
                />
                <Text
                  style={{
                    fontSize: 9.5,
                    fontWeight: "700",
                    color: addedToCalendar ? "#1E5D4B" : "#12221C",
                  }}
                >
                  {addedToCalendar ? "Added to Device Calendar ✓" : "Add to Calendar"}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
