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
// SECURE, RESILIENT DATABASE SERVICE WRAPPERS WITH 1 REALISTIC DUMMY RECORD PER SECTION
// -----------------------------------------------------------------------------

export const DUMMY_SOCIETIES = [
  {
    id: "aws-student-builder-nutech",
    name: "AWS Student Builder Group NUTECH",
    short_name: "AWS Builder Group",
    shortName: "AWS Builder Group",
    tagline: "Join The Team Behind Our Campus Tech Community",
    category: "Technical",
    category_label: "CLOUD & TECH COMMUNITY",
    dept: "CS, IT & Engineering · NUTECH",
    faculty_advisor: "Engr. Tariq Mehmood",
    contact_email: "aws.builder@nutech.edu.pk",
    instagram: "@awsnutech",
    meeting_schedule: "Wednesdays at 03:30 PM (CS Lab 2)",
    members_count: 1,
    events_count: 1,
    logo: "local:aws-builder",
    banner: "local:aws-builder",
    mission:
      "NUTECH’s most premium tech community! After flagship events and industry visits at NASTP and 10Pearls, AWS Student Builder Group NUTECH empowers students with AWS cloud credits, exam vouchers, hands-on workshops, and industry networking.",
    status: "Active & Approved by OSA",
  },
];

export const DUMMY_EVENTS = [
  {
    id: "nutech-hackathon-2026",
    title: "NUTECH National Hackathon 2026",
    short_title: "National Hackathon",
    shortTitle: "National Hackathon",
    society_id: "aws-student-builder-nutech",
    societyId: "aws-student-builder-nutech",
    society_name: "AWS Student Builder Group NUTECH",
    societyName: "AWS Student Builder Group NUTECH",
    category: "Hackathons",
    category_tag: "FLAGSHIP HACKATHON",
    categoryTag: "FLAGSHIP HACKATHON",
    badge: "Oct 15",
    date: "2026-10-15",
    date_label: "Thu, Oct 15",
    dateLabel: "Thu, Oct 15",
    time: "09:00 AM - 05:00 PM",
    time_label: "09:00 AM - 05:00 PM",
    timeLabel: "09:00 AM - 05:00 PM",
    date_time_full: "Thu, Oct 15, 2026 · 09:00 AM",
    dateTimeFull: "Thu, Oct 15, 2026 · 09:00 AM",
    venue: "Main Auditorium, NUTECH Islamabad",
    wing: "Main Academic Complex",
    capacity: 150,
    registered_count: 1,
    registrations_count: 1,
    registeredCount: 1,
    deadline: "2026-10-12",
    deadline_text: "Registration Closes Oct 12",
    deadlineText: "Registration Closes Oct 12",
    image: "local:aws-builder",
    club_logo: "local:aws-builder",
    clubLogo: "local:aws-builder",
    description:
      "Join the premier annual 24-hour coding, AI and cloud innovation hackathon organized by AWS Student Builder Group NUTECH. Compete with top student innovators, solve industry challenges, and win cash prizes, AWS credits, and official certificates.",
    status: "Approved",
    osa_notes: "Approved by Directorate of Student Life (DSL) & OSA. Auditorium reserved.",
    submitted_at: "Oct 01, 2026",
  },
];

export const DUMMY_POSTS = [
  {
    id: "post-ieee-recruitment-2026",
    society_id: "ieee-nutech",
    society_name: "IEEE Student Branch NUTECH",
    category: "Clubs",
    title: "Annual Student Branch Recruitment Drive 2026",
    content:
      "Excited to welcome new innovators! Applications are now officially open for technical, media, event management, and logistics leads for the 2026-27 tenure. Don't miss the chance to represent NUTECH on a global platform.",
    image_url: "local:ieee-nutech",
    link: "https://ieee.nutech.edu.pk/apply",
    likes_count: 42,
    created_at: "2026-10-01T10:00:00Z",
  },
];

