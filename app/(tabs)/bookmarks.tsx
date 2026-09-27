import React, { useMemo, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { NUTECH_EVENTS_LIST } from "@/lib/nutech-data";

const SERIF_FONT = Platform.select({
  web: "Georgia, 'Times New Roman', serif",
  ios: "Georgia",
  default: "serif",
});

const FILTERS = ["All Saved", "Hackathons", "Workshops", "Clubs", "Cultural"] as const;

export default function BookmarksScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const [selectedFilter, setSelectedFilter] = useState<(typeof FILTERS)[number]>("All Saved");
  const [savedIds, setSavedIds] = useState<string[]>(() => NUTECH_EVENTS_LIST.map((e) => e.id));

  const visibleEvents = useMemo(() => {
    const base = NUTECH_EVENTS_LIST.filter((item) => savedIds.includes(item.id));
    if (selectedFilter === "All Saved") return base;
    return base.filter((item) => item.category === selectedFilter);
  }, [savedIds, selectedFilter]);

  const toggleBookmark = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Header Bar */}
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
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#134635",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="bookmark" size={13.5} color="#E9C48C" />
          </View>
          <View>
            <Text
              style={{
                fontSize: 7.5,
                fontWeight: "700",
                letterSpacing: 0.8,
                color: "#2A6350",
              }}
            >
              NUTECH ISLAMABAD
            </Text>
            <Text
              style={{
                fontFamily: SERIF_FONT,
                fontSize: 16,
                fontWeight: "700",
                color: "#12221C",
                marginTop: -1,
              }}
            >
              Saved Events
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/reminders")}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#EFECE6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="notifications-outline" size={14} color="#12221C" />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: hPad,
          paddingTop: 4,
          paddingBottom: 28,
          maxWidth: 520,
          width: "100%",
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={25} distance={8}>

          {/* Saved Events List */}
          {visibleEvents.length === 0 ? (
            <View
              style={{
                marginTop: 18,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#EAE8E1",
                padding: 24,
                alignItems: "center",
              }}
            >
              <Ionicons name="bookmark-outline" size={22} color="#144534" />
              <Text
                style={{
                  marginTop: 8,
                  fontFamily: SERIF_FONT,
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#12221C",
                }}
              >
                No saved NUTECH events
              </Text>
              <Pressable
                onPress={() => {
                  setSavedIds(NUTECH_EVENTS_LIST.map((e) => e.id));
                  setSelectedFilter("All Saved");
                }}
                style={{
                  marginTop: 10,
                  backgroundColor: "#0E3A2B",
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                }}
              >
                <Text style={{ fontSize: 9.5, fontWeight: "700", color: "#FFFFFF" }}>
                  Show All Events
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 10, marginTop: 4 }}>
              {visibleEvents.map((ev) => (
                <Pressable
                  key={ev.id}
                  onPress={() => router.push(`/event/${ev.id}` as any)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: "#EAE8E1",
                    overflow: "hidden",
                  }}
                >
                  <View style={{ flexDirection: "row", padding: 11 }}>
                    <Image
                      source={{ uri: ev.image }}
                      style={{ width: 74, height: 74, borderRadius: 11 }}
                      resizeMode="cover"
                    />

                    <View style={{ flex: 1, marginLeft: 11 }}>
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
                            paddingHorizontal: 7,
                            paddingVertical: 2,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 7.5,
                              fontWeight: "700",
                              color: "#144534",
                            }}
                          >
                            {ev.categoryTag}
                          </Text>
                        </View>

                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            toggleBookmark(ev.id);
                          }}
                          hitSlop={8}
                        >
                          <Ionicons name="bookmark" size={15} color="#134635" />
                        </Pressable>
                      </View>

                      <Text
                        style={{
                          marginTop: 4,
                          fontFamily: SERIF_FONT,
                          fontSize: 12.5,
                          fontWeight: "700",
                          color: "#12221C",
                        }}
                        numberOfLines={1}
                      >
                        {ev.shortTitle}
                      </Text>

                      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
                        <Image
                          source={{ uri: ev.clubLogo }}
                          style={{ width: 14, height: 14, borderRadius: 4 }}
                        />
                        <Text
                          numberOfLines={1}
                          style={{ fontSize: 8.5, fontWeight: "600", color: "#1E5D4B", flex: 1 }}
                        >
                          {ev.societyName}
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: 4,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Ionicons name="calendar-outline" size={10} color="#6E7773" />
                        <Text style={{ fontSize: 8.5, color: "#6E7773" }}>{ev.dateLabel}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
