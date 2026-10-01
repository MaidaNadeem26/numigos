import React, { useState, useRef, useEffect } from "react";
import {
  Image,
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
import { resolveClubLogoSource } from "@/lib/nutech-data";

export default function SocietyChatScreen() {
  const router = useRouter();
  const { hPad } = useResponsive();
  const { society, chatMessages, sendChatMessage } = useSocietyAdminData();
  const [inputText, setInputText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showPinned, setShowPinned] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Interactive thumbs-up reaction counters
  const [thumbsReactions, setThumbsReactions] = useState<Record<string, number>>({});

  const toggleThumbs = (msgId: string) => {
    setThumbsReactions((prev) => ({
      ...prev,
      [msgId]: (prev[msgId] || 0) + 1,
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF9F5" }} edges={["top"]}>
      {/* Top Header Bar */}
      <View
        style={{
          height: 54,
          paddingHorizontal: hPad,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={resolveClubLogoSource(society.logo)}
            style={{ width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: "#E2DFD6" }}
          />

          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text
                style={{ fontFamily: FONT_SANS, fontSize: 13.5, fontWeight: "700", color: "#12221C" }}
                numberOfLines={1}
              >
                {society.shortName}
              </Text>
              <View
                style={{
                  backgroundColor: "#E8F4EE",
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontFamily: FONT_SANS, fontSize: 8, fontWeight: "700", color: "#1E5D4B" }}>
                  TEAM
                </Text>
              </View>
            </View>
            <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, color: "#16A34A", fontWeight: "600", marginTop: 1 }}>
              {society.membersCount} members active
            </Text>
          </View>
        </View>

        {/* View Team Members Icon Button */}
        <Pressable
          accessibilityLabel="View Team Members"
          accessibilityRole="button"
          onPress={() => router.push("/society-admin/members")}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#EAE7DF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="people-outline" size={17} color="#1E5D4B" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        style={{ flex: 1 }}
      >
        {/* Fixed Pinned Announcement Box (stays visible while scrolling) */}
        {showPinned && (
          <View
            style={{
              paddingHorizontal: hPad,
              paddingTop: 6,
              paddingBottom: 4,
              maxWidth: 520,
              width: "100%",
              alignSelf: "center",
              backgroundColor: "#FAF9F5",
              zIndex: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#F2CC8F",
                padding: 10,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 3,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#FEF7EC",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Ionicons name="pin" size={13} color="#C47D15" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONT_SANS, fontSize: 9.5, fontWeight: "700", color: "#C47D15" }}>
                  PINNED ANNOUNCEMENT
                </Text>
                <Text
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 10.5,
                    color: "#12221C",
                    lineHeight: 15,
                    marginTop: 2,
                  }}
                >
                  {`Official communication channel for ${society.name}. Coordinate society activities, announcements, and team discussions here.`}
                </Text>
              </View>
            </View>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            paddingHorizontal: hPad,
            paddingTop: 8,
            paddingBottom: 16,
            maxWidth: 520,
            width: "100%",
            alignSelf: "center",
            gap: 12,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Date Divider Pill */}
          <View style={{ alignItems: "center", marginVertical: 4 }}>
            <View
              style={{
                backgroundColor: "#EAE7DF",
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 999,
              }}
            >
              <Text style={{ fontFamily: FONT_SANS, fontSize: 8.5, fontWeight: "700", color: "#58635E", letterSpacing: 0.4 }}>
                OFFICIAL CHANNEL
              </Text>
            </View>
          </View>

          {/* Messages Feed */}
          {chatMessages.length > 0 ? (
            chatMessages.map((msg) => {
              const isMe = msg.isCurrentUser;
              const thumbsCount = thumbsReactions[msg.id] ?? 0;

              return (
                <View
                  key={msg.id}
                  style={{
                    flexDirection: isMe ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    gap: 8,
                    maxWidth: "86%",
                    alignSelf: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  {!isMe && (
                    msg.senderAvatar ? (
                      <Image
                        source={{ uri: msg.senderAvatar }}
                        style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: "#E2DFD6" }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "#1E5D4B",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#FAF9F5" }}>
                          {msg.senderName
                            ? msg.senderName
                                .split(" ")
                                .map((p) => p[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "U"}
                        </Text>
                      </View>
                    )
                  )}

                  <View style={{ alignItems: isMe ? "flex-end" : "flex-start", flexShrink: 1 }}>
                    {/* Sender Name & Role */}
                    {!isMe && (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 3, marginLeft: 2 }}>
                        <Text style={{ fontFamily: FONT_SANS, fontSize: 10, fontWeight: "700", color: "#12221C" }}>
                          {msg.senderName}
                        </Text>
                        <View
                          style={{
                            backgroundColor:
                              msg.senderRole.includes("President")
                                ? "#FEF7EC"
                                : msg.senderRole.includes("Lead")
                                ? "#E8F4EE"
                                : "#F3F4F6",
                            paddingHorizontal: 5,
                            paddingVertical: 1,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONT_SANS,
                              fontSize: 7.5,
                              color: msg.senderRole.includes("President")
                                ? "#C47D15"
                                : msg.senderRole.includes("Lead")
                                ? "#1E5D4B"
                                : "#58635E",
                              fontWeight: "700",
                            }}
                          >
                            {msg.senderRole}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Message Bubble */}
                    <View
                      style={{
                        backgroundColor: isMe ? "#1E5D4B" : "#FFFFFF",
                        borderRadius: 16,
                        borderTopRightRadius: isMe ? 4 : 16,
                        borderTopLeftRadius: isMe ? 16 : 4,
                        borderWidth: isMe ? 0 : 1,
                        borderColor: "#EAE7DF",
                        paddingHorizontal: 12,
                        paddingVertical: 8.5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: isMe ? 0.08 : 0.03,
                        shadowRadius: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONT_SANS,
                          fontSize: 12,
                          color: isMe ? "#FFFFFF" : "#12221C",
                          lineHeight: 17,
                        }}
                      >
                        {msg.text}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 4,
                          marginTop: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 8,
                            color: isMe ? "rgba(255,255,255,0.7)" : "#8D9692",
                          }}
                        >
                          {msg.timestamp}
                        </Text>
                        {isMe && <Ionicons name="checkmark-done" size={12} color="#CBEAD9" />}
                      </View>
                    </View>

                    {/* Interactive Thumbs Up Reaction Only */}
                    <Pressable
                      onPress={() => toggleThumbs(msg.id)}
                      style={{
                        backgroundColor: thumbsCount > 0 ? "#E8F4EE" : "#FFFFFF",
                        borderWidth: 1,
                        borderColor: thumbsCount > 0 ? "#1E5D4B" : "#E2DFD6",
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 999,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 3,
                        alignSelf: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <Text style={{ fontSize: 10 }}>👍</Text>
                      {thumbsCount > 0 && (
                        <Text style={{ fontFamily: FONT_MONO, fontSize: 8.5, color: "#12221C", fontWeight: "700" }}>
                          {thumbsCount}
                        </Text>
                      )}
                    </Pressable>
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
                marginVertical: 20,
              }}
            >
              <Ionicons name="chatbubbles-outline" size={28} color="#8D9692" style={{ marginBottom: 6 }} />
              <Text style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: "700", color: "#12221C" }}>
                No messages yet
              </Text>
              <Text style={{ fontFamily: FONT_SANS, fontSize: 10, color: "#58635E", marginTop: 4, textAlign: "center" }}>
                Start the conversation with your society team below.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Message Input Composer */}
        <View
          style={{
            backgroundColor: "#FAF9F5",
            paddingHorizontal: hPad,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            maxWidth: 520,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {/* Text Input Container */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: isInputFocused ? "#1E5D4B" : "#EAE7DF",
              paddingHorizontal: 14,
              height: 40,
            }}
          >
            <TextInput
              placeholder="Message your society team..."
              placeholderTextColor="#8D9692"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              returnKeyType="send"
              style={[
                {
                  flex: 1,
                  fontFamily: FONT_SANS,
                  fontSize: 11.5,
                  color: "#12221C",
                  height: "100%",
                },
                Platform.OS === "web" ? ({ outlineStyle: "none", outline: "none" } as any) : null,
              ]}
            />
            {inputText.length > 0 && (
              <Pressable hitSlop={6} onPress={() => setInputText("")}>
                <Ionicons name="close-circle" size={15} color="#8D9692" />
              </Pressable>
            )}
          </View>

          {/* Send Button */}
          <Pressable
            disabled={!inputText.trim()}
            onPress={handleSend}
            style={({ pressed }) => [
              {
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: inputText.trim() ? "#1E5D4B" : "#E2DFD6",
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <Ionicons name="arrow-up" size={19} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
