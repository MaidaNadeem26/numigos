import { useState, useEffect } from "react";
import { AWS_BUILDER_IMAGE, NUTECH_SOCIETIES, resolveClubLogoSource, resolveClubBannerSource } from "./nutech-data";

export interface SocietyAdminEvent {
  id: string;
  title: string;
  shortTitle: string;
  societyId: string;
  societyName: string;
  category: "Workshops" | "Hackathons" | "Clubs" | "Cultural";
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
  status: "Draft" | "Pending Approval" | "Approved" | "Rejected" | "Changes Requested" | "Completed" | "Cancelled";
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
  status: "Registered" | "Attended" | "Absent";
}

export interface SocietyTeamMember {
  id: string;
  name: string;
  rollNumber: string;
  role: string;
  group: "Leadership" | "Core Team" | "Member";
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
  type: "approval" | "registration" | "changes" | "team" | "reminder";
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
  role: "society_admin";
  managedSocietyId: string;
  avatar: string;
  phone: string;
}

export interface ManagedSocietyData {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: "Technical" | "Creative" | "Community" | "Outdoor & Sports";
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
  status: "Active & Approved by OSA";
  leaders: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
}

// Initial default state
const initialSociety: ManagedSocietyData = {
  id: "aws-student-builder-nutech",
  name: "AWS Student Builder Group NUTECH",
  shortName: "AWS Builder Group",
  tagline: "Join The Team Behind Our Campus Tech Community",
  category: "Technical",
  categoryLabel: "CLOUD & TECH COMMUNITY",
  dept: "CS, IT & Engineering · NUTECH",
  facultyAdvisor: "Dr. Kamran Malik (Associate Professor, CS Dept)",
  contactEmail: "aws.builder@nutech.edu.pk",
  instagram: "@awsnutech",
  meetingSchedule: "Every Thursday · 3:30 PM (CS Lab 2)",
  membersCount: 24,
  eventsCount: 4,
  logo: "local:aws-builder",
  banner: "local:aws-builder",
  status: "Active & Approved by OSA",
  mission:
    "NUTECH’s most premium tech community! After flagship events and industry visits at NASTP and 10Pearls, AWS Student Builder Group NUTECH empowers students with AWS cloud credits, exam vouchers, hands-on workshops, and industry networking.",
  leaders: [
    {
      name: "Hamza Malik",
      role: "President / Cloud Lead",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
    },
    {
      name: "Ayesha Tariq",
      role: "Vice President",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    },
    {
      name: "Bilal Farooq",
      role: "Technical Lead",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    },
  ],
};

const initialProfile: SocietyAdminProfile = {
  name: "Hamza Malik",
  email: "admin.aws@nutech.edu.pk",
  rollNumber: "2022-CS-088",
  department: "BS Computer Science",
  semester: "6th Semester",
  role: "society_admin",
  managedSocietyId: "aws-student-builder-nutech",
  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
  phone: "+92 300 1234567",
};

