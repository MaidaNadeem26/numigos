import type { ImageSourcePropType } from 'react-native';

export type EventFeedItem = {
  id: string;
  type: 'event';
  title: string;
  society: string;
  schedule: string;
  image: ImageSourcePropType;
};

export type PostFeedItem = {
  id: string;
  type: 'post';
  society: string;
  timestamp: string;
  caption: string;
  logo: ImageSourcePropType;
  image?: ImageSourcePropType;
  likes: number;
  comments: number;
};

export type FeedItem = EventFeedItem | PostFeedItem;

const campusImage = require('@/assets/images/numigos-campus-event-hero.png');
const nutechLogo = require('@/assets/images/nutech-logo.png');

export const HOME_FEED: FeedItem[] = [
  {
    id: 'event-innovation-night',
    type: 'event',
    title: 'Campus Innovation Night',
    society: 'NU Tech Society',
    schedule: 'Today · 5:30 PM',
    image: campusImage,
  },
  {
    id: 'post-debate-auditions',
    type: 'post',
    society: 'NUTECH Debating Society',
    timestamp: '2h ago',
    caption:
      'Auditions for the inter-university debate team open this Wednesday. Bring a two-minute speech on any issue you care about.',
    logo: nutechLogo,
    likes: 48,
    comments: 9,
  },
  {
    id: 'event-futsal-finals',
    type: 'event',
    title: 'Inter-Department Futsal Final',
    society: 'NUTECH Sports Club',
    schedule: 'Tomorrow · 4:00 PM',
    image: campusImage,
  },
  {
    id: 'post-robotics-workshop',
    type: 'post',
    society: 'Robotics & Automation Club',
    timestamp: '5h ago',
    caption:
      'A look inside today’s autonomous rover workshop. Thanks to everyone who helped make the lab such an energetic place to learn.',
    logo: nutechLogo,
    image: campusImage,
    likes: 76,
    comments: 14,
  },
  {
    id: 'post-volunteer-drive',
    type: 'post',
    society: 'Community Service Society',
    timestamp: 'Yesterday',
    caption:
      'Volunteer registrations are open for our weekend campus clean-up drive. Meet us outside the student center at 9 AM.',
    logo: nutechLogo,
    likes: 31,
    comments: 6,
  },
  {
    id: 'event-career-connect',
    type: 'event',
    title: 'Career Connect 2026',
    society: 'Student Affairs Office',
    schedule: 'Friday · 10:00 AM',
    image: campusImage,
  },
];
