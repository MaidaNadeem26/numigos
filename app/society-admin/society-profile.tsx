import React from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";
import { resolveClubLogoSource, resolveClubBannerSource } from "@/lib/nutech-data";

export default function SocietyProfileScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { society, events, members } = useSocietyAdminData();

  const societyEvents = events.filter((e) => e.status === "Approved");
  const displayLeaders = members.filter((m) => m.group === "Leadership").length > 0
    ? members.filter((m) => m.group === "Leadership")
    : (society.leaders || []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top App Bar */}
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#FAF9F5",
          flexDirection: "row",
          height: 48,
          justifyContent: "space-between",
          paddingHorizontal: hPad,
        }}
      >
        <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.canGoBack() ? router.back() : router.push("/society-admin/dashboard")}
          >
            <Ionicons color="#12221C" name="arrow-back" size={17} />
          </Pressable>
          <Text
            style={{
              color: "#12221C",
              fontFamily: FONT_SANS,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            Society Profile
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/society-admin/edit-society")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#1E5D4B",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
          }}
        >
          <Ionicons name="create-outline" size={13} color="#FFFFFF" />
          <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
            Edit Society
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36,
          paddingHorizontal: hPad,
          paddingTop: 10,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={20} distance={8}>
          {/* Hero Banner Image + Dark Forest Green Hero Card */}
          <View style={{ borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#E0DDD4", marginBottom: 14 }}>
            <Image
              source={resolveClubBannerSource(society.banner)}
              style={{ width: "100%", height: 120 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["#235F4B", "#184737", "#12382B"]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={{ padding: 14, position: "relative" }}
            >
              {/* Top Badges Row */}
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: "#CBEAD9",
                    borderRadius: 999,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      color: "#134635",
                      fontFamily: FONT_SANS,
                      fontSize: 8.5,
                      fontWeight: "700",
                      letterSpacing: 0.5,
                    }}
                  >
                    {society.categoryLabel}
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 999,
                    flexDirection: "row",
                    gap: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#F2CC8F" }} />
                  <Text style={{ color: "#F2CC8F", fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700" }}>
                    MANAGED BY YOU
                  </Text>
                </View>
              </View>

              {/* Society Logo Squircle + Title Info */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: "#FFFFFF",
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                  }}
                >
                  <Image source={resolveClubLogoSource(society.logo)} style={{ width: "100%", height: "100%" }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: FONT_SANS,
                      fontSize: 16,
                      fontWeight: "700",
                      lineHeight: 21,
                    }}
                  >
                    {society.name}
                  </Text>
                  <Text style={{ color: "#CBEAD9", fontFamily: FONT_SANS, fontSize: 9.5, marginTop: 2 }}>
                    {society.dept}
                  </Text>
                </View>
              </View>

              {/* Tagline */}
              <Text
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: FONT_SANS,
                  fontSize: 10.5,
                  marginTop: 10,
                  lineHeight: 15,
                }}
              >
                {society.tagline}
              </Text>

              {/* Quick Admin Actions Row */}
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <Pressable
                  onPress={() => router.push("/society-admin/edit-society")}
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 999,
                    paddingVertical: 7,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Ionicons name="pencil" size={12} color="#FFFFFF" />
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
                    Edit Society Info
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/society-admin/edit-society")}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Ionicons name="image-outline" size={13} color="#FFFFFF" />
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
                    Change Logo
                  </Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          {/* About / Mission Statement */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 6 }}>
              MISSION & MANDATE
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, color: "#58635E", lineHeight: 16 }}>
              {society.mission}
            </Text>
          </View>

          {/* Faculty Advisor Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#FEF7EC",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="school" size={20} color="#C47D15" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "700", letterSpacing: 0.5 }}>
                OFFICIAL FACULTY ADVISOR
              </Text>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#12221C", marginTop: 2 }}>
                {society.facultyAdvisor}
              </Text>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#1E5D4B", marginTop: 1 }}>
                Approved by NUTECH Directorate of Student Life
              </Text>
            </View>
          </View>

          {/* Society Leadership */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
                SOCIETY LEADERSHIP
              </Text>
              <Pressable onPress={() => router.push("/society-admin/members")}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#1E5D4B" }}>
                  Manage Team →
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 8 }}>
              {displayLeaders.length > 0 ? (
                displayLeaders.map((lead: any) => (
                  <View key={lead.id || lead.name} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {lead.avatar ? (
                      <Image source={{ uri: lead.avatar }} style={{ width: 34, height: 34, borderRadius: 17 }} />
                    ) : (
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          backgroundColor: "#1E5D4B",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#FAF9F5" }}>
                          {lead.name
                            ? lead.name
                                .split(" ")
                                .map((p: string) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "L"}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "700", color: "#12221C" }}>
                        {lead.name}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E" }}>
                        {lead.role}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ paddingVertical: 8 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#8D9692" }}>
                    No leadership assigned yet. Use Manage Team to assign roles.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Contact Details */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 14,
              gap: 8,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 2 }}>
              CONTACT & MEETING INFORMATION
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="mail-outline" size={15} color="#1E5D4B" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, color: "#12221C" }}>
                {society.contactEmail}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="logo-instagram" size={15} color="#1E5D4B" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, color: "#12221C" }}>
                {society.instagram}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="calendar-outline" size={15} color="#1E5D4B" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, color: "#12221C" }}>
                {society.meetingSchedule}
              </Text>
            </View>
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