const initialEvents: SocietyAdminEvent[] = [
  {
    id: "event-aws-jam-25",
    title: "Cloud Study Jam: Serverless & Generative AI on AWS",
    shortTitle: "AWS Cloud Study Jam",
    societyId: "aws-student-builder-nutech",
    societyName: "AWS Student Builder Group NUTECH",
    category: "Workshops",
    categoryTag: "STUDY JAM",
    date: "2026-03-27",
    dateLabel: "Thu, Mar 27 · 2:00 PM",
    timeLabel: "2:00 – 5:00 PM",
    dateTimeFull: "Thursday, Mar 27 · 2:00 PM – 5:00 PM",
    venue: "Academic Block · CS Lab 3 (Level 2)",
    wing: "Academic Block",
    capacity: 150,
    registeredCount: 128,
    deadlineText: "Registration closes Tomorrow, 11:59 PM",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    clubLogo: "local:aws-builder",
    description:
      "Join the AWS Student Builder Group NUTECH for an intensive hands-on Cloud Study Jam. Learn AWS Lambda, Amazon Bedrock, and deploy serverless full-stack web applications. 50$ AWS credits provided to all attendees!",
    status: "Approved",
    submittedAt: "Mar 10, 2026",
  },
  {
    id: "event-aws-bootcamp-25",
    title: "AWS Cloud Practitioner Certification Bootcamp",
    shortTitle: "Cloud Practitioner Bootcamp",
    societyId: "aws-student-builder-nutech",
    societyName: "AWS Student Builder Group NUTECH",
    category: "Workshops",
    categoryTag: "CERTIFICATION",
    date: "2026-04-05",
    dateLabel: "Sat, Apr 05 · 10:00 AM",
    timeLabel: "10:00 AM – 3:30 PM",
    dateTimeFull: "Saturday, Apr 05 · 10:00 AM – 3:30 PM",
    venue: "NUTECH Main Auditorium",
    wing: "Admin Block",
    capacity: 200,
    registeredCount: 84,
    deadlineText: "Registration closes April 3",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    clubLogo: "local:aws-builder",
    description:
      "A comprehensive one-day accelerated bootcamp designed to prepare NUTECH students for the official AWS Certified Cloud Practitioner (CLF-C02) exam. Includes free exam preparation material and practice tests.",
    status: "Approved",
    submittedAt: "Mar 14, 2026",
  },
  {
    id: "event-aws-hackathon-25",
    title: "Campus Hackathon: Cloud Solutions for Smart Islamabad",
    shortTitle: "Smart Islamabad Hackathon",
    societyId: "aws-student-builder-nutech",
    societyName: "AWS Student Builder Group NUTECH",
    category: "Hackathons",
    categoryTag: "HACKATHON",
    date: "2026-04-19",
    dateLabel: "Sat, Apr 19 · 9:00 AM",
    timeLabel: "9:00 AM – 6:00 PM",
    dateTimeFull: "Saturday, Apr 19 · 9:00 AM – 6:00 PM",
    venue: "NUTECH Innovation Center & Central Lawn",
    wing: "Innovation Center",
    capacity: 120,
    registeredCount: 0,
    deadlineText: "Opens once approved by OSA",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    clubLogo: "local:aws-builder",
    description:
      "24-hour civic tech hackathon challenging student teams to build cloud-based IoT and AI solutions for traffic, waste management, and energy efficiency across Islamabad.",
    status: "Pending Approval",
    osaNotes: "Submitted to Office of Student Affairs on Mar 24. Awaiting safety & logistics clearance.",
    submittedAt: "Mar 24, 2026",
  },
  {
    id: "event-aws-industry-talk",
    title: "Microservices Architecture at Scale: NASTP Engineers Talk",
    shortTitle: "Microservices Tech Talk",
    societyId: "aws-student-builder-nutech",
    societyName: "AWS Student Builder Group NUTECH",
    category: "Workshops",
    categoryTag: "TECH TALK",
    date: "2026-05-07",
    dateLabel: "Wed, May 07 · 3:00 PM",
    timeLabel: "3:00 – 4:30 PM",
    dateTimeFull: "Wednesday, May 07 · 3:00 PM – 4:30 PM",
    venue: "Seminar Hall · Level 1",
    wing: "Academic Block",
    capacity: 100,
    registeredCount: 0,
    deadlineText: "Under revision",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
    clubLogo: "local:aws-builder",
    description:
      "Lead Architects from National Aerospace Science & Technology Park (NASTP) share real-world experiences designing fault-tolerant distributed cloud systems.",
    status: "Changes Requested",
    osaNotes: "OSA Request: Please shift timing to 4:00 PM to prevent overlap with EE Department Mid-term evaluations.",
    submittedAt: "Mar 18, 2026",
  },
  {
    id: "event-aws-foundations-past",
    title: "Intro to Cloud Foundations & AWS Academy Onboarding",
    shortTitle: "Cloud Foundations 101",
    societyId: "aws-student-builder-nutech",
    societyName: "AWS Student Builder Group NUTECH",
    category: "Workshops",
    categoryTag: "PAST EVENT",
    date: "2026-02-12",
    dateLabel: "Feb 12 · 2:00 PM",
    timeLabel: "2:00 – 4:00 PM",
    dateTimeFull: "Wednesday, Feb 12 · 2:00 PM – 4:00 PM",
    venue: "CS Lab 1",
    wing: "Academic Block",
    capacity: 100,
    registeredCount: 96,
    deadlineText: "Completed",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    clubLogo: "local:aws-builder",
    description: "Orientation session introducing NUTECH students to cloud computing and the AWS Academy curriculum.",
    status: "Completed",
    submittedAt: "Feb 01, 2026",
  },
];

