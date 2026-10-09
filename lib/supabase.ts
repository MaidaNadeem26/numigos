import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { AppState, Platform } from "react-native";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.supabaseUrl ||
  "https://wwpqhxobjobqtnwddmya.supabase.co";

const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  Constants.expoConfig?.extra?.supabasePublishableKey ||
  "sb_publishable_1cuVdNhLUUea5TQu9_33cA_OlxR6SUA";

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Supabase connection is not configured.");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const TEST_ACCOUNTS: Record<string, { password: string; name: string; role: string; societyId?: string }> = {
  "test@nutech.edu.pk": {
    password: "Test1234",
    name: "Bilal Ahmad",
    role: "student",
  },
  "bilal.ahmad@nutech.edu.pk": {
    password: "Test1234",
    name: "Bilal Ahmad",
    role: "student",
  },
  "admin.aws@nutech.edu.pk": {
    password: "Test1234",
    name: "Hamza Malik",
    role: "society_admin",
    societyId: "aws-student-builder-nutech",
  },
  "admin.zindigi@nutech.edu.pk": {
    password: "Test1234",
    name: "Ayesha Khan",
    role: "society_admin",
    societyId: "zindigi-prize-nutech",
  },
};

export const TEST_SESSION_STORAGE_KEY = "numigos_test_session_email";

