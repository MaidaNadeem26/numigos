export interface NutechSociety {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: "Technical" | "Creative" | "Community" | "Outdoor & Sports";
  categoryLabel: string;
  dept: string;
  membersCount: number;
  studentsLabel: string;
  eventsCount: number;
  sessionsLabel: string;
  roleInProfile?: string;
  badgeInProfile?: string;
  logo: string;
  banner: string;
  mission: string;
  leaders: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
}

export interface NutechEvent {
  id: string;
  title: string;
  shortTitle: string;
  societyId: string;
  societyName: string;
  category: "Hackathons" | "Workshops" | "Clubs" | "Cultural";
  categoryTag: string;
  badge: string;
  dateLabel: string;
  timeLabel: string;
  dateTimeFull: string;
  venue: string;
  wing: string;
  joinedLabel: string;
  deadlineText: string;
  urgent: boolean;
  image: string;
  clubLogo: string;
  description: string;
}

export const ENTREPRENEURSHIP_LOGO = require("@/assets/images/nutech-entrepreneurship-club.jpg");
export const ZINDIGI_PRIZE_IMAGE = require("@/assets/images/zindigi-prize-nutech.jpg");
export const IEEE_NUTECH_IMAGE = require("@/assets/images/ieee-nutech-recruitment.jpg");
export const AWS_BUILDER_IMAGE = require("@/assets/images/aws-student-builder-nutech.jpg");

export function resolveClubLogoSource(logo: string) {
  if (logo === "local:entrepreneurship") {
    return ENTREPRENEURSHIP_LOGO;
  }
  if (logo === "local:zindigi-prize") {
    return ZINDIGI_PRIZE_IMAGE;
  }
  if (logo === "local:ieee-nutech") {
    return IEEE_NUTECH_IMAGE;
  }
  if (logo === "local:aws-builder") {
    return AWS_BUILDER_IMAGE;
  }
  return { uri: logo };
}

export function resolveClubBannerSource(banner: string) {
  if (banner === "local:zindigi-prize") {
    return ZINDIGI_PRIZE_IMAGE;
  }
  if (banner === "local:ieee-nutech") {
    return IEEE_NUTECH_IMAGE;
  }
  if (banner === "local:aws-builder") {
    return AWS_BUILDER_IMAGE;
  }
  if (banner === "local:entrepreneurship") {
    return ENTREPRENEURSHIP_LOGO;
  }
  return { uri: banner };
}

export function isEventPassed(eventOrDate?: any): boolean {
  if (!eventOrDate) return false;
  const rawDate =
    typeof eventOrDate === "string"
      ? eventOrDate
      : eventOrDate.date || eventOrDate.date_time_full || eventOrDate.dateTimeFull;
  if (!rawDate || typeof rawDate !== "string") return false;

  try {
    const isoMatch = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const targetDate = new Date(year, month, day, 23, 59, 59, 999);
      return targetDate.getTime() < Date.now();
    }

    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.getTime() < Date.now();
    }
  } catch {
    return false;
  }
  return false;
}

