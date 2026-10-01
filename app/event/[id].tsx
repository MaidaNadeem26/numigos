import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "@/components/ui/primitives/LinearGradient";
import { SafeAreaView } from "@/components/ui/primitives/SafeAreaView";
import { goBackOrReplace } from "@/lib/navigation";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { NutechEvent, NUTECH_SOCIETIES, resolveClubLogoSource } from "@/lib/nutech-data";
import { dbService } from "@/lib/supabase";
import { useStudentData } from "@/lib/student-data";

const SERIF_FONT = FONT_SANS;

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { hPad } = useResponsive();
  const { isRegistered, registerForEvent, isBookmarked, toggleBookmark } = useStudentData();

  const [event, setEvent] = useState<NutechEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchEvent() {
      if (!id) {
        setLoading(false);
        return;
      }
      const data = await dbService.getEventById(id);
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
            dateTimeFull: `${data.date || ""} · ${data.time || ""}`,
            venue: data.venue || "NUTECH Campus",
            wing: data.wing || "Main Campus",
            joinedLabel: `${data.registrations_count || 0} registered`,
            deadlineText: data.deadline ? `Deadline: ${new Date(data.deadline).toLocaleDateString()}` : "Open registration",
            urgent: false,
            image: data.image || "",
            clubLogo: data.club_logo || societyInfo?.logo || "local:entrepreneurship",
            description: data.description || "Join this official co-curricular session at NUTECH Islamabad.",
          });
        }
        setLoading(false);
      }
    }
    void fetchEvent();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!event && !loading) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: "#FAF9F5", flex: 1 }}>
        <View
          style={{
            alignItems: "center",
            backgroundColor: "#FAF9F5",
            flexDirection: "row",
            height: 44,
            paddingHorizontal: hPad,
            gap: 10,
          }}
        >
          <Pressable hitSlop={8} onPress={() => goBackOrReplace("/(tabs)/explore")}>
            <Ionicons color="#12221C" name="arrow-back" size={17} />
          </Pressable>
          <Text style={{ color: "#12221C", fontFamily: SERIF_FONT, fontSize: 14, fontWeight: "700" }}>
            Event Details
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Ionicons name="calendar-outline" size={32} color="#1E5D4B" />
          <Text style={{ fontFamily: SERIF_FONT, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: 8 }}>
            Event Not Found
          </Text>
          <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, color: "#58635E", marginTop: 4, textAlign: "center" }}>
            The requested campus event may have ended or been rescheduled.
          </Text>
          <Pressable
            onPress={() => goBackOrReplace("/(tabs)/explore")}
            style={{
              marginTop: 14,
              backgroundColor: "#1B4D3E",
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700" }}>Back to Explore</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: "#FAF9F5", flex: 1 }} />
    );
  }

  const enrolled = isRegistered(event.id);
  const bookmarked = isBookmarked(event.id);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ backgroundColor: "#FAF9F5", flex: 1 }}
    >
      {/* Top Bar */}
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#FAF9F5",
          flexDirection: "row",
          height: 44,
          justifyContent: "space-between",
          paddingHorizontal: hPad,
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => goBackOrReplace("/(tabs)/explore")}
          >
            <Ionicons color="#12221C" name="arrow-back" size={17} />
          </Pressable>
          <Text
            style={{
              color: "#12221C",
              fontFamily: SERIF_FONT,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            NUTECH Event Details
          </Text>
        </View>

        <Pressable
          accessibilityLabel="Bookmark event"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => void toggleBookmark(event.id)}
        >
          <Ionicons
            color="#2C3A34"
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={15.5}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24,
          paddingHorizontal: hPad,
          paddingTop: 4,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={25} distance={8}>
          {/* Hero Banner Card with Forest Green Gradient */}
          <LinearGradient
            colors={["#235F4B", "#184737", "#12382B"]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              padding: 13,
              position: "relative",
            }}
          >
            {/* Top Badges Row */}
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#CBEAD9",
                  borderRadius: 999,
                  flexDirection: "row",
                  gap: 4.5,
                  paddingHorizontal: 8.5,
                  paddingVertical: 3,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#144534",
                    borderRadius: 2.5,
                    height: 4.5,
                    width: 4.5,
                  }}
                />
                <Text
                  style={{
                    color: "#144534",
                    fontSize: 8,
                    fontWeight: "700",
                    letterSpacing: 0.4,
                  }}
                >
                  {event.categoryTag}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.16)",
                  borderRadius: 999,
                  borderWidth: 1,
                  paddingHorizontal: 8.5,
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: 8,
                    fontWeight: "600",
                  }}
                >
                  NUTECH Islamabad
                </Text>
              </View>
            </View>

            {/* Event Title */}
            <Text
              style={{
                color: "#FFFFFF",
                fontFamily: SERIF_FONT,
                fontSize: 16.5,
                fontWeight: "700",
                letterSpacing: -0.2,
                marginTop: 10,
              }}
            >
              {event.title}
            </Text>

            {/* Society Host Row with local brand crest */}
            <Pressable
              onPress={() => router.push(`/societies/${event.societyId}` as any)}
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: 7,
                marginTop: 7,
              }}
            >
              <Image
                source={resolveClubLogoSource(event.clubLogo)}
                style={{
                  backgroundColor: "#FAF9F5",
                  borderRadius: 7,
                  height: 22,
                  width: 22,
                }}
              />
              <Text
                style={{
                  color: "#D6EBE3",
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                Organized by {event.societyName} →
              </Text>
            </Pressable>

            {/* Event Image Banner (if available) */}
            {event.image ? (
              <Image
                source={{ uri: event.image }}
                style={{
                  width: "100%",
                  height: 140,
                  borderRadius: 12,
                  marginTop: 10,
                }}
                resizeMode="cover"
              />
            ) : null}

            {/* Meta Row (Date, Venue, Capacity) */}
            <View
              style={{
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.18)",
                borderRadius: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                paddingHorizontal: 9.5,
                paddingVertical: 7,
              }}
            >
              <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
                <Ionicons color="#E9C48C" name="calendar-outline" size={11.5} />
                <Text style={{ color: "#FFFFFF", fontSize: 9.5, fontWeight: "600" }}>
                  {event.dateLabel}
                </Text>
              </View>

              <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
                <Ionicons color="#E9C48C" name="time-outline" size={11.5} />
                <Text style={{ color: "#FFFFFF", fontSize: 9.5, fontWeight: "600" }}>
                  {event.timeLabel}
                </Text>
              </View>

              <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
                <Ionicons color="#E9C48C" name="location-outline" size={11.5} />
                <Text style={{ color: "#FFFFFF", fontSize: 9.5, fontWeight: "600" }}>
                  {event.wing}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Action Row: Enroll CTA + Pass Button */}
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
              marginTop: 10,
            }}
          >
            <Pressable
              onPress={() => void registerForEvent(event.id)}
              style={{
                alignItems: "center",
                backgroundColor: enrolled ? "#BCE5D1" : "#1B4D3E",
                borderRadius: 999,
                flex: 1,
                flexDirection: "row",
                gap: 5,
                height: 38,
                justifyContent: "center",
              }}
            >
              <Ionicons
                color={enrolled ? "#12382B" : "#FFFFFF"}
                name={enrolled ? "checkmark-circle-outline" : "ticket-outline"}
                size={14}
              />
              <Text
                style={{
                  color: enrolled ? "#12382B" : "#FFFFFF",
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {enrolled ? "Registered for Event ✓" : "Register for Event"}
              </Text>
            </Pressable>

            {enrolled && (
              <Pressable
                onPress={() => router.push(`/events/registered?eventId=${event.id}` as any)}
                style={{
                  alignItems: "center",
                  backgroundColor: "#EFECE6",
                  borderRadius: 19,
                  height: 38,
                  justifyContent: "center",
                  width: 38,
                }}
              >
                <Ionicons color="#18241E" name="qr-code-outline" size={16} />
              </Pressable>
            )}
          </View>

          {/* About Event Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#EAE8E1",
              borderRadius: 14,
              borderWidth: 1,
              marginTop: 10,
              padding: 12,
            }}
          >
            <Text
              style={{
                color: "#2A6350",
                fontSize: 8.5,
                fontWeight: "700",
                letterSpacing: 0.6,
              }}
            >
              ABOUT THIS SESSION
            </Text>
            <Text
              style={{
                color: "#3A4540",
                fontSize: 10,
                lineHeight: 15,
                marginTop: 6,
              }}
            >
              {event.description}
            </Text>
          </View>

          {/* Venue & Logistics Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#EAE8E1",
              borderRadius: 14,
              borderWidth: 1,
              marginTop: 10,
              padding: 12,
            }}
          >
            <Text
              style={{
                color: "#12221C",
                fontFamily: SERIF_FONT,
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              Venue & Access
            </Text>

            <View style={{ gap: 8, marginTop: 8 }}>
              <View style={{ alignItems: "center", flexDirection: "row", gap: 7 }}>
                <Ionicons color="#2A6350" name="location" size={13} />
                <Text style={{ color: "#3A4540", fontSize: 9.5 }}>{event.venue}</Text>
              </View>

              <View style={{ alignItems: "center", flexDirection: "row", gap: 7 }}>
                <Ionicons color="#2A6350" name="time" size={13} />
                <Text style={{ color: "#3A4540", fontSize: 9.5 }}>{event.dateTimeFull}</Text>
              </View>

              <View style={{ alignItems: "center", flexDirection: "row", gap: 7 }}>
                <Ionicons color="#2A6350" name="information-circle" size={13} />
                <Text style={{ color: "#3A4540", fontSize: 9.5 }}>{event.deadlineText}</Text>
              </View>
            </View>
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
