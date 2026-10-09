import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { LinearGradient } from "@/components/ui/primitives/LinearGradient";
import { SafeAreaView } from "@/components/ui/primitives/SafeAreaView";
import { FONT_MONO, FONT_SANS, MotionPressable, MotionView, PulseDot, useResponsive } from "@/lib/responsive-motion";
import {
  AWS_BUILDER_IMAGE,
  ENTREPRENEURSHIP_LOGO,
  IEEE_NUTECH_IMAGE,
  isEventPassed,
  mapDbEventToNutechEvent,
  NutechEvent,
  NUTECH_SOCIETIES,
  resolveClubLogoSource,
  ZINDIGI_PRIZE_IMAGE,
} from "@/lib/nutech-data";
import { RegistrationSuccessModal } from "@/components/events/RegistrationSuccessModal";
import { useStudentData } from "@/lib/student-data";
import { dbService } from "@/lib/supabase";

// Typography: Instrument Sans (sans) and JetBrains Mono (mono)
const SERIF_FONT = FONT_SANS;

const CATEGORIES = ["All Events", "Hackathons", "Workshops", "Clubs", "Cultural"];

type ClubPostItem = {
  id: string;
  societyId: string;
  society: string;
  category: string;
  timeAgo: string;
  logoSource: any;
  image?: string;
  imageSource?: any;
  title?: string;
  body: string;
  externalLink?: {
    label: string;
    url: string;
  };
  secondaryLink?: {
    label: string;
    url: string;
  };
  eventTag?: {
    id: string;
    label: string;
  };
  likes: number;
  liked: boolean;
  bookmarked: boolean;
};

