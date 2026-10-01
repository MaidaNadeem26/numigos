import React, { useState } from "react";
import { Alert, Image, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData, SocietyAdminEvent } from "@/lib/society-admin-data";
import { resolveClubLogoSource } from "@/lib/nutech-data";

export default function SocietyAdminEventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { hPad } = useResponsive();
  const { events, society, cancelEvent, setDraftEvent } = useSocietyAdminData();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
        <View
          style={{
            height: 52,
            paddingHorizontal: hPad,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FAF9F5",
          }}
        >
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.push("/society-admin/events"))}
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
          <Text style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: "700", color: "#12221C", marginLeft: 12 }}>
            Event Details
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Ionicons name="alert-circle-outline" size={48} color="#8D9692" style={{ marginBottom: 12 }} />
          <Text style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: "700", color: "#12221C" }}>
            Event Not Found
          </Text>
          <Text style={{ fontFamily: FONT_SANS, fontSize: 12, color: "#58635E", marginTop: 4, textAlign: "center" }}>
            The requested event could not be found or has been removed.
          </Text>
          <Pressable
            onPress={() => router.push("/society-admin/events")}
            style={{
              marginTop: 16,
              backgroundColor: "#1E5D4B",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 999,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>
              Back to Events
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusDisplay = (status: SocietyAdminEvent["status"]) => {
    switch (status) {
      case "Approved":
        return {
          bg: "#E8F4EE",
          border: "#CBEAD9",
          text: "#1E5D4B",
          title: "Approved by NUTECH OSA",
          subtitle: "This event is officially cleared and live on the student campus feed.",
          icon: "checkmark-circle",
        };
      case "Pending Approval":
        return {
          bg: "#FFF7ED",
          border: "#FED7AA",
          text: "#D97706",
          title: "Under OSA Review",
          subtitle: "Queued for safety, schedule, and venue approval by Directorate of Student Life.",
          icon: "time",
        };
      case "Changes Requested":
        return {
          bg: "#FFF0EB",
          border: "#FAD4C0",
          text: "#C44D2D",
          title: "OSA Changes Requested",
          subtitle: event.osaNotes || "OSA has requested revisions before final clearance.",
          icon: "alert-circle",
        };
      case "Rejected":
        return {
          bg: "#FEE2E2",
          border: "#FECACA",
          text: "#DC2626",
          title: "OSA Rejected Event",
          subtitle: event.osaNotes || "This event could not be approved due to campus policy conflicts.",
          icon: "close-circle",
        };
      case "Cancelled":
        return {
          bg: "#F3F4F6",
          border: "#E5E7EB",
          text: "#6B7280",
          title: "Event Cancelled",
          subtitle: "This event has been cancelled by the society administration.",
          icon: "ban",
        };
      case "Completed":
        return {
          bg: "#F3F4F6",
          border: "#E5E7EB",
          text: "#4B5563",
          title: "Event Completed",
          subtitle: "Event has concluded. Registrations and attendance are archived.",
          icon: "checkmark-done",
        };
      default:
        return {
          bg: "#F3F4F6",
          border: "#E5E7EB",
          text: "#6B7280",
          title: status,
          subtitle: "Status information",
          icon: "ellipse",
        };
    }
  };

  const statusInfo = getStatusDisplay(event.status);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / Math.max(1, event.capacity)) * 100));

  const handleCancel = () => {
    setCancelModalVisible(true);
  };

  const handleEditAndResubmit = () => {
    setDraftEvent({
      ...event,
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      capacity: event.capacity,
      image: event.image,
    });
    router.push("/society-admin/create-event");
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
            onPress={() => router.canGoBack() ? router.back() : router.push("/society-admin/events")}
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
              SOCIETY ADMIN MANAGEMENT
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Event Details
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Pressable
            onPress={() => router.push(`/society-admin/registrants?eventId=${event.id}`)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "#E8F4EE",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
            }}
          >
            <Ionicons name="people" size={13} color="#1E5D4B" />
            <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#1E5D4B" }}>
              Registrants
            </Text>
          </Pressable>
        </View>
      </View>

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
      >
        <MotionView delay={20} distance={8}>
          {/* Hero Banner */}
          <View style={{ borderRadius: 16, overflow: "hidden", height: 160, borderWidth: 1, borderColor: "#E5E2DA", marginBottom: 12 }}>
            {event.image ? (
              <Image source={{ uri: event.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <LinearGradient
                colors={["#1E5D4B", "#134635"]}
                style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name="calendar" size={48} color="#F2CC8F" />
              </LinearGradient>
            )}
          </View>

          {/* Admin Status Card */}
          <View
            style={{
              backgroundColor: statusInfo.bg,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: statusInfo.border,
              padding: 13,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Ionicons name={statusInfo.icon as any} size={18} color={statusInfo.text} />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 12, fontWeight: "700", color: statusInfo.text }}>
                {statusInfo.title}
              </Text>
            </View>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: statusInfo.text, lineHeight: 14 }}>
              {statusInfo.subtitle}
            </Text>

            {/* If Changes Requested or Rejected, Resubmit Action */}
            {(event.status === "Changes Requested" || event.status === "Rejected") && (
              <Pressable
                onPress={handleEditAndResubmit}
                style={{
                  marginTop: 10,
                  backgroundColor: statusInfo.text,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  alignSelf: "flex-start",
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FFFFFF" }}>
                  Edit & Resubmit to OSA
                </Text>
              </Pressable>
            )}
          </View>

          {/* Title & Category Badge */}
          <View style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <View style={{ backgroundColor: "#1E5D4B", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700", color: "#FFFFFF" }}>
                  {event.categoryTag}
                </Text>
              </View>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E" }}>
                Submitted: {event.submittedAt}
              </Text>
            </View>

            <Text style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: "700", color: "#12221C", lineHeight: 24 }}>
              {event.title}
            </Text>
          </View>

          {/* Registration Capacity Progress Card */}
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
                STUDENT REGISTRATIONS
              </Text>
              <Text style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: "700", color: "#1E5D4B" }}>
                {event.registeredCount} / {event.capacity} ({percentFilled}%)
              </Text>
            </View>

            {/* Progress Track */}
            <View style={{ height: 8, backgroundColor: "#F2EFE9", borderRadius: 4, overflow: "hidden", marginVertical: 6 }}>
              <View style={{ height: "100%", width: `${percentFilled}%`, backgroundColor: "#1E5D4B", borderRadius: 4 }} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#58635E" }}>
                {event.deadlineText}
              </Text>
              <Pressable onPress={() => router.push(`/society-admin/registrants?eventId=${event.id}`)}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#1E5D4B" }}>
                  View All Attendees →
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Event Schedule & Venue Information */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              gap: 12,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#E8F4EE", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="calendar" size={16} color="#1E5D4B" />
              </View>
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "700" }}>
                  DATE & TIMING
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                  {event.dateTimeFull}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#E8F4EE", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="location" size={16} color="#1E5D4B" />
              </View>
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "700" }}>
                  ALLOCATED VENUE
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                  {event.venue} ({event.wing})
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#E8F4EE", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="business" size={16} color="#1E5D4B" />
              </View>
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "700" }}>
                  ORGANIZING SOCIETY
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "600", color: "#12221C" }}>
                  {society.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#EAE7DF",
              padding: 14,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#12221C", letterSpacing: 0.5, marginBottom: 6 }}>
              EVENT DESCRIPTION & SYLLABUS
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 11, color: "#58635E", lineHeight: 17 }}>
              {event.description}
            </Text>
          </View>

          {/* Action Management Buttons */}
          <View style={{ gap: 8 }}>
            <Pressable
              onPress={() => router.push(`/society-admin/registrants?eventId=${event.id}`)}
              style={{
                backgroundColor: "#1E5D4B",
                borderRadius: 999,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Ionicons name="people-outline" size={16} color="#FFFFFF" />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "700", color: "#FFFFFF" }}>
                Manage Registrations ({event.registeredCount})
              </Text>
            </Pressable>

            {event.status !== "Cancelled" && event.status !== "Completed" && (
              <Pressable
                onPress={handleCancel}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#FAD4C0",
                  borderRadius: 999,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 6,
                }}
              >
                <Ionicons name="close-circle-outline" size={16} color="#C44D2D" />
                <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "700", color: "#C44D2D" }}>
                  Cancel This Event
                </Text>
              </Pressable>
            )}
          </View>
        </MotionView>
      </ScrollView>
      {/* Cancel Event Confirmation Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
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
              <Ionicons name="alert-circle-outline" size={24} color="#C44D2D" />
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
              Cancel Event
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
              Are you sure you want to cancel <Text style={{ fontWeight: "700", color: "#12221C" }}>{event.title}</Text>? This will notify OSA and registered students.
            </Text>

            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Keep Event"
                onPress={() => setCancelModalVisible(false)}
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
                  Keep Event
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirm Cancel Event"
                onPress={() => {
                  cancelEvent(event.id);
                  setCancelModalVisible(false);
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
                  Yes, Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
