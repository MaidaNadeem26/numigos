import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="explore"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="calendar" options={{ href: null }} />
      <Tabs.Screen name="bookmarks" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
