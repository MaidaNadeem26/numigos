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
  description?: string;
  location?: string;
  attendees?: number;
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
  description?: string;
  members?: number;
  founded?: string;
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

export const HOME_FEED: FeedItem[] = [];

export const FOLLOWED_SOCIETIES: Society[] = [];

export const ALL_SOCIETIES: Society[] = [];

export function getSocietyById(id: string | undefined) {
  if (!id) return undefined;
  return ALL_SOCIETIES.find((society) => society.id === id);
}

export const STUDENT_REGISTRATION_IDS: string[] = [];
export const STUDENT_BOOKMARK_IDS: string[] = [];

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

  return { eventId: relevantEvent.id, eventName: relevantEvent.title, daysRemaining: 0 };
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

export const PAST_EVENTS: EventFeedItem[] = [];

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  kind: 'event' | 'deadline' | 'society';
  unread: boolean;
  eventId?: string;
};

export const STUDENT_NOTIFICATIONS: StudentNotification[] = [];

export function getAllEvents() {
  return HOME_FEED.filter((item): item is EventFeedItem => item.type === 'event');
}

export function getEventById(id: string | undefined) {
  if (!id) return undefined;
  return [...getAllEvents(), ...PAST_EVENTS].find((event) => event.id === id);
}

export function getBookmarkedEvents() {
  return getAllEvents().filter((event) => STUDENT_BOOKMARK_IDS.includes(event.id));
}

export function getRegisteredEvents() {
  return getAllEvents().filter((event) => STUDENT_REGISTRATION_IDS.includes(event.id));
}
