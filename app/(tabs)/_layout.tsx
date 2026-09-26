import { Compass, Home, Bookmark, CalendarDays, UserRound } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { numigosTheme } from '@/lib/theme';

const TAB_ICON_SIZE = 17;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="explore"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: numigosTheme.colors.brand,
        tabBarInactiveTintColor: '#A6AFB4',
        tabBarLabelStyle: {
          fontFamily: numigosTheme.fonts.medium,
          fontSize: 8,
          marginTop: 1,
        },
        tabBarStyle: {
          height: 48 + insets.bottom,
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 5),
          backgroundColor: numigosTheme.colors.surface,
          borderTopColor: numigosTheme.colors.homeCardBorder,
          borderTopWidth: 1,
          shadowColor: numigosTheme.colors.brandDeep,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.025,
          shadowRadius: 3,
          elevation: 2,
        },
        tabBarItemStyle: { paddingVertical: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={TAB_ICON_SIZE} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarAccessibilityLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <Compass color={color} size={TAB_ICON_SIZE} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarAccessibilityLabel: 'Calendar',
          tabBarIcon: ({ color }) => (
            <CalendarDays color={color} size={TAB_ICON_SIZE} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Saved',
          tabBarAccessibilityLabel: 'Saved events',
          tabBarIcon: ({ color }) => (
            <Bookmark color={color} size={TAB_ICON_SIZE} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <UserRound color={color} size={TAB_ICON_SIZE} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}
