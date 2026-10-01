import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotionView, PulseDot, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";

const SERIF_FONT = FONT_SANS;

const PASS_DATA: Record<
  string,
  {
    clubHeader: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    seat: string;
    perkLabel: string;
    perkBadge: string;
  }
> = {
  "default": {
    clubHeader: "AWS CLOUD CLUB · NUTECH",
    title: "Cloud Study Jam: AWS",
    date: "Today, Oct 24",
    time: "2:00 – 5:00 PM",
    venue: "Block 2 · Lab 4",
    seat: "GA · Bench A4",
    perkLabel: "AWS Credit Voucher:",
    perkBadge: "$50 USD INCLUDED",
  },
  "event-ieee-fest": {
    clubHeader: "IEEE STUDENT BRANCH · NUTECH",
    title: "NUTECH IEEE Fest '25: Hackathon & Circuits",
    date: "Sat, Mar 15",
    time: "2:00 – 5:00 PM",
    venue: "Block 2 · Lab 4",
    seat: "GA · Bench A4",
    perkLabel: "Participant Kit:",
    perkBadge: "SWAG INCLUDED",
  },
  "event-green-week": {
    clubHeader: "GREEN YOUTH CLUB · NUTECH",
    title: "NUTECH Green Week: Eco Exhibition",
    date: "Mon, Mar 17",
    time: "10:00 AM – 1:00 PM",
    venue: "Central Lawn",
    seat: "Open Delegate",
    perkLabel: "OSA Activity Credit:",
    perkBadge: "VERIFIED ENTRY",
  },
  "event-media-workshop": {
    clubHeader: "MEDIA & PUBLICITY · NUTECH",
    title: "Campus Photography & Storytelling",
    date: "Wed, Mar 19",
    time: "3:00 – 5:00 PM",
    venue: "Main Auditorium",
    seat: "Row B · Seat 08",
    perkLabel: "Media Press Access:",
    perkBadge: "STUDIO PASS",
  },
};

export default function RegisteredEventsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { hPad } = useResponsive();
  const [bookmarked, setBookmarked] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const pass = (id && PASS_DATA[id]) || PASS_DATA["default"];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${pass.title.replace("\n", " ")} — ${pass.date} (${pass.time}) at ${pass.venue}`,
      });
    } catch {
      // Ignore share cancellation
    }
  };

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
            Event Detail
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
          <Pressable onPress={() => setBookmarked((prev) => !prev)} hitSlop={8}>
            <Ionicons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={16}
              color="#12221C"
            />
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#134635",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="person-outline" size={13.5} color="#FFFFFF" />
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
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={20} distance={8}>
          {/* Sub-Header Row: ACTIVE ENTRY PASS + Share Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5.5,
                backgroundColor: "#CBEAD9",
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 4.5,
              }}
            >
              <PulseDot size={5.5} color="#144534" />
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "700",
                  letterSpacing: 0.5,
                  color: "#144534",
                }}
              >
                ACTIVE ENTRY PASS
              </Text>
            </View>

            <Pressable
              onPress={() => void handleShare()}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#EFECE6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="share-social-outline" size={13.5} color="#12221C" />
            </Pressable>
          </View>

          {/* Main Pass Card (Without QR Code) */}
          <View
            style={{
              backgroundColor: "#F5F4EE",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#E5E2DA",
              overflow: "hidden",
            }}
          >
            {/* Dark Forest Green Header */}
            <LinearGradient
              colors={["#13503D", "#0C392A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 14,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle Decorative Ring */}
              <View
                style={{
                  position: "absolute",
                  top: -28,
                  right: -28,
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  borderWidth: 14,
                  borderColor: "rgba(255,255,255,0.05)",
                }}
                pointerEvents="none"
              />

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
                    <Ionicons name="cloud-done-outline" size={17} color="#E9C48C" />
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
                      {pass.clubHeader}
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
                      {pass.title}
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
                  <Ionicons name="checkmark-circle-outline" size={10.5} color="#8FD1B8" />
                  <Text
                    style={{
                      fontSize: 7,
                      fontWeight: "700",
                      letterSpacing: 0.4,
                      color: "#8FD1B8",
                    }}
                  >
                    CONFIRMED
                  </Text>
                </View>
              </View>

              {/* Student Identity Box */}
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
                      ZA
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>
                      Zainab Ahmed
                    </Text>
                    <Text style={{ fontSize: 8.5, color: "#9EC5B5", marginTop: 1 }}>
                      2021-NUTECH-CS-084
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
                    CS · Year 3
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
                      {pass.date}
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
                      {pass.time}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 12 }}>
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
                    <Ionicons name="business-outline" size={12} color="#1E5D4B" />
                    <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                      {pass.venue}
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
                    ALLOCATED SEAT
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 3.5,
                    }}
                  >
                    <Ionicons name="desktop-outline" size={12} color="#1E5D4B" />
                    <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                      {pass.seat}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Voucher / Perk Row */}
              <View
                style={{
                  marginTop: 13,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#EAE8E1",
                  paddingHorizontal: 11,
                  paddingVertical: 8.5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="card-outline" size={13} color="#144534" />
                  <Text style={{ fontSize: 9.5, fontWeight: "600", color: "#2C3A34" }}>
                    {pass.perkLabel}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#F5DFB8",
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#5D3B14" }}>
                    {pass.perkBadge}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2-Button Row: Add to Calendar & ID Card Rule */}
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              gap: 9,
            }}
          >
            <Pressable
              onPress={() => setAddedToCalendar((prev) => !prev)}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 999,
                backgroundColor: "#CBEAD9",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Ionicons
                name={addedToCalendar ? "checkmark-circle-outline" : "calendar-outline"}
                size={13.5}
                color="#144534"
              />
              <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#144534" }}>
                {addedToCalendar ? "Added to Calendar" : "Add to Calendar"}
              </Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                height: 38,
                borderRadius: 999,
                backgroundColor: "#E8E6DF",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Ionicons name="id-card-outline" size={13.5} color="#26332E" />
              <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#26332E" }}>
                ID Card Rule
              </Text>
            </Pressable>
          </View>

          {/* Campus Verification Policy Card */}
          <View
            style={{
              marginTop: 11,
              backgroundColor: "#EFECE6",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#E5E2DA",
              padding: 12,
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "#E4E0D6",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              <Ionicons name="information-circle-outline" size={14} color="#5D4B34" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#12221C" }}>
                Campus Verification Policy
              </Text>
              <Text
                style={{
                  marginTop: 2.5,
                  fontSize: 9,
                  lineHeight: 13.5,
                  color: "#58635E",
                }}
              >
                Must present original physical{" "}
                <Text style={{ fontWeight: "700", color: "#12221C" }}>
                  NUTECH Student Card
                </Text>{" "}
                alongside this pass for turnstile check-in and workshop swag bundle redemption.
              </Text>
            </View>
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