export function ExploreDashboard() {
  const pathname = usePathname();
  const isAdminMode = pathname.includes("society-admin");
  const { hPad } = useResponsive();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const {
    profile,
    registeredEventIds,
    followedSocietyIds,
    registerForEvent,
    toggleFollow,
    toggleBookmark: toggleStudentBookmark,
    isRegistered,
    isBookmarked,
  } = useStudentData();

  const [events, setEvents] = useState<NutechEvent[]>([]);
  const [posts, setPosts] = useState<ClubPostItem[]>([]);
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredModalEvent, setRegisteredModalEvent] = useState<NutechEvent | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleExpandPost = (postId: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

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

  const loadData = useCallback(async () => {
    try {
      const [eventsRes, postsRes] = await Promise.all([
        dbService.getEvents(),
        dbService.getPosts(),
      ]);

      if (eventsRes && Array.isArray(eventsRes)) {
        const mappedEvents: NutechEvent[] = eventsRes.map(mapDbEventToNutechEvent);
        setEvents(mappedEvents);
      }

      if (postsRes && Array.isArray(postsRes)) {
        const mappedPosts: ClubPostItem[] = postsRes.map((p: any) => {
          const societyInfo = NUTECH_SOCIETIES[p.society_id];
          return {
            id: p.id,
            societyId: p.society_id || "",
            society: societyInfo?.name || p.society_name || "NUTECH Society",
            category: p.category || "Clubs",
            timeAgo: p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
            logoSource: resolveClubLogoSource(societyInfo?.logo || "local:entrepreneurship"),
            image: p.image_url,
            title: p.title,
            body: p.content || "",
            externalLink: p.link ? { label: p.link, url: p.link } : undefined,
            likes: p.likes_count || 0,
            liked: false,
            bookmarked: false,
          };
        });
        setPosts(mappedPosts);
      }
    } catch {
      // offline gracefully
    }
  }, []);

  useEffect(() => {
    void loadData();
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  }, [loadData]);

  const refresh = () => {
    setRefreshing(true);
    void loadData().then(() => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => setRefreshing(false), 500);
    });
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All Events" || post.category === activeCategory;
    const matchesQuery =
      !normalizedQuery ||
      `${post.society} ${post.body} ${post.title || ""}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const displayEvents = events.filter((ev) => {
    const matchesCategory =
      activeCategory === "All Events" || ev.category === activeCategory;
    const matchesQuery =
      !normalizedQuery ||
      `${ev.title} ${ev.societyName} ${ev.venue}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const activeEvent = displayEvents[activeCardIndex] ?? displayEvents[0];
  const isEventRegistered = activeEvent ? isRegistered(activeEvent.id) : false;

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
      )
    );
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ backgroundColor: "#FAF9F5", flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24,
          paddingHorizontal: hPad,
          paddingTop: 8,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            colors={["#1E5D4B"]}
            onRefresh={refresh}
            refreshing={refreshing}
            tintColor="#1E5D4B"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar Header */}
        <MotionView delay={15}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row", gap: 9 }}>
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "#E2F0EA",
                  borderRadius: 16,
                  height: 32,
                  justifyContent: "center",
                  width: 32,
                }}
              >
                <Ionicons color="#1E5D4B" name="school-outline" size={16} />
              </View>
              <View>
                <Text
                  style={{
                    color: "#6B7280",
                    fontFamily: FONT_SANS,
                    fontSize: 8.5,
                    fontWeight: "600",
                    letterSpacing: 0.5,
                  }}
                >
                  NUTECH CAMPUS
                </Text>
                <Text
                  style={{
                    color: "#111827",
                    fontFamily: FONT_SANS,
                    fontSize: 15,
                    fontWeight: "700",
                    letterSpacing: -0.2,
                  }}
                >
                  Events & Societies
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
              {isAdminMode && (
                <Pressable
                  onPress={() => router.push("/society-admin/dashboard")}
                  style={{
                    backgroundColor: "#1E5D4B",
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                  <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#FFFFFF" }}>
                    Admin
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => router.push("/reminders")}
                style={{
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  borderRadius: 18,
                  borderWidth: 1,
                  height: 36,
                  justifyContent: "center",
                  width: 36,
                }}
              >
                <Ionicons color="#111827" name="notifications-outline" size={16} />
              </Pressable>
            </View>
          </View>
        </MotionView>

        {/* Search Input */}
        <MotionView delay={35}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
              marginTop: 11,
            }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderColor: "#E8E6DF",
                borderRadius: 11,
                borderWidth: 1,
                flex: 1,
                flexDirection: "row",
                height: 37,
                paddingHorizontal: 11,
              }}
            >
              <Ionicons color="#8C9490" name="search-outline" size={13.5} />
              <TextInput
                accessibilityLabel="Search NUTECH clubs, events"
                onChangeText={setQuery}
                placeholder="Search NUTECH clubs, events..."
                placeholderTextColor="#949B97"
                returnKeyType="search"
                style={[
                  {
                    color: "#18241E",
                    flex: 1,
                    fontSize: 11,
                    marginLeft: 7,
                    paddingVertical: 0,
                  },
                  Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                ]}
                value={query}
              />
            </View>
          </View>
        </MotionView>

        {/* Categories Horizontal Scroll */}
        <MotionView delay={55}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingVertical: 10 }}
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 5.5,
                    borderRadius: 999,
                    backgroundColor: active ? "#1E5D4B" : "#FFFFFF",
                    borderColor: active ? "#1E5D4B" : "#E5E7EB",
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: active ? "#FFFFFF" : "#4B5563",
                    }}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </MotionView>

        {/* Featured Campus Event Card */}
        <MotionView delay={95}>
          <View style={{ marginTop: 4 }}>
            {!activeEvent ? (
              <View
                style={{
                  backgroundColor: "#1E5643",
                  borderRadius: 18,
                  padding: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="calendar-outline" size={28} color="#CBEAD9" />
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    marginTop: 8,
                  }}
                >
                  No Upcoming Campus Events
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#CBEAD9",
                    textAlign: "center",
                    marginTop: 4,
                    lineHeight: 14,
                  }}
                >
                  Official events organized by student societies will appear here once approved by OSA.
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <MotionPressable
                  accessibilityRole="button"
                  scaleTo={0.98}
                  onPress={() => router.push(`/event/${activeEvent.id}` as any)}
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    shadowColor: "#0D2920",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.16,
                    shadowRadius: 12,
                    width: "100%",
                    zIndex: 2,
                  }}
                >
                  <LinearGradient
                    colors={["#1E5643", "#143D30", "#0E2C22"]}
                    end={{ x: 1, y: 1 }}
                    start={{ x: 0, y: 0 }}
                    style={{
                      paddingHorizontal: 14,
                      paddingTop: 13,
                      paddingBottom: 13,
                      position: "relative",
                    }}
                  >
                    {/* Top Row: Club Avatar Image + Name + Badge Pill */}
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ alignItems: "center", flexDirection: "row", gap: 6.5 }}>
                        <Image
                          source={resolveClubLogoSource(activeEvent.clubLogo)}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 6,
                            backgroundColor: "#FAF9F5",
                          }}
                        />
                        <Text
                          style={{
                            color: "rgba(255, 255, 255, 0.95)",
                            fontFamily: SERIF_FONT,
                            fontSize: 10,
                            fontWeight: "700",
                          }}
                        >
                          {activeEvent.societyName}
                        </Text>
                      </View>

                      <View
                        style={{
                          alignItems: "center",
                          backgroundColor: "#CBEAD9",
                          borderRadius: 999,
                          flexDirection: "row",
                          gap: 4.5,
                          paddingHorizontal: 8,
                          paddingVertical: 2.5,
                        }}
                      >
                        <PulseDot color="#144534" size={4.5} />
                        <Text
                          style={{
                            color: "#144534",
                            fontSize: 7.5,
                            fontWeight: "700",
                            letterSpacing: 0.4,
                          }}
                        >
                          {activeEvent.categoryTag}
                        </Text>
                      </View>
                    </View>

                    {/* Middle Row: Event Details */}
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            color: "#FFFFFF",
                            fontFamily: SERIF_FONT,
                            fontSize: 14.5,
                            fontWeight: "700",
                            letterSpacing: -0.2,
                          }}
                        >
                          {activeEvent.shortTitle}
                        </Text>

                        {/* Time & Location Chips */}
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 6,
                            marginTop: 8,
                          }}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              backgroundColor: "rgba(255, 255, 255, 0.09)",
                              borderColor: "rgba(255, 255, 255, 0.12)",
                              borderRadius: 8,
                              borderWidth: 1,
                              flexDirection: "row",
                              gap: 4,
                              paddingHorizontal: 8,
                              paddingVertical: 3.5,
                            }}
                          >
                            <Ionicons color="#A9D1C2" name="time-outline" size={10.5} />
                            <Text
                              style={{
                                color: "rgba(255, 255, 255, 0.92)",
                                fontSize: 9,
                                fontWeight: "500",
                              }}
                            >
                              {activeEvent.timeLabel}
                            </Text>
                          </View>

                          <View
                            style={{
                              alignItems: "center",
                              backgroundColor: "rgba(255, 255, 255, 0.09)",
                              borderColor: "rgba(255, 255, 255, 0.12)",
                              borderRadius: 8,
                              borderWidth: 1,
                              flexDirection: "row",
                              gap: 4,
                              paddingHorizontal: 8,
                              paddingVertical: 3.5,
                            }}
                          >
                            <Ionicons color="#A9D1C2" name="location-outline" size={10.5} />
                            <Text
                              numberOfLines={1}
                              style={{
                                color: "rgba(255, 255, 255, 0.92)",
                                fontSize: 9,
                                fontWeight: "500",
                              }}
                            >
                              {activeEvent.wing}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {activeEvent.image ? (
                        <Image
                          source={{ uri: activeEvent.image }}
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 11,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.2)",
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 11,
                            backgroundColor: "rgba(255,255,255,0.12)",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons name="calendar-outline" size={24} color="#CBEAD9" />
                        </View>
                      )}
                    </View>

                    {/* Bottom Row: Pagination Dots + Register Button */}
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 12,
                      }}
                    >
                      <Pressable
                        accessibilityLabel="Next event"
                        onPress={(e) => {
                          e.stopPropagation();
                          setActiveCardIndex((prev) => (prev + 1) % displayEvents.length);
                        }}
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          gap: 4.5,
                          paddingVertical: 4,
                        }}
                      >
                        {displayEvents.map((ev, idx) => {
                          const active = idx === activeCardIndex;
                          return (
                            <View
                              key={ev.id}
                              style={{
                                backgroundColor: active
                                  ? "#E9C48C"
                                  : "rgba(255, 255, 255, 0.28)",
                                borderRadius: 3,
                                height: 4.5,
                                width: active ? 14 : 4.5,
                              }}
                            />
                          );
                        })}
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.78)",
                            fontSize: 9,
                            fontWeight: "600",
                            marginLeft: 6,
                          }}
                        >
                          {activeEvent.joinedLabel}
                        </Text>
                      </Pressable>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            void toggleStudentBookmark(activeEvent.id);
                          }}
                          hitSlop={6}
                          style={{
                            alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.16)",
                            borderRadius: 999,
                            padding: 6,
                          }}
                          accessibilityLabel="Save event"
                        >
                          <Ionicons
                            name={isBookmarked(activeEvent.id) ? "bookmark" : "bookmark-outline"}
                            size={13}
                            color="#FFFFFF"
                          />
                        </Pressable>

                        <Pressable
                          disabled={isEventPassed(activeEvent)}
                          onPress={(e) => {
                            e.stopPropagation();
                            if (!isEventPassed(activeEvent) && !isEventRegistered) {
                              void handleRegisterEvent(activeEvent);
                            }
                          }}
                          style={{
                            alignItems: "center",
                            backgroundColor: isEventPassed(activeEvent)
                              ? "rgba(255, 255, 255, 0.22)"
                              : isEventRegistered
                              ? "#F5F3EB"
                              : "#E9C48C",
                            borderRadius: 999,
                            flexDirection: "row",
                            gap: 4,
                            paddingHorizontal: 12,
                            paddingVertical: 5.5,
                            opacity: isEventPassed(activeEvent) ? 0.75 : 1,
                          }}
                        >
                          {isEventRegistered && !isEventPassed(activeEvent) ? (
                            <Ionicons color="#1B4D3E" name="checkmark" size={11.5} />
                          ) : isEventPassed(activeEvent) ? (
                            <Ionicons color="rgba(255, 255, 255, 0.8)" name="time-outline" size={11.5} />
                          ) : null}
                          <Text
                            style={{
                              color: isEventPassed(activeEvent)
                                ? "rgba(255, 255, 255, 0.9)"
                                : isEventRegistered
                                ? "#1B4D3E"
                                : "#3D2715",
                              fontSize: 10,
                              fontWeight: "700",
                            }}
                          >
                            {isEventPassed(activeEvent)
                              ? "Event Ended"
                              : isEventRegistered
                              ? "Registered"
                              : "Register"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </LinearGradient>
                </MotionPressable>

                {/* Stacked card shadow peek underneath */}
                {displayEvents.length > 1 && (
                  <Pressable
                    onPress={() => setActiveCardIndex((prev) => (prev + 1) % displayEvents.length)}
                    style={{
                      backgroundColor: "#DCE6E1",
                      borderBottomLeftRadius: 14,
                      borderBottomRightRadius: 14,
                      height: 5,
                      width: "90%",
                      zIndex: 1,
                    }}
                  />
                )}
              </View>
            )}
          </View>
        </MotionView>

        {/* Campus Events Section */}
        <MotionView delay={120}>
          <View style={{ marginTop: 18 }}>
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
                    color: "#111827",
                    fontFamily: FONT_SANS,
                    fontSize: 17,
                    fontWeight: "700",
                    letterSpacing: -0.3,
                  }}
                >
                  Campus Events
                </Text>
                <Text
                  style={{
                    color: "#6B7280",
                    fontFamily: FONT_SANS,
                    fontSize: 11.5,
                    marginTop: 2,
                  }}
                >
                  Register directly for official workshops and competitions
                </Text>
              </View>
            </View>

            {displayEvents.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: "#EAE8E1",
                  padding: 24,
                  alignItems: "center",
                }}
              >
                <Ionicons name="calendar-outline" size={24} color="#144534" />
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#12221C",
                    marginTop: 8,
                  }}
                >
                  No events found
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#6E7773",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Try selecting another category or check back later.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 11 }}>
                {displayEvents.map((ev) => {
                  const evRegistered = isRegistered(ev.id);
                  const evEnded = isEventPassed(ev);
                  const evBookmarked = isBookmarked(ev.id);

                  return (
                    <Pressable
                      key={ev.id}
                      onPress={() => router.push(`/event/${ev.id}` as any)}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E7EB",
                        borderRadius: 16,
                        borderWidth: 1,
                        overflow: "hidden",
                        padding: 12,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                        {ev.image ? (
                          <Image
                            source={{ uri: ev.image }}
                            style={{
                              width: 72,
                              height: 72,
                              borderRadius: 10,
                              backgroundColor: "#0D1814",
                            }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={{
                              width: 72,
                              height: 72,
                              borderRadius: 10,
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
                              <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
                                {ev.categoryTag}
                              </Text>
                            </View>

                            <Pressable
                              hitSlop={6}
                              onPress={(e) => {
                                e.stopPropagation();
                                void toggleStudentBookmark(ev.id);
                              }}
                              accessibilityLabel="Save event"
                            >
                              <Ionicons
                                name={evBookmarked ? "bookmark" : "bookmark-outline"}
                                size={15}
                                color={evBookmarked ? "#1E5D4B" : "#8E9893"}
                              />
                            </Pressable>
                          </View>

                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#111827",
                              fontFamily: SERIF_FONT,
                              fontSize: 13,
                              fontWeight: "700",
                              marginTop: 4,
                            }}
                          >
                            {ev.title}
                          </Text>

                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#1E5D4B",
                              fontSize: 9,
                              fontWeight: "600",
                              marginTop: 1,
                            }}
                          >
                            {ev.societyName}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                              <Ionicons name="calendar-outline" size={10} color="#6B7280" />
                              <Text style={{ color: "#6B7280", fontSize: 8.5 }}>{ev.dateLabel}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                              <Ionicons name="location-outline" size={10} color="#6B7280" />
                              <Text numberOfLines={1} style={{ color: "#6B7280", fontSize: 8.5, maxWidth: 110 }}>
                                {ev.wing || ev.venue}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Card Bottom: Register CTA on Every Event Card (No Follow button) */}
                      <View
                        style={{
                          marginTop: 10,
                          paddingTop: 8,
                          borderTopWidth: 1,
                          borderTopColor: "#F3F4F6",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontSize: 8.5, color: "#6B7280", fontWeight: "500" }}>
                          {ev.joinedLabel}
                        </Text>

                        <Pressable
                          disabled={evEnded}
                          onPress={(e) => {
                            e.stopPropagation();
                            if (!evEnded && !evRegistered) {
                              void handleRegisterEvent(ev);
                            }
                          }}
                          style={{
                            alignItems: "center",
                            backgroundColor: evEnded
                              ? "#E5E7EB"
                              : evRegistered
                              ? "#CBEAD9"
                              : "#123F30",
                            borderRadius: 999,
                            flexDirection: "row",
                            gap: 4,
                            paddingHorizontal: 12,
                            paddingVertical: 5.5,
                            opacity: evEnded ? 0.7 : 1,
                          }}
                        >
                          {evRegistered && !evEnded ? (
                            <Ionicons color="#144534" name="checkmark" size={11} />
                          ) : evEnded ? (
                            <Ionicons color="#6B7280" name="time-outline" size={11} />
                          ) : null}
                          <Text
                            style={{
                              color: evEnded
                                ? "#6B7280"
                                : evRegistered
                                ? "#144534"
                                : "#FFFFFF",
                              fontSize: 9,
                              fontWeight: "700",
                            }}
                          >
                            {evEnded
                              ? "Event Ended"
                              : evRegistered
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

        {/* From Your Societies Section (Announcements feed - Follow button removed) */}
        <MotionView delay={150}>
          <View style={{ marginTop: 18 }}>
            <View style={{ marginBottom: 11 }}>
              <Text
                style={{
                  color: "#111827",
                  fontFamily: FONT_SANS,
                  fontSize: 17,
                  fontWeight: "700",
                  letterSpacing: -0.3,
                }}
              >
                From NUTECH Societies
              </Text>
              <Text
                style={{
                  color: "#6B7280",
                  fontFamily: FONT_SANS,
                  fontSize: 11.5,
                  marginTop: 2,
                }}
              >
                Announcements and campus updates
              </Text>
            </View>

            {filteredPosts.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: "#EAE8E1",
                  padding: 24,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Ionicons name="newspaper-outline" size={24} color="#144534" />
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#12221C",
                    marginTop: 8,
                  }}
                >
                  No Announcements Yet
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#6E7773",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Stay tuned for society recruitment drives, news, and official university notices.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 14 }}>
                {filteredPosts.map((post) => {
                  const isLongPost = post.body.length > 110 || post.body.includes("\n");
                  const isExpanded = expandedPostIds.includes(post.id);
                  const shortBody = isLongPost
                    ? post.body.replace(/\n+/g, " ").slice(0, 115).trim() + "..."
                    : post.body;

                  return (
                    <View
                      key={post.id}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E7EB",
                        borderRadius: 20,
                        borderWidth: 1,
                        overflow: "hidden",
                      }}
                    >
                      <View style={{ padding: 13 }}>
                        {/* Header Row: Avatar + Club Name/Time + Category Tag (Follow button removed) */}
                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Pressable
                            onPress={() => router.push(`/societies/${post.societyId}` as any)}
                            style={{ alignItems: "center", flexDirection: "row", flex: 1, paddingRight: 8 }}
                          >
                            <Image
                              source={post.logoSource}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                backgroundColor: "#0D1814",
                              }}
                              resizeMode="cover"
                            />
                            <View style={{ marginLeft: 8.5, flex: 1 }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  color: "#111827",
                                  fontFamily: FONT_SANS,
                                  fontSize: 11.5,
                                  fontWeight: "700",
                                }}
                              >
                                {post.society}
                              </Text>
                              <Text
                                style={{
                                  color: "#6B7280",
                                  fontFamily: FONT_SANS,
                                  fontSize: 9,
                                }}
                              >
                                {post.timeAgo}
                              </Text>
                            </View>
                          </Pressable>

                          <View
                            style={{
                              backgroundColor: "#F3F4F6",
                              borderColor: "#E5E7EB",
                              borderRadius: 999,
                              borderWidth: 1,
                              paddingHorizontal: 8,
                              paddingVertical: 2.5,
                            }}
                          >
                            <Text
                              style={{
                                color: "#4B5563",
                                fontFamily: FONT_SANS,
                                fontSize: 8.5,
                                fontWeight: "600",
                              }}
                            >
                              {post.category || "Announcement"}
                            </Text>
                          </View>
                        </View>

                        {/* Title if available */}
                        {post.title ? (
                          <Text
                            style={{
                              color: "#111827",
                              fontFamily: FONT_SANS,
                              fontSize: 12.5,
                              fontWeight: "700",
                              marginTop: 9,
                            }}
                          >
                            {post.title}
                          </Text>
                        ) : null}

                        {/* Post Text Body */}
                        <Text
                          style={{
                            color: "#374151",
                            fontFamily: FONT_SANS,
                            fontSize: 10.5,
                            lineHeight: 16,
                            marginTop: post.title ? 4 : 8,
                          }}
                        >
                          {isExpanded ? post.body : shortBody}
                        </Text>

                        {/* Read more / Show less toggle */}
                        {isLongPost && (
                          <Pressable
                            hitSlop={6}
                            onPress={() => toggleExpandPost(post.id)}
                            style={{
                              alignSelf: "flex-start",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 2.5,
                              marginTop: 4,
                            }}
                          >
                            <Text
                              style={{
                                color: "#1E5D4B",
                                fontFamily: FONT_SANS,
                                fontSize: 10,
                                fontWeight: "700",
                              }}
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </Text>
                            <Ionicons
                              name={isExpanded ? "chevron-up" : "chevron-down"}
                              size={12}
                              color="#1E5D4B"
                            />
                          </Pressable>
                        )}

                        {/* Embedded Post Image */}
                        {post.image ? (
                          <Image
                            source={{ uri: post.image }}
                            style={{
                              width: "100%",
                              height: isExpanded ? 220 : 140,
                              borderRadius: 12,
                              marginTop: 8,
                            }}
                            resizeMode="cover"
                          />
                        ) : null}

                        {/* Form / Registration Link */}
                        {post.externalLink ? (
                          <Pressable
                            onPress={() => void Linking.openURL(post.externalLink!.url)}
                            style={{
                              alignItems: "center",
                              backgroundColor: "#DCFCE7",
                              borderColor: "#BBF7D0",
                              borderRadius: 10,
                              borderWidth: 1,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 8,
                              paddingHorizontal: 10,
                              paddingVertical: 7,
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{
                                color: "#166534",
                                fontFamily: FONT_SANS,
                                fontSize: 9.5,
                                fontWeight: "600",
                                flex: 1,
                                paddingRight: 6,
                              }}
                            >
                              {post.externalLink.label}
                            </Text>
                            <Ionicons name="open-outline" size={13} color="#166534" />
                          </Pressable>
                        ) : null}

                        {/* Social Interaction Bar */}
                        <View
                          style={{
                            alignItems: "center",
                            borderTopColor: "#F3F4F6",
                            borderTopWidth: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                            paddingTop: 8,
                          }}
                        >
                          <Pressable
                            onPress={() => toggleLike(post.id)}
                            style={{ alignItems: "center", flexDirection: "row", gap: 4 }}
                          >
                            <Ionicons
                              name={post.liked ? "heart" : "heart-outline"}
                              size={14}
                              color={post.liked ? "#DC2626" : "#6B7280"}
                            />
                            <Text
                              style={{
                                color: post.liked ? "#DC2626" : "#6B7280",
                                fontFamily: FONT_SANS,
                                fontSize: 9.5,
                                fontWeight: "600",
                              }}
                            >
                              {post.likes}
                            </Text>
                          </Pressable>

                          <Pressable
                            onPress={() => toggleBookmark(post.id)}
                            style={{ alignItems: "center", flexDirection: "row", gap: 4 }}
                          >
                            <Ionicons
                              name={post.bookmarked ? "bookmark" : "bookmark-outline"}
                              size={14}
                              color={post.bookmarked ? "#1E5D4B" : "#6B7280"}
                            />
                          </Pressable>
                        </View>
                      </View>
                    </View>
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
