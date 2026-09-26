import { Bookmark, CalendarDays, Home, UserRound } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CONTENT_HEIGHT } from '@/lib/layout';
import { numigosTheme } from '@/lib/theme';

const TAB_ICON_SIZE = 18;

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
          height: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 5),
          backgroundColor: numigosTheme.colors.surface,
          borderTopColor: numigosTheme.colors.line,
          borderTopWidth: 1,
          shadowColor: numigosTheme.colors.brandDeep,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.025,
          shadowRadius: 3,
          elevation: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
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
