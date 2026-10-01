import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";
import { resolveClubLogoSource } from "@/lib/nutech-data";

const LOGO_PRESETS = [
  { label: "AWS Builder", value: "local:aws-builder" },
  { label: "Zindigi Prize", value: "local:zindigi-prize" },
  { label: "IEEE NUTECH", value: "local:ieee-nutech" },
  { label: "Tech Innovation", value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80" },
];

export default function EditSocietyScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { society, updateSociety, updateLogo } = useSocietyAdminData();

  const [tagline, setTagline] = useState(society.tagline);
  const [mission, setMission] = useState(society.mission);
  const [facultyAdvisor, setFacultyAdvisor] = useState(society.facultyAdvisor);
  const [contactEmail, setContactEmail] = useState(society.contactEmail);
  const [instagram, setInstagram] = useState(society.instagram);
  const [meetingSchedule, setMeetingSchedule] = useState(society.meetingSchedule);

  const [currentLogo, setCurrentLogo] = useState(society.logo);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "failed">("idle");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectLogo = (logoVal: string) => {
    setUploadStatus("uploading");
    setTimeout(() => {
      setCurrentLogo(logoVal);
      updateLogo(logoVal);
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 2500);
    }, 700);
  };

  const handleSave = () => {
    updateSociety({
      tagline,
      mission,
      facultyAdvisor,
      contactEmail,
      instagram,
      meetingSchedule,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      router.back();
    }, 800);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Header Bar */}
      <View
        style={{
          height: 52,
          paddingHorizontal: hPad,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#EFECE6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={16} color="#12221C" />
          </Pressable>
          <View>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: "700", letterSpacing: 0.8, color: "#1E5D4B" }}>
              PERMITTED INFORMATION
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Edit Society Profile
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          style={{
            backgroundColor: "#1E5D4B",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#FFFFFF" }}>
            Save
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: hPad,
            paddingTop: 12,
            maxWidth: 520,
            width: "100%",
            alignSelf: "center",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MotionView delay={20} distance={8}>
            {saveSuccess && (
              <View
                style={{
                  backgroundColor: "#E8F4EE",
                  borderRadius: 12,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color="#1E5D4B" />
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "600", color: "#1E5D4B" }}>
                  Society profile changes saved successfully!
                </Text>
              </View>
            )}

            {/* Logo Management Box */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EAE7DF",
                padding: 14,
                marginBottom: 14,
              }}
            >
              <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 10 }}>
                SOCIETY LOGO
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: "#FAF9F5",
                    borderWidth: 2,
                    borderColor: "#1E5D4B",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={resolveClubLogoSource(currentLogo)} style={{ width: "100%", height: "100%" }} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#12221C" }}>
                    Official Insignia
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 2 }}>
                    High-resolution square format recommended.
                  </Text>

                  {/* Upload State Feedback */}
                  {uploadStatus === "uploading" && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <ActivityIndicator size="small" color="#1E5D4B" />
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#1E5D4B", fontWeight: "600" }}>
                        Uploading & verifying logo...
                      </Text>
                    </View>
                  )}
                  {uploadStatus === "success" && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <Ionicons name="checkmark-circle" size={13} color="#15803D" />
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#15803D", fontWeight: "600" }}>
                        Logo updated successfully!
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Logo Selectors */}
              <Text style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: "700", color: "#8D9692", marginBottom: 6 }}>
                SELECT LOGO PRESET OR UPLOAD:
              </Text>
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                {LOGO_PRESETS.map((preset) => {
                  const selected = currentLogo === preset.value;
                  return (
                    <Pressable
                      key={preset.label}
                      onPress={() => handleSelectLogo(preset.value)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: selected ? "#1E5D4B" : "#F6F5F0",
                        borderWidth: 1,
                        borderColor: selected ? "#1E5D4B" : "#E5E2DA",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 9.5,
                          fontWeight: "600",
                          color: selected ? "#FFFFFF" : "#58635E",
                        }}
                      >
                        {preset.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Editable Fields Box */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EAE7DF",
                padding: 14,
                gap: 12,
              }}
            >
              <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
                SOCIETY DETAILS
              </Text>

              {/* Tagline */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Society Tagline
                </Text>
                <TextInput
                  value={tagline}
                  onChangeText={setTagline}
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 10.5,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Mission / Description */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Mission & Mandate
                </Text>
                <TextInput
                  value={mission}
                  onChangeText={setMission}
                  multiline
                  numberOfLines={4}
                  style={[
              {
                    minHeight: 80,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    fontFamily: FONT_SANS,
                    fontSize: 10.5,
                    color: "#12221C",
                    lineHeight: 15,
                    textAlignVertical: "top",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Faculty Advisor */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Faculty Advisor Name & Department
                </Text>
                <TextInput
                  value={facultyAdvisor}
                  onChangeText={setFacultyAdvisor}
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 10.5,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Official Contact Email */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Official Society Email
                </Text>
                <TextInput
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  keyboardType="email-address"
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 10.5,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Instagram Handle */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Social Media / Instagram
                </Text>
                <TextInput
                  value={instagram}
                  onChangeText={setInstagram}
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 10.5,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Meeting Schedule */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Weekly Routine / Meeting Schedule
                </Text>
                <TextInput
                  value={meetingSchedule}
                  onChangeText={setMeetingSchedule}
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 10.5,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Save CTA */}
              <Pressable
                onPress={handleSave}
                style={{
                  backgroundColor: "#1E5D4B",
                  borderRadius: 999,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>
                  Save Profile Changes
                </Text>
              </Pressable>
            </View>
          </MotionView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
