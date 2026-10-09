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
import {
  NutechEvent,
  isEventPassed,
  mapDbEventToNutechEvent,
  NutechSociety,
  NUTECH_SOCIETIES,
  resolveClubBannerSource,
  resolveClubLogoSource,
} from "@/lib/nutech-data";
import { RegistrationSuccessModal } from "@/components/events/RegistrationSuccessModal";
import { dbService, SocietyMemberRecord, SocietyPostRecord } from "@/lib/supabase";
import { useStudentData } from "@/lib/student-data";

const SERIF_FONT = FONT_SANS;

export default function SocietyProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { hPad } = useResponsive();
  const { profile, isFollowed, toggleFollow, isRegistered, registerForEvent } = useStudentData();

  const [society, setSociety] = useState<NutechSociety | null>(() => {
    if (id && NUTECH_SOCIETIES[id]) return NUTECH_SOCIETIES[id];
    return null;
  });
  const [loading, setLoading] = useState(!society);
  const [leaders, setLeaders] = useState<SocietyMemberRecord[]>([]);
  const [posts, setPosts] = useState<SocietyPostRecord[]>([]);
  const [events, setEvents] = useState<NutechEvent[]>([]);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredModalEvent, setRegisteredModalEvent] = useState<NutechEvent | null>(null);

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

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!id) {
        setLoading(false);
        return;
      }

      let currentSociety = society;
      if (!currentSociety) {
        const dbSoc = await dbService.getSocietyById(id);
        if (dbSoc && isMounted) {
          currentSociety = {
            id: dbSoc.id,
            name: dbSoc.name,
            shortName: dbSoc.short_name || dbSoc.name,
            tagline: dbSoc.tagline || "",
            category: (dbSoc.category as any) || "Community",
            categoryLabel: (dbSoc.category_label || dbSoc.category || "COMMUNITY").toUpperCase(),
            dept: dbSoc.dept || "NUTECH Islamabad",
            membersCount: 0,
            studentsLabel: "Active Club",
            eventsCount: 0,
            sessionsLabel: "Active Club",
            logo: dbSoc.logo || "local:entrepreneurship",
            banner: dbSoc.banner || "local:entrepreneurship",
            mission: dbSoc.mission || "",
            leaders: [],
          };
          setSociety(currentSociety);
        }
      }

      const societyId = currentSociety?.id || id;
      const [membersData, postsData, allEvents] = await Promise.all([
        dbService.getSocietyMembers(societyId),
        dbService.getPosts(societyId),
        dbService.getEvents(),
      ]);

      if (isMounted) {
        setLeaders(membersData);
        setPosts(postsData);
        const mapped = (allEvents || []).map(mapDbEventToNutechEvent);
        const filtered = mapped.filter(
          (e) =>
            e.societyId === societyId ||
            e.societyName?.toLowerCase() === currentSociety?.name?.toLowerCase()
        );
        setEvents(filtered);
        setLoading(false);
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleExpandPost = (postId: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((p) => p !== postId) : [...prev, postId]
    );
  };

  if (!society && !loading) {
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
            Society Not Found
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Ionicons name="alert-circle-outline" size={32} color="#1E5D4B" />
          <Text style={{ fontFamily: SERIF_FONT, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: 8 }}>
            Club Profile Unavailable
          </Text>
          <Text style={{ fontSize: 11, color: "#58635E", marginTop: 4, textAlign: "center" }}>
            The requested student society could not be found or has not been published yet.
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

  if (!society) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: "#FAF9F5", flex: 1 }} />
    );
  }

  const isClubFollowed = isFollowed(society.id);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: "#FAF9F5", flex: 1 }}>
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
                  {society.tagline ? (
                    <Text
                      style={{
                        color: "rgba(214, 235, 227, 0.88)",
                        fontSize: 9.5,
                        marginTop: 2,
                      }}
                    >
                      {society.tagline}
                    </Text>
                  ) : null}
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
              onPress={() => toggleFollow(society.id)}
              style={{
                alignItems: "center",
                backgroundColor: isClubFollowed ? "#BCE5D1" : "#1B4D3E",
                borderRadius: 999,
                flex: 1,
                flexDirection: "row",
                gap: 5,
                height: 36,
                justifyContent: "center",
              }}
            >
              <Ionicons
                color={isClubFollowed ? "#12382B" : "#FFFFFF"}
                name={isClubFollowed ? "checkmark-circle-outline" : "add-circle-outline"}
                size={14}
              />
              <Text
                style={{
                  color: isClubFollowed ? "#12382B" : "#FFFFFF",
                  fontSize: 10.5,
                  fontWeight: "700",
                }}
              >
                {isClubFollowed ? "Following Club ✓" : "+ Follow Club"}
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
              {society.mission || "Dedicated to enriching student life and co-curricular engagement across NUTECH Islamabad."}
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

            {leaders.length === 0 ? (
              <View style={{ paddingVertical: 14, alignItems: "center" }}>
                <Ionicons name="people-outline" size={20} color="#8D9692" />
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#7A8580", marginTop: 4 }}>
                  No executive members listed yet for this club.
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 7, marginTop: 9, flexWrap: "wrap" }}>
                {leaders.map((leader) => (
                  <View
                    key={leader.id || leader.name}
                    style={{
                      alignItems: "center",
                      backgroundColor: "#F6F5F0",
                      borderRadius: 11,
                      minWidth: 90,
                      flex: 1,
                      paddingHorizontal: 4,
                      paddingVertical: 9,
                    }}
                  >
                    {leader.avatar ? (
                      <Image
                        source={{ uri: leader.avatar }}
                        style={{
                          backgroundColor: "#E2E6E4",
                          borderRadius: 19,
                          height: 38,
                          width: 38,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          backgroundColor: "#E2E6E4",
                          borderRadius: 19,
                          height: 38,
                          width: 38,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#144534" }}>
                          {leader.name
                            .split(" ")
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </Text>
                      </View>
                    )}
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
            )}
          </View>

          {/* Club Posts & Announcements Section */}
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

            {posts.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAE8E1",
                  borderRadius: 15,
                  borderWidth: 1,
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <Ionicons name="megaphone-outline" size={22} color="#144534" />
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 12.5,
                    fontWeight: "700",
                    color: "#12221C",
                    marginTop: 6,
                  }}
                >
                  No announcements yet
                </Text>
                <Text style={{ fontSize: 9.5, color: "#7A8580", marginTop: 2, textAlign: "center" }}>
                  Official updates and recruitment calls from this club will appear here.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {posts.map((post) => {
                  const isExpanded = expandedPostIds.includes(post.id);
                  return (
                    <View
                      key={post.id}
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
                              {post.category || "Club Post"}
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

                      {post.title ? (
                        <Text
                          style={{
                            marginTop: 9,
                            fontFamily: SERIF_FONT,
                            fontSize: 12.5,
                            fontWeight: "700",
                            color: "#12221C",
                          }}
                        >
                          {post.title}
                        </Text>
                      ) : null}

                      <Text
                        numberOfLines={isExpanded ? undefined : 3}
                        style={{
                          marginTop: 5,
                          fontSize: 9.8,
                          lineHeight: 15,
                          color: "#36403C",
                        }}
                      >
                        {post.content}
                      </Text>

                      {post.content.length > 120 && (
                        <Pressable
                          onPress={() => toggleExpandPost(post.id)}
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
                            {isExpanded ? "Show less" : "Read more"}
                          </Text>
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={12}
                            color="#144534"
                          />
                        </Pressable>
                      )}

                      {post.image_url ? (
                        <Image
                          source={{ uri: post.image_url }}
                          style={{
                            marginTop: 9,
                            width: "100%",
                            height: isExpanded ? 200 : 135,
                            borderRadius: 12,
                            backgroundColor: "#0A120F",
                          }}
                          resizeMode="contain"
                        />
                      ) : null}

                      {post.link ? (
                        <Pressable
                          onPress={() => void Linking.openURL(post.link!)}
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
                            {post.link}
                          </Text>
                          <Ionicons name="open-outline" size={13.5} color="#144534" />
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
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

            {events.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAE8E1",
                  borderRadius: 14,
                  borderWidth: 1,
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <Ionicons name="calendar-outline" size={22} color="#144534" />
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 12.5,
                    fontWeight: "700",
                    color: "#12221C",
                    marginTop: 6,
                  }}
                >
                  No upcoming club events
                </Text>
                <Text style={{ fontSize: 9.5, color: "#7A8580", marginTop: 2, textAlign: "center" }}>
                  When this club schedules workshops or competitions, they will be listed here.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 9 }}>
                {events.map((ev) => {
                  const isRsvped = isRegistered(ev.id);
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
                        {ev.image ? (
                          <Image
                            source={{ uri: ev.image }}
                            style={{ width: 68, height: 68, borderRadius: 10 }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={{
                              width: 68,
                              height: 68,
                              borderRadius: 10,
                              backgroundColor: "#134635",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons name="calendar-outline" size={24} color="#8FD1B8" />
                          </View>
                        )}
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
                            {ev.badge ? (
                              <Text style={{ color: "#8A5A2B", fontSize: 8.5, fontWeight: "700" }}>
                                {ev.badge}
                              </Text>
                            ) : null}
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
                            {ev.shortTitle || ev.title}
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
                          disabled={isEventPassed(ev)}
                          onPress={(e) => {
                            e.stopPropagation();
                            if (!isEventPassed(ev) && !isRsvped) {
                              void handleRegisterEvent(ev);
                            }
                          }}
                          style={{
                            backgroundColor: isEventPassed(ev)
                              ? "#E5E7EB"
                              : isRsvped
                              ? "#CBEAD9"
                              : "#123F30",
                            borderRadius: 999,
                            paddingHorizontal: 11,
                            paddingVertical: 4.5,
                            opacity: isEventPassed(ev) ? 0.75 : 1,
                          }}
                        >
                          <Text
                            style={{
                              color: isEventPassed(ev)
                                ? "#6B7280"
                                : isRsvped
                                ? "#144534"
                                : "#FFFFFF",
                              fontSize: 8.5,
                              fontWeight: "700",
                            }}
                          >
                            {isEventPassed(ev)
                              ? "Event Ended"
                              : isRsvped
                              ? "✓ Registered"
                              : "Register"}
                          </Text>
                        </Pressable>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
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
