import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dbService, getAuthenticatedProfile } from './supabase';
import { resolveClubLogoSource, resolveClubBannerSource } from './nutech-data';

export interface SocietyAdminEvent {
  id: string;
  title: string;
  shortTitle: string;
  societyId: string;
  societyName: string;
  category: 'Workshops' | 'Hackathons' | 'Clubs' | 'Cultural';
  categoryTag: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  dateTimeFull: string;
  venue: string;
  wing: string;
  capacity: number;
  registeredCount: number;
  deadlineText: string;
  image: string;
  clubLogo: string;
  description: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Changes Requested' | 'Completed' | 'Cancelled';
  osaNotes?: string;
  submittedAt: string;
}

export interface SocietyRegistrant {
  id: string;
  eventId: string;
  name: string;
  rollNumber: string;
  department: string;
  semester: string;
  email: string;
  avatar: string;
  registeredAt: string;
  status: 'Registered' | 'Attended' | 'Absent';
}

export interface SocietyTeamMember {
  id: string;
  name: string;
  rollNumber: string;
  role: string;
  group: 'Leadership' | 'Core Team' | 'Member';
  department: string;
  avatar: string;
  joinedDate: string;
  email: string;
}

export interface SocietyChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface SocietyNotification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'registration' | 'changes' | 'team' | 'reminder';
  timestamp: string;
  read: boolean;
  targetRoute?: string;
}

export interface SocietyAdminProfile {
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
  role: 'society_admin';
  managedSocietyId: string;
  avatar: string;
  phone: string;
}

export interface ManagedSocietyData {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: 'Technical' | 'Creative' | 'Community' | 'Outdoor & Sports';
  categoryLabel: string;
  dept: string;
  facultyAdvisor: string;
  contactEmail: string;
  instagram: string;
  meetingSchedule: string;
  membersCount: number;
  eventsCount: number;
  logo: string;
  banner: string;
  mission: string;
  status: 'Active & Approved by OSA';
  leaders: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
}

export const defaultAdminEvent: SocietyAdminEvent = {
  id: 'nutech-hackathon-2026',
  title: 'NUTECH National Hackathon 2026',
  shortTitle: 'National Hackathon',
  societyId: 'aws-student-builder-nutech',
  societyName: 'AWS Student Builder Group NUTECH',
  category: 'Hackathons',
  categoryTag: 'FLAGSHIP HACKATHON',
  date: '2026-10-15',
  dateLabel: 'Thu, Oct 15',
  timeLabel: '09:00 AM - 05:00 PM',
  dateTimeFull: 'Thu, Oct 15, 2026 · 09:00 AM',
  venue: 'Main Auditorium, NUTECH Islamabad',
  wing: 'Main Academic Complex',
  capacity: 150,
  registeredCount: 1,
  deadlineText: 'Registration Closes Oct 12',
  image: 'local:aws-builder',
  clubLogo: 'local:aws-builder',
  description:
    'Join the premier annual 24-hour coding, AI and cloud innovation hackathon organized by AWS Student Builder Group NUTECH. Compete with top student innovators, solve industry challenges, and win cash prizes, AWS credits, and official certificates.',
  status: 'Approved',
  osaNotes: 'Approved by Directorate of Student Life (DSL) & OSA. Auditorium reserved.',
  submittedAt: 'Oct 01, 2026',
};

export const defaultAdminRegistrant: SocietyRegistrant = {
  id: 'reg-001',
  eventId: 'nutech-hackathon-2026',
  name: 'Muhammad Ahmad',
  rollNumber: 'F22-BSE-042',
  department: 'Software Engineering',
  semester: '6th Semester',
  email: 'ahmad.se@nutech.edu.pk',
  avatar: '',
  registeredAt: 'Oct 02, 2026 · 10:15 AM',
  status: 'Registered',
};

export const defaultAdminMember: SocietyTeamMember = {
  id: 'mem-001',
  name: 'Fatima Noor',
  rollNumber: 'F21-BCE-018',
  role: 'Vice President & Cloud Lead',
  group: 'Leadership',
  department: 'Computer Engineering',
  avatar: '',
  joinedDate: 'Fall 2025',
  email: 'fatima.noor@nutech.edu.pk',
};

