import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "@/components/ui/primitives/LinearGradient";
import { SafeAreaView } from "@/components/ui/primitives/SafeAreaView";
import { goBackOrReplace } from "@/lib/navigation";
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { NUTECH_EVENTS } from "@/lib/nutech-data";

const SERIF_FONT = FONT_SANS;

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { hPad } = useResponsive();
  const [bookmarked, setBookmarked] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const event =
    (id && NUTECH_EVENTS[id]) ||
    NUTECH_EVENTS["event-ieee-fest"];

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
              fontSize: 13.5,
              fontWeight: "700",
            }}
          >
            Event Details
          </Text>
        </View>

        <Pressable
          accessibilityLabel="Bookmark event"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setBookmarked((prev) => !prev)}
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
          paddingBottom: 20,
          paddingHorizontal: hPad,
          paddingTop: 4,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={25} distance={8}>
          {/* Hero Banner Image */}
          <View
            style={{
              borderRadius: 16,
              height: 164,
              overflow: "hidden",
              width: "100%",
            }}
          >
            <ImageBackground
              resizeMode="cover"
              source={{ uri: event.image }}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={[
                  "rgba(10, 26, 20, 0.05)",
                  "rgba(11, 30, 23, 0.25)",
                  "rgba(11, 31, 24, 0.45)",
                ]}
                end={{ x: 0.5, y: 1 }}
                start={{ x: 0.5, y: 0 }}
                style={{ flex: 1 }}
              />
            </ImageBackground>
          </View>

          {/* Event Title */}
          <Text
            style={{
              color: "#12221C",
              fontFamily: SERIF_FONT,
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: -0.2,
              lineHeight: 23,
              marginTop: 12,
            }}
          >
            {event.title}
          </Text>

          {/* NUTECH Club Organizer Card with Real Club Image */}
          <Pressable
            onPress={() => router.push(`/societies/${event.societyId}` as any)}
            style={{
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderColor: "#EAE8E1",
              borderRadius: 13,
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 11,
              paddingHorizontal: 11,
              paddingVertical: 9.5,
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row", flex: 1 }}>
              <Image
                source={{ uri: event.clubLogo }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#D5E8DF",
                }}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#12221C",
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    {event.societyName}
                  </Text>
                  <Ionicons color="#1E5D4B" name="checkmark-circle" size={11} />
                </View>
                <Text
                  style={{
                    color: "#7A8580",
                    fontSize: 8.5,
                    marginTop: 1,
                  }}
                >
                  NUTECH Official Student Society
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#CBEAD9",
                borderRadius: 999,
                paddingHorizontal: 9,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: "#144534",
                  fontSize: 8.5,
                  fontWeight: "700",
                }}
              >
                View Club
              </Text>
            </View>
          </Pressable>

          {/* Date & Time Card */}
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderColor: "#EAE8E1",
              borderRadius: 13,
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
              paddingHorizontal: 11,
              paddingVertical: 9.5,
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row", flex: 1 }}>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#E4F2EC",
                  borderRadius: 9,
                  height: 32,
                  justifyContent: "center",
                  width: 32,
                }}
              >
                <Ionicons color="#184D3C" name="calendar-outline" size={14} />
              </View>
              <View style={{ flex: 1, marginLeft: 9 }}>
                <Text
                  style={{
                    color: "#7A8580",
                    fontSize: 7.5,
                    fontWeight: "700",
                    letterSpacing: 0.4,
                  }}
                >
                  DATE & TIME
                </Text>
                <Text
                  style={{
                    color: "#12221C",
                    fontSize: 10,
                    fontWeight: "700",
                    marginTop: 1.5,
                  }}
                >
                  {event.dateTimeFull}
                </Text>
              </View>
            </View>
          </View>

          {/* Location Card */}
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderColor: "#EAE8E1",
              borderRadius: 13,
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
              paddingHorizontal: 11,
              paddingVertical: 9.5,
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row", flex: 1 }}>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#E4F2EC",
                  borderRadius: 9,
                  height: 32,
                  justifyContent: "center",
                  width: 32,
                }}
              >
                <Ionicons color="#184D3C" name="location-outline" size={14} />
              </View>
              <View style={{ flex: 1, marginLeft: 9 }}>
                <Text
                  style={{
                    color: "#7A8580",
                    fontSize: 7.5,
                    fontWeight: "700",
                    letterSpacing: 0.4,
                  }}
                >
                  NUTECH VENUE
                </Text>
                <Text
                  style={{
                    color: "#12221C",
                    fontSize: 10,
                    fontWeight: "700",
                    marginTop: 1.5,
                  }}
                >
                  {event.venue}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#E4F2EC",
                borderRadius: 7,
                paddingHorizontal: 8,
                paddingVertical: 3.5,
              }}
            >
              <Text
                style={{
                  color: "#184D3C",
                  fontSize: 8.5,
                  fontWeight: "700",
                }}
              >
                {event.wing}
              </Text>
            </View>
          </View>

          {/* About the Event Description Card */}
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
              About the Event
            </Text>
            <Text
              style={{
                color: "#4A5450",
                fontSize: 10,
                lineHeight: 15.5,
                marginTop: 6,
              }}
            >
              {event.description}
            </Text>
          </View>
        </MotionView>
      </ScrollView>

      {/* Bottom Sticky Registration Bar */}
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#FAF9F5",
          borderTopColor: "#EAE7DF",
          borderTopWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: hPad,
          paddingVertical: 9,
        }}
      >
        <View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <Text
              style={{
                color: "#12221C",
                fontFamily: SERIF_FONT,
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              Free
            </Text>
            <View
              style={{
                backgroundColor: "#CBEAD9",
                borderRadius: 4,
                paddingHorizontal: 5,
                paddingVertical: 1.5,
              }}
            >
              <Text
                style={{
                  color: "#144534",
                  fontSize: 7,
                  fontWeight: "700",
                }}
              >
                {enrolled ? "ENROLLED" : "NUTECH ID"}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: "#7A8580",
              fontSize: 8.5,
              marginTop: 0.5,
            }}
          >
            {enrolled ? "Registered · See you there" : "Open to all NUTECH students"}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setEnrolled(true);
            router.push(`/events/registered?id=${event.id}` as any);
          }}
          style={{
            alignItems: "center",
            backgroundColor: enrolled ? "#E4F2EC" : "#123F30",
            borderRadius: 999,
            flexDirection: "row",
            gap: 5,
            height: 36,
            justifyContent: "center",
            paddingHorizontal: 18,
          }}
        >
          <Ionicons
            color={enrolled ? "#144534" : "#FFFFFF"}
            name={enrolled ? "checkmark-circle" : "ticket-outline"}
            size={13}
          />
          <Text
            style={{
              color: enrolled ? "#144534" : "#FFFFFF",
              fontSize: 10.5,
              fontWeight: "700",
            }}
          >
            {enrolled ? "Registered" : "Register Now"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
