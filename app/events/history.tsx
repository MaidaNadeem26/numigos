import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SERIF_FONT = FONT_SANS;

const ATTENDED_HISTORY = [
  {
    id: "event-cloud-study-jam",
    title: "DevCon 2024 — Multi-Cloud & Serverless Systems",
    society: "AWS Cloud Club NUTECH",
    dateLabel: "Dec 14, 2024",
    role: "Verified Attendee",
    certificateId: "NUTECH-DC24-084",
    credits: "2.0SDP Credits",
    hasCertificate: true,
  },
  {
    id: "event-speed-programming",
    title: "Intra-University Speed Programming '24",
    society: "ACM Student Chapter",
    dateLabel: "Nov 28, 2024",
    role: "Runner-Up Merit Award",
    certificateId: "NUTECH-ACM24-019",
    credits: "3.0 SDP Credits",
    hasCertificate: true,
  },
  {
    id: "event-innovation-night",
    title: "Autonomous Rover & Embedded Systems Lab",
    society: "Robotics & Automation (RAS)",
    dateLabel: "Oct 19, 2024",
    role: "Workshop Participant",
    certificateId: "NUTECH-RAS24-112",
    credits: "1.5 SDP Credits",
    hasCertificate: true,
  },
  {
    id: "event-ui-ux-bootcamp",
    title: "Figma & Design Systems Open Bootcamp",
    society: "NUTECH Arts & Design Guild",
    dateLabel: "Sep 22, 2024",
    role: "Attendance Verified",
    certificateId: "NUTECH-ADG24-051",
    credits: "1.5 SDP Credits",
    hasCertificate: false,
  },
];

export default function EventHistoryScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Header Bar */}
      <View
        style={{
          height: 48,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.push("/(tabs)/profile"))}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#EFECE6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={15} color="#12221C" />
          </Pressable>
          <View>
            <Text
              style={{
                fontSize: 7.5,
                fontWeight: "700",
                letterSpacing: 0.8,
                color: "#2A6350",
              }}
            >
              VERIFIED CREDENTIALS
            </Text>
            <Text
              style={{
                fontFamily: SERIF_FONT,
                fontSize: 15.5,
                fontWeight: "700",
                color: "#12221C",
                marginTop: -1,
              }}
            >
              Event History & Certificates
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#E3F2EC",
            borderRadius: 999,
            paddingHorizontal: 8.5,
            paddingVertical: 3.5,
          }}
        >
          <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
            OSA VERIFIED
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: hPad, paddingTop: 6, paddingBottom: 28, maxWidth: 520, width: "100%", alignSelf: "center" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <MotionView delay={25} distance={8}>
        {/* Co-Curricular Transcript Card */}
        <LinearGradient
          colors={["#1D5442", "#11382B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 13,
          }}
        >
          <Text style={{ fontSize: 8, fontWeight: "700", letterSpacing: 0.7, color: "#9EC5B5" }}>
            OFFICIAL CO-CURRICULAR TRANSCRIPT
          </Text>
          <Text
            style={{
              marginTop: 4,
              fontFamily: SERIF_FONT,
              fontSize: 15,
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            Zainab Ahmed · 2021-CS-084
          </Text>

          <View
            style={{
              marginTop: 10,
              backgroundColor: "rgba(9, 27, 20, 0.4)",
              borderRadius: 11,
              paddingVertical: 8.5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontFamily: SERIF_FONT, fontSize: 14, fontWeight: "700", color: "#F3D092" }}>
                4
              </Text>
              <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#9EC5B5", marginTop: 1 }}>
                ATTENDED
              </Text>
            </View>
            <View style={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.1)" }} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontFamily: SERIF_FONT, fontSize: 14, fontWeight: "700", color: "#F3D092" }}>
                3
              </Text>
              <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#9EC5B5", marginTop: 1 }}>
                CERTIFICATES
              </Text>
            </View>
            <View style={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.1)" }} />
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontFamily: SERIF_FONT, fontSize: 14, fontWeight: "700", color: "#F3D092" }}>
                8.0
              </Text>
              <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#9EC5B5", marginTop: 1 }}>
                SDP CREDITS
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* History Items */}
        <View style={{ marginTop: 12, gap: 9 }}>
          {ATTENDED_HISTORY.map((item) => {
            const isDownloaded = downloadedId === item.id;
            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: "#EAE8E1",
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 9, flex: 1 }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: "#CBEAD9",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={item.hasCertificate ? "ribbon-outline" : "checkmark-done-outline"}
                        size={15}
                        color="#144534"
                      />
                    </View>
                    <View style={{ flex: 1, paddingRight: 6 }}>
                      <Text
                        style={{
                          fontFamily: SERIF_FONT,
                          fontSize: 11.5,
                          fontWeight: "700",
                          color: "#12221C",
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text style={{ marginTop: 1.5, fontSize: 8.5, fontWeight: "600", color: "#1E5D4B" }}>
                        {item.society} · {item.dateLabel}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#F5DFB8",
                      borderRadius: 999,
                      paddingHorizontal: 7.5,
                      paddingVertical: 2.5,
                    }}
                  >
                    <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#5D3B14" }}>
                      {item.credits}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 9,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 8.5, fontWeight: "700", color: "#12221C" }}>
                      {item.role}
                    </Text>
                    <Text style={{ fontSize: 8, color: "#6E7773", marginTop: 1 }}>
                      Credential ID: {item.certificateId}
                    </Text>
                  </View>

                  {item.hasCertificate ? (
                    <Pressable
                      onPress={() => setDownloadedId(item.id)}
                      style={{
                        backgroundColor: isDownloaded ? "#CBEAD9" : "#0E3A2B",
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 4.5,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name={isDownloaded ? "checkmark-circle" : "download-outline"}
                        size={11}
                        color={isDownloaded ? "#144534" : "#FFFFFF"}
                      />
                      <Text
                        style={{
                          fontSize: 8,
                          fontWeight: "700",
                          color: isDownloaded ? "#144534" : "#FFFFFF",
                        }}
                      >
                        {isDownloaded ? "Saved PDF" : "Certificate"}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => router.push(`/event/${item.id}` as any)}
                      style={{
                        backgroundColor: "#E6E4DD",
                        borderRadius: 999,
                        paddingHorizontal: 9,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ fontSize: 8, fontWeight: "700", color: "#4A5450" }}>
                        View Recap
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
              </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
