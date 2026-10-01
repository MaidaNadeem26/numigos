import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { AWS_BUILDER_IMAGE, IEEE_NUTECH_IMAGE, NUTECH_EVENTS_LIST, NUTECH_SOCIETIES, resolveClubBannerSource, resolveClubLogoSource, ZINDIGI_PRIZE_IMAGE } from "@/lib/nutech-data";

const SERIF_FONT = FONT_SANS;

export default function SocietyProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { hPad } = useResponsive();
  const [bookmarked, setBookmarked] = useState(false);
  const [joined, setJoined] = useState(true);
  const [rsvpIds, setRsvpIds] = useState<string[]>(["event-ieee-fest"]);
  const [postExpanded, setPostExpanded] = useState(false);

  const society = (id && NUTECH_SOCIETIES[id]) || NUTECH_SOCIETIES["entrepreneurship-club"];
  const clubEvents = NUTECH_EVENTS_LIST.filter((ev) => ev.societyId === society.id);
  const displayEvents = clubEvents.length > 0 ? clubEvents : NUTECH_EVENTS_LIST.slice(0, 2);

  const toggleRsvp = (eventId: string) => {
    setRsvpIds((prev) =>
      prev.includes(eventId) ? prev.filter((item) => item !== eventId) : [...prev, eventId]
    );
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ backgroundColor: "#FAF9F5", flex: 1 }}
    >
      {/* Top App Bar */}
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
            NUTECH Club Profile
          </Text>
        </View>

        <Pressable
          accessibilityLabel="Bookmark society"
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
          {/* Club Banner Image + Dark Forest Green Hero Card */}
          <View style={{ borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#E0DDD4" }}>
            <Image
              source={resolveClubBannerSource(society.banner)}
              style={{ width: "100%", height: 112 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["#235F4B", "#184737", "#12382B"]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{ padding: 13, position: "relative" }}
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
                    {society.categoryLabel}
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

              {/* Club Logo Image + Title Row */}
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 11,
                }}
              >
                <Image
                  source={resolveClubLogoSource(society.logo)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.4)",
                    backgroundColor: "#FAF9F5",
                  }}
                />

                <View style={{ flex: 1, marginLeft: 11 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: SERIF_FONT,
                      fontSize: 16.5,
                      fontWeight: "700",
                      letterSpacing: -0.2,
                    }}
                  >
                    {society.name}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(214, 235, 227, 0.88)",
                      fontSize: 9.5,
                      marginTop: 2,
                    }}
                  >
                    {society.tagline}
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 12,
                }}
              >
                <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
                  <Ionicons color="#E9C48C" name="people-outline" size={12} />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 9.5,
                      fontWeight: "600",
                    }}
                  >
                    {society.studentsLabel}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    height: 11,
                    marginHorizontal: 12,
                    width: 1,
                  }}
                />

                <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
                  <Ionicons color="#E9C48C" name="calendar-outline" size={11.5} />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 9.5,
                      fontWeight: "600",
                    }}
                  >
                    {society.sessionsLabel}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Action Row: Join / Joined + Notification Bell */}
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
              marginTop: 10,
            }}
          >
            <Pressable
              onPress={() => setJoined((prev) => !prev)}
              style={{
                alignItems: "center",
                backgroundColor: joined ? "#BCE5D1" : "#1B4D3E",
                borderRadius: 999,
                flex: 1,
                flexDirection: "row",
                gap: 5,
                height: 36,
                justifyContent: "center",
              }}
            >
              <Ionicons
                color={joined ? "#12382B" : "#FFFFFF"}
                name={joined ? "checkmark-circle-outline" : "add-circle-outline"}
                size={14}
              />
              <Text
                style={{
                  color: joined ? "#12382B" : "#FFFFFF",
                  fontSize: 10.5,
                  fontWeight: "700",
                }}
              >
                {joined ? "Following Club ✓" : "+ Follow Club"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/reminders")}
              style={{
                alignItems: "center",
                backgroundColor: "#EFECE6",
                borderRadius: 18,
                height: 36,
                justifyContent: "center",
                width: 36,
              }}
            >
              <Ionicons color="#18241E" name="notifications-outline" size={14.5} />
            </Pressable>
          </View>

          {/* Mission & Scope Card */}
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
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
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
                ABOUT THIS NUTECH CLUB
              </Text>

              <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
                <Ionicons color="#5A6560" name="school-outline" size={11} />
                <Text
                  style={{
                    color: "#5A6560",
                    fontSize: 8.5,
                    fontWeight: "600",
                  }}
                >
                  {society.dept}
                </Text>
              </View>
            </View>

            <Text
              style={{
                color: "#3A4540",
                fontSize: 10,
                lineHeight: 15,
                marginTop: 6,
              }}
            >
              {society.mission}
            </Text>
          </View>

          {/* Core Leadership Card */}
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
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
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
                Club Leadership
              </Text>
              <Text
                style={{
                  color: "#2A6350",
                  fontSize: 8.5,
                  fontWeight: "700",
                }}
              >
                NUTECH OSA
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 7, marginTop: 9 }}>
              {society.leaders.map((leader) => (
                <View
                  key={leader.name}
                  style={{
                    alignItems: "center",
                    backgroundColor: "#F6F5F0",
                    borderRadius: 11,
                    flex: 1,
                    paddingHorizontal: 4,
                    paddingVertical: 9,
                  }}
                >
                  <Image
                    source={{ uri: leader.avatar }}
                    style={{
                      backgroundColor: "#E2E6E4",
                      borderRadius: 19,
                      height: 38,
                      width: 38,
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#12221C",
                      fontSize: 9,
                      fontWeight: "700",
                      marginTop: 6,
                      textAlign: "center",
                    }}
                  >
                    {leader.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#7A8580",
                      fontSize: 8,
                      marginTop: 1,
                      textAlign: "center",
                    }}
                  >
                    {leader.role}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Club Posts & Announcements Section (Non-Event Club Posts) */}
          <View style={{ marginTop: 13 }}>
            <Text
              style={{
                color: "#12221C",
                fontFamily: SERIF_FONT,
                fontSize: 13.5,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Club Posts & Announcements
            </Text>

            {society.id === "aws-student-builder-nutech" || society.id === "aws-cloud-club" ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAE8E1",
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                    <Image
                      source={resolveClubLogoSource(society.logo)}
                      style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: "#D5E8DF" }}
                    />
                    <View>
                      <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                        {society.name}
                      </Text>
                      <Text style={{ fontSize: 8.5, color: "#7A8580" }}>
                        Core Team Applications Open · Club Post
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#CBEAD9",
                      borderRadius: 999,
                      paddingHorizontal: 7.5,
                      paddingVertical: 2.5,
                    }}
                  >
                    <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
                      CLUB POST
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 9,
                    fontFamily: SERIF_FONT,
                    fontSize: 12.5,
                    fontWeight: "700",
                    color: "#12221C",
                  }}
                >
                  The wait is over! Core team applications are open 🎉
                </Text>

                <Text
                  numberOfLines={postExpanded ? undefined : 2}
                  style={{
                    marginTop: 5,
                    fontSize: 9.8,
                    lineHeight: 15,
                    color: "#36403C",
                  }}
                >
                  {`AWS Student Builder Group NUTECH has officially opened team applications!

Join NUTECH’s most premium tech community. After events at NASTP and 10Pearls, we’re ready for our next chapter.

🎁 Get AWS swag, exam vouchers, and cloud credits. Build your skills. Connect with industry professionals.`}
                </Text>
                <Pressable
                  onPress={() => setPostExpanded((prev) => !prev)}
                  hitSlop={6}
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#144534" }}>
                    {postExpanded ? "Show less" : "Read more"}
                  </Text>
                  <Ionicons
                    name={postExpanded ? "chevron-up" : "chevron-down"}
                    size={12}
                    color="#144534"
                  />
                </Pressable>

                <Image
                  source={AWS_BUILDER_IMAGE}
                  style={{
                    marginTop: 9,
                    width: "100%",
                    height: postExpanded ? 200 : 135,
                    borderRadius: 12,
                  }}
                  resizeMode="contain"
                  backgroundColor="#0A120F"
                />

                <Pressable
                  onPress={() => void Linking.openURL("https://forms.gle/DggZXNdqdzryVpga8")}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#DCFCE7",
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 8.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 9.5,
                      fontWeight: "700",
                      color: "#144534",
                      flex: 1,
                      paddingRight: 8,
                    }}
                  >
                    📝 Join the squad. Apply now: https://forms.gle/DggZXNdqdzryVpga8
                  </Text>
                  <Ionicons name="open-outline" size={13.5} color="#144534" />
                </Pressable>
              </View>
            ) : society.id === "zindigi-prize-nutech" ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAE8E1",
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                    <Image
                      source={resolveClubLogoSource(society.logo)}
                      style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: "#D5E8DF" }}
                    />
                    <View>
                      <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                        {society.name}
                      </Text>
                      <Text style={{ fontSize: 8.5, color: "#7A8580" }}>
                        Core Team Recruitment 2026-27 · Club Post
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#CBEAD9",
                      borderRadius: 999,
                      paddingHorizontal: 7.5,
                      paddingVertical: 2.5,
                    }}
                  >
                    <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
                      CLUB POST
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 9,
                    fontFamily: SERIF_FONT,
                    fontSize: 12.5,
                    fontWeight: "700",
                    color: "#12221C",
                  }}
                >
                  🚀 Join Zindigi Prize NUTECH Core Team 2026-27! 🚀
                </Text>

                <Text
                  numberOfLines={postExpanded ? undefined : 2}
                  style={{
                    marginTop: 5,
                    fontSize: 9.8,
                    lineHeight: 15,
                    color: "#36403C",
                  }}
                >
                  {`Do you want to be a part of the biggest Entrepreneur Community in Pakistan?

What is Zindigi Prize?
Zindigi Prize is Pakistan's largest Entrepreneurship competition. It is a platform where students turn their ideas into real startups. We organize workshops, speaker sessions, pitching competitions and provide mentorship and funding opportunities to young entrepreneurs. It's not just a society, it's a movement to build future leaders.

This is your chance to Build, Lead, and Innovate.
Open for all departments.

Note: No startup needed to join the team.`}
                </Text>
                <Pressable
                  onPress={() => setPostExpanded((prev) => !prev)}
                  hitSlop={6}
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#144534" }}>
                    {postExpanded ? "Show less" : "Read more"}
                  </Text>
                  <Ionicons
                    name={postExpanded ? "chevron-up" : "chevron-down"}
                    size={12}
                    color="#144534"
                  />
                </Pressable>

                <Image
                  source={ZINDIGI_PRIZE_IMAGE}
                  style={{
                    marginTop: 9,
                    width: "100%",
                    height: postExpanded ? 200 : 135,
                    borderRadius: 12,
                  }}
                  resizeMode="contain"
                  backgroundColor="#0A120F"
                />

                <Pressable
                  onPress={() => void Linking.openURL("https://forms.gle/kFDYhRu25iH11Mrz6")}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#DCFCE7",
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 8.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 9.5,
                      fontWeight: "700",
                      color: "#144534",
                      flex: 1,
                      paddingRight: 8,
                    }}
                  >
                    📋 Apply Here: https://forms.gle/kFDYhRu25iH11Mrz6
                  </Text>
                  <Ionicons name="open-outline" size={13.5} color="#144534" />
                </Pressable>

                <Pressable
                  onPress={() => void Linking.openURL("https://chat.whatsapp.com/ElfjeW81Xnj9T1iSAAoEaV")}
                  style={{
                    marginTop: 6,
                    backgroundColor: "#EBF5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#D8EBE2",
                    paddingHorizontal: 10,
                    paddingVertical: 8.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 9.5,
                      fontWeight: "700",
                      color: "#144534",
                      flex: 1,
                      paddingRight: 8,
                    }}
                  >
                    💬 WhatsApp Updates: https://chat.whatsapp.com/ElfjeW81Xnj9T1iSAAoEaV
                  </Text>
                  <Ionicons name="logo-whatsapp" size={13.5} color="#144534" />
                </Pressable>
              </View>
            ) : society.id === "ieee-nutech" ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAE8E1",
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                    <Image
                      source={resolveClubLogoSource(society.logo)}
                      style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: "#D5E8DF" }}
                    />
                    <View>
                      <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                        {society.name}
                      </Text>
                      <Text style={{ fontSize: 8.5, color: "#7A8580" }}>
                        2026-27 Tenure Recruitment · Club Post
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#CBEAD9",
                      borderRadius: 999,
                      paddingHorizontal: 7.5,
                      paddingVertical: 2.5,
                    }}
                  >
                    <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
                      CLUB POST
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 9,
                    fontFamily: SERIF_FONT,
                    fontSize: 12.5,
                    fontWeight: "700",
                    color: "#12221C",
                  }}
                >
                  ⚡ JOIN IEEE NUTECH | RECRUITMENT DRIVE 2026 🚀
                </Text>

                <Text
                  numberOfLines={postExpanded ? undefined : 2}
                  style={{
                    marginTop: 5,
                    fontSize: 9.8,
                    lineHeight: 15,
                    color: "#36403C",
                  }}
                >
                  {`You’ve seen the IEEE Fest.
You’ve seen the competitions, workshops, speakers, crowds and the energy.

Now it’s your turn to be part of it. 👀

IEEE NUTECH is recruiting students who want to:
🔧 Build technical skills
🤝 Meet & work with amazing people
🎤 Improve communication & professional skills
🚀 Take leadership and lead real projects & events

Whether you’re from Engineering, IT, or NSDD — there’s a place for you at IEEE NUTECH.

Don’t just attend. Be part of the team that makes it happen. ⚡

⏳ Registration Deadline: Wednesday 30 Sept, 2026`}
                </Text>
                <Pressable
                  onPress={() => setPostExpanded((prev) => !prev)}
                  hitSlop={6}
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#144534" }}>
                    {postExpanded ? "Show less" : "Read more"}
                  </Text>
                  <Ionicons
                    name={postExpanded ? "chevron-up" : "chevron-down"}
                    size={12}
                    color="#144534"
                  />
                </Pressable>

                <Image
                  source={IEEE_NUTECH_IMAGE}
                  style={{
                    marginTop: 9,
                    width: "100%",
                    height: postExpanded ? 200 : 135,
                    borderRadius: 12,
                  }}
                  resizeMode="contain"
                  backgroundColor="#0A120F"
                />

                <Pressable
                  onPress={() => void Linking.openURL("https://forms.gle/cykdHctmqyfZuXR17")}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#DCFCE7",
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 8.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 9.5,
                      fontWeight: "700",
                      color: "#144534",
                      flex: 1,
                      paddingRight: 8,
                    }}
                  >
                    📋 Register: https://forms.gle/cykdHctmqyfZuXR17
                  </Text>
                  <Ionicons name="open-outline" size={13.5} color="#144534" />
                </Pressable>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAE8E1",
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                    <Image
                      source={resolveClubLogoSource(society.logo)}
                      style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: "#D5E8DF" }}
                    />
                    <View>
                      <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#12221C" }}>
                        {society.name}
                      </Text>
                      <Text style={{ fontSize: 8.5, color: "#7A8580" }}>
                        Core Team Announcement · Club Post
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#CBEAD9",
                      borderRadius: 999,
                      paddingHorizontal: 7.5,
                      paddingVertical: 2.5,
                    }}
                  >
                    <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
                      CLUB POST
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 9,
                    fontFamily: SERIF_FONT,
                    fontSize: 12.5,
                    fontWeight: "700",
                    color: "#12221C",
                  }}
                >
                  NUTECH Entrepreneurship Club — Core Team
                </Text>

                <Text
                  numberOfLines={postExpanded ? undefined : 2}
                  style={{
                    marginTop: 5,
                    fontSize: 9.8,
                    lineHeight: 15,
                    color: "#36403C",
                  }}
                >
                  {`Interested in entrepreneurship, business, innovation, startups, and new ideas? Join the NUTECH Entrepreneurship Club Core Team and be part of a community where you can learn, work on projects, develop your ideas, and connect with industries, entrepreneurs, and professionals.

We are looking for:
🎯 Media Lead
🤝 Outreach Lead
📋 Management Lead
🏛️ General Secretary
👩‍💼 Female Representative
💡 Other Core Team Roles

This is a great opportunity to learn, lead, build your network, and turn ideas into action.

Join the team. Build the future. 🚀

Regards,
Huzaifa Khan`}
                </Text>
                <Pressable
                  onPress={() => setPostExpanded((prev) => !prev)}
                  hitSlop={6}
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#144534" }}>
                    {postExpanded ? "Show less" : "Read more"}
                  </Text>
                  <Ionicons
                    name={postExpanded ? "chevron-up" : "chevron-down"}
                    size={12}
                    color="#144534"
                  />
                </Pressable>

                <Pressable
                  onPress={() => void Linking.openURL("https://forms.gle/pAA2oZmuLwGPSybQ6")}
                  style={{
                    marginTop: 10,
                    backgroundColor: "#DCFCE7",
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 8.5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 9.5,
                      fontWeight: "700",
                      color: "#144534",
                      flex: 1,
                      paddingRight: 8,
                    }}
                  >
                    🔗 Register here: https://forms.gle/pAA2oZmuLwGPSybQ6
                  </Text>
                  <Ionicons name="open-outline" size={13.5} color="#144534" />
                </Pressable>
              </View>
            )}
          </View>

          {/* Upcoming Events Section */}
          <View style={{ marginTop: 13 }}>
            <Text
              style={{
                color: "#12221C",
                fontFamily: SERIF_FONT,
                fontSize: 13.5,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Upcoming Club Events
            </Text>

            <View style={{ gap: 9 }}>
              {displayEvents.map((ev) => {
                const isRsvped = rsvpIds.includes(ev.id);
                return (
                  <Pressable
                    key={ev.id}
                    onPress={() => router.push(`/event/${ev.id}` as any)}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#EAE8E1",
                      borderRadius: 14,
                      borderWidth: 1,
                      overflow: "hidden",
                    }}
                  >
                    <View style={{ flexDirection: "row", padding: 11 }}>
                      <Image
                        source={{ uri: ev.image }}
                        style={{ width: 68, height: 68, borderRadius: 10 }}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <View
                            style={{
                              backgroundColor: "#CBEAD9",
                              borderRadius: 999,
                              paddingHorizontal: 7,
                              paddingVertical: 2,
                            }}
                          >
                            <Text style={{ color: "#144534", fontSize: 7.5, fontWeight: "700" }}>
                              {ev.categoryTag}
                            </Text>
                          </View>
                          <Text style={{ color: "#8A5A2B", fontSize: 8.5, fontWeight: "700" }}>
                            {ev.badge}
                          </Text>
                        </View>

                        <Text
                          numberOfLines={1}
                          style={{
                            color: "#12221C",
                            fontFamily: SERIF_FONT,
                            fontSize: 13,
                            fontWeight: "700",
                            marginTop: 4,
                          }}
                        >
                          {ev.shortTitle}
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                          <Ionicons color="#5A6560" name="location-outline" size={11} />
                          <Text numberOfLines={1} style={{ color: "#5A6560", fontSize: 9, flex: 1 }}>
                            {ev.venue}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: "#F6F5F0",
                        paddingHorizontal: 11,
                        paddingVertical: 7.5,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTopWidth: 1,
                        borderTopColor: "#EFECE6",
                      }}
                    >
                      <Text style={{ fontSize: 8.5, color: "#5A6560", fontWeight: "600" }}>
                        {ev.dateLabel}
                      </Text>

                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleRsvp(ev.id);
                        }}
                        style={{
                          backgroundColor: isRsvped ? "#CBEAD9" : "#123F30",
                          borderRadius: 999,
                          paddingHorizontal: 11,
                          paddingVertical: 4.5,
                        }}
                      >
                        <Text
                          style={{
                            color: isRsvped ? "#144534" : "#FFFFFF",
                            fontSize: 8.5,
                            fontWeight: "700",
                          }}
                        >
                          {isRsvped ? "✓ Registered" : "Register"}
                        </Text>
                      </Pressable>
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
