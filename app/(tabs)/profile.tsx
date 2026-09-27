import React from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { setTestSessionEmail, supabase } from "@/lib/supabase";
import { MotionView, PulseDot, useResponsive } from "@/lib/responsive-motion";
import { NUTECH_EVENTS_LIST, NUTECH_SOCIETIES_LIST, resolveClubLogoSource } from "@/lib/nutech-data";

const SERIF_FONT = Platform.select({
  web: "Georgia, 'Times New Roman', serif",
  ios: "Georgia",
  default: "serif",
});

const MY_NUTECH_CLUBS = NUTECH_SOCIETIES_LIST.slice(0, 4);
const SAVED_NUTECH_EVENTS = NUTECH_EVENTS_LIST.slice(0, 2);

export default function ProfileTabScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();

  const signOut = async () => {
    await setTestSessionEmail(null);
    await supabase.auth.signOut();
    router.replace("/login");
  };

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
                textTransform: "uppercase",
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
              Profile
            </Text>
          </View>
        </View>

        <Pressable
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
          <View
            style={{
              position: "absolute",
              top: 6,
              right: 7,
              width: 5.5,
              height: 5.5,
              borderRadius: 3,
              backgroundColor: "#C93B3B",
            }}
          />
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
              SPRING 2025 · NUTECH STUDENT PORTAL
            </Text>
          </View>
        </View>

        {/* Dark Green Student ID Card (v0 clean: 2 stats, no NFC/Badges) */}
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
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=240&q=80",
                }}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: "rgba(255,255,255,0.25)",
                }}
                resizeMode="cover"
              />

              <View style={{ flex: 1, marginLeft: 11 }}>
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  Zainab Ahmed
                </Text>
                <Text
                  style={{
                    fontSize: 9.5,
                    color: "#8FD1B8",
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  zainab.cs21@nutech.edu.pk
                </Text>
                <Text
                  style={{
                    fontSize: 9.5,
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: "500",
                    marginTop: 3,
                  }}
                >
                  Roll No: 2021-CS-084 · Dept of Computer Science
                </Text>
              </View>
            </View>

            {/* 2-Column v0 Stats Box: Registered Events & Joined Clubs */}
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
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 14.5,
                    fontWeight: "700",
                    color: "#F3D092",
                  }}
                >
                  3
                </Text>
                <Text
                  style={{
                    fontSize: 7.5,
                    fontWeight: "700",
                    letterSpacing: 0.6,
                    color: "#9EC5B5",
                    marginTop: 1.5,
                  }}
                >
                  REGISTERED EVENTS
                </Text>
              </Pressable>

              <View
                style={{
                  width: 1,
                  height: 22,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              />

              <Pressable
                onPress={() => router.push("/societies")}
                style={{ flex: 1, alignItems: "center" }}
              >
                <Text
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: 14.5,
                    fontWeight: "700",
                    color: "#F3D092",
                  }}
                >
                  4
                </Text>
                <Text
                  style={{
                    fontSize: 7.5,
                    fontWeight: "700",
                    letterSpacing: 0.6,
                    color: "#9EC5B5",
                    marginTop: 1.5,
                  }}
                >
                  NUTECH CLUBS
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </MotionView>

        {/* Campus Activity Hub Section */}
        <MotionView delay={75}>
          <View
            style={{
              marginTop: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: SERIF_FONT,
                fontSize: 13.5,
                fontWeight: "700",
                color: "#12221C",
              }}
            >
              My NUTECH Clubs & Events
            </Text>
            <Pressable onPress={() => router.push("/societies")}>
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: "700",
                  letterSpacing: 0.4,
                  color: "#1E5D4B",
                }}
              >
                EXPLORE ALL
              </Text>
            </Pressable>
          </View>

          {/* Card 1: My NUTECH Societies with Real Club Images */}
          <View
            style={{
              marginTop: 8,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#EAE8E1",
              padding: 12,
            }}
          >
            <Pressable
              onPress={() => router.push("/societies")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    backgroundColor: "#E4F2EC",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="people-outline" size={14} color="#144534" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 10.5,
                      fontWeight: "700",
                      color: "#12221C",
                    }}
                  >
                    My NUTECH Societies
                  </Text>
                  <Text
                    style={{
                      fontSize: 8.5,
                      color: "#7A8580",
                      marginTop: 0.5,
                    }}
                  >
                    4 active club memberships
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#8E9893" />
            </Pressable>

            <View style={{ marginTop: 9, gap: 6 }}>
              {MY_NUTECH_CLUBS.map((soc) => (
                <Pressable
                  key={soc.id}
                  onPress={() => router.push(`/societies/${soc.id}` as any)}
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
                      source={resolveClubLogoSource(soc.logo)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#D5E8DF",
                      }}
                    />
                    <View style={{ flex: 1, marginLeft: 9 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 9.5,
                          fontWeight: "700",
                          color: "#12221C",
                        }}
                      >
                        {soc.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 8.5,
                          color: "#7A8580",
                          marginTop: 1,
                        }}
                      >
                        {soc.roleInProfile ?? soc.dept}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: soc.badgeInProfile === "Core" ? "#CBEAD9" : "#E6E4DD",
                      borderRadius: 999,
                      paddingHorizontal: 8,
                      paddingVertical: 2.5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 8,
                        fontWeight: "700",
                        color: soc.badgeInProfile === "Core" ? "#144534" : "#4A5450",
                      }}
                    >
                      {soc.badgeInProfile ?? "Member"}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Card 2: Bookmarked Events */}
          <View
            style={{
              marginTop: 9,
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "#EAE8E1",
              padding: 12,
            }}
          >
            <Pressable
              onPress={() => router.push("/(tabs)/bookmarks")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    backgroundColor: "#E4F2EC",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="bookmark-outline" size={14} color="#144534" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 10.5,
                      fontWeight: "700",
                      color: "#12221C",
                    }}
                  >
                    Saved NUTECH Events
                  </Text>
                  <Text
                    style={{
                      fontSize: 8.5,
                      color: "#7A8580",
                      marginTop: 0.5,
                    }}
                  >
                    Events bookmarked for this week
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#8E9893" />
            </Pressable>

            <View style={{ marginTop: 9, gap: 6 }}>
              {SAVED_NUTECH_EVENTS.map((ev) => (
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
                    <Image
                      source={{ uri: ev.image }}
                      style={{ width: 32, height: 32, borderRadius: 8 }}
                    />
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
              ))}
            </View>
          </View>
        </MotionView>

        {/* Simplified v0 Request New Society Card */}
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

          {/* Simplified v0 Account Section */}
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