export const defaultAdminChatMessage: SocietyChatMessage = {
  id: 'chat-001',
  senderId: 'osa-coordinator',
  senderName: 'Engr. Tariq Mehmood (OSA Advisor)',
  senderRole: 'Faculty & OSA Coordinator',
  senderAvatar: '',
  text: 'Welcome to Numigos! The proposal for NUTECH National Hackathon 2026 has been approved by the Directorate of Student Life. Let us know if you need any logistics or auditorium equipment.',
  timestamp: '10:30 AM',
  isCurrentUser: false,
};

export const defaultAdminNotification: SocietyNotification = {
  id: 'notif-admin-001',
  title: 'Event Proposal Approved',
  message: "OSA has approved 'NUTECH National Hackathon 2026'. Your event is now live for all campus students.",
  type: 'approval',
  timestamp: 'Oct 02, 2026',
  read: false,
  targetRoute: '/society-admin/events',
};

const initialSociety: ManagedSocietyData = {
  id: 'aws-student-builder-nutech',
  name: 'AWS Student Builder Group NUTECH',
  shortName: 'AWS Builder Group',
  tagline: 'Official Society Management Portal',
  category: 'Technical',
  categoryLabel: 'CLOUD & TECH COMMUNITY',
  dept: 'CS, IT & Engineering · NUTECH',
  facultyAdvisor: 'Engr. Tariq Mehmood',
  contactEmail: 'aws.builder@nutech.edu.pk',
  instagram: '@awsnutech',
  meetingSchedule: 'Wednesdays at 03:30 PM (CS Lab 2)',
  membersCount: 1,
  eventsCount: 1,
  logo: 'local:aws-builder',
  banner: 'local:aws-builder',
  status: 'Active & Approved by OSA',
  mission: 'Official Student Society at NUTECH Islamabad empowering students with AWS cloud credits, exam vouchers, hands-on workshops, and industry networking.',
  leaders: [
    {
      name: 'Fatima Noor',
      role: 'Vice President & Cloud Lead',
      avatar: '',
    },
  ],
};

const initialProfile: SocietyAdminProfile = {
  name: '',
  email: '',
  rollNumber: '',
  department: '',
  semester: '',
  role: 'society_admin',
  managedSocietyId: 'aws-student-builder-nutech',
  avatar: '',
  phone: '',
};

const STORAGE_KEYS = {
  SOCIETY: 'numigos_admin_society',
  PROFILE: 'numigos_admin_profile',
  EVENTS: 'numigos_admin_events',
  REGISTRANTS: 'numigos_admin_registrants',
  MEMBERS: 'numigos_admin_members',
  CHAT: 'numigos_admin_chat',
  NOTIFS: 'numigos_admin_notifs',
};