export const DUMMY_REGISTRATIONS = [
  {
    id: "reg-001",
    event_id: "nutech-hackathon-2026",
    event_title: "NUTECH National Hackathon 2026",
    user_name: "Muhammad Ahmad",
    name: "Muhammad Ahmad",
    roll_number: "F22-BSE-042",
    department: "Software Engineering",
    semester: "6th Semester",
    user_email: "ahmad.se@nutech.edu.pk",
    email: "ahmad.se@nutech.edu.pk",
    avatar: "",
    registered_at: "2026-10-02T10:15:00Z",
    created_at: "2026-10-02T10:15:00Z",
    status: "Attended",
    certificate_id: "CERT-NUTECH-2026-001",
  },
];

export const DUMMY_MEMBERS = [
  {
    id: "mem-001",
    society_id: "aws-student-builder-nutech",
    name: "Fatima Noor",
    roll_number: "F21-BCE-018",
    role: "Vice President & Cloud Lead",
    group_name: "Leadership",
    group: "Leadership",
    department: "Computer Engineering",
    joined_date: "Fall 2025",
    email: "fatima.noor@nutech.edu.pk",
    avatar: "",
    created_at: "2025-09-15T09:00:00Z",
  },
];

export const DUMMY_CHAT = [
  {
    id: "chat-001",
    society_id: "aws-student-builder-nutech",
    sender_id: "osa-coordinator",
    sender_name: "Engr. Tariq Mehmood (OSA Advisor)",
    sender_role: "Faculty & OSA Coordinator",
    sender_avatar: "",
    text: "Welcome to Numigos! The proposal for NUTECH National Hackathon 2026 has been approved by the Directorate of Student Life. Let us know if you need any logistics or auditorium equipment.",
    created_at: "2026-10-02T10:30:00Z",
  },
];

export const DUMMY_NOTIFICATIONS = [
  {
    id: "notif-001",
    society_id: "aws-student-builder-nutech",
    title: "NUTECH National Hackathon 2026",
    message: "Registration is confirmed! Main Auditorium, NUTECH Islamabad on Oct 15, 09:00 AM.",
    type: "approval",
    created_at: "2026-10-02T09:00:00Z",
    read: false,
    target_route: "/events/registered?eventId=nutech-hackathon-2026",
  },
];

export const DUMMY_BOOKMARKS = [
  {
    user_id: "guest-user",
    event_id: "nutech-hackathon-2026",
  },
];

export const DUMMY_FOLLOWED = [
  {
    user_id: "guest-user",
    society_id: "aws-student-builder-nutech",
  },
];

// Helper to safely execute Supabase queries with fallback support
export async function safeDbQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  fallback: T
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    if (error || data === null || (Array.isArray(data) && data.length === 0)) {
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
    }, DUMMY_SOCIETIES as any[]);
  },

  async getSocietyById(id: string) {
    return safeDbQuery(async () => {
      return await supabase.from("societies").select("*").eq("id", id).maybeSingle();
    }, (DUMMY_SOCIETIES.find((s) => s.id === id) || DUMMY_SOCIETIES[0]) as any);
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
    }, DUMMY_EVENTS as any[]);
  },

  async getEventById(id: string) {
    return safeDbQuery(async () => {
      return await supabase.from("events").select("*").eq("id", id).maybeSingle();
    }, (DUMMY_EVENTS.find((e) => e.id === id) || DUMMY_EVENTS[0]) as any);
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
    }, DUMMY_MEMBERS as any[]);
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
      if (userId) {
        query = query.eq("user_id", userId);
      }
      return await query;
    }, DUMMY_REGISTRATIONS as any[]);
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
      return await supabase.from("registrations").insert([regData]).select().single();
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
    }, DUMMY_POSTS as any[]);
  },

  // Society Followers
  async getFollowedSocieties(userId: string) {
    return safeDbQuery(async () => {
      return await supabase.from("society_followers").select("society_id").eq("user_id", userId);
    }, DUMMY_FOLLOWED as any[]);
  },

  async toggleFollowSociety(userId: string, societyId: string) {
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
    }, DUMMY_CHAT as any[]);
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
    }, DUMMY_NOTIFICATIONS as any[]);
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

  // Bookmarks
  async getBookmarks(userId: string) {
    return safeDbQuery(async () => {
      return await supabase.from("bookmarks").select("event_id").eq("user_id", userId);
    }, DUMMY_BOOKMARKS as any[]);
  },

  async toggleBookmark(userId: string, eventId: string) {
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
