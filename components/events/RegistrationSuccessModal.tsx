import React from "react";
import { Modal, Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";

const SERIF_FONT = FONT_SANS;

export interface RegistrationSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  event: {
    id?: string;
    title?: string;
    shortTitle?: string;
    dateLabel?: string;
    timeLabel?: string;
    venue?: string;
    societyName?: string;
  } | null;
  studentName?: string;
  rollNumber?: string;
}

export function RegistrationSuccessModal({
  visible,
  onClose,
  event,
  studentName,
  rollNumber,
}: RegistrationSuccessModalProps) {
  const router = useRouter();

  if (!event) return null;

  const eventTitle = event.title || event.shortTitle || "Campus Event";
  const dateText = event.dateLabel || "Upcoming";
  const timeText = event.timeLabel || "Scheduled time";
  const venueText = event.venue || "NUTECH Campus";

  const handleViewPass = () => {
    onClose();
    router.push("/events/registered" as any);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          {/* Close button */}
          <Pressable
            hitSlop={10}
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close confirmation"
          >
            <Ionicons name="close" size={18} color="#7A8580" />
          </Pressable>

          {/* Success Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={44} color="#1E5D4B" />
          </View>

          {/* Title and message */}
          <Text style={styles.title}>Registration Confirmed! 🎉</Text>
          <Text style={styles.subtitle}>
            You have successfully secured your spot for this campus event.
          </Text>

          {/* Event Details Card */}
          <View style={styles.eventBox}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {eventTitle}
            </Text>
            {event.societyName ? (
              <Text style={styles.societyName} numberOfLines={1}>
                Organized by {event.societyName}
              </Text>
            ) : null}

            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={13} color="#1E5D4B" />
              <Text style={styles.metaText} numberOfLines={1}>
                {dateText} {timeText ? `· ${timeText}` : ""}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color="#1E5D4B" />
              <Text style={styles.metaText} numberOfLines={1}>
                {venueText}
              </Text>
            </View>

            {studentName ? (
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={13} color="#1E5D4B" />
                <Text style={styles.metaText} numberOfLines={1}>
                  Registered for: {studentName} {rollNumber ? `(${rollNumber})` : ""}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleViewPass}
              style={styles.primaryButton}
            >
              <Ionicons name="ticket-outline" size={15} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>View My Pass</Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 24, 18, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 9999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#EAE8E1",
  },
  closeButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F2F0E9",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E2F0EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: SERIF_FONT,
    fontSize: 18,
    fontWeight: "700",
    color: "#12221C",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    color: "#5B6661",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
    paddingHorizontal: 10,
  },
  eventBox: {
    width: "100%",
    backgroundColor: "#FAF9F5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAE7DF",
    padding: 12,
    marginTop: 14,
  },
  eventTitle: {
    fontFamily: SERIF_FONT,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#12221C",
  },
  societyName: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1E5D4B",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#ECE9E1",
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 4,
  },
  metaText: {
    fontSize: 10.5,
    color: "#4A5550",
    flex: 1,
    fontWeight: "500",
  },
  buttonRow: {
    width: "100%",
    gap: 8,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#134635",
    borderRadius: 999,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#F2F0E9",
    borderRadius: 999,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#4A5550",
    fontSize: 11.5,
    fontWeight: "600",
  },
});