class SocietyAdminStore {
  society: ManagedSocietyData = initialSociety;
  profile: SocietyAdminProfile = initialProfile;
  events: SocietyAdminEvent[] = [defaultAdminEvent];
  registrants: SocietyRegistrant[] = [defaultAdminRegistrant];
  members: SocietyTeamMember[] = [defaultAdminMember];
  chatMessages: SocietyChatMessage[] = [defaultAdminChatMessage];
  notifications: SocietyNotification[] = [defaultAdminNotification];
  draftEvent: any = null;
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    this.initStore();
  }

  private async initStore() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const [savedSociety, savedProfile, savedEvents, savedRegs, savedMems, savedChat, savedNotifs] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SOCIETY),
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.EVENTS),
        AsyncStorage.getItem(STORAGE_KEYS.REGISTRANTS),
        AsyncStorage.getItem(STORAGE_KEYS.MEMBERS),
        AsyncStorage.getItem(STORAGE_KEYS.CHAT),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFS),
      ]);

      if (savedSociety) { try { this.society = JSON.parse(savedSociety); } catch {} }
      if (savedProfile) { try { this.profile = JSON.parse(savedProfile); } catch {} }
      if (savedEvents) { try { const parsed = JSON.parse(savedEvents); if (Array.isArray(parsed) && parsed.length > 0) this.events = parsed; } catch {} }
      if (savedRegs) { try { const parsed = JSON.parse(savedRegs); if (Array.isArray(parsed) && parsed.length > 0) this.registrants = parsed; } catch {} }
      if (savedMems) { try { const parsed = JSON.parse(savedMems); if (Array.isArray(parsed) && parsed.length > 0) this.members = parsed; } catch {} }
      if (savedChat) { try { const parsed = JSON.parse(savedChat); if (Array.isArray(parsed) && parsed.length > 0) this.chatMessages = parsed; } catch {} }
      if (savedNotifs) { try { const parsed = JSON.parse(savedNotifs); if (Array.isArray(parsed) && parsed.length > 0) this.notifications = parsed; } catch {} }
      this.notify();
    } catch {
      // Keep defaults
    }

    this.syncFromSupabase();
  }

  private async syncFromSupabase() {
    try {
      const { profile: authProfile } = await getAuthenticatedProfile();
      if (authProfile) {
        this.profile = {
          ...this.profile,
          name: authProfile.full_name || this.profile.name,
          email: authProfile.email || this.profile.email,
          rollNumber: authProfile.roll_number || this.profile.rollNumber,
          department: authProfile.department || this.profile.department,
          semester: authProfile.semester || this.profile.semester,
          phone: authProfile.phone || this.profile.phone,
          managedSocietyId: authProfile.managed_society_id || this.profile.managedSocietyId,
        };
      }

      const societyId = this.profile.managedSocietyId || this.society.id;

      const [dbSocieties, dbEvents, dbMembers, dbRegs, dbChat, dbNotifs] = await Promise.all([
        dbService.getSocieties(),
        dbService.getEvents(societyId),
        dbService.getSocietyMembers(societyId),
        dbService.getRegistrations(),
        dbService.getChatMessages(societyId),
        dbService.getNotifications(societyId),
      ]);

      if (dbSocieties && Array.isArray(dbSocieties) && dbSocieties.length > 0) {
        const found = dbSocieties.find((s: any) => s.id === societyId) || dbSocieties[0];
        if (found) {
          this.society = {
            ...this.society,
            id: found.id,
            name: found.name || this.society.name,
            shortName: found.short_name || this.society.shortName,
            tagline: found.tagline || this.society.tagline,
            facultyAdvisor: found.faculty_advisor || this.society.facultyAdvisor,
            contactEmail: found.contact_email || this.society.contactEmail,
            instagram: found.instagram || this.society.instagram,
            meetingSchedule: found.meeting_schedule || this.society.meetingSchedule,
            mission: found.mission || this.society.mission,
            logo: found.logo || this.society.logo,
            banner: found.banner || this.society.banner,
          };
        }
      }

      if (dbEvents !== null && Array.isArray(dbEvents) && dbEvents.length > 0) {
        this.events = dbEvents.map((e: any) => ({
          id: e.id,
          title: e.title,
          shortTitle: e.short_title || e.title,
          societyId: e.society_id,
          societyName: e.society_name || this.society.name,
          category: e.category,
          categoryTag: e.category_tag || e.category,
          date: e.date,
          dateLabel: e.date_label || e.date,
          timeLabel: e.time_label || '',
          dateTimeFull: e.date_time_full || e.date,
          venue: e.venue,
          wing: e.wing || 'Academic Block',
          capacity: e.capacity || 100,
          registeredCount: e.registered_count || 0,
          deadlineText: e.deadline_text || '',
          image: e.image || this.society.banner,
          clubLogo: e.club_logo || this.society.logo,
          description: e.description || '',
          status: e.status || 'Approved',
          osaNotes: e.osa_notes,
          submittedAt: e.submitted_at || 'Recently',
        }));
        this.society.eventsCount = this.events.length;
      }

      if (dbMembers !== null && Array.isArray(dbMembers) && dbMembers.length > 0) {
        this.members = dbMembers.map((m: any) => ({
          id: m.id,
          name: m.name,
          rollNumber: m.roll_number,
          role: m.role,
          group: m.group_name || 'Member',
          department: m.department || 'NUTECH',
          avatar: m.avatar || '',
          joinedDate: m.joined_date || '',
          email: m.email || '',
        }));
        this.society.membersCount = this.members.length;
      }

      if (dbRegs !== null && Array.isArray(dbRegs) && dbRegs.length > 0) {
        this.registrants = dbRegs.map((r: any) => ({
          id: r.id,
          eventId: r.event_id,
          name: r.user_name || 'Student',
          rollNumber: r.roll_number || '',
          department: r.department || '',
          semester: r.semester || '',
          email: r.user_email || '',
          avatar: r.avatar || '',
          registeredAt: r.created_at || 'Recently',
          status: r.status || 'Registered',
        }));
      }

      if (dbChat !== null && Array.isArray(dbChat) && dbChat.length > 0) {
        this.chatMessages = dbChat.map((c: any) => ({
          id: c.id,
          senderId: c.sender_id,
          senderName: c.sender_name,
          senderRole: c.sender_role,
          senderAvatar: c.sender_avatar || '',
          text: c.text,
          timestamp: c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          isCurrentUser: c.sender_id === authProfile?.id,
        }));
      }

      if (dbNotifs !== null && Array.isArray(dbNotifs) && dbNotifs.length > 0) {
        this.notifications = dbNotifs.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'approval',
          timestamp: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recently',
          read: n.read ?? false,
          targetRoute: n.target_route,
        }));
      }

      this.persistAll();
      this.notify();
    } catch {
      // Graceful rehydration fallback
    }
  }

  private persistAll() {
    try {
      void AsyncStorage.setItem(STORAGE_KEYS.SOCIETY, JSON.stringify(this.society));
      void AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.profile));
      void AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
      void AsyncStorage.setItem(STORAGE_KEYS.REGISTRANTS, JSON.stringify(this.registrants));
      void AsyncStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(this.members));
      void AsyncStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(this.chatMessages));
      void AsyncStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(this.notifications));
    } catch {
      // Ignore storage errors
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.warn('SocietyAdminStore listener error', e);
      }
    });
  }

  getStats() {
    const upcoming = this.events.filter((e) => e.status === 'Approved').length;
    const totalEvents = this.events.length;
    const registrations = this.events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
    const members = this.members.length;
    const attendedCount = this.registrants.filter((r) => r.status === 'Attended').length;
    const attendance = this.registrants.length > 0 ? Math.round((attendedCount / this.registrants.length) * 100) : 0;

    return {
      upcoming,
      totalEvents,
      registrations,
      members,
      attendance,
    };
  }

  setDraftEvent(draft: any) {
    this.draftEvent = draft;
  }

  createEvent(draft: Partial<SocietyAdminEvent>) {
    const newEvent: SocietyAdminEvent = {
      id: 'event-' + Date.now(),
      title: draft.title || 'Untitled Event',
      shortTitle: draft.shortTitle || draft.title || 'Untitled',
      societyId: this.society.id,
      societyName: this.society.name,
      category: draft.category || 'Workshops',
      categoryTag: draft.categoryTag || (draft.category || 'WORKSHOPS').toUpperCase(),
      date: draft.date || 'TBD',
      dateLabel: draft.dateLabel || draft.date || 'TBD',
      timeLabel: draft.timeLabel || '',
      dateTimeFull: draft.dateTimeFull || draft.date || 'TBD',
      venue: draft.venue || 'Academic Block',
      wing: draft.wing || 'Academic Block',
      capacity: draft.capacity || 100,
      registeredCount: 0,
      deadlineText: draft.deadlineText || '',
      image: draft.image || this.society.banner,
      clubLogo: this.society.logo,
      description: draft.description || '',
      status: 'Pending Approval',
      submittedAt: 'Just now',
    };

    this.events = [newEvent, ...this.events];
    this.society.eventsCount = this.events.length;
    this.persistAll();
    this.notify();

    // Background write to Supabase
    dbService.createEvent({
      id: newEvent.id,
      society_id: newEvent.societyId,
      society_name: newEvent.societyName,
      title: newEvent.title,
      short_title: newEvent.shortTitle,
      category: newEvent.category,
      category_tag: newEvent.categoryTag,
      date: newEvent.date,
      date_label: newEvent.dateLabel,
      time_label: newEvent.timeLabel,
      date_time_full: newEvent.dateTimeFull,
      venue: newEvent.venue,
      wing: newEvent.wing,
      capacity: newEvent.capacity,
      registered_count: 0,
      deadline_text: newEvent.deadlineText,
      image: newEvent.image,
      club_logo: newEvent.clubLogo,
      description: newEvent.description,
      status: 'Pending Approval',
    }).catch((err) => console.warn('Background dbService.createEvent error', err));

    return newEvent;
  }

  updateEvent(eventId: string, updates: Partial<SocietyAdminEvent>) {
    this.events = this.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e));
    this.persistAll();
    this.notify();

    dbService.updateEvent(eventId, {
      title: updates.title,
      description: updates.description,
      venue: updates.venue,
      capacity: updates.capacity,
      image: updates.image,
      status: updates.status,
    }).catch((err) => console.warn('Background dbService.updateEvent error', err));
  }

  cancelEvent(eventId: string) {
    this.events = this.events.map((e) =>
      e.id === eventId ? { ...e, status: 'Cancelled' as const } : e
    );
    this.persistAll();
    this.notify();

    dbService.updateEvent(eventId, { status: 'Cancelled' }).catch((err) =>
      console.warn('Background dbService.cancelEvent error', err)
    );
  }

  toggleAttendance(registrantId: string, status?: SocietyRegistrant['status']) {
    this.registrants = this.registrants.map((r) => {
      if (r.id === registrantId) {
        const nextStatus: SocietyRegistrant['status'] =
          status || (r.status === 'Registered' ? 'Attended' : r.status === 'Attended' ? 'Absent' : 'Registered');
        
        dbService.updateAttendance(registrantId, nextStatus).catch((err) =>
          console.warn('Background dbService.updateAttendance error', err)
        );

        return { ...r, status: nextStatus };
      }
      return r;
    });
    this.persistAll();
    this.notify();
  }

  addMember(memberData: {
    name: string;
    rollNumber: string;
    role: string;
    group: 'Leadership' | 'Core Team' | 'Member';
    department: string;
    email: string;
    avatar: string;
  }) {
    const newMember: SocietyTeamMember = {
      id: 'mem-' + Date.now(),
      name: memberData.name,
      rollNumber: memberData.rollNumber,
      role: memberData.role,
      group: memberData.group,
      department: memberData.department,
      avatar: memberData.avatar,
      joinedDate: 'Spring 2026',
      email: memberData.email,
    };

    this.members = [...this.members, newMember];
    this.society.membersCount = this.members.length;
    this.persistAll();
    this.notify();

    dbService.addSocietyMember({
      id: newMember.id,
      society_id: this.society.id,
      name: newMember.name,
      roll_number: newMember.rollNumber,
      role: newMember.role,
      group_name: newMember.group,
      department: newMember.department,
      avatar: newMember.avatar,
      email: newMember.email,
    }).catch((err) => console.warn('Background dbService.addSocietyMember error', err));

    return newMember;
  }

  updateMemberRole(memberId: string, role: string, group: 'Leadership' | 'Core Team' | 'Member') {
    this.members = this.members.map((m) =>
      m.id === memberId ? { ...m, role, group } : m
    );
    this.persistAll();
    this.notify();

    dbService.updateSocietyMember(memberId, { role, group_name: group }).catch((err) =>
      console.warn('Background dbService.updateSocietyMember error', err)
    );
  }

  removeMember(memberId: string) {
    this.members = this.members.filter((m) => m.id !== memberId);
    this.society.membersCount = this.members.length;
    this.persistAll();
    this.notify();

    dbService.removeSocietyMember(memberId).catch((err) =>
      console.warn('Background dbService.removeSocietyMember error', err)
    );
  }

  sendChatMessage(text: string) {
    const newMsg: SocietyChatMessage = {
      id: 'msg-' + Date.now(),
      senderId: this.profile.email || 'current-user',
      senderName: this.profile.name || 'You',
      senderRole: 'Society Admin',
      senderAvatar: this.profile.avatar || '',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };

    this.chatMessages = [...this.chatMessages, newMsg];
    this.persistAll();
    this.notify();

    dbService.sendChatMessage({
      society_id: this.society.id,
      sender_id: newMsg.senderId,
      sender_name: newMsg.senderName,
      sender_role: newMsg.senderRole,
      sender_avatar: newMsg.senderAvatar,
      text: newMsg.text,
    }).catch((err) => console.warn('Background dbService.sendChatMessage error', err));

    return newMsg;
  }

  markNotificationRead(notifId: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === notifId ? { ...n, read: true } : n
    );
    this.persistAll();
    this.notify();

    dbService.markNotificationRead(notifId).catch((err) =>
      console.warn('Background dbService.markNotificationRead error', err)
    );
  }

  markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.persistAll();
    this.notify();
  }

  clearNotifications() {
    this.notifications = [];
    this.persistAll();
    this.notify();

    dbService.clearNotifications(this.society.id).catch((err) =>
      console.warn('Background dbService.clearNotifications error', err)
    );
  }

  updateProfile(updates: Partial<SocietyAdminProfile>) {
    this.profile = { ...this.profile, ...updates };
    this.persistAll();
    this.notify();

    getAuthenticatedProfile().then(({ profile: p }) => {
      if (p?.id) {
        dbService.updateProfile(p.id, {
          full_name: updates.name,
          phone: updates.phone,
          semester: updates.semester,
        }).catch((err) => console.warn('Background dbService.updateProfile error', err));
      }
    });
  }

  updateSociety(updates: Partial<ManagedSocietyData>) {
    this.society = { ...this.society, ...updates };
    this.persistAll();
    this.notify();

    dbService.updateSociety(this.society.id, {
      tagline: updates.tagline,
      mission: updates.mission,
      faculty_advisor: updates.facultyAdvisor,
      contact_email: updates.contactEmail,
      instagram: updates.instagram,
      meeting_schedule: updates.meetingSchedule,
    }).catch((err) => console.warn('Background dbService.updateSociety error', err));
  }

  updateLogo(logoVal: string) {
    this.society = { ...this.society, logo: logoVal };
    this.persistAll();
    this.notify();

    dbService.updateSociety(this.society.id, { logo: logoVal }).catch((err) =>
      console.warn('Background dbService.updateSociety logo error', err)
    );
  }
}

