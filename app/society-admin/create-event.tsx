import React, { useState, useEffect } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive, FONT_SANS, FONT_MONO } from "@/lib/responsive-motion";
import { useSocietyAdminData } from "@/lib/society-admin-data";

const PRESET_BANNERS = [
  { label: "Cloud & AI", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80" },
  { label: "Hackathon", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80" },
  { label: "Workshop", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80" },
  { label: "Seminar", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80" },
];

const PRESET_VENUES = [
  "Academic Block · CS Lab 3",
  "NUTECH Main Auditorium",
  "Innovation Center · Room 204",
  "Academic Block · EE Lab 1",
  "NUTECH Central Lawn",
];

const CATEGORIES: Array<"Workshops" | "Hackathons" | "Clubs" | "Cultural"> = [
  "Workshops",
  "Hackathons",
  "Clubs",
  "Cultural",
];

export default function CreateEventScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { society, draftEvent, setDraftEvent } = useSocietyAdminData();

  const [title, setTitle] = useState(draftEvent?.title ?? "");
  const [description, setDescription] = useState(draftEvent?.description ?? "");
  const [category, setCategory] = useState<"Workshops" | "Hackathons" | "Clubs" | "Cultural">(draftEvent?.category ?? "Workshops");
  const [bannerUrl, setBannerUrl] = useState(draftEvent?.image ?? PRESET_BANNERS[0].url);
  const [date, setDate] = useState(draftEvent?.date ?? "");
  const [startTime, setStartTime] = useState(draftEvent?.startTime ?? "");
  const [endTime, setEndTime] = useState(draftEvent?.endTime ?? "");
  const [venue, setVenue] = useState(draftEvent?.venue ?? "");
  const [deadline, setDeadline] = useState(draftEvent?.deadlineText ?? "");
  const [capacity, setCapacity] = useState(draftEvent?.capacity ? String(draftEvent.capacity) : "");
  const [error, setError] = useState("");

  const handleReview = () => {
    if (!title.trim()) {
      setError("Please enter an event title");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description for the event");
      return;
    }
    if (!date.trim()) {
      setError("Please specify the event date");
      return;
    }
    if (!venue.trim()) {
      setError("Please specify the event venue");
      return;
    }

    const draft = {
      title: title.trim(),
      shortTitle: title.trim(),
      description: description.trim(),
      category,
      categoryTag: category.toUpperCase(),
      image: bannerUrl,
      date: date.trim(),
      dateLabel: `${date} · ${startTime}`,
      timeLabel: `${startTime} – ${endTime}`,
      dateTimeFull: `${date} · ${startTime} – ${endTime}`,
      venue: venue.trim(),
      wing: venue.includes("Auditorium") ? "Admin Block" : "Academic Block",
      capacity: parseInt(capacity, 10) || 100,
      deadlineText: `Registration closes ${deadline}`,
      startTime,
      endTime,
    };

    setDraftEvent(draft);
    router.push("/society-admin/review-event");
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
              STEP 1 OF 2 · EVENT DETAILS
            </Text>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 15, fontWeight: "700", color: "#12221C", marginTop: -1 }}>
              Create Society Event
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
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
            {/* OSA Approval Reminder Banner */}
            <View
              style={{
                backgroundColor: "#FFF7ED",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#FED7AA",
                padding: 12,
                flexDirection: "row",
                gap: 10,
                marginBottom: 14,
                alignItems: "center",
              }}
            >
              <Ionicons name="shield-outline" size={20} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10.5, fontWeight: "700", color: "#9A3412" }}>
                  OSA Approval Required
                </Text>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9, color: "#9A3412", marginTop: 2, lineHeight: 13 }}>
                  Submitted events are queued for review by NUTECH Directorate of Student Life. Once approved, the event goes live across campus.
                </Text>
              </View>
            </View>

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

            {/* Form Container */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EAE7DF",
                padding: 14,
                gap: 14,
              }}
            >
              {/* Event Banner */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 6 }}>
                  Event Banner
                </Text>
                <View style={{ borderRadius: 12, overflow: "hidden", height: 110, marginBottom: 8, borderWidth: 1, borderColor: "#E5E2DA" }}>
                  <Image source={{ uri: bannerUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>

                {/* Preset Options */}
                <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                  {PRESET_BANNERS.map((preset) => {
                    const selected = bannerUrl === preset.url;
                    return (
                      <Pressable
                        key={preset.label}
                        onPress={() => setBannerUrl(preset.url)}
                        style={{
                          paddingHorizontal: 9,
                          paddingVertical: 5,
                          borderRadius: 8,
                          backgroundColor: selected ? "#1E5D4B" : "#F6F5F0",
                          borderWidth: 1,
                          borderColor: selected ? "#1E5D4B" : "#E5E2DA",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 9,
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

              {/* Event Title */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Event Title *
                </Text>
                <TextInput
                  value={title}
                  onChangeText={(t) => { setTitle(t); setError(""); }}
                  placeholder="e.g. AWS Bedrock & Generative AI Workshop"
                  placeholderTextColor="#8D9692"
                  style={[
              {
                    height: 40,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 12,
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#12221C",
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
              </View>

              {/* Category */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 6 }}>
                  Category *
                </Text>
                <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                  {CATEGORIES.map((cat) => {
                    const active = category === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setCategory(cat)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 999,
                          backgroundColor: active ? "#1E5D4B" : "#F6F5F0",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 9.5,
                            fontWeight: "700",
                            color: active ? "#FFFFFF" : "#58635E",
                          }}
                        >
                          {cat === 'Clubs' ? 'Societies' : cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Description */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Description *
                </Text>
                <TextInput
                  value={description}
                  onChangeText={(d) => { setDescription(d); setError(""); }}
                  multiline
                  numberOfLines={4}
                  placeholder="Detailed description of the event, learning objectives, requirements, and who should attend..."
                  placeholderTextColor="#8D9692"
                  style={[
              {
                    minHeight: 80,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
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

              {/* Date & Time Row */}
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1.2 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                    Event Date
                  </Text>
                  <TextInput
                    value={date}
                    onChangeText={setDate}
                    placeholder="e.g. Apr 22, 2026"
                    placeholderTextColor="#8D9692"
                    style={[
              {
                      height: 40,
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
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                    Start Time
                  </Text>
                  <TextInput
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="02:00 PM"
                    placeholderTextColor="#8D9692"
                    style={[
              {
                      height: 40,
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
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                    End Time
                  </Text>
                  <TextInput
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="05:00 PM"
                    placeholderTextColor="#8D9692"
                    style={[
              {
                      height: 40,
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
              </View>

              {/* Venue */}
              <View>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                  Campus Venue *
                </Text>
                <TextInput
                  value={venue}
                  onChangeText={(v) => { setVenue(v); setError(""); }}
                  placeholder="e.g. Academic Block · CS Lab 3"
                  placeholderTextColor="#8D9692"
                  style={[
              {
                    height: 40,
                    backgroundColor: "#F6F5F0",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#E5E2DA",
                    paddingHorizontal: 12,
                    fontFamily: FONT_SANS,
                    fontSize: 11,
                    color: "#12221C",
                    marginBottom: 6,
                                },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                />
                <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
                  {PRESET_VENUES.map((preset) => (
                    <Pressable
                      key={preset}
                      onPress={() => setVenue(preset)}
                      style={{
                        paddingHorizontal: 7,
                        paddingVertical: 3.5,
                        borderRadius: 6,
                        backgroundColor: venue === preset ? "#E8F4EE" : "#F6F5F0",
                      }}
                    >
                      <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, color: venue === preset ? "#1E5D4B" : "#58635E" }}>
                        {preset}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Deadline & Capacity */}
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1.5 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                    Registration Deadline
                  </Text>
                  <TextInput
                    value={deadline}
                    onChangeText={setDeadline}
                    placeholder="Apr 20, 2026 · 11:59 PM"
                    placeholderTextColor="#8D9692"
                    style={[
              {
                      height: 40,
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
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C", marginBottom: 4 }}>
                    Max Capacity
                  </Text>
                  <TextInput
                    value={capacity}
                    onChangeText={setCapacity}
                    placeholder="120"
                    keyboardType="numeric"
                    placeholderTextColor="#8D9692"
                    style={[
              {
                      height: 40,
                      backgroundColor: "#F6F5F0",
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#E5E2DA",
                      paddingHorizontal: 10,
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      color: "#12221C",
                                  },
              Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
            ]}
                  />
                </View>
              </View>

              {/* Submit CTA */}
              <Pressable
                onPress={handleReview}
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
                  Review Event Preview →
                </Text>
              </Pressable>
            </View>
          </MotionView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