export function mapDbEventToNutechEvent(ev: any): NutechEvent {
  if (!ev) {
    return {
      id: "",
      title: "Campus Event",
      shortTitle: "Campus Event",
      societyId: "",
      societyName: "NUTECH Society",
      category: "Hackathons",
      categoryTag: "EVENT",
      badge: "Upcoming",
      dateLabel: "TBA",
      timeLabel: "TBA",
      dateTimeFull: "TBA",
      venue: "NUTECH Campus",
      wing: "Main Campus",
      joinedLabel: "0 registered",
      deadlineText: "Open registration",
      urgent: false,
      image: "",
      clubLogo: "local:entrepreneurship",
      description: "",
    };
  }

  const societyId = ev.society_id || ev.societyId || "";
  const societyInfo = NUTECH_SOCIETIES[societyId];

  return {
    id: ev.id,
    title: ev.title || "Campus Event",
    shortTitle: ev.short_title || ev.shortTitle || ev.title || "Campus Event",
    societyId,
    societyName: ev.society_name || ev.societyName || societyInfo?.name || "NUTECH Society",
    category: (ev.category as any) || "Hackathons",
    categoryTag: (ev.category_tag || ev.categoryTag || ev.category || "EVENT").toUpperCase(),
    badge: ev.badge || (ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Upcoming"),
    dateLabel: ev.date_label || ev.dateLabel || (ev.date ? new Date(ev.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "TBA"),
    timeLabel: ev.time_label || ev.timeLabel || ev.time || "TBA",
    dateTimeFull: ev.date_time_full || ev.dateTimeFull || `${ev.date || ""} ${ev.time || ""}`,
    venue: ev.venue || "NUTECH Campus",
    wing: ev.wing || "Main Campus",
    joinedLabel: `${ev.registrations_count || ev.registered_count || 0} registered`,
    deadlineText: ev.deadline_text || ev.deadlineText || (ev.deadline ? `Deadline: ${new Date(ev.deadline).toLocaleDateString()}` : "Open registration"),
    urgent: Boolean(ev.urgent),
    image: ev.image || "",
    clubLogo: ev.club_logo || ev.clubLogo || societyInfo?.logo || "local:entrepreneurship",
    description: ev.description || "",
  };
}

export const NUTECH_SOCIETIES: Record<string, NutechSociety> = {
  "aws-student-builder-nutech": {
    id: "aws-student-builder-nutech",
    name: "AWS Student Builder Group NUTECH",
    shortName: "AWS Builder Group",
    tagline: "Join The Team Behind Our Campus Tech Community",
    category: "Technical",
    categoryLabel: "CLOUD & TECH COMMUNITY",
    dept: "CS, IT & Engineering · NUTECH",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Core Team Open",
    roleInProfile: "Core Team Applications Open",
    badgeInProfile: "Following",
    logo: "local:aws-builder",
    banner: "local:aws-builder",
    mission:
      "NUTECH’s most premium tech community! After flagship events and industry visits at NASTP and 10Pearls, AWS Student Builder Group NUTECH empowers students with AWS cloud credits, exam vouchers, hands-on workshops, and industry networking.",
    leaders: [],
  },
  "zindigi-prize-nutech": {
    id: "zindigi-prize-nutech",
    name: "Zindigi Prize NUTECH",
    shortName: "Zindigi Prize",
    tagline: "Build · Lead · Innovate · Entrepreneur (@zindigiprize_nutech)",
    category: "Community",
    categoryLabel: "SOCIAL ENTREPRENEURSHIP",
    dept: "Open for All NUTECH Departments",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "2026-27 Cohort",
    roleInProfile: "Core Team Recruitment 2026-27",
    badgeInProfile: "Following",
    logo: "local:zindigi-prize",
    banner: "local:zindigi-prize",
    mission:
      "Zindigi Prize is Pakistan's largest Entrepreneurship competition where NUTECH students turn their ideas into real startups. We organize workshops, speaker sessions, pitching competitions, and provide mentorship and funding opportunities to young entrepreneurs.",
    leaders: [],
  },
  "entrepreneurship-club": {
    id: "entrepreneurship-club",
    name: "NUTECH Entrepreneurship Club",
    shortName: "Entrepreneurship",
    tagline: "Entrepreneurship, Business, Innovation & Startups",
    category: "Community",
    categoryLabel: "ENTREPRENEURSHIP & STARTUPS",
    dept: "NUTECH Innovation Center & OSA",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    roleInProfile: "Following Club Updates",
    badgeInProfile: "Following",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "Interested in entrepreneurship, business, innovation, startups, and new ideas? Join the NUTECH Entrepreneurship Club and be part of a community where you can learn, work on projects, develop your ideas, and connect with industries, entrepreneurs, and professionals.",
    leaders: [],
  },
  "ieee-nutech": {
    id: "ieee-nutech",
    name: "IEEE Student Branch NUTECH",
    shortName: "IEEE NUTECH",
    tagline: "Technology · People · Impact | Build. Connect. Lead.",
    category: "Technical",
    categoryLabel: "TECHNOLOGY & ENGINEERING",
    dept: "Engineering, IT & NSDD Departments",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "2026-27 Tenure",
    roleInProfile: "2026-27 Recruitment Drive",
    badgeInProfile: "Following",
    logo: "local:ieee-nutech",
    banner: "local:ieee-nutech",
    mission:
      "Operating under NUTECH Electrical Engineering & Computer Science departments, the IEEE Student Branch organizes the flagship NUTECH IEEE Fest, hackathons, circuit design competitions, AI workshops, and technical quizzes.",
    leaders: [],
  },
  "media-publicity": {
    id: "media-publicity",
    name: "NUTECH Media & Publicity Society",
    shortName: "Media Society",
    tagline: "Campus Photography, Filmmaking & Digital Design",
    category: "Creative",
    categoryLabel: "MEDIA & DESIGN",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    roleInProfile: "Photography & Design Wing",
    badgeInProfile: "Member",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "The official creative voice of NUTECH Islamabad, covering university convocations, student festivals, digital media production, UI/UX design workshops, and campus photo walks.",
    leaders: [],
  },
  "fine-arts": {
    id: "fine-arts",
    name: "NUTECH Fine Arts & Creativity Club",
    shortName: "Fine Arts Club",
    tagline: "Calligraphy, Painting, Exhibitions & Campus Aesthetics",
    category: "Creative",
    categoryLabel: "ARTS & CULTURE",
    dept: "Directorate of Student Life (DSL)",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    roleInProfile: "Exhibition Coordinator",
    badgeInProfile: "Member",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "Nurturing artistic expression at NUTECH through annual fine arts exhibitions, Arabic calligraphy workshops, campus mural projects, and creative design competitions.",
    leaders: [],
  },
  "adventure-club": {
    id: "adventure-club",
    name: "NUTECH Adventure Club",
    shortName: "Adventure Club",
    tagline: "Trekking, Hiking, Northern Expeditions & Outdoor Leadership",
    category: "Outdoor & Sports",
    categoryLabel: "OUTDOOR & TREKKING",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    roleInProfile: "General Body Member",
    badgeInProfile: "Member",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "Organizing weekend Margalla Hills trail hikes, northern Pakistan study & adventure tours, camping nights, and physical endurance challenges for NUTECH students.",
    leaders: [],
  },
  "literary-debating": {
    id: "literary-debating",
    name: "NUTECH Literary & Debating Club",
    shortName: "Debating Club",
    tagline: "Parliamentary Debates, Declamations & Campus Chronicle",
    category: "Creative",
    categoryLabel: "LITERARY & DEBATE",
    dept: "Directorate of Student Life (DSL)",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "Fostering articulate leadership, English and Urdu declamation contests, Model United Nations delegations, and literary publications across NUTECH.",
    leaders: [],
  },
  "green-youth": {
    id: "green-youth",
    name: "PM's Green Youth Movement (GYM) Club",
    shortName: "Green Youth Club",
    tagline: "NUTECH Green Week, Sustainability & Climate Action",
    category: "Community",
    categoryLabel: "ENVIRONMENT & GREEN",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "Driving environmental stewardship at NUTECH through the flagship Green Week, campus tree plantation drives, eco-themed exhibitions, and clean-energy awareness campaigns.",
    leaders: [],
  },
  "community-service": {
    id: "community-service",
    name: "NUTECH Community Service Club",
    shortName: "Community Service",
    tagline: "Social Impact, SOS Village Visits & Welfare Drives",
    category: "Community",
    categoryLabel: "SOCIAL WELFARE",
    dept: "Directorate of Student Life (DSL)",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "Dedicated to community outreach, blood donation camps, SOS Children's Village visits, flood relief fundraisers, and civic volunteering across Islamabad and Rawalpindi.",
    leaders: [],
  },
  "nsc-nutech": {
    id: "nsc-nutech",
    name: "NUTECH Student Council (NSC)",
    shortName: "Student Council",
    tagline: "Apex Student Representative Body & Campus Governance",
    category: "Community",
    categoryLabel: "STUDENT COUNCIL",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 0,
    studentsLabel: "Active Club",
    eventsCount: 0,
    sessionsLabel: "Active Club",
    logo: "local:entrepreneurship",
    banner: "local:entrepreneurship",
    mission:
      "The apex student body at NUTECH representing student interests, coordinating inter-society festivals with the Student Facilitation Desk (SFD), and leading orientation week.",
    leaders: [],
  },
};

export const NUTECH_SOCIETIES_LIST: NutechSociety[] = Object.values(NUTECH_SOCIETIES);

export const NUTECH_EVENTS: Record<string, NutechEvent> = {};

export const NUTECH_EVENTS_LIST: NutechEvent[] = [];
