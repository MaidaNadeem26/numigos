import React, { useMemo, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive } from "@/lib/responsive-motion";
import { NUTECH_SOCIETIES_LIST, resolveClubBannerSource, resolveClubLogoSource } from "@/lib/nutech-data";

const SERIF_FONT = Platform.select({
  web: "Georgia, 'Times New Roman', serif",
  ios: "Georgia",
  default: "serif",
});

const CATEGORIES = ["All", "Technical", "Creative", "Community", "Outdoor & Sports"] as const;

export default function SocietiesScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [joinedIds, setJoinedIds] = useState<string[]>([
    "zindigi-prize-nutech",
    "entrepreneurship-club",
    "ieee-nutech",
    "media-publicity",
    "fine-arts",
    "adventure-club",
  ]);

  const filteredSocieties = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NUTECH_SOCIETIES_LIST.filter((soc) => {
      const matchesCat = selectedCategory === "All" || soc.category === selectedCategory;
      const matchesQuery =
        !q ||
        soc.name.toLowerCase().includes(q) ||
        soc.categoryLabel.toLowerCase().includes(q) ||
        soc.mission.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, selectedCategory]);

  const toggleJoin = (id: string) => {
    setJoinedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
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
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.push("/(tabs)/explore"))}
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
            <Text
              style={{
                fontSize: 7.5,
                fontWeight: "700",
                letterSpacing: 0.8,
                color: "#2A6350",
              }}
            >
              OFFICE OF STUDENT AFFAIRS (OSA)
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
              NUTECH Clubs & Societies
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/societies/register")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: "#0E3A2B",
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 5.5,
          }}
        >
          <Ionicons name="add-circle-outline" size={12.5} color="#F3D092" />
          <Text style={{ fontSize: 8.5, fontWeight: "700", color: "#FFFFFF" }}>
            New Club
          </Text>
        </Pressable>
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
          {/* Search Bar */}
          <View
            style={{
              height: 38,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E2DA",
              paddingHorizontal: 11,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="search-outline" size={14.5} color="#7A8580" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search NUTECH clubs (IEEE, Media, Fine Arts, Adventure)..."
              placeholderTextColor="#8E9893"
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 10.5,
                color: "#12221C",
                paddingVertical: 0,
              }}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={14} color="#8E9893" />
              </Pressable>
            )}
          </View>
          <View style={{ height: 10 }} />

          {/* NUTECH Society Cards with Banner & Logo Images */}
          <View style={{ gap: 11 }}>
            {filteredSocieties.map((soc) => {
              const isJoined = joinedIds.includes(soc.id);
              return (
                <Pressable
                  key={soc.id}
                  onPress={() => router.push(`/societies/${soc.id}` as any)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#EAE8E1",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={resolveClubBannerSource(soc.banner)}
                    style={{ width: "100%", height: 76 }}
                    resizeMode="cover"
                  />
                  <View style={{ padding: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Image
                        source={resolveClubLogoSource(soc.logo)}
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 12,
                          borderWidth: 2,
                          borderColor: "#FFFFFF",
                          marginTop: -26,
                          backgroundColor: "#FAF9F5",
                        }}
                      />

                      <View style={{ flex: 1, marginLeft: 10, paddingRight: 8 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <View
                            style={{
                              backgroundColor: "#E4F2EC",
                              borderRadius: 999,
                              paddingHorizontal: 6.5,
                              paddingVertical: 1.5,
                            }}
                          >
                            <Text style={{ fontSize: 7, fontWeight: "700", color: "#144534" }}>
                              {soc.categoryLabel}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={{
                            marginTop: 2,
                            fontFamily: SERIF_FONT,
                            fontSize: 12.5,
                            fontWeight: "700",
                            color: "#12221C",
                          }}
                          numberOfLines={1}
                        >
                          {soc.name}
                        </Text>

                        <Text style={{ marginTop: 1, fontSize: 8.5, color: "#6E7773" }}>
                          {soc.studentsLabel} · {soc.dept}
                        </Text>
                      </View>

                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleJoin(soc.id);
                        }}
                        style={{
                          backgroundColor: isJoined ? "#CBEAD9" : "#0E3A2B",
                          borderRadius: 999,
                          paddingHorizontal: 10,
                          paddingVertical: 5.5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 8.5,
                            fontWeight: "700",
                            color: isJoined ? "#144534" : "#FFFFFF",
                          }}
                        >
                          {isJoined ? "Following ✓" : "+ Follow"}
                        </Text>
                      </Pressable>
                    </View>

                    <Text
                      style={{
                        marginTop: 7,
                        fontSize: 9,
                        lineHeight: 13.5,
                        color: "#58635E",
                      }}
                      numberOfLines={2}
                    >
                      {soc.mission}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </MotionView>
      </ScrollView>
    </SafeAreaView>
  );
}
