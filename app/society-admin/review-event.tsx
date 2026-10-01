import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";

export default function ReviewEventScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { society, draftEvent, createEvent, setDraftEvent } = useSocietyAdminData();
  const [submitted, setSubmitted] = useState(false);
  const [createdEventId, setCreatedEventId] = useState("");

  if (!draftEvent && !submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: FONT_SANS, fontSize: 13, color: "#12221C", marginBottom: 12 }}>
          No draft event found to review.
        </Text>
        <Pressable
          onPress={() => router.replace("/society-admin/create-event")}
          style={{
            backgroundColor: "#1E5D4B",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 999,
          }}
        >
          <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>
            Create New Event
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSubmitToOSA = () => {
    const newEvent = createEvent(draftEvent);
    setCreatedEventId(newEvent.id);
    setDraftEvent(null);
    setSubmitted(true);
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
          {!submitted && (
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
          )}
          <View>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: "700", letterSpacing: 0.8, color: "#1E5D4B" }}>
              STEP 2 OF 2 · REVIEW & SUBMIT
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              {submitted ? "Submission Confirmed" : "Review Event Details"}
            </Text>
          </View>
        </View>

        {!submitted && (
          <Pressable
            onPress={() => router.back()}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#EFECE6",
            }}
          >
            <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "600", color: "#12221C" }}>
              Edit
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 36,
          paddingHorizontal: hPad,
          paddingTop: 14,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={20} distance={8}>
          {submitted ? (
            /* Success Confirmation Screen */
            <View style={{ gap: 16 }}>
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: "#CBEAD9",
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#E8F4EE",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={36} color="#1E5D4B" />
                </View>

                <Text style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: "700", color: "#12221C", textAlign: "center" }}>
                  Submitted to NUTECH OSA
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#58635E",
                    textAlign: "center",
                    marginTop: 6,
                    lineHeight: 16,
                    paddingHorizontal: 8,
                  }}
                >
                  Your event proposal has been queued for Directorate of Student Life review. You will receive a notification when approval is granted.
                </Text>

                {/* Workflow Status Tracker */}
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#FAF9F5",
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: "#EAE7DF",
                    padding: 14,
                    marginTop: 18,
                    gap: 12,
                  }}
                >
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#12221C", letterSpacing: 0.5 }}>
                    APPROVAL PIPELINE
                  </Text>

                  {/* Step 1 */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#1E5D4B", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#12221C" }}>
                        Submitted by Society Admin
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#58635E" }}>
                        Just now · Pending OSA Review
                      </Text>
                    </View>
                  </View>

                  {/* Step 2 */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#D97706", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="time" size={12} color="#D97706" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#D97706" }}>
                        OSA Safety & Venue Clearance
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#8D9692" }}>
                        Office of Student Affairs · Typically 24-48 hrs
                      </Text>
                    </View>
                  </View>

                  {/* Step 3 */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#F2EFE9", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="radio-button-off" size={12} color="#8D9692" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "600", color: "#8D9692" }}>
                        Live Campus Registration
                      </Text>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#8D9692" }}>
                        Opens for student RSVPs once approved
                      </Text>
                    </View>
                  </View>
                </View>

                {/* CTAs */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 20, width: "100%" }}>
                  <Pressable
                    onPress={() => router.replace(`/society-admin/event/${createdEventId}`)}
                    style={{
                      flex: 1,
                      backgroundColor: "#1E5D4B",
                      borderRadius: 999,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "700", color: "#FFFFFF" }}>
                      View Event Details
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.replace("/society-admin/events")}
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
                      All Events
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            /* Review & Preview Form */
            <View style={{ gap: 14 }}>
              {/* Status Header Badge */}
              <View
                style={{
                  backgroundColor: "#FFF7ED",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#FED7AA",
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Ionicons name="information-circle-outline" size={20} color="#D97706" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#9A3412" }}>
                    Preview Before Submission
                  </Text>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#9A3412", marginTop: 1 }}>
                    Review how this event will appear to students once OSA approval is granted.
                  </Text>
                </View>
              </View>

              {/* Event Card Preview */}
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: "#EAE7DF",
                  overflow: "hidden",
                }}
              >
                <Image source={{ uri: draftEvent.image }} style={{ width: "100%", height: 160 }} resizeMode="cover" />

                <View style={{ padding: 16 }}>
                  {/* Category and Proposed Status */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <View style={{ backgroundColor: "#E8F4EE", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700", color: "#1E5D4B" }}>
                        {draftEvent.categoryTag}
                      </Text>
                    </View>

                    <View style={{ backgroundColor: "#FFF7ED", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700", color: "#D97706" }}>
                        PENDING SUBMISSION
                      </Text>
                    </View>
                  </View>

                  <Text style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: "700", color: "#12221C", lineHeight: 22 }}>
                    {draftEvent.title}
                  </Text>

                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, color: "#58635E", marginTop: 4 }}>
                    Organized by {society.name}
                  </Text>

                  {/* Details Grid */}
                  <View
                    style={{
                      backgroundColor: "#FAF9F5",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#EAE7DF",
                      padding: 12,
                      marginTop: 14,
                      gap: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Ionicons name="calendar-outline" size={15} color="#1E5D4B" />
                      <View>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "600" }}>
                          DATE & TIME
                        </Text>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "600", color: "#12221C" }}>
                          {draftEvent.dateTimeFull}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Ionicons name="location-outline" size={15} color="#1E5D4B" />
                      <View>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "600" }}>
                          VENUE
                        </Text>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "600", color: "#12221C" }}>
                          {draftEvent.venue} ({draftEvent.wing})
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Ionicons name="people-outline" size={15} color="#1E5D4B" />
                      <View>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "600" }}>
                          SEAT CAPACITY
                        </Text>
                        <Text style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: "600", color: "#12221C" }}>
                          {draftEvent.capacity} maximum attendees
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Ionicons name="time-outline" size={15} color="#1E5D4B" />
                      <View>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: "#8D9692", fontWeight: "600" }}>
                          REGISTRATION DEADLINE
                        </Text>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: "600", color: "#12221C" }}>
                          {draftEvent.deadlineText}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Description Box */}
                  <View style={{ marginTop: 14 }}>
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                      DESCRIPTION
                    </Text>
                    <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, color: "#58635E", lineHeight: 16 }}>
                      {draftEvent.description}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                <Pressable
                  onPress={() => router.back()}
                  style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#EAE7DF",
                    borderRadius: 999,
                    height: 44,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "700", color: "#12221C" }}>
                    Back to Edit
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleSubmitToOSA}
                  style={{
                    flex: 1.5,
                    backgroundColor: "#1E5D4B",
                    borderRadius: 999,
                    height: 44,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 11.5, fontWeight: "700", color: "#FFFFFF" }}>
                    Submit for Approval
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
