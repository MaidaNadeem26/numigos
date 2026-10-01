import React, { useState } from "react";
import { Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";

const SERIF_FONT = FONT_SANS;

const DOMAINS = ["Technical", "Creative & Media", "Community Service", "Outdoor & Sports"];

export default function RegisterSocietyScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("Technical");
  const [advisor, setAdvisor] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
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
            <Text style={{ fontSize: 7.5, fontWeight: "700", letterSpacing: 0.8, color: "#2A6350" }}>
              NUTECH OFFICE OF STUDENT AFFAIRS
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
              Request New Society
            </Text>
          </View>
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
          {submitted ? (
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#CBEAD9",
                padding: 18,
                alignItems: "center",
              }}
            >
              <Ionicons name="checkmark-circle" size={32} color="#144534" />
              <Text
                style={{
                  marginTop: 8,
                  fontFamily: SERIF_FONT,
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                Request Submitted to NUTECH OSA
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 9.5,
                  lineHeight: 14,
                  color: "#58635E",
                  textAlign: "center",
                }}
              >
                The Student Facilitation Desk (SFD) under the Directorate of Student Life will review your request and contact you via your NUTECH email.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/profile")}
                style={{
                  marginTop: 12,
                  backgroundColor: "#0E3A2B",
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#FFFFFF" }}>
                  Back to Profile
                </Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EAE8E1",
                padding: 13,
                gap: 11,
              }}
            >
              <View>
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Proposed Club / Society Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. NUTECH Robotics & AI Society"
                  placeholderTextColor="#8E9893"
                  style={{
                    height: 36,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontSize: 10,
                    color: "#12221C",
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#12221C", marginBottom: 5 }}>
                  Category
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                  {DOMAINS.map((opt) => {
                    const active = domain === opt;
                    return (
                      <Pressable
                        key={opt}
                        onPress={() => setDomain(opt)}
                        style={{
                          paddingHorizontal: 9.5,
                          paddingVertical: 5,
                          borderRadius: 999,
                          backgroundColor: active ? "#134635" : "#F6F5F0",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 8.5,
                            fontWeight: "700",
                            color: active ? "#FFFFFF" : "#4A5450",
                          }}
                        >
                          {opt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Proposed Faculty Advisor
                </Text>
                <TextInput
                  value={advisor}
                  onChangeText={setAdvisor}
                  placeholder="Faculty Name & NUTECH Department"
                  placeholderTextColor="#8E9893"
                  style={{
                    height: 36,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontSize: 10,
                    color: "#12221C",
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Purpose & Planned Campus Activities
                </Text>
                <TextInput
                  value={purpose}
                  onChangeText={setPurpose}
                  multiline
                  numberOfLines={4}
                  placeholder="Describe what your club will organize at NUTECH..."
                  placeholderTextColor="#8E9893"
                  style={{
                    minHeight: 74,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    fontSize: 9.5,
                    lineHeight: 14,
                    color: "#12221C",
                    textAlignVertical: "top",
                  }}
                />
              </View>

              <Pressable
                onPress={() => setSubmitted(true)}
                style={{
                  marginTop: 2,
                  backgroundColor: "#0E3A2B",
                  borderRadius: 999,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
                  Submit Request to OSA
                </Text>
              </Pressable>
            </View>
          )}
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