const initialRegistrants: SocietyRegistrant[] = [
  {
    id: "reg-1",
    eventId: "event-aws-jam-25",
    name: "Muhammad Saad",
    rollNumber: "2023-CS-014",
    department: "BS Computer Science",
    semester: "4th Semester",
    email: "saad.m@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Yesterday · 4:12 PM",
    status: "Attended",
  },
  {
    id: "reg-2",
    eventId: "event-aws-jam-25",
    name: "Zainab Fatima",
    rollNumber: "2022-SE-052",
    department: "BS Software Engineering",
    semester: "6th Semester",
    email: "zainab.f@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Yesterday · 5:30 PM",
    status: "Registered",
  },
  {
    id: "reg-3",
    eventId: "event-aws-jam-25",
    name: "Ali Hassan",
    rollNumber: "2023-AI-019",
    department: "BS Artificial Intelligence",
    semester: "4th Semester",
    email: "ali.h@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 25 · 11:20 AM",
    status: "Registered",
  },
  {
    id: "reg-4",
    eventId: "event-aws-jam-25",
    name: "Hira Farooq",
    rollNumber: "2024-CS-108",
    department: "BS Computer Science",
    semester: "2nd Semester",
    email: "hira.f@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 25 · 01:15 PM",
    status: "Attended",
  },
  {
    id: "reg-5",
    eventId: "event-aws-jam-25",
    name: "Bilal Ahmad",
    rollNumber: "2022-CS-001",
    department: "BS Computer Science",
    semester: "6th Semester",
    email: "bilal.ahmad@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 24 · 06:40 PM",
    status: "Registered",
  },
  {
    id: "reg-6",
    eventId: "event-aws-jam-25",
    name: "Daniyal Qazi",
    rollNumber: "2023-EE-043",
    department: "BS Electrical Engineering",
    semester: "4th Semester",
    email: "daniyal.q@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 24 · 07:10 PM",
    status: "Absent",
  },
  {
    id: "reg-7",
    eventId: "event-aws-jam-25",
    name: "Areeba Siddiqui",
    rollNumber: "2024-CS-022",
    department: "BS Computer Science",
    semester: "2nd Semester",
    email: "areeba.s@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 23 · 02:00 PM",
    status: "Registered",
  },
  {
    id: "reg-8",
    eventId: "event-aws-jam-25",
    name: "Usman Tariq",
    rollNumber: "2022-ME-011",
    department: "BS Mechanical Engineering",
    semester: "6th Semester",
    email: "usman.t@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 23 · 04:30 PM",
    status: "Registered",
  },
  {
    id: "reg-9",
    eventId: "event-aws-bootcamp-25",
    name: "Farhan Saeed",
    rollNumber: "2023-CS-089",
    department: "BS Computer Science",
    semester: "4th Semester",
    email: "farhan.s@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 22 · 09:15 AM",
    status: "Registered",
  },
  {
    id: "reg-10",
    eventId: "event-aws-bootcamp-25",
    name: "Maryam Bibi",
    rollNumber: "2023-SE-031",
    department: "BS Software Engineering",
    semester: "4th Semester",
    email: "maryam.b@nutech.edu.pk",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
    registeredAt: "Mar 21 · 05:50 PM",
    status: "Registered",
  },
];

const initialMembers: SocietyTeamMember[] = [
  {
    id: "mem-1",
    name: "Hamza Malik",
    rollNumber: "2022-CS-088",
    role: "President",
    group: "Leadership",
    department: "BS Computer Science",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
    joinedDate: "Fall 2023",
    email: "admin.aws@nutech.edu.pk",
  },
  {
    id: "mem-2",
    name: "Ayesha Tariq",
    rollNumber: "2022-CS-034",
    role: "Vice President",
    group: "Leadership",
    department: "BS Computer Science",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    joinedDate: "Fall 2023",
    email: "ayesha.t@nutech.edu.pk",
  },
  {
    id: "mem-3",
    name: "Bilal Farooq",
    rollNumber: "2023-CS-015",
    role: "Technical Lead",
    group: "Core Team",
    department: "BS Computer Science",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    joinedDate: "Spring 2024",
    email: "bilal.f@nutech.edu.pk",
  },
  {
    id: "mem-4",
    name: "Zainab Noor",
    rollNumber: "2023-SE-044",
    role: "Media & Design Lead",
    group: "Core Team",
    department: "BS Software Engineering",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    joinedDate: "Spring 2024",
    email: "zainab.n@nutech.edu.pk",
  },
  {
    id: "mem-5",
    name: "Daniyal Khan",
    rollNumber: "2023-AI-027",
    role: "Events Coordinator",
    group: "Core Team",
    department: "BS Artificial Intelligence",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
    joinedDate: "Fall 2024",
    email: "daniyal.k@nutech.edu.pk",
  },
  {
    id: "mem-6",
    name: "Omar Sharif",
    rollNumber: "2024-CS-092",
    role: "Cloud Lab Assistant",
    group: "Member",
    department: "BS Computer Science",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    joinedDate: "Fall 2024",
    email: "omar.s@nutech.edu.pk",
  },
  {
    id: "mem-7",
    name: "Mahnoor Javaid",
    rollNumber: "2024-SE-019",
    role: "Publicity Officer",
    group: "Member",
    department: "BS Software Engineering",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80",
    joinedDate: "Spring 2025",
    email: "mahnoor.j@nutech.edu.pk",
  },
];

