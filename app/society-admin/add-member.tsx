import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";

const ROLES = [
  { role: "Core Team Lead", group: "Core Team" as const },
  { role: "Technical Lead", group: "Core Team" as const },
  { role: "Media & Design Lead", group: "Core Team" as const },
  { role: "Events Coordinator", group: "Core Team" as const },
  { role: "Cloud Lab Assistant", group: "Member" as const },
  { role: "Publicity Officer", group: "Member" as const },
  { role: "General Member", group: "Member" as const },
];

export default function AddMemberScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { addMember, society } = useSocietyAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("BS Computer Science");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Core Team Lead");
  const [selectedGroup, setSelectedGroup] = useState<"Leadership" | "Core Team" | "Member">("Core Team");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      setError("Please specify the student name");
      return;
    }
    if (!rollNumber.trim()) {
      setError("Please provide a valid NUTECH roll number");
      return;
    }

    addMember({
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      role: selectedRole,
      group: selectedGroup,
      department: department.trim(),
      email: email.trim() || `${rollNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}@nutech.edu.pk`,
      avatar: "",
    });

    router.replace("/society-admin/members");
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
              TEAM ONBOARDING
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Add Society Member
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#E8F4EE",
            paddingHorizontal: 8,
            paddingVertical: 3.5,
            borderRadius: 999,
          }}
        >
          <Text style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: "700", color: "#1E5D4B" }}>
            {society.shortName}
          </Text>
        </View>
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
            {error ? (
              <View
                style={{
                  backgroundColor: "#FEE2E2",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "600", color: "#DC2626" }}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Member Form Fields */}
            <View
              style={{
                gap: 12,
              }}
            >
              <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
                MEMBER DETAILS
              </Text>

              {/* Name */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Full Name *
                </Text>
                <TextInput
                  value={name}
                  onChangeText={(n) => { setName(n); setError(""); }}
                  placeholder="Enter member's full name"
                  placeholderTextColor="#8D9692"
                  style={[
              {
                    height: 38,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#EAE7DF",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Roll Number */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  NUTECH Roll Number *
                </Text>
                <TextInput
                  value={rollNumber}
                  onChangeText={(r) => { setRollNumber(r); setError(""); }}
                  placeholder="e.g. YYYY-DEPT-XXX"
                  placeholderTextColor="#8D9692"
                  autoCapitalize="characters"
                  style={[
              {
                    height: 38,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#EAE7DF",
                    paddingHorizontal: 10,
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Department */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Department
                </Text>
                <TextInput
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="e.g. Department of Computer Science"
                  placeholderTextColor="#8D9692"
                  style={[
              {
                    height: 38,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#EAE7DF",
                    paddingHorizontal: 10,
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Position Assignment */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", marginBottom: 6 }}>
                  Society Position *
                </Text>
                <View style={{ gap: 6 }}>
                  {ROLES.map((r) => {
                    const active = selectedRole === r.role;
                    return (
                      <Pressable
                        key={r.role}
                        onPress={() => {
                          setSelectedRole(r.role);
                          setSelectedGroup(r.group);
                        }}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 7,
                          borderRadius: 8,
                          backgroundColor: active ? "#E8F4EE" : "#FFFFFF",
                          borderWidth: 1,
                          borderColor: active ? "#1E5D4B" : "#EAE7DF",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: active ? "#1E5D4B" : "#12221C" }}>
                          {r.role}
                        </Text>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692" }}>
                          {r.group}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Add CTA */}
              <Pressable
                onPress={handleAdd}
                style={{
                  backgroundColor: "#1E5D4B",
                  borderRadius: 999,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 6,
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>
                  Confirm & Add to Team
                </Text>
              </Pressable>
            </View>
          </MotionView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