export const societyAdminStore = new SocietyAdminStore();

export function useSocietyAdminData() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = societyAdminStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    society: societyAdminStore.society,
    profile: societyAdminStore.profile,
    events: societyAdminStore.events,
    registrants: societyAdminStore.registrants,
    members: societyAdminStore.members,
    chatMessages: societyAdminStore.chatMessages,
    notifications: societyAdminStore.notifications,
    unreadNotificationsCount: societyAdminStore.notifications.filter((n) => !n.read).length,
    draftEvent: societyAdminStore.draftEvent,
    stats: societyAdminStore.getStats(),
    setDraftEvent: useCallback((draft: any) => societyAdminStore.setDraftEvent(draft), []),
    createEvent: useCallback((draft: any) => societyAdminStore.createEvent(draft), []),
    updateEvent: useCallback((id: string, updates: any) => societyAdminStore.updateEvent(id, updates), []),
    cancelEvent: useCallback((id: string) => societyAdminStore.cancelEvent(id), []),
    toggleAttendance: useCallback((id: string, status?: any) => societyAdminStore.toggleAttendance(id, status), []),
    addMember: useCallback((member: any) => societyAdminStore.addMember(member), []),
    updateMemberRole: useCallback((id: string, role: string, group: any) => societyAdminStore.updateMemberRole(id, role, group), []),
    removeMember: useCallback((id: string) => societyAdminStore.removeMember(id), []),
    sendChatMessage: useCallback((text: string) => societyAdminStore.sendChatMessage(text), []),
    markNotificationRead: useCallback((id: string) => societyAdminStore.markNotificationRead(id), []),
    markAllNotificationsRead: useCallback(() => societyAdminStore.markAllNotificationsRead(), []),
    clearNotifications: useCallback(() => societyAdminStore.clearNotifications(), []),
    updateProfile: useCallback((updates: any) => societyAdminStore.updateProfile(updates), []),
    updateSociety: useCallback((updates: any) => societyAdminStore.updateSociety(updates), []),
    updateLogo: useCallback((logo: string) => societyAdminStore.updateLogo(logo), []),
  };
}
