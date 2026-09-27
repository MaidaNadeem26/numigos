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

export const NUTECH_SOCIETIES: Record<string, NutechSociety> = {
  "aws-student-builder-nutech": {
    id: "aws-student-builder-nutech",
    name: "AWS Student Builder Group NUTECH",
    shortName: "AWS Builder Group",
    tagline: "Join The Team Behind Our Campus Tech Community",
    category: "Technical",
    categoryLabel: "CLOUD & TECH COMMUNITY",
    dept: "CS, IT & Engineering · NUTECH",
    membersCount: 390,
    studentsLabel: "390 Followers",
    eventsCount: 3,
    sessionsLabel: "Core Team Open",
    roleInProfile: "Core Team Applications Open",
    badgeInProfile: "Following",
    logo: "local:aws-builder",
    banner: "local:aws-builder",
    mission:
      "NUTECH’s most premium tech community! After flagship events and industry visits at NASTP and 10Pearls, AWS Student Builder Group NUTECH empowers students with AWS cloud credits, exam vouchers, hands-on workshops, and industry networking.",
    leaders: [
      {
        name: "Cloud Captain",
        role: "AWS Builder Lead",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Technical Lead",
        role: "Cloud & AI Track",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Community Lead",
        role: "Industry & Events",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "zindigi-prize-nutech": {
    id: "zindigi-prize-nutech",
    name: "Zindigi Prize NUTECH",
    shortName: "Zindigi Prize",
    tagline: "Build · Lead · Innovate · Entrepreneur (@zindigiprize_nutech)",
    category: "Community",
    categoryLabel: "SOCIAL ENTREPRENEURSHIP",
    dept: "Open for All NUTECH Departments",
    membersCount: 380,
    studentsLabel: "380 Followers",
    eventsCount: 3,
    sessionsLabel: "2026-27 Cohort",
    roleInProfile: "Core Team Recruitment 2026-27",
    badgeInProfile: "Following",
    logo: "local:zindigi-prize",
    banner: "local:zindigi-prize",
    mission:
      "Zindigi Prize is Pakistan's largest Entrepreneurship competition where NUTECH students turn their ideas into real startups. We organize workshops, speaker sessions, pitching competitions, and provide mentorship and funding opportunities to young entrepreneurs.",
    leaders: [
      {
        name: "Campus Director",
        role: "Zindigi Prize NUTECH",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Operations & PR",
        role: "Core Team Lead",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Media & Design",
        role: "Directorate Lead",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "entrepreneurship-club": {
    id: "entrepreneurship-club",
    name: "NUTECH Entrepreneurship Club",
    shortName: "Entrepreneurship",
    tagline: "Entrepreneurship, Business, Innovation & Startups",
    category: "Community",
    categoryLabel: "ENTREPRENEURSHIP & STARTUPS",
    dept: "NUTECH Innovation Center & OSA",
    membersCount: 320,
    studentsLabel: "320 Followers",
    eventsCount: 2,
    sessionsLabel: "Active Club",
    roleInProfile: "Following Club Updates",
    badgeInProfile: "Following",
    logo: "local:entrepreneurship",
    banner: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    mission:
      "Interested in entrepreneurship, business, innovation, startups, and new ideas? Join the NUTECH Entrepreneurship Club and be part of a community where you can learn, work on projects, develop your ideas, and connect with industries, entrepreneurs, and professionals.",
    leaders: [
      {
        name: "Huzaifa Khan",
        role: "Club Lead",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Core Team",
        role: "Management & Outreach",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Media Wing",
        role: "Media & Publicity",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "ieee-nutech": {
    id: "ieee-nutech",
    name: "IEEE Student Branch NUTECH",
    shortName: "IEEE NUTECH",
    tagline: "Technology · People · Impact | Build. Connect. Lead.",
    category: "Technical",
    categoryLabel: "TECHNOLOGY & ENGINEERING",
    dept: "Engineering, IT & NSDD Departments",
    membersCount: 420,
    studentsLabel: "420 Followers",
    eventsCount: 4,
    sessionsLabel: "2026-27 Tenure",
    roleInProfile: "2026-27 Recruitment Drive",
    badgeInProfile: "Following",
    logo: "local:ieee-nutech",
    banner: "local:ieee-nutech",
    mission:
      "Operating under NUTECH Electrical Engineering & Computer Science departments, the IEEE Student Branch organizes the flagship NUTECH IEEE Fest, hackathons, circuit design competitions, AI workshops, and technical quizzes.",
    leaders: [
      {
        name: "Dr. Kamran Malik",
        role: "Faculty Counselor",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Hamza Tariq",
        role: "Branch Chair",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Ayesha Noor",
        role: "CS Chapter Lead",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "media-publicity": {
    id: "media-publicity",
    name: "NUTECH Media & Publicity Society",
    shortName: "Media Society",
    tagline: "Campus Photography, Filmmaking & Digital Design",
    category: "Creative",
    categoryLabel: "MEDIA & DESIGN",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 230,
    studentsLabel: "230 Members",
    eventsCount: 3,
    sessionsLabel: "3 Active Events",
    roleInProfile: "Photography & Design Wing",
    badgeInProfile: "Member",
    logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    mission:
      "The official creative voice of NUTECH Islamabad, covering university convocations, student festivals, digital media production, UI/UX design workshops, and campus photo walks.",
    leaders: [
      {
        name: "Ms. Sana Javed",
        role: "Faculty Advisor",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Bilal Ahmed",
        role: "President",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Zoya Khan",
        role: "Creative Head",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "fine-arts": {
    id: "fine-arts",
    name: "NUTECH Fine Arts & Creativity Club",
    shortName: "Fine Arts Club",
    tagline: "Calligraphy, Painting, Exhibitions & Campus Aesthetics",
    category: "Creative",
    categoryLabel: "ARTS & CULTURE",
    dept: "Directorate of Student Life (DSL)",
    membersCount: 195,
    studentsLabel: "195 Members",
    eventsCount: 2,
    sessionsLabel: "2 Active Events",
    roleInProfile: "Exhibition Coordinator",
    badgeInProfile: "Member",
    logo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
    mission:
      "Nurturing artistic expression at NUTECH through annual fine arts exhibitions, Arabic calligraphy workshops, campus mural projects, and creative design competitions.",
    leaders: [
      {
        name: "Dr. Farah Deeba",
        role: "Faculty Advisor",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Maham Fatima",
        role: "President",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Saad Ali",
        role: "Curator",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "adventure-club": {
    id: "adventure-club",
    name: "NUTECH Adventure Club",
    shortName: "Adventure Club",
    tagline: "Trekking, Hiking, Northern Expeditions & Outdoor Leadership",
    category: "Outdoor & Sports",
    categoryLabel: "OUTDOOR & TREKKING",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 290,
    studentsLabel: "290 Members",
    eventsCount: 2,
    sessionsLabel: "2 Active Events",
    roleInProfile: "General Body Member",
    badgeInProfile: "Member",
    logo: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    mission:
      "Organizing weekend Margalla Hills trail hikes, northern Pakistan study & adventure tours, camping nights, and physical endurance challenges for NUTECH students.",
    leaders: [
      {
        name: "Engr. Usman Shah",
        role: "Faculty Advisor",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Talha Afridi",
        role: "Expedition Lead",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Hassan Raza",
        role: "Safety Coordinator",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "literary-debating": {
    id: "literary-debating",
    name: "NUTECH Literary & Debating Club",
    shortName: "Debating Club",
    tagline: "Parliamentary Debates, Declamations & Campus Chronicle",
    category: "Creative",
    categoryLabel: "LITERARY & DEBATE",
    dept: "Directorate of Student Life (DSL)",
    membersCount: 185,
    studentsLabel: "185 Members",
    eventsCount: 2,
    sessionsLabel: "2 Active Events",
    logo: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    mission:
      "Fostering articulate leadership, English and Urdu declamation contests, Model United Nations delegations, and literary publications across NUTECH.",
    leaders: [
      {
        name: "Prof. Tariq Mehmood",
        role: "Faculty Advisor",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Areeba Siddiqui",
        role: "President",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Daniyal Qureshi",
        role: "General Secretary",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "green-youth": {
    id: "green-youth",
    name: "PM's Green Youth Movement (GYM) Club",
    shortName: "Green Youth Club",
    tagline: "NUTECH Green Week, Sustainability & Climate Action",
    category: "Community",
    categoryLabel: "ENVIRONMENT & GREEN",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 260,
    studentsLabel: "260 Members",
    eventsCount: 2,
    sessionsLabel: "2 Active Events",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80",
    mission:
      "Driving environmental stewardship at NUTECH through the flagship Green Week, campus tree plantation drives, eco-themed exhibitions, and clean-energy awareness campaigns.",
    leaders: [
      {
        name: "Dr. Naveed Iqbal",
        role: "Faculty Advisor",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Fatima Zahra",
        role: "Club Lead",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Omer Farooq",
        role: "Campaign Coordinator",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "community-service": {
    id: "community-service",
    name: "NUTECH Community Service Club",
    shortName: "Community Service",
    tagline: "Social Impact, SOS Village Visits & Welfare Drives",
    category: "Community",
    categoryLabel: "SOCIAL WELFARE",
    dept: "Directorate of Student Life (DSL)",
    membersCount: 310,
    studentsLabel: "310 Members",
    eventsCount: 2,
    sessionsLabel: "2 Active Events",
    logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    mission:
      "Dedicated to community outreach, blood donation camps, SOS Children's Village visits, flood relief fundraisers, and civic volunteering across Islamabad and Rawalpindi.",
    leaders: [
      {
        name: "Dr. Asma Munir",
        role: "Faculty Advisor",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Usman Ghani",
        role: "President",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Hira Batool",
        role: "Outreach Lead",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
  "nsc-nutech": {
    id: "nsc-nutech",
    name: "NUTECH Student Council (NSC)",
    shortName: "Student Council",
    tagline: "Apex Student Representative Body & Campus Governance",
    category: "Community",
    categoryLabel: "STUDENT COUNCIL",
    dept: "Office of Student Affairs (OSA)",
    membersCount: 450,
    studentsLabel: "450 Members",
    eventsCount: 3,
    sessionsLabel: "3 Active Events",
    logo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80",
    banner: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
    mission:
      "The apex student body at NUTECH representing student interests, coordinating inter-society festivals with the Student Facilitation Desk (SFD), and leading orientation week.",
    leaders: [
      {
        name: "Director DSL",
        role: "Patron",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Shehryar Khan",
        role: "NSC President",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
      },
      {
        name: "Zainab Ahmed",
        role: "General Secretary",
        avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=240&q=80",
      },
    ],
  },
};

export const NUTECH_SOCIETIES_LIST: NutechSociety[] = Object.values(NUTECH_SOCIETIES);

export const NUTECH_EVENTS: Record<string, NutechEvent> = {
  "event-ieee-fest": {
    id: "event-ieee-fest",
    title: "NUTECH IEEE Fest '25: Hackathon & Circuit Design",
    shortTitle: "NUTECH IEEE Fest '25",
    societyId: "ieee-nutech",
    societyName: "NUTECH IEEE Student Branch",
    category: "Hackathons",
    categoryTag: "IEEE FEST",
    badge: "Today · 2:00 PM",
    dateLabel: "Sat, Mar 15 · 2:00 PM",
    timeLabel: "2:00 – 5:00 PM",
    dateTimeFull: "Saturday, Mar 15 · 2:00 PM – 5:00 PM",
    venue: "Academic Block · CS & EE Labs (Level 2)",
    wing: "Academic Block",
    joinedLabel: "180+ joined",
    deadlineText: "Open registration · Free for NUTECH students",
    urgent: true,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    clubLogo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    description:
      "Flagship technical festival organized by the NUTECH IEEE Student Branch featuring speed programming, AI app prototyping, circuit designing, technical debates, and quiz battles open to all Computer Science and Engineering batches.",
  },
  "event-green-week": {
    id: "event-green-week",
    title: "NUTECH Green Week: Plantation & Eco Exhibition",
    shortTitle: "NUTECH Green Week '25",
    societyId: "green-youth",
    societyName: "PM's Green Youth Movement Club",
    category: "Clubs",
    categoryTag: "GREEN WEEK",
    badge: "Tomorrow · 10:00 AM",
    dateLabel: "Mon, Mar 17 · 10:00 AM",
    timeLabel: "10:00 AM – 1:00 PM",
    dateTimeFull: "Monday, Mar 17 · 10:00 AM – 1:00 PM",
    venue: "NUTECH Central Lawn & Innovation Center",
    wing: "Main Campus",
    joinedLabel: "210+ joined",
    deadlineText: "Tomorrow, 9:00 AM registration closes",
    urgent: true,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    clubLogo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80",
    description:
      "Join NUTECH's annual Green Week organized under the Office of Student Affairs (OSA) and PM's Green Youth Movement Club. Activities include the campus tree plantation drive, sustainability poster exhibition, and clean-tech project showcase.",
  },
  "event-media-workshop": {
    id: "event-media-workshop",
    title: "Campus Photography & Visual Storytelling Workshop",
    shortTitle: "Photography & Media Workshop",
    societyId: "media-publicity",
    societyName: "NUTECH Media & Publicity Society",
    category: "Workshops",
    categoryTag: "WORKSHOP",
    badge: "Wed · 3:00 PM",
    dateLabel: "Wed, Mar 19 · 3:00 PM",
    timeLabel: "3:00 – 5:00 PM",
    dateTimeFull: "Wednesday, Mar 19 · 3:00 PM – 5:00 PM",
    venue: "NUTECH Auditorium · Ground Floor",
    wing: "Admin Block",
    joinedLabel: "95+ joined",
    deadlineText: "Open registration · Bring camera or phone",
    urgent: false,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    clubLogo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
    description:
      "Hands-on workshop hosted by the NUTECH Media & Publicity Society covering event photography, framing, short-form campus documentary editing, and creative direction for university events.",
  },
  "event-arts-exhibition": {
    id: "event-arts-exhibition",
    title: "Spring Fine Arts & Calligraphy Showcase",
    shortTitle: "Fine Arts & Calligraphy Showcase",
    societyId: "fine-arts",
    societyName: "NUTECH Fine Arts & Creativity Club",
    category: "Cultural",
    categoryTag: "EXHIBITION",
    badge: "Fri · 11:00 AM",
    dateLabel: "Fri, Mar 21 · 11:00 AM",
    timeLabel: "11:00 AM – 4:00 PM",
    dateTimeFull: "Friday, Mar 21 · 11:00 AM – 4:00 PM",
    venue: "Student Activity Gallery · Level 2",
    wing: "Academic Block",
    joinedLabel: "140+ joined",
    deadlineText: "Artwork submissions open till Thursday",
    urgent: false,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
    clubLogo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80",
    description:
      "An open campus exhibition curated by the NUTECH Fine Arts & Creativity Club showcasing student paintings, traditional and modern calligraphy, digital illustrations, and craft installations.",
  },
  "event-margalla-hike": {
    id: "event-margalla-hike",
    title: "Margalla Trail 5 Hike & Outdoor Leadership Meet",
    shortTitle: "Margalla Trail 5 Student Hike",
    societyId: "adventure-club",
    societyName: "NUTECH Adventure Club",
    category: "Clubs",
    categoryTag: "OUTDOOR",
    badge: "Sun · 7:00 AM",
    dateLabel: "Sun, Mar 23 · 7:00 AM",
    timeLabel: "7:00 AM – 12:30 PM",
    dateTimeFull: "Sunday, Mar 23 · 7:00 AM – 12:30 PM",
    venue: "Departure: NUTECH Main Gate I-12",
    wing: "Outdoor",
    joinedLabel: "120+ joined",
    deadlineText: "Bus seats filling fast · Register by Friday",
    urgent: true,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    clubLogo: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80",
    description:
      "Morning group trek up Margalla Hills Trail 5 organized by the NUTECH Adventure Club. University transport departs from NUTECH Main Gate (Sector I-12, Islamabad) at 7:00 AM sharp.",
  },
};

export const NUTECH_EVENTS_LIST: NutechEvent[] = Object.values(NUTECH_EVENTS);