const initialChatMessages: SocietyChatMessage[] = [
  {
    id: "msg-1",
    senderId: "mem-2",
    senderName: "Ayesha Tariq",
    senderRole: "Vice President",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    text: "Hey everyone! OSA approved CS Lab 3 for Thursday’s Study Jam. Capacity is set to 150 students.",
    timestamp: "10:14 AM",
    isCurrentUser: false,
  },
  {
    id: "msg-2",
    senderId: "mem-3",
    senderName: "Bilal Farooq",
    senderRole: "Technical Lead",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    text: "Awesome. I’ve configured the AWS Academy sandbox accounts and verified all student IAM credits.",
    timestamp: "10:18 AM",
    isCurrentUser: false,
  },
  {
    id: "msg-3",
    senderId: "mem-4",
    senderName: "Zainab Noor",
    senderRole: "Media & Design Lead",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    text: "Standee banners and ID lanyards are printed. I’ll bring them to the SFD desk by 1:00 PM.",
    timestamp: "10:25 AM",
    isCurrentUser: false,
  },
  {
    id: "msg-4",
    senderId: "mem-1",
    senderName: "Hamza Malik",
    senderRole: "President",
    senderAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
    text: "Great work team. Registrations already crossed 128! Let’s meet at 1:30 PM sharp for quick setup.",
    timestamp: "10:30 AM",
    isCurrentUser: true,
  },
];

const initialNotifications: SocietyNotification[] = [
  {
    id: "notif-1",
    title: "Event Approved by OSA",
    message: "Cloud Study Jam: Serverless & Generative AI on AWS has been officially approved for CS Lab 3.",
    type: "approval",
    timestamp: "2 hours ago",
    read: false,
    targetRoute: "/society-admin/event/event-aws-jam-25",
  },
  {
    id: "notif-2",
    title: "Registration Milestone Reached",
    message: "128 students have registered for the Cloud Study Jam! (85% of total capacity).",
    type: "registration",
    timestamp: "5 hours ago",
    read: false,
    targetRoute: "/society-admin/registrants",
  },
  {
    id: "notif-3",
    title: "Changes Requested on NASTP Talk",
    message: "OSA requested a time shift for Microservices Architecture talk to 4:00 PM.",
    type: "changes",
    timestamp: "Yesterday",
    read: true,
    targetRoute: "/society-admin/event/event-aws-industry-talk",
  },
  {
    id: "notif-4",
    title: "New Team Member Onboarded",
    message: "Omar Sharif (2024-CS-092) was added to the Cloud Lab team.",
    type: "team",
    timestamp: "2 days ago",
    read: true,
    targetRoute: "/society-admin/members",
  },
];

