import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import { dbService, getAuthenticatedProfile, AuthenticatedProfile } from "./supabase";

const STORAGE_KEYS = {
  REGISTRATIONS: "numigos_student_registrations",
  BOOKMARKS: "numigos_student_bookmarks",
  FOLLOWED: "numigos_student_followed_clubs",
  PROFILE: "numigos_student_profile",
};

export type StudentProfile = AuthenticatedProfile;

// In-memory store for instantaneous reactive state across screens
class StudentStore {
  registeredEventIds: string[] = [];
  bookmarkedEventIds: string[] = [];
  followedSocietyIds: string[] = [];
  profile: StudentProfile | null = null;
  listeners: Array<() => void> = [];
  isInitialized = false;

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.warn("StudentStore listener error", err);
      }
    });
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      const [cachedRegs, cachedMarks, cachedFollows, cachedProf] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.REGISTRATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
        AsyncStorage.getItem(STORAGE_KEYS.FOLLOWED),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
      ]);

      if (cachedRegs) {
        try { this.registeredEventIds = JSON.parse(cachedRegs); } catch {}
      }
      if (cachedMarks) {
        try { this.bookmarkedEventIds = JSON.parse(cachedMarks); } catch {}
      }
      if (cachedFollows) {
        try { this.followedSocietyIds = JSON.parse(cachedFollows); } catch {}
      }
      if (cachedProf) {
        try { this.profile = JSON.parse(cachedProf); } catch {}
      }

      this.notify();

      // Background sync with Supabase authenticated profile
      const { profile: authProfile } = await getAuthenticatedProfile();
      if (authProfile) {
        this.profile = {
          ...authProfile,
        };
        await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.profile));

        // Sync bookmarks, registrations, and followed clubs from DB if user ID exists
        if (authProfile.id) {
          const [dbBookmarks, dbRegs, dbFollowed] = await Promise.all([
            dbService.getBookmarks(authProfile.id),
            dbService.getRegistrations(undefined, authProfile.id),
            dbService.getFollowedSocieties(authProfile.id),
          ]);

          if (dbBookmarks && Array.isArray(dbBookmarks)) {
            const ids = dbBookmarks.map((b: any) => b.event_id);
            this.bookmarkedEventIds = Array.from(new Set([...this.bookmarkedEventIds, ...ids]));
            await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(this.bookmarkedEventIds));
          }

          if (dbRegs && Array.isArray(dbRegs)) {
            const ids = dbRegs.map((r: any) => r.event_id);
            this.registeredEventIds = Array.from(new Set([...this.registeredEventIds, ...ids]));
            await AsyncStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(this.registeredEventIds));
          }

          if (dbFollowed && Array.isArray(dbFollowed)) {
            const ids = dbFollowed.map((f: any) => f.society_id);
            this.followedSocietyIds = Array.from(new Set([...this.followedSocietyIds, ...ids]));
            await AsyncStorage.setItem(STORAGE_KEYS.FOLLOWED, JSON.stringify(this.followedSocietyIds));
          }
        }

        this.notify();
      }
    } catch (err) {
      console.warn("StudentStore.init failed, continuing with cached state", err);
    }
  }

  async registerForEvent(
    eventId: string,
    details?: { userName?: string; userEmail?: string; rollNumber?: string; department?: string }
  ) {
    if (!this.registeredEventIds.includes(eventId)) {
      this.registeredEventIds = [...this.registeredEventIds, eventId];
      this.notify();
      await AsyncStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(this.registeredEventIds));

      // Asynchronously record in Supabase if user exists
      try {
        await dbService.registerForEvent({
          event_id: eventId,
          user_id: this.profile?.id || "guest-user",
          name: details?.userName || this.profile?.full_name || "Student",
          email: details?.userEmail || this.profile?.email || "",
          roll_number: details?.rollNumber || this.profile?.roll_number || "",
          department: details?.department || this.profile?.department || "",
        });
      } catch (e) {
        console.warn("Background dbService.registerForEvent error", e);
      }
    }
    return true;
  }

  async toggleBookmark(eventId: string) {
    const isBookmarked = this.bookmarkedEventIds.includes(eventId);
    if (isBookmarked) {
      this.bookmarkedEventIds = this.bookmarkedEventIds.filter((id) => id !== eventId);
    } else {
      this.bookmarkedEventIds = [...this.bookmarkedEventIds, eventId];
    }
    this.notify();
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(this.bookmarkedEventIds));

    if (this.profile?.id) {
      try {
        await dbService.toggleBookmark(eventId, this.profile.id);
      } catch (e) {
        console.warn("Background dbService.toggleBookmark error", e);
      }
    }
  }

  async toggleFollow(societyId: string) {
    const isFollowed = this.followedSocietyIds.includes(societyId);
    if (isFollowed) {
      this.followedSocietyIds = this.followedSocietyIds.filter((id) => id !== societyId);
    } else {
      this.followedSocietyIds = [...this.followedSocietyIds, societyId];
    }
    this.notify();
    await AsyncStorage.setItem(STORAGE_KEYS.FOLLOWED, JSON.stringify(this.followedSocietyIds));

    if (this.profile?.id) {
      try {
        await dbService.toggleFollowSociety(this.profile.id, societyId);
      } catch (e) {
        console.warn("Background dbService.toggleFollowSociety error", e);
      }
    }
  }

  isRegistered(eventId: string) {
    return this.registeredEventIds.includes(eventId);
  }

  isBookmarked(eventId: string) {
    return this.bookmarkedEventIds.includes(eventId);
  }

  isFollowed(societyId: string) {
    return this.followedSocietyIds.includes(societyId);
  }
}

export const studentStore = new StudentStore();

export function useStudentData() {
  const [, setTick] = useState(0);

  useEffect(() => {
    studentStore.init();
    const unsubscribe = studentStore.subscribe(() => setTick((t) => t + 1));
    return unsubscribe;
  }, []);

  return {
    profile: studentStore.profile,
    registeredEventIds: studentStore.registeredEventIds,
    bookmarkedEventIds: studentStore.bookmarkedEventIds,
    followedSocietyIds: studentStore.followedSocietyIds,
    registerForEvent: useCallback(
      (eventId: string, details?: { userName?: string; userEmail?: string; rollNumber?: string; department?: string }) =>
        studentStore.registerForEvent(eventId, details),
      []
    ),
    toggleBookmark: useCallback(
      (eventId: string) => studentStore.toggleBookmark(eventId),
      []
    ),
    toggleFollow: useCallback(
      (societyId: string) => studentStore.toggleFollow(societyId),
      []
    ),
    isRegistered: useCallback(
      (eventId: string) => studentStore.isRegistered(eventId),
      []
    ),
    isBookmarked: useCallback(
      (eventId: string) => studentStore.isBookmarked(eventId),
      []
    ),
    isFollowed: useCallback(
      (societyId: string) => studentStore.isFollowed(societyId),
      []
    ),
  };
}