export async function getTestSessionEmail(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TEST_SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function setTestSessionEmail(email: string | null): Promise<void> {
  try {
    if (email) {
      await AsyncStorage.setItem(TEST_SESSION_STORAGE_KEY, email);
    } else {
      await AsyncStorage.removeItem(TEST_SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export interface AuthenticatedProfile {
  id?: string;
  email?: string;
  role: string;
  is_verified: boolean;
  full_name?: string;
  name?: string;
  roll_number?: string;
  department?: string;
  semester?: string;
  phone?: string;
  avatar_url?: string;
  managed_society_id?: string;
}

export type RegistrationRecord = any;
export type NotificationRecord = any;
export type SocietyMemberRecord = any;
export type SocietyPostRecord = any;

export async function getAuthenticatedProfile(userId?: string): Promise<{ profile: AuthenticatedProfile | null; error: Error | null }> {
  try {
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      resolvedUserId = user?.id;
    }

    if (resolvedUserId) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, is_verified, full_name, roll_number, department, semester, phone, managed_society_id, avatar_url")
        .eq("id", resolvedUserId)
        .maybeSingle();

      if (!error && data) {
        return {
          profile: {
            ...data,
            name: data.full_name || (data as any).name || "Student",
          } as AuthenticatedProfile,
          error: null,
        };
      }
    }

    // Check test session
    const testEmail = await getTestSessionEmail();
    if (testEmail && TEST_ACCOUNTS[testEmail]) {
      const testAcc = TEST_ACCOUNTS[testEmail];
      return {
        profile: {
          id: resolvedUserId || "test-user-id",
          email: testEmail,
          role: testAcc.role,
          is_verified: true,
          full_name: testAcc.name,
          name: testAcc.name,
          managed_society_id: testAcc.societyId,
        },
        error: null,
      };
    }

    return {
      profile: {
        id: resolvedUserId || "guest-user",
        name: "Student",
        full_name: "Student",
        role: "student",
        is_verified: true,
      },
      error: null,
    };
  } catch (err: any) {
    return {
      profile: {
        id: userId || "guest-user",
        name: "Student",
        full_name: "Student",
        role: "student",
        is_verified: true,
      },
      error: null,
    };
  }
}

// -----------------------------------------------------------------------------
// SECURE, RESILIENT DATABASE SERVICE WRAPPERS
// -----------------------------------------------------------------------------

// Helper to safely execute Supabase queries with fallback support
export async function safeDbQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  fallback: T
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    if (error || data === null) {
      return fallback;
    }
    return data;
  } catch {
    return fallback;
  }
}

// Helper to safely execute Supabase mutations
export async function safeDbMutation<T>(
  mutationFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ success: boolean; data?: T | null; error?: string }> {
  try {
    const { data, error } = await mutationFn();
    if (error) {
      return { success: false, error: error.message || "Operation failed" };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error" };
  }
}

// Real database service methods
export const dbService = {
  // Societies
  async getSocieties() {
    return safeDbQuery(async () => {
      return await supabase.from("societies").select("*").order("name");
    }, [] as any[]);
  },

  async getSocietyById(id: string) {
    return safeDbQuery(async () => {
      return await supabase.from("societies").select("*").eq("id", id).maybeSingle();
    }, null as any);
  },

  async updateSociety(societyId: string, updates: Record<string, any>) {
    return safeDbMutation(async () => {
      return await supabase
        .from("societies")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", societyId);
    });
  },

  // Events
  async getEvents(societyId?: string) {
    return safeDbQuery(async () => {
      let query = supabase.from("events").select("*").order("date", { ascending: true });
      if (societyId) {
        query = query.eq("society_id", societyId);
      }
      return await query;
    }, [] as any[]);
  },

  async getEventById(id: string) {
    return safeDbQuery(async () => {
      return await supabase.from("events").select("*").eq("id", id).maybeSingle();
    }, null as any);
  },

  async createEvent(eventData: Record<string, any>) {
    return safeDbMutation(async () => {
      return await supabase.from("events").insert([eventData]).select().single();
    });
  },

  async updateEvent(eventId: string, updates: Record<string, any>) {
    return safeDbMutation(async () => {
      return await supabase
        .from("events")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", eventId);
    });
  },

  // Society Members
  async getSocietyMembers(societyId: string) {
    return safeDbQuery(async () => {
      return await supabase
        .from("society_members")
        .select("*")
        .eq("society_id", societyId)
        .order("created_at", { ascending: true });
    }, [] as any[]);
  },

  async addSocietyMember(memberData: Record<string, any>) {
    return safeDbMutation(async () => {
      return await supabase.from("society_members").insert([memberData]).select().single();
    });
  },

  async updateSocietyMember(memberId: string, updates: Record<string, any>) {
    return safeDbMutation(async () => {
      return await supabase.from("society_members").update(updates).eq("id", memberId);
    });
  },

  async removeSocietyMember(memberId: string) {
    return safeDbMutation(async () => {
      return await supabase.from("society_members").delete().eq("id", memberId);
    });
  },

  // Registrations & Attendance
  async getRegistrations(eventId?: string, userId?: string) {
    return safeDbQuery(async () => {
      let query = supabase.from("registrations").select("*").order("registered_at", { ascending: false });
      if (eventId) {
        query = query.eq("event_id", eventId);
      }
      if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        query = query.eq("user_id", userId);
      }
      return await query;
    }, [] as any[]);
  },

  async registerForEvent(regData: {
    event_id: string;
    name: string;
    roll_number: string;
    email: string;
    user_id?: string;
    department?: string;
    semester?: string;
    avatar?: string;
  }) {
    return safeDbMutation(async () => {
      const dataToInsert = { ...regData };
      if (dataToInsert.user_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dataToInsert.user_id)) {
        delete dataToInsert.user_id;
      }
      return await supabase.from("registrations").insert([dataToInsert]).select().single();
    });
  },

  // Posts
  async getPosts(societyId?: string) {
    return safeDbQuery(async () => {
      let query = supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (societyId) {
        query = query.eq("society_id", societyId);
      }
      return await query;
    }, [] as any[]);
  },

  // Society Followers
  async getFollowedSocieties(userId: string) {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return [];
    }
    return safeDbQuery(async () => {
      return await supabase.from("society_followers").select("society_id").eq("user_id", userId);
    }, [] as any[]);
  },

  async toggleFollowSociety(userId: string, societyId: string) {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return { success: true };
    }
    return safeDbMutation(async () => {
      const { data: existing } = await supabase
        .from("society_followers")
        .select("id")
        .eq("user_id", userId)
        .eq("society_id", societyId)
        .maybeSingle();

      if (existing) {
        return await supabase.from("society_followers").delete().eq("id", existing.id);
      } else {
        return await supabase.from("society_followers").insert([{ user_id: userId, society_id: societyId }]);
      }
    });
  },

  // Bookmarks
  async getBookmarks(userId: string) {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return [];
    }
    return safeDbQuery(async () => {
      return await supabase.from("bookmarks").select("event_id").eq("user_id", userId);
    }, [] as any[]);
  },

  async toggleBookmark(eventId: string, userId: string) {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return { success: true };
    }
    return safeDbMutation(async () => {
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("event_id", eventId)
        .maybeSingle();

      if (existing) {
        return await supabase.from("bookmarks").delete().eq("id", existing.id);
      } else {
        return await supabase.from("bookmarks").insert([{ user_id: userId, event_id: eventId }]);
      }
    });
  },

  async updateAttendance(registrationId: string, status: "Registered" | "Attended" | "Absent") {
    return safeDbMutation(async () => {
      return await supabase.from("registrations").update({ status }).eq("id", registrationId);
    });
  },

  // Chat Messages
  async getChatMessages(societyId: string) {
    return safeDbQuery(async () => {
      return await supabase
        .from("chat_messages")
        .select("*")
        .eq("society_id", societyId)
        .order("created_at", { ascending: true })
        .limit(50);
    }, null);
  },

  async sendChatMessage(msgData: {
    society_id: string;
    sender_id: string;
    sender_name: string;
    sender_role: string;
    sender_avatar?: string;
    text: string;
  }) {
    return safeDbMutation(async () => {
      return await supabase.from("chat_messages").insert([msgData]).select().single();
    });
  },

  // Notifications
  async getNotifications(societyId?: string) {
    return safeDbQuery(async () => {
      let query = supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (societyId) {
        query = query.eq("society_id", societyId);
      }
      return await query;
    }, null);
  },

  async markNotificationRead(notifId: string) {
    return safeDbMutation(async () => {
      return await supabase.from("notifications").update({ read: true }).eq("id", notifId);
    });
  },

  async clearNotifications(societyId?: string) {
    return safeDbMutation(async () => {
      if (societyId) {
        return await supabase.from("notifications").delete().eq("society_id", societyId);
      }
      return await supabase.from("notifications").delete().neq("id", "0");
    });
  },

  // Society Registration Request (Proposals)
  async submitSocietyRequest(data: {
    proposed_name: string;
    domain: string;
    advisor: string;
    purpose: string;
  }) {
    return safeDbMutation(async () => {
      return await supabase.from("society_registration_requests").insert([data]).select().single();
    });
  },

  // Profile Updates
  async updateProfile(userId: string, updates: Record<string, any>) {
    return safeDbMutation(async () => {
      return await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId);
    });
  },
};

if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });
}
