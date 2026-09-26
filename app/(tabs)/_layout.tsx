import { Bookmark, CalendarDays, Home, UserRound } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { numigosTheme } from '@/lib/theme';

const TAB_ICON_SIZE = 19;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: numigosTheme.colors.brand,
        tabBarInactiveTintColor: '#B3BBB8',
        tabBarStyle: {
          height: 50 + insets.bottom,
          paddingTop: 7,
          paddingBottom: Math.max(insets.bottom, 7),
          backgroundColor: numigosTheme.colors.surface,
          borderTopColor: numigosTheme.colors.line,
          borderTopWidth: 1,
          shadowColor: numigosTheme.colors.brandDeep,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={TAB_ICON_SIZE} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarAccessibilityLabel: 'Bookmarks',
          tabBarIcon: ({ color }) => (
            <Bookmark color={color} size={TAB_ICON_SIZE} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarAccessibilityLabel: 'Calendar',
          tabBarIcon: ({ color }) => (
            <CalendarDays color={color} size={TAB_ICON_SIZE} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <UserRound color={color} size={TAB_ICON_SIZE} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