// Reactive singleton store with subscription listeners
class SocietyAdminStore {
  society: ManagedSocietyData = initialSociety;
  profile: SocietyAdminProfile = initialProfile;
  events: SocietyAdminEvent[] = initialEvents;
  registrants: SocietyRegistrant[] = initialRegistrants;
  members: SocietyTeamMember[] = initialMembers;
  chatMessages: SocietyChatMessage[] = initialChatMessages;
  notifications: SocietyNotification[] = initialNotifications;
  draftEvent: any = null;
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach((fn) => fn());
  }

  updateSociety(fields: Partial<ManagedSocietyData>) {
    this.society = { ...this.society, ...fields };
    this.notify();
  }

  updateLogo(newLogo: string) {
    this.society = { ...this.society, logo: newLogo };
    this.notify();
  }

  createEvent(eventData: Omit<SocietyAdminEvent, "id" | "societyId" | "societyName" | "clubLogo" | "registeredCount" | "status" | "submittedAt">) {
    const newId = `event-aws-${Date.now()}`;
    const newEvent: SocietyAdminEvent = {
      ...eventData,
      id: newId,
      societyId: this.society.id,
      societyName: this.society.name,
      clubLogo: this.society.logo,
      registeredCount: 0,
      status: "Pending Approval",
      submittedAt: "Just now",
      osaNotes: "Submitted to NUTECH Office of Student Affairs for approval.",
    };
    this.events = [newEvent, ...this.events];
    this.society.eventsCount = this.events.length;
    // Add notification
    this.notifications = [
      {
        id: `notif-${Date.now()}`,
        title: "Event Submitted to OSA",
        message: `"${newEvent.title}" has been submitted for OSA review and is pending approval.`,
        type: "approval",
        timestamp: "Just now",
        read: false,
        targetRoute: `/society-admin/event/${newId}`,
      },
      ...this.notifications,
    ];
    this.notify();
    return newEvent;
  }

  updateEvent(eventId: string, fields: Partial<SocietyAdminEvent>) {
    this.events = this.events.map((ev) => (ev.id === eventId ? { ...ev, ...fields } : ev));
    this.notify();
  }

  cancelEvent(eventId: string) {
    this.events = this.events.map((ev) => (ev.id === eventId ? { ...ev, status: "Cancelled" as const } : ev));
    this.notify();
  }

  toggleAttendance(registrantId: string, status: "Registered" | "Attended" | "Absent") {
    this.registrants = this.registrants.map((r) => (r.id === registrantId ? { ...r, status } : r));
    this.notify();
  }

  addMember(member: Omit<SocietyTeamMember, "id" | "joinedDate">) {
    const newMember: SocietyTeamMember = {
      ...member,
      id: `mem-${Date.now()}`,
      joinedDate: "Spring 2026",
    };
    this.members = [...this.members, newMember];
    this.society.membersCount = this.members.length;
    this.notify();
    return newMember;
  }

  updateMemberRole(memberId: string, role: string, group: "Leadership" | "Core Team" | "Member") {
    this.members = this.members.map((m) => (m.id === memberId ? { ...m, role, group } : m));
    this.notify();
  }

  removeMember(memberId: string) {
    this.members = this.members.filter((m) => m.id !== memberId);
    this.society.membersCount = this.members.length;
    this.notify();
  }

  sendChatMessage(text: string) {
    const newMessage: SocietyChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: this.profile.rollNumber,
      senderName: this.profile.name,
      senderRole: "President",
      senderAvatar: this.profile.avatar,
      text,
      timestamp: "Just now",
      isCurrentUser: true,
    };
    this.chatMessages = [...this.chatMessages, newMessage];
    this.notify();
  }

  markNotificationRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.notify();
  }

  setDraftEvent(draft: any) {
    this.draftEvent = draft;
    this.notify();
  }

  markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notify();
  }
}

export const societyAdminStore = new SocietyAdminStore();

export function useSocietyAdminData() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return societyAdminStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });
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
    setDraftEvent: (draft: any) => societyAdminStore.setDraftEvent(draft),
    updateSociety: (fields: Partial<ManagedSocietyData>) => societyAdminStore.updateSociety(fields),
    updateLogo: (logo: string) => societyAdminStore.updateLogo(logo),
    createEvent: (data: any) => societyAdminStore.createEvent(data),
    updateEvent: (id: string, fields: Partial<SocietyAdminEvent>) => societyAdminStore.updateEvent(id, fields),
    cancelEvent: (id: string) => societyAdminStore.cancelEvent(id),
    toggleAttendance: (id: string, status: "Registered" | "Attended" | "Absent") => societyAdminStore.toggleAttendance(id, status),
    addMember: (data: any) => societyAdminStore.addMember(data),
    updateMemberRole: (id: string, role: string, group: any) => societyAdminStore.updateMemberRole(id, role, group),
    removeMember: (id: string) => societyAdminStore.removeMember(id),
    sendChatMessage: (text: string) => societyAdminStore.sendChatMessage(text),
    markNotificationRead: (id: string) => societyAdminStore.markNotificationRead(id),
    markAllNotificationsRead: () => societyAdminStore.markAllNotificationsRead(),
  };
}
