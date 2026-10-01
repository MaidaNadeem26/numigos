import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { dbService, RegistrationRecord } from "@/lib/supabase";
import { useStudentData } from "@/lib/student-data";

const SERIF_FONT = FONT_SANS;

export default function EventHistoryScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { profile } = useStudentData();

  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      const allRegs = await dbService.getRegistrations();
      if (isMounted) {
        // Filter to registrations belonging to this student (or attended registrations)
        const myAttended = (allRegs || []).filter(
          (r) =>
            r.status === "Attended" ||
            (profile?.email && r.email?.toLowerCase() === profile.email.toLowerCase()) ||
            (profile?.name && r.name?.toLowerCase() === profile.name.toLowerCase())
        );
        setRecords(myAttended);
        setLoading(false);
      }
    }
    void loadHistory();
    return () => {
      isMounted = false;
    };
  }, [profile]);

  const studentName = profile?.name || "Student";
  const studentRoll = profile?.roll_number || "NUTECH";
  const eventsCount = records.length;
  const certificatesCount = records.filter((r) => r.certificate_id).length;
  const sdpCredits = (eventsCount * 1.5).toFixed(1);

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
              STUDENT AFFAIRS PORTAL
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
              Event History
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#E8F4EE",
            borderRadius: 999,
            paddingHorizontal: 8,
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
        contentContainerStyle={{
          paddingHorizontal: hPad,
          paddingTop: 6,
          paddingBottom: 28,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
              {studentName} · {studentRoll}
            </Text>

            <View
              style={{
                marginTop: 10,
                backgroundColor: "rgba(9, 27, 20, 0.4)",
                borderRadius: 11,
                paddingVertical: 9,
                paddingHorizontal: 8,
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 7.5, color: "#A7C6B9", fontWeight: "700" }}>ATTENDED</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    fontFamily: FONT_MONO,
                    marginTop: 1,
                  }}
                >
                  {eventsCount}
                </Text>
              </View>

              <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />

              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 7.5, color: "#A7C6B9", fontWeight: "700" }}>CERTIFICATES</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    fontFamily: FONT_MONO,
                    marginTop: 1,
                  }}
                >
                  {certificatesCount}
                </Text>
              </View>

              <View style={{ width: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />

              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 7.5, color: "#A7C6B9", fontWeight: "700" }}>SDP CREDITS</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#F3D092",
                    fontFamily: FONT_MONO,
                    marginTop: 1,
                  }}
                >
                  {sdpCredits}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Section Heading */}
          <View style={{ marginTop: 14, marginBottom: 8 }}>
            <Text
              style={{
                fontFamily: SERIF_FONT,
                fontSize: 13,
                fontWeight: "700",
                color: "#12221C",
              }}
            >
              Completed Sessions & Credentials
            </Text>
          </View>

          {/* Past Attended Events List */}
          {records.length === 0 ? (
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
              <Ionicons name="ribbon-outline" size={26} color="#144534" />
              <Text
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 13.5,
                  fontWeight: "700",
                  color: "#12221C",
                  marginTop: 8,
                }}
              >
                No Attendance History Yet
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#6E7773",
                  marginTop: 4,
                  textAlign: "center",
                  lineHeight: 14,
                  maxWidth: 270,
                }}
              >
                Your verified attendance, SDP credits, and digital certificates from campus events will be recorded here.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/explore")}
                style={{
                  marginTop: 12,
                  backgroundColor: "#0E3A2B",
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 6.5,
                }}
              >
                <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#FFFFFF" }}>
                  Browse Events
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 9 }}>
              {records.map((item) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 14,
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
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#E4F2EC",
                        borderRadius: 999,
                        paddingHorizontal: 7.5,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
                        VERIFIED ATTENDANCE
                      </Text>
                    </View>
                    <Text style={{ fontSize: 8.5, color: "#6E7773", fontWeight: "600" }}>
                      {item.registered_at ? new Date(item.registered_at).toLocaleDateString() : "Attended"}
                    </Text>
                  </View>

                  <Text
                    style={{
                      marginTop: 6,
                      fontFamily: SERIF_FONT,
                      fontSize: 12.5,
                      fontWeight: "700",
                      color: "#12221C",
                    }}
                  >
                    {item.event_id}
                  </Text>
                  <Text style={{ marginTop: 2, fontSize: 9, color: "#1E5D4B", fontWeight: "600" }}>
                    {item.department || "Student Affairs"}
                  </Text>

                  <View
                    style={{
                      marginTop: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#F7F6F1",
                      borderRadius: 9,
                      paddingHorizontal: 8.5,
                      paddingVertical: 6,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                      <Ionicons name="checkmark-circle" size={13} color="#1E5D4B" />
                      <Text style={{ fontSize: 8.5, fontWeight: "700", color: "#12221C" }}>
                        {item.status || "Attended"}
                      </Text>
                    </View>

                    {item.certificate_id && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="ribbon-outline" size={12} color="#8A5A2B" />
                        <Text style={{ fontSize: 8.5, fontWeight: "700", color: "#8A5A2B" }}>
                          Certificate Issued
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
