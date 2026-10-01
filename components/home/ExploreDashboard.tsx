import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { AWS_BUILDER_IMAGE, ENTREPRENEURSHIP_LOGO, IEEE_NUTECH_IMAGE, NUTECH_EVENTS_LIST, NUTECH_SOCIETIES_LIST, resolveClubLogoSource, ZINDIGI_PRIZE_IMAGE } from "@/lib/nutech-data";

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

const INITIAL_POSTS: ClubPostItem[] = [
  {
    id: "post-aws-student-builder-nutech",
    societyId: "aws-student-builder-nutech",
    society: "AWS Student Builder Group NUTECH",
    category: "Technical",
    timeAgo: "Just now",
    logoSource: AWS_BUILDER_IMAGE,
    imageSource: AWS_BUILDER_IMAGE,
    title: "The wait is over! Core team applications are open 🎉",
    body: `AWS Student Builder Group NUTECH has officially opened team applications!

Join NUTECH’s most premium tech community. After events at NASTP and 10Pearls, we’re ready for our next chapter.

🎁 Get AWS swag, exam vouchers, and cloud credits. Build your skills. Connect with industry professionals.`,
    externalLink: {
      label: "📝 Join the squad. Apply now: https://forms.gle/DggZXNdqdzryVpga8",
      url: "https://forms.gle/DggZXNdqdzryVpga8",
    },
    likes: 248,
    liked: true,
    bookmarked: true,
  },
  {
    id: "post-zindigi-prize-core-team",
    societyId: "zindigi-prize-nutech",
    society: "Zindigi Prize NUTECH",
    category: "Clubs",
    timeAgo: "Just now",
    logoSource: ZINDIGI_PRIZE_IMAGE,
    imageSource: ZINDIGI_PRIZE_IMAGE,
    title: "🚀 Join Zindigi Prize NUTECH Core Team 2026-27! 🚀",
    body: `Do you want to be a part of the biggest Entrepreneur Community in Pakistan?

What is Zindigi Prize?
Zindigi Prize is Pakistan's largest Entrepreneurship competition. It is a platform where students turn their ideas into real startups. We organize workshops, speaker sessions, pitching competitions and provide mentorship and funding opportunities to young entrepreneurs. It's not just a society, it's a movement to build future leaders.

This is your chance to Build, Lead, and Innovate.
Open for all departments.

Note: No startup needed to join the team.`,
    externalLink: {
      label: "📋 Apply Here (Google Form): https://forms.gle/kFDYhRu25iH11Mrz6",
      url: "https://forms.gle/kFDYhRu25iH11Mrz6",
    },
    secondaryLink: {
      label: "💬 For Queries & Updates (WhatsApp): https://chat.whatsapp.com/ElfjeW81Xnj9T1iSAAoEaV",
      url: "https://chat.whatsapp.com/ElfjeW81Xnj9T1iSAAoEaV",
    },
    likes: 192,
    liked: true,
    bookmarked: true,
  },
  {
    id: "post-entrepreneurship-core-team",
    societyId: "entrepreneurship-club",
    society: "NUTECH Entrepreneurship Club",
    category: "Clubs",
    timeAgo: "Just now",
    logoSource: ENTREPRENEURSHIP_LOGO,
    title: "NUTECH Entrepreneurship Club · Core Team",
    body: `Interested in entrepreneurship, business, innovation, startups, and new ideas? Join the NUTECH Entrepreneurship Club Core Team and be part of a community where you can learn, work on projects, develop your ideas, and connect with industries, entrepreneurs, and professionals.

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
Huzaifa Khan`,
    externalLink: {
      label: "🔗 Register here: https://forms.gle/pAA2oZmuLwGPSybQ6",
      url: "https://forms.gle/pAA2oZmuLwGPSybQ6",
    },
    likes: 164,
    liked: true,
    bookmarked: true,
  },
  {
    id: "post-ieee-recruitment-2026",
    societyId: "ieee-nutech",
    society: "IEEE Student Branch NUTECH",
    category: "Technical",
    timeAgo: "1h",
    logoSource: IEEE_NUTECH_IMAGE,
    imageSource: IEEE_NUTECH_IMAGE,
    title: "⚡ JOIN IEEE NUTECH | RECRUITMENT DRIVE 2026 🚀",
    body: `You’ve seen the IEEE Fest.
You’ve seen the competitions, workshops, speakers, crowds and the energy.

Now it’s your turn to be part of it. 👀

IEEE NUTECH is recruiting students who want to:
🔧 Build technical skills
🤝 Meet & work with amazing people
🎤 Improve communication & professional skills
🚀 Take leadership and lead real projects & events

Whether you’re from Engineering, IT, or NSDD — there’s a place for you at IEEE NUTECH.

Don’t just attend. Be part of the team that makes it happen. ⚡

⏳ Registration Deadline: Wednesday 30 Sept, 2026`,
    externalLink: {
      label: "📋 Register: https://forms.gle/cykdHctmqyfZuXR17",
      url: "https://forms.gle/cykdHctmqyfZuXR17",
    },
    likes: 215,
    liked: true,
    bookmarked: true,
  },
  {
    id: "post-green-week",
    societyId: "green-youth",
    society: "PM's Green Youth Movement Club",
    category: "Clubs",
    timeAgo: "4h",
    logoSource: { uri: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80" },
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80",
    body: "NUTECH Green Week kicks off on Monday at the Central Lawn! Join our campus tree plantation drive and sustainability exhibition under OSA.",
    eventTag: {
      id: "event-green-week",
      label: "NUTECH Green Week · Mon 10:00 AM",
    },
    likes: 98,
    liked: false,
    bookmarked: true,
  },
];

export function ExploreDashboard() {
  const pathname = usePathname();
  const isAdminMode = pathname.includes("society-admin");
  const { hPad } = useResponsive();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [registeredIds, setRegisteredIds] = useState<string[]>(["event-ieee-fest"]);
  const [followedClubIds, setFollowedClubIds] = useState<string[]>(["aws-student-builder-nutech", "zindigi-prize-nutech", "entrepreneurship-club", "ieee-nutech"]);
  const toggleFollowClub = (clubId: string) => {
    setFollowedClubIds((prev) => prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId]);
  };
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const toggleExpandPost = (postId: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    },
    []
  );

  const refresh = () => {
    setRefreshing(true);
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => setRefreshing(false), 600);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All Events" || post.category === activeCategory;
    const matchesQuery =
      !normalizedQuery ||
      `${post.society} ${post.body}`.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  
  const activeEvent = NUTECH_EVENTS_LIST[activeCardIndex] ?? NUTECH_EVENTS_LIST[0];
  const isRegistered = registeredIds.includes(activeEvent.id);

  const toggleRegister = (eventId: string) => {
    setRegisteredIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
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
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#1B4D3E" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <MotionView delay={0}>
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
                fontFamily: FONT_SANS,
                fontSize: 22,
                fontWeight: "800",
                letterSpacing: -0.4,
              }}
            >
              Numigos
            </Text>

            <Pressable
              accessibilityLabel="Open notifications"
              accessibilityRole="button"
              onPress={() => router.push(isAdminMode ? "/society-admin/notifications" : "/reminders")}
              style={{
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderColor: "#E8E6DF",
                borderRadius: 17,
                borderWidth: 1,
                height: 34,
                justifyContent: "center",
                position: "relative",
                width: 34,
              }}
            >
              <Ionicons color="#18241E" name="notifications-outline" size={15} />
              <View
                style={{
                  backgroundColor: "#E2A547",
                  borderRadius: 3,
                  height: 5.5,
                  position: "absolute",
                  right: 8,
                  top: 7,
                  width: 5.5,
                }}
              />
            </Pressable>
          </View>
        </MotionView>

        {/* Search Input + Forest Green Filter Button */}
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

                {/* Featured Campus Event Card */}
        <MotionView delay={95}>
          <View style={{ marginTop: 14 }}>
            {/* Featured Dark Green Card + Stacked Underlay */}
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
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/societies/${activeEvent.societyId}` as any);
                      }}
                      style={{ alignItems: "center", flexDirection: "row", gap: 7, flex: 1, paddingRight: 8 }}
                    >
                      <Image
                        source={{ uri: activeEvent.clubLogo }}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,0.28)",
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          color: "rgba(255, 255, 255, 0.9)",
                          fontSize: 9.5,
                          fontWeight: "700",
                          letterSpacing: 0.4,
                          flex: 1,
                        }}
                      >
                        {activeEvent.societyName.toUpperCase()}
                      </Text>
                    </Pressable>

                    <View
                      style={{
                        alignItems: "center",
                        backgroundColor: "#E9C48C",
                        borderRadius: 999,
                        flexDirection: "row",
                        gap: 4.5,
                        paddingHorizontal: 8.5,
                        paddingVertical: 3.5,
                      }}
                    >
                      <PulseDot size={5} color="#B85D2B" />
                      <Text
                        style={{
                          color: "#3D2715",
                          fontSize: 8.5,
                          fontWeight: "700",
                        }}
                      >
                        {activeEvent.badge}
                      </Text>
                    </View>
                  </View>

                  {/* Event Title + Thumbnail Row */}
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: "#FFFFFF",
                          fontFamily: SERIF_FONT,
                          fontSize: 16.5,
                          fontWeight: "700",
                          letterSpacing: -0.2,
                        }}
                      >
                        {activeEvent.shortTitle}
                      </Text>

                      {/* Time & Location Frosted Chips */}
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
                        setActiveCardIndex((prev) => (prev + 1) % NUTECH_EVENTS_LIST.length);
                      }}
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 4.5,
                        paddingVertical: 4,
                      }}
                    >
                      {NUTECH_EVENTS_LIST.map((ev, idx) => {
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

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleRegister(activeEvent.id);
                      }}
                      style={{
                        alignItems: "center",
                        backgroundColor: isRegistered ? "#F5F3EB" : "#E9C48C",
                        borderRadius: 999,
                        flexDirection: "row",
                        gap: 4,
                        paddingHorizontal: 12,
                        paddingVertical: 5.5,
                      }}
                    >
                      {isRegistered ? (
                        <Ionicons color="#1B4D3E" name="checkmark" size={11.5} />
                      ) : null}
                      <Text
                        style={{
                          color: isRegistered ? "#1B4D3E" : "#3D2715",
                          fontSize: 10,
                          fontWeight: "700",
                        }}
                      >
                        {isRegistered ? "Registered" : "Register"}
                      </Text>
                    </Pressable>
                  </View>
                </LinearGradient>
              </MotionPressable>

              {/* Stacked card shadow peek underneath */}
              <Pressable
                onPress={() => setActiveCardIndex((prev) => (prev + 1) % NUTECH_EVENTS_LIST.length)}
                style={{
                  backgroundColor: "#DCE6E1",
                  borderBottomLeftRadius: 14,
                  borderBottomRightRadius: 14,
                  height: 5,
                  width: "90%",
                  zIndex: 1,
                }}
              />
            </View>
          </View>
        </MotionView>

{/* From Your Societies Section */}
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
                Announcements and upcoming campus activities
              </Text>
            </View>

            {/* Boxed Society Post Cards matching media_1790836235513.png */}
            <View style={{ gap: 14 }}>
              {filteredPosts.map((post) => {
                const isFollowing = followedClubIds.includes(post.societyId);
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
                      {/* Header Row: Avatar + Club Name/Time + Following Pill */}
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
                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                color: "#111827",
                                fontFamily: FONT_SANS,
                                fontSize: 12,
                                fontWeight: "700",
                              }}
                            >
                              {post.society}
                            </Text>
                            <Text
                              style={{
                                color: "#6B7280",
                                fontFamily: FONT_SANS,
                                fontSize: 10,
                                marginTop: 1,
                              }}
                            >
                              {post.timeAgo} · {post.eventTag ? "Event update" : "Club post"}
                            </Text>
                          </View>
                        </Pressable>

                        {isAdminMode && post.societyId === "aws-student-builder-nutech" ? (
                          <Pressable
                            onPress={() => router.push("/society-admin/dashboard")}
                            style={{
                              backgroundColor: "#134635",
                              borderRadius: 999,
                              paddingHorizontal: 10,
                              paddingVertical: 4.5,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#F2CC8F" }} />
                            <Text
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: 9.5,
                                fontWeight: "700",
                                color: "#F2CC8F",
                              }}
                            >
                              YOUR SOCIETY
                            </Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={() => toggleFollowClub(post.societyId)}
                            style={{
                              backgroundColor: isFollowing ? "#DCFCE7" : "#134635",
                              borderRadius: 999,
                              paddingHorizontal: 11,
                              paddingVertical: 4.5,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: FONT_SANS,
                                fontSize: 10,
                                fontWeight: "600",
                                color: isFollowing ? "#166534" : "#FFFFFF",
                              }}
                            >
                              {isFollowing ? "Following" : "+ Follow"}
                            </Text>
                          </Pressable>
                        )}
                      </View>

                      {/* Post Title (Refined, smaller size) */}
                      {post.title ? (
                        <Text
                          style={{
                            color: "#111827",
                            fontFamily: FONT_SANS,
                            fontSize: 13.5,
                            fontWeight: "700",
                            lineHeight: 18,
                            marginTop: 10,
                          }}
                        >
                          {post.title}
                        </Text>
                      ) : null}

                      {/* Post Body Snippet (Refined, smaller size) */}
                      <Text
                        numberOfLines={isExpanded ? undefined : 2}
                        style={{
                          color: "#4B5563",
                          fontFamily: FONT_SANS,
                          fontSize: 11.5,
                          lineHeight: 16.5,
                          marginTop: 4,
                        }}
                      >
                        {isExpanded ? post.body : shortBody}
                      </Text>

                      {/* Read more Link */}
                      {isLongPost ? (
                        <Pressable
                          onPress={() => toggleExpandPost(post.id)}
                          hitSlop={6}
                          style={{ alignSelf: "flex-start", marginTop: 5 }}
                        >
                          <Text
                            style={{
                              color: "#111827",
                              fontFamily: FONT_SANS,
                              fontSize: 11,
                              fontWeight: "600",
                              textDecorationLine: "underline",
                            }}
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </Text>
                        </Pressable>
                      ) : null}

                      {/* Clickable Action Link Pill (Compact & refined) */}
                      {post.externalLink ? (
                        <Pressable
                          onPress={() => void Linking.openURL(post.externalLink!.url)}
                          style={{
                            alignItems: "center",
                            backgroundColor: "#DCFCE7",
                            borderRadius: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#166534",
                              flex: 1,
                              fontFamily: FONT_SANS,
                              fontSize: 11,
                              fontWeight: "600",
                              paddingRight: 6,
                            }}
                          >
                            {post.externalLink.label.startsWith("Apply now") || post.externalLink.label.startsWith("📝")
                              ? post.externalLink.label.replace(/^📝\s*/, "")
                              : `Join the squad. Apply now: ${post.externalLink.url.replace(/^https?:\/\//, "")}`}
                          </Text>
                          <Ionicons color="#166534" name="arrow-up-outline" size={14} style={{ transform: [{ rotate: "45deg" }] }} />
                        </Pressable>
                      ) : null}

                      {/* Secondary WhatsApp Link if present & expanded */}
                      {post.secondaryLink && isExpanded ? (
                        <Pressable
                          onPress={() => void Linking.openURL(post.secondaryLink!.url)}
                          style={{
                            alignItems: "center",
                            backgroundColor: "#F0FDF4",
                            borderColor: "#DCFCE7",
                            borderRadius: 10,
                            borderWidth: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 6,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#166534",
                              flex: 1,
                              fontFamily: FONT_SANS,
                              fontSize: 11,
                              fontWeight: "600",
                              paddingRight: 6,
                            }}
                          >
                            {post.secondaryLink.label}
                          </Text>
                          <Ionicons color="#166534" name="logo-whatsapp" size={14} />
                        </Pressable>
                      ) : null}
                    </View>

                    {/* Edge-to-Edge Poster Image - Sleek 185px height (no huge height, full width) */}
                    {post.imageSource ? (
                      <Pressable
                        onPress={() => router.push(`/societies/${post.societyId}` as any)}
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          backgroundColor: "#0D1814",
                        }}
                      >
                        <Image
                          source={post.imageSource}
                          style={{
                            width: "100%",
                            height: isExpanded ? 200 : 135,
                          }}
                          resizeMode={isExpanded ? "contain" : "cover"}
                        />
                      </Pressable>
                    ) : post.image ? (
                      <Pressable
                        onPress={() =>
                          post.eventTag
                            ? router.push(`/event/${post.eventTag.id}` as any)
                            : router.push(`/societies/${post.societyId}` as any)
                        }
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          backgroundColor: "#0D1814",
                        }}
                      >
                        <Image
                          source={{ uri: post.image }}
                          style={{
                            width: "100%",
                            height: isExpanded ? 150 : 110,
                          }}
                          resizeMode="cover"
                        />
                      </Pressable>
                    ) : null}

                    {/* Footer: Heart + likes on left, Bookmark on right */}
                    <View
                      style={{
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                      }}
                    >
                      <Pressable
                        onPress={() => toggleLike(post.id)}
                        style={{ alignItems: "center", flexDirection: "row", gap: 5 }}
                      >
                        <Ionicons
                          color={post.liked ? "#EF4444" : "#6B7280"}
                          name={post.liked ? "heart" : "heart-outline"}
                          size={16}
                        />
                        <Text
                          style={{
                            color: "#6B7280",
                            fontFamily: FONT_SANS,
                            fontSize: 12,
                            fontWeight: "500",
                          }}
                        >
                          {post.likes}
                        </Text>
                      </Pressable>

                      <Pressable onPress={() => toggleBookmark(post.id)}>
                        <Ionicons
                          color={post.bookmarked ? "#166534" : "#6B7280"}
                          name={post.bookmarked ? "bookmark" : "bookmark-outline"}
                          size={16}
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
