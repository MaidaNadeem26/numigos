import React, { useState } from "react";
import { Alert, Image, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData, SocietyTeamMember } from "@/lib/society-admin-data";

const AVAILABLE_ROLES = [
  { role: "President", group: "Leadership" as const },
  { role: "Vice President", group: "Leadership" as const },
  { role: "Technical Lead", group: "Core Team" as const },
  { role: "Media & Design Lead", group: "Core Team" as const },
  { role: "Events Coordinator", group: "Core Team" as const },
  { role: "Cloud Lab Assistant", group: "Member" as const },
  { role: "Publicity Officer", group: "Member" as const },
  { role: "General Member", group: "Member" as const },
];

export default function SocietyMembersScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { members, society, updateMemberRole, removeMember } = useSocietyAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingMember, setEditingMember] = useState<SocietyTeamMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<SocietyTeamMember | null>(null);
  const [presidentWarningVisible, setPresidentWarningVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<"Leadership" | "Core Team" | "Member">("Core Team");

  const filteredMembers = members.filter((m) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.rollNumber.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenEdit = (m: SocietyTeamMember) => {
    setEditingMember(m);
    setSelectedRole(m.role);
    setSelectedGroup(m.group);
  };

  const handleSaveRole = () => {
    if (!editingMember) return;
    updateMemberRole(editingMember.id, selectedRole, selectedGroup);
    setEditingMember(null);
  };

  const handleRemove = (m: SocietyTeamMember) => {
    if (m.role === "President") {
      setPresidentWarningVisible(true);
      return;
    }
    setMemberToRemove(m);
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
        <Text style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: "700", color: "#12221C" }}>
          Society Team & Roster
        </Text>

        <Pressable
          accessibilityLabel="Add Member"
          accessibilityRole="button"
          onPress={() => router.push("/society-admin/add-member")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#1E5D4B",
            paddingHorizontal: 11,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Ionicons name="person-add" size={13} color="#FFFFFF" />
          <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
            Add Member
          </Text>
        </Pressable>
      </View>

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
      >
        <MotionView delay={20} distance={8}>
          {/* Search Box */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              paddingHorizontal: 10,
              height: 38,
              marginBottom: 12,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={15} color="#8D9692" />
            <TextInput
              placeholder="Search team member by name or roll..."
              placeholderTextColor="#8D9692"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[
                {
                  flex: 1,
                  fontFamily: FONT_SANS,
                  fontSize: 10.5,
                  color: "#12221C",
                  height: "100%",
                },
                Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
              ]}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={15} color="#8D9692" />
              </Pressable>
            )}
          </View>



          {/* Members List */}
          <View style={{ gap: 10 }}>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => {
                const isLeadership = m.group === "Leadership";
                const isCore = m.group === "Core Team";
                return (
                  <View
                    key={m.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "#EAE7DF",
                      padding: 12,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1, paddingRight: 6 }}>
                        {m.avatar ? (
                          <Image source={{ uri: m.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                        ) : (
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              backgroundColor: "#1E5D4B",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#FAF9F5" }}>
                              {m.name
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "M"}
                            </Text>
                          </View>
                        )}
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
                              {m.name}
                            </Text>
                            <Text
                              style={{
                                fontFamily: FONT_MONO,
                                fontSize: 9,
                                fontWeight: "600",
                                color: "#1E5D4B",
                                backgroundColor: "#E8F4EE",
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                borderRadius: 4,
                              }}
                            >
                              {m.rollNumber}
                            </Text>
                          </View>

                          <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E", marginTop: 1 }}>
                            {m.department} · {m.joinedDate}
                          </Text>
                        </View>
                      </View>

                      {/* Role Pill */}
                      <View
                        style={{
                          backgroundColor: isLeadership ? "#FEF7EC" : isCore ? "#E8F4EE" : "#F3F4F6",
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 999,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 9,
                            fontWeight: "700",
                            color: isLeadership ? "#C47D15" : isCore ? "#1E5D4B" : "#4B5563",
                          }}
                        >
                          {m.role}
                        </Text>
                      </View>
                    </View>

                    {/* Actions Row */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: "#F6F5F0",
                      }}
                    >
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#8D9692" }}>
                        {m.email}
                      </Text>

                      <View style={{ flexDirection: "row", gap: 6 }}>
                        <Pressable
                          onPress={() => handleOpenEdit(m)}
                          style={{
                            backgroundColor: "#F2EFE9",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Ionicons name="create-outline" size={11} color="#12221C" />
                          <Text style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: "600", color: "#12221C" }}>
                            Change Role
                          </Text>
                        </Pressable>

                        {m.role !== "President" && (
                          <Pressable
                            onPress={() => handleRemove(m)}
                            style={{
                              backgroundColor: "#FFF0EB",
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 6,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <Ionicons name="trash-outline" size={11} color="#C44D2D" />
                            <Text style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: "600", color: "#C44D2D" }}>
                              Remove
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#EAE7DF",
                  padding: 24,
                  alignItems: "center",
                }}
              >
                <Ionicons name="people-outline" size={28} color="#8D9692" style={{ marginBottom: 6 }} />
                <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
                  No members found
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E", marginTop: 4, textAlign: "center" }}>
                  {searchQuery ? "No members match your search criteria." : "No members have been added to this society yet."}
                </Text>
              </View>
            )}
          </View>
        </MotionView>
      </ScrollView>

      {/* Edit Role Modal */}
      <Modal visible={!!editingMember} transparent animationType="fade" onRequestClose={() => setEditingMember(null)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View
            style={{
              backgroundColor: "#FAF9F5",
              borderRadius: 18,
              width: "100%",
              maxWidth: 380,
              padding: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: "700", color: "#12221C" }}>
                  Assign Society Role
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E" }}>
                  {editingMember?.name} ({editingMember?.rollNumber})
                </Text>
              </View>
              <Pressable onPress={() => setEditingMember(null)}>
                <Ionicons name="close" size={20} color="#12221C" />
              </Pressable>
            </View>

            <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#58635E", marginBottom: 8, letterSpacing: 0.5 }}>
              SELECT POSITION:
            </Text>

            <View style={{ gap: 6, marginBottom: 14 }}>
              {AVAILABLE_ROLES.map((r) => {
                const isSelected = selectedRole === r.role;
                return (
                  <Pressable
                    key={r.role}
                    onPress={() => {
                      setSelectedRole(r.role);
                      setSelectedGroup(r.group);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: isSelected ? "#E8F4EE" : "#FFFFFF",
                      borderWidth: 1,
                      borderColor: isSelected ? "#1E5D4B" : "#EAE7DF",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: isSelected ? "#1E5D4B" : "#12221C" }}>
                        {r.role}
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692" }}>
                        Category: {r.group}
                      </Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={16} color="#1E5D4B" />}
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setEditingMember(null)}
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#EAE7DF",
                  borderRadius: 999,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSaveRole}
                style={{
                  flex: 1.5,
                  backgroundColor: "#1E5D4B",
                  borderRadius: 999,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>
                  Save Position
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Institutional Remove Confirmation Modal */}
      <Modal
        visible={!!memberToRemove}
        transparent
        animationType="fade"
        onRequestClose={() => setMemberToRemove(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FAF9F5",
              borderRadius: 20,
              width: "100%",
              maxWidth: 380,
              padding: 22,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#FEE2E2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons name="trash-outline" size={24} color="#C44D2D" />
            </View>

            <Text
              style={{
                fontFamily: FONT_SANS,
                fontSize: 16,
                fontWeight: "700",
                color: "#12221C",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Remove Team Member
            </Text>

            <Text
              style={{
                fontFamily: FONT_SANS,
                fontSize: 12,
                color: "#58635E",
                textAlign: "center",
                lineHeight: 18,
                marginBottom: 20,
              }}
            >
              Are you sure you want to remove{" "}
              <Text style={{ fontWeight: "700", color: "#12221C" }}>
                {memberToRemove?.name}
              </Text>{" "}
              ({memberToRemove?.rollNumber}) from the {society.shortName} roster?
            </Text>

            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                onPress={() => setMemberToRemove(null)}
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#EAE7DF",
                  borderRadius: 999,
                  height: 42,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#12221C",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirm Remove Member"
                onPress={() => {
                  if (memberToRemove) {
                    removeMember(memberToRemove.id);
                    setMemberToRemove(null);
                  }
                }}
                style={{
                  flex: 1.3,
                  backgroundColor: "#C44D2D",
                  borderRadius: 999,
                  height: 42,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  Remove Member
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* President Protection Warning Modal */}
      <Modal
        visible={presidentWarningVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPresidentWarningVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FAF9F5",
              borderRadius: 20,
              width: "100%",
              maxWidth: 380,
              padding: 22,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#FEF3C7",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons name="shield-alert-outline" size={24} color="#D97706" />
            </View>

            <Text
              style={{
                fontFamily: FONT_SANS,
                fontSize: 16,
                fontWeight: "700",
                color: "#12221C",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Action Restricted
            </Text>

            <Text
              style={{
                fontFamily: FONT_SANS,
                fontSize: 12,
                color: "#58635E",
                textAlign: "center",
                lineHeight: 18,
                marginBottom: 20,
              }}
            >
              The President cannot be removed from the society roster. Please reassign the presidential role to another member first.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Understood"
              onPress={() => setPresidentWarningVisible(false)}
              style={{
                width: "100%",
                backgroundColor: "#1E5D4B",
                borderRadius: 999,
                height: 42,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_SANS,
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#FFFFFF",
                }}
              >
                Understood
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
