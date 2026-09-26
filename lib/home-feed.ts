import type { ImageSourcePropType } from 'react-native';

export const EVENT_CATEGORIES = [
  'Tech',
  'Sports',
  'Music',
  'Cultural',
  'Arts',
  'Business',
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type DashboardCategory = EventCategory | 'General';
export type FeedFilter = 'All' | 'Events' | 'Posts' | EventCategory;

export type EventFeedItem = {
  id: string;
  type: 'event';
  title: string;
  society: string;
  schedule: string;
  relativeDay: string;
  time: string;
  category: DashboardCategory;
  image: ImageSourcePropType;
  approved: boolean;
  discoveryOrder: number;
  registrationDeadline?: string;
};

export type PostFeedItem = {
  id: string;
  type: 'post';
  society: string;
  timestamp: string;
  caption: string;
  category: DashboardCategory;
  logo: ImageSourcePropType;
  image?: ImageSourcePropType;
  likes: number;
  comments: number;
  bookmarked?: boolean;
};

export type FeedItem = EventFeedItem | PostFeedItem;

export type DashboardStat = {
  id: 'upcoming' | 'registered' | 'saved';
  label: 'Upcoming' | 'Registered' | 'Saved';
  value: number;
  tone: 'brand' | 'coral' | 'sage';
};

export type Society = {
  id: string;
  shortName: string;
  fullName: string;
  category: DashboardCategory;
  logo: ImageSourcePropType;
};

export type DeadlineReminder = {
  eventId: string;
  eventName: string;
  daysRemaining: number;
};

const categoryImages: Record<DashboardCategory, ImageSourcePropType> = {
  Tech: require('@/assets/images/categories/tech.png'),
  Sports: require('@/assets/images/categories/sports.png'),
  Music: require('@/assets/images/categories/music.png'),
  Cultural: require('@/assets/images/categories/cultural.png'),
  Arts: require('@/assets/images/categories/arts.png'),
  Business: require('@/assets/images/categories/business.png'),
  General: require('@/assets/images/categories/default.png'),
};

export function getCategoryImage(category: DashboardCategory) {
  return categoryImages[category] ?? categoryImages.General;
}

export const CATEGORY_SHORTCUTS = [
  'Tech',
  'Sports',
  'Music',
  'Cultural',
] as const satisfies readonly EventCategory[];
export const FEED_FILTERS: FeedFilter[] = ['All', 'Events', 'Posts', ...CATEGORY_SHORTCUTS];

export const HOME_FEED: FeedItem[] = [
  {
    id: 'event-innovation-night',
    type: 'event',
    title: 'Campus Innovation Night',
    society: 'NU Tech Society',
    schedule: 'Today · 5:30 PM',
    relativeDay: 'Today',
    time: '5:30 PM',
    category: 'Tech',
    image: getCategoryImage('Tech'),
    approved: true,
    discoveryOrder: 2,
    registrationDeadline: 'today+2',
  },
  {
    id: 'post-music-jam',
    type: 'post',
    society: 'NU Music Society',
    timestamp: '2h ago',
    caption:
      'An evening of live music, new collaborations, and familiar campus favourites. Rehearsals for our autumn showcase begin this week.',
    category: 'Music',
    logo: getCategoryImage('Music'),
    image: getCategoryImage('Music'),
    likes: 48,
    comments: 9,
  },
  {
    id: 'event-futsal-finals',
    type: 'event',
    title: 'Inter-Department Futsal Final',
    society: 'NUTECH Sports Club',
    schedule: 'Tomorrow · 4:00 PM',
    relativeDay: 'Tomorrow',
    time: '4:00 PM',
    category: 'Sports',
    image: getCategoryImage('Sports'),
    approved: true,
    discoveryOrder: 3,
  },
  {
    id: 'post-robotics-workshop',
    type: 'post',
    society: 'Robotics & Automation Club',
    timestamp: '5h ago',
    caption:
      'A look inside today’s autonomous rover workshop. Thanks to everyone who helped make the lab such an energetic place to learn.',
    category: 'Tech',
    logo: getCategoryImage('Tech'),
    image: getCategoryImage('Tech'),
    likes: 76,
    comments: 14,
    bookmarked: true,
  },
  {
    id: 'event-cultural-evening',
    type: 'event',
    title: 'Colours of Pakistan',
    society: 'Cultural Society',
    schedule: 'Friday · 6:00 PM',
    relativeDay: 'Friday',
    time: '6:00 PM',
    category: 'Cultural',
    image: getCategoryImage('Cultural'),
    approved: true,
    discoveryOrder: 4,
  },
  {
    id: 'post-photo-walk',
    type: 'post',
    society: 'Photography Club',
    timestamp: 'Yesterday',
    caption:
      'Frames from our golden-hour photo walk around campus. The next walk will focus on portraits and natural light.',
    category: 'Arts',
    logo: getCategoryImage('Arts'),
    image: getCategoryImage('Arts'),
    likes: 31,
    comments: 6,
  },
  {
    id: 'event-founder-lab',
    type: 'event',
    title: 'Student Founder Lab',
    society: 'Entrepreneurship Society',
    schedule: 'Saturday · 11:00 AM',
    relativeDay: 'Saturday',
    time: '11:00 AM',
    category: 'Business',
    image: getCategoryImage('Business'),
    approved: true,
    discoveryOrder: 5,
  },
  {
    id: 'event-cloud-study-jam',
    type: 'event',
    title: 'Cloud Study Jam',
    society: 'AWS Cloud Club',
    schedule: 'Today · 2:00 PM',
    relativeDay: 'Today',
    time: '2:00 PM',
    category: 'Tech',
    image: getCategoryImage('Tech'),
    approved: true,
    discoveryOrder: 1,
  },
];

export const FOLLOWED_SOCIETIES: Society[] = [
  {
    id: 'aws-cloud-club',
    shortName: 'AWS',
    fullName: 'AWS Cloud Club',
    category: 'Tech',
    logo: getCategoryImage('Tech'),
  },
  {
    id: 'sports-club',
    shortName: 'Sports',
    fullName: 'NUTECH Sports Club',
    category: 'Sports',
    logo: getCategoryImage('Sports'),
  },
  {
    id: 'music-society',
    shortName: 'Music',
    fullName: 'NU Music Society',
    category: 'Music',
    logo: getCategoryImage('Music'),
  },
  {
    id: 'cultural-society',
    shortName: 'Culture',
    fullName: 'Cultural Society',
    category: 'Cultural',
    logo: getCategoryImage('Cultural'),
  },
  {
    id: 'robotics-club',
    shortName: 'Robotics',
    fullName: 'Robotics & Automation Club',
    category: 'Tech',
    logo: getCategoryImage('Tech'),
  },
  {
    id: 'photography-club',
    shortName: 'Photo',
    fullName: 'Photography Club',
    category: 'Arts',
    logo: getCategoryImage('Arts'),
  },
];

export const STUDENT_REGISTRATION_IDS = [
  'event-innovation-night',
  'event-futsal-finals',
  'event-cultural-evening',
];
export const STUDENT_BOOKMARK_IDS = ['event-innovation-night', 'event-founder-lab'];

export function getDashboardStats(): DashboardStat[] {
  const upcoming = HOME_FEED.filter(
    (item) =>
      item.type === 'event' &&
      STUDENT_REGISTRATION_IDS.includes(item.id) &&
      item.relativeDay !== 'Past',
  ).length;

  return [
    { id: 'upcoming', label: 'Upcoming', value: upcoming, tone: 'brand' },
    {
      id: 'registered',
      label: 'Registered',
      value: STUDENT_REGISTRATION_IDS.length,
      tone: 'coral',
    },
    { id: 'saved', label: 'Saved', value: STUDENT_BOOKMARK_IDS.length, tone: 'sage' },
  ];
}

export function getDeadlineReminder(): DeadlineReminder | null {
  const relevantEvent = HOME_FEED.find(
    (item) =>
      item.type === 'event' &&
      Boolean(item.registrationDeadline) &&
      (STUDENT_BOOKMARK_IDS.includes(item.id) || STUDENT_REGISTRATION_IDS.includes(item.id)),
  );

  if (!relevantEvent || relevantEvent.type !== 'event') return null;

  const daysRemaining = 2;
  if (daysRemaining < 0 || daysRemaining > 3) return null;

  return { eventId: relevantEvent.id, eventName: relevantEvent.title, daysRemaining };
}

export function getTodayEventCount() {
  return HOME_FEED.filter(
    (item) => item.type === 'event' && item.approved && item.relativeDay === 'Today',
  ).length;
}

export function getFeaturedEvent() {
  return HOME_FEED.filter(
    (item): item is EventFeedItem => item.type === 'event' && item.approved,
  ).sort((first, second) => first.discoveryOrder - second.discoveryOrder)[0];
}

export function getThisWeekEvents(limit = 5) {
  return HOME_FEED.filter((item): item is EventFeedItem => item.type === 'event' && item.approved)
    .sort((first, second) => first.discoveryOrder - second.discoveryOrder)
    .slice(0, limit);
}

export function getFollowedSocietyPosts() {
  const followedSocietyNames = new Set(FOLLOWED_SOCIETIES.map((society) => society.fullName));
  return HOME_FEED.filter(
    (item): item is PostFeedItem => item.type === 'post' && followedSocietyNames.has(item.society),
  );
}
