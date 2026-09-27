import React, { useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotionView, useResponsive } from "@/lib/responsive-motion";

const SERIF_FONT = Platform.select({
  web: "Georgia, 'Times New Roman', serif",
  ios: "Georgia",
  default: "serif",
});

const NUTECH_NOTIFICATIONS = [
  {
    id: "n1",
    tag: "EVENT REMINDER",
    title: "NUTECH IEEE Fest '25 Starts Today at 2:00 PM",
    message: "Join the NUTECH IEEE Student Branch in Academic Block Level 2 for the Hackathon & Circuit Design kickoff.",
    time: "30m ago",
    route: "/event/event-ieee-fest",
    logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "n2",
    tag: "GREEN WEEK",
    title: "NUTECH Green Week Plantation Drive",
    message: "PM's Green Youth Movement Club invites all students to the Central Lawn on Monday at 10:00 AM.",
    time: "3h ago",
    route: "/event/event-green-week",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "n3",
    tag: "CLUB UPDATE",
    title: "NUTECH Media & Publicity Photography Workshop",
    message: "Registrations are open for Wednesday's visual storytelling session in the NUTECH Auditorium.",
    time: "Yesterday",
    route: "/event/event-media-workshop",
    logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
  },
];

export default function RemindersScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const [readIds, setReadIds] = useState<string[]>([]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
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
            <Text style={{ fontSize: 7.5, fontWeight: "700", letterSpacing: 0.8, color: "#2A6350" }}>
              NUTECH CAMPUS ALERTS
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
              Notifications
            </Text>
          </View>
        </View>
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
        showsVerticalScrollIndicator={false}
      >
        <MotionView delay={25} distance={8}>
          <View style={{ gap: 9 }}>
            {NUTECH_NOTIFICATIONS.map((item) => {
              const unread = !readIds.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setReadIds((prev) => [...prev, item.id]);
                    router.push(item.route as any);
                  }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: unread ? "#CBEAD9" : "#EAE8E1",
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <Image
                    source={{ uri: item.logo }}
                    style={{ width: 36, height: 36, borderRadius: 10 }}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontSize: 7.5, fontWeight: "700", color: "#144534" }}>
                        {item.tag}
                      </Text>
                      <Text style={{ fontSize: 8, color: "#7A8580" }}>{item.time}</Text>
                    </View>
                    <Text
                      style={{
                        marginTop: 3,
                        fontFamily: SERIF_FONT,
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#12221C",
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ marginTop: 2, fontSize: 9, lineHeight: 13.5, color: "#58635E" }}>
                      {item.message}
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
