import React, { useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { dbService, setTestSessionEmail, supabase } from "@/lib/supabase";
import { MotionView, PulseDot, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { mapDbEventToNutechEvent, NutechEvent, NUTECH_SOCIETIES_LIST, resolveClubLogoSource } from "@/lib/nutech-data";
import { useStudentData } from "@/lib/student-data";

const SERIF_FONT = FONT_SANS;

export default function ProfileTabScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { profile, registeredEventIds, followedSocietyIds, bookmarkedEventIds } = useStudentData();
  const [allEvents, setAllEvents] = useState<NutechEvent[]>([]);

  useEffect(() => {
    let isMounted = true;
    dbService.getEvents().then((evs) => {
      if (isMounted) setAllEvents((evs || []).map(mapDbEventToNutechEvent));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const myClubs = NUTECH_SOCIETIES_LIST.filter((s) => followedSocietyIds.includes(s.id));
  const savedEvents = allEvents.filter((e) => bookmarkedEventIds.includes(e.id));

  const signOut = async () => {
    await setTestSessionEmail(null);
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const studentName = profile?.name || "Student";
  const studentEmail = profile?.email || "student@nutech.edu.pk";
  const studentRoll = profile?.roll_number || "NUTECH";
  const studentDept = profile?.department || "NUTECH Islamabad";
  const studentInitials = studentName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            <Ionicons name="school-outline" size={14} color="#E9C48C" />
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
              Student Profile
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Notifications"
          onPress={() => router.push("/reminders")}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#E8E6DF",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Ionicons name="notifications-outline" size={16} color="#12221C" />
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
        showsVerticalScrollIndicator={false}
      >
        {/* Active Semester Pill */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E3F2EC",
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
              ACTIVE STUDENT PORTAL
            </Text>
          </View>
        </View>

        {/* Dark Green Student ID Card */}
        <MotionView delay={35}>
          <LinearGradient
            colors={["#1D5442", "#12382C", "#0E2C22"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              marginTop: 10,
              borderRadius: 16,
              padding: 13,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 12,
                    backgroundColor: "#CBEAD9",
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.25)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#144534" }}>
                    {studentInitials}
                  </Text>
                </View>
              )}

              <View style={{ flex: 1, marginLeft: 11 }}>
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  {studentName}
                </Text>
                <Text
                  style={{
                    fontSize: 9.5,
                    color: "#8FD1B8",
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  {studentEmail}
                </Text>
                <Text
                  style={{
                    fontSize: 9.5,
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: "500",
                    marginTop: 3,
                  }}
                >
                  Roll No: {studentRoll} · {studentDept}
                </Text>
              </View>
            </View>

            {/* 2-Column Stats Box: Registered Events & Joined Clubs */}
            <View
              style={{
                marginTop: 12,
                backgroundColor: "rgba(9, 27, 20, 0.42)",
                borderRadius: 11,
                paddingVertical: 8.5,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <Pressable
                onPress={() => router.push("/events/registered")}
                style={{ flex: 1, alignItems: "center" }}
              >
                <Text style={{ fontSize: 7.5, color: "#8FD1B8", fontWeight: "700" }}>
                  REGISTERED EVENTS
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    fontFamily: FONT_MONO,
                    marginTop: 1,
                  }}
                >
                  {registeredEventIds.length}
                </Text>
              </Pressable>

              <View style={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.14)" }} />

              <Pressable
                onPress={() => router.push("/societies")}
                style={{ flex: 1, alignItems: "center" }}
              >
                <Text style={{ fontSize: 7.5, color: "#8FD1B8", fontWeight: "700" }}>
                  FOLLOWED CLUBS
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    fontFamily: FONT_MONO,
                    marginTop: 1,
                  }}
                >
                  {followedSocietyIds.length}
                </Text>
              </Pressable>
            </View>

            {/* Active Pass Row */}
            <Pressable
              onPress={() => router.push("/events/registered")}
              style={{
                marginTop: 10,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 7.5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <Ionicons name="ticket-outline" size={13.5} color="#F2CC8F" />
                <Text style={{ fontSize: 9, fontWeight: "600", color: "#FFFFFF" }}>
                  View Entry Pass & Attendance History
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={12.5} color="#8FD1B8" />
            </Pressable>
          </LinearGradient>
        </MotionView>

        {/* My Societies Section */}
        <MotionView delay={70}>
          <View
            style={{
              marginTop: 12,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#EAE8E1",
              padding: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 9,
              }}
            >
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                Followed Societies ({myClubs.length})
              </Text>

              <Pressable onPress={() => router.push("/societies")}>
                <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#144534" }}>
                  Explore All →
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 7 }}>
              {myClubs.length === 0 ? (
                <View style={{ paddingVertical: 14, alignItems: "center" }}>
                  <Text style={{ fontSize: 9.5, color: "#8E9893" }}>
                    You haven&apos;t followed any societies yet.
                  </Text>
                </View>
              ) : (
                myClubs.map((club) => (
                  <Pressable
                    key={club.id}
                    onPress={() => router.push(`/societies/${club.id}` as any)}
                    style={{
                      backgroundColor: "#F6F5F0",
                      borderRadius: 10,
                      paddingHorizontal: 9,
                      paddingVertical: 7.5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 }}>
                      <Image
                        source={resolveClubLogoSource(club.logo)}
                        style={{ width: 28, height: 28, borderRadius: 7 }}
                      />
                      <View style={{ flex: 1, marginLeft: 8.5 }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 9.5,
                            fontWeight: "700",
                            color: "#12221C",
                          }}
                        >
                          {club.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 8,
                            color: "#7A8580",
                            marginTop: 1,
                          }}
                        >
                          {club.dept}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: "#E4F2EC",
                        borderRadius: 999,
                        paddingHorizontal: 7.5,
                        paddingVertical: 2.5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 7.5,
                          fontWeight: "700",
                          color: "#144534",
                        }}
                      >
                        Following
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        </MotionView>

        {/* Saved Events Section */}
        <MotionView delay={90}>
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#EAE8E1",
              padding: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 9,
              }}
            >
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                Saved Events ({savedEvents.length})
              </Text>

              <Pressable onPress={() => router.push("/(tabs)/bookmarks")}>
                <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#144534" }}>
                  View All →
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 7 }}>
              {savedEvents.length === 0 ? (
                <View style={{ paddingVertical: 14, alignItems: "center" }}>
                  <Text style={{ fontSize: 9.5, color: "#8E9893" }}>
                    No bookmarked events yet.
                  </Text>
                </View>
              ) : (
                savedEvents.map((ev) => (
                  <Pressable
                    key={ev.id}
                    onPress={() => router.push(`/event/${ev.id}` as any)}
                    style={{
                      backgroundColor: "#F6F5F0",
                      borderRadius: 10,
                      paddingHorizontal: 9,
                      paddingVertical: 7.5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 }}>
                      {ev.image ? (
                        <Image
                          source={{ uri: ev.image }}
                          style={{ width: 32, height: 32, borderRadius: 8 }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: "#134635",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons name="calendar-outline" size={16} color="#8FD1B8" />
                        </View>
                      )}
                      <View style={{ flex: 1, marginLeft: 9 }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 9.5,
                            fontWeight: "700",
                            color: "#12221C",
                          }}
                        >
                          {ev.shortTitle}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 8.5,
                            color: "#7A8580",
                            marginTop: 1,
                          }}
                        >
                          {ev.dateLabel} · {ev.wing}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: "#0E3A2B",
                        borderRadius: 999,
                        paddingHorizontal: 9,
                        paddingVertical: 3.5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 8,
                          fontWeight: "700",
                          color: "#FFFFFF",
                        }}
                      >
                        View
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        </MotionView>

        {/* Request New Society Card */}
        <MotionView delay={110}>
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#EAE8E1",
              padding: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                Want to start a new NUTECH club?
              </Text>
              <View
                style={{
                  backgroundColor: "#F5DFB8",
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 2.5,
                }}
              >
                <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#5D3B14" }}>
                  OSA / DSL
                </Text>
              </View>
            </View>

            <Text
              style={{
                marginTop: 4,
                fontSize: 9.5,
                lineHeight: 14,
                color: "#6E7773",
              }}
            >
              Submit a society registration request to the NUTECH Office of Student Affairs (OSA).
            </Text>

            <Pressable
              onPress={() => router.push("/societies/register")}
              style={{
                marginTop: 10,
                backgroundColor: "#0E3A2B",
                borderRadius: 999,
                height: 34,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Ionicons name="add-circle-outline" size={13.5} color="#FFFFFF" />
              <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#FFFFFF" }}>
                Request New Society
              </Text>
            </Pressable>
          </View>

          {/* Account Section */}
          <View
            style={{
              marginTop: 12,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#EAE8E1",
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={() => router.push("/events/history")}
              style={{
                paddingHorizontal: 13,
                paddingVertical: 11,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#F2F0EA",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="ribbon-outline" size={14} color="#58635E" />
                <Text style={{ fontSize: 10, fontWeight: "500", color: "#12221C" }}>
                  Co-Curricular History & Transcript
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={13.5} color="#9BA39F" />
            </Pressable>

            <Pressable
              onPress={() => router.push("/reminders")}
              style={{
                paddingHorizontal: 13,
                paddingVertical: 11,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#F2F0EA",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="notifications-outline" size={14} color="#58635E" />
                <Text style={{ fontSize: 10, fontWeight: "500", color: "#12221C" }}>
                  Reminders & Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={13.5} color="#9BA39F" />
            </Pressable>

            <Pressable
              onPress={() => void signOut()}
              style={{
                paddingHorizontal: 13,
                paddingVertical: 11,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="log-out-outline" size={14} color="#B83B3B" />
                <Text style={{ fontSize: 10, fontWeight: "600", color: "#B83B3B" }}>
                  Sign Out
                </Text>
              </View>
            </Pressable>
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
