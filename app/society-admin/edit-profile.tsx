import React, { useState } from "react";
import {
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

export default function EditProfileScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { profile } = useSocietyAdminData();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [semester, setSemester] = useState(profile.semester);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    profile.name = name;
    profile.phone = phone;
    profile.semester = semester;
    setSaved(true);
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
              PERSONAL ACCOUNT
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Edit Admin Profile
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
            paddingBottom: 36,
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
            {saved && (
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
                  Profile updated successfully!
                </Text>
              </View>
            )}

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
                PERSONAL INFORMATION
              </Text>

              {/* Name */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Full Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Phone */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Contact Phone Number
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Semester */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Academic Semester
                </Text>
                <TextInput
                  value={semester}
                  onChangeText={setSemester}
                  style={[
              {
                    height: 38,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Read Only Institutional Fields */}
              <View style={{ borderTopWidth: 1, borderTopColor: "#F2EFE9", paddingTop: 10, gap: 10 }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#8D9692", letterSpacing: 0.5 }}>
                  VERIFIED UNIVERSITY CREDENTIALS (READ-ONLY)
                </Text>

                <View>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#8D9692" }}>
                    University Email
                  </Text>
                  <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#12221C", marginTop: 2 }}>
                    {profile.email}
                  </Text>
                </View>

                <View>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#8D9692" }}>
                    Student Roll Number
                  </Text>
                  <Text style={{ fontFamily: FONT_MONO, fontSize: 11, color: "#12221C", marginTop: 2 }}>
                    {profile.rollNumber}
                  </Text>
                </View>

                <View>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#8D9692" }}>
                    Department
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11, color: "#12221C", marginTop: 2 }}>
                    {profile.department}
                  </Text>
                </View>

                <View>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#8D9692" }}>
                    System Role
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#15803D" }} />
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#1E5D4B" }}>
                      Society Admin (Approved by OSA)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </MotionView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
