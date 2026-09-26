import { Typography } from 'heroui-native';
import { Check, Plus, Search, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';

import { ResilientImage } from '@/components/ui/ResilientImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/student/ScreenHeader';
import { GesturePressable } from '@/components/ui/primitives/GesturePressable';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { ALL_SOCIETIES, FOLLOWED_SOCIETIES } from '@/lib/home-feed';
import { numigosTheme } from '@/lib/theme';

export default function SocietiesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [followedIds, setFollowedIds] = useState(() => FOLLOWED_SOCIETIES.map((item) => item.id));
  const societies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ALL_SOCIETIES;
    return ALL_SOCIETIES.filter((item) =>
      `${item.fullName} ${item.category}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  const toggleFollow = (id: string) =>
    setFollowedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScreenHeader
        title="Explore societies"
        right={
          <GesturePressable
            accessibilityLabel="Register a society"
            accessibilityRole="button"
            className="bg-brand h-11 w-11 items-center justify-center rounded-full active:opacity-80"
            onPress={() => router.push('/societies/register')}
          >
            <Plus color="white" size={19} />
          </GesturePressable>
        }
      />
      <View className="mx-auto w-full max-w-[680px] px-4 pt-3 pb-3">
        <View className="border-home-card-border bg-surface h-11 flex-row items-center rounded-full border px-4">
          <Search color={numigosTheme.colors.homeMuted} size={17} />
          <TextInput
            accessibilityLabel="Search societies"
            className="text-home-ink ml-2 min-w-0 flex-1 text-sm"
            onChangeText={setQuery}
            placeholder="Search societies"
            placeholderTextColor={numigosTheme.colors.homeMuted}
            value={query}
          />
        </View>
      </View>
      <FlatList
        className="mx-auto w-full max-w-[680px] flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10, flexGrow: 1 }}
        data={societies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const followed = followedIds.includes(item.id);
          return (
            <View className="border-home-card-border bg-surface flex-row items-center rounded-2xl border p-2">
              <GesturePressable
                accessibilityLabel={`Open ${item.fullName}`}
                accessibilityRole="button"
                className="min-w-0 flex-1 flex-row items-center rounded-xl p-1 active:opacity-75"
                onPress={() =>
                  router.push({ pathname: '/societies/[id]', params: { id: item.id } })
                }
              >
                <ResilientImage
                  accessibilityIgnoresInvertColors
                  accessibilityLabel={`${item.fullName} logo`}
                  containerStyle={{ width: 52, height: 52, borderRadius: 26 }}
                  source={item.logo}
                />
                <View className="min-w-0 flex-1 pl-3">
                  <Typography className="text-home-ink text-sm font-bold" numberOfLines={2}>
                    {item.fullName}
                  </Typography>
                  <Typography className="text-home-muted mt-1 text-xs" numberOfLines={2}>
                    {item.category} · {item.members ?? 120} members
                  </Typography>
                </View>
              </GesturePressable>
              <GesturePressable
                accessibilityLabel={
                  followed ? `Unfollow ${item.fullName}` : `Follow ${item.fullName}`
                }
                accessibilityRole="button"
                accessibilityState={{ selected: followed }}
                className={`ml-2 min-h-11 min-w-[76px] flex-row items-center justify-center rounded-full px-3 ${followed ? 'bg-brand-mist' : 'bg-brand'}`}
                onPress={() => toggleFollow(item.id)}
              >
                {followed ? (
                  <Check color={numigosTheme.colors.brand} size={14} />
                ) : (
                  <Plus color="white" size={14} />
                )}
                <Typography
                  className={`ml-1 text-xs font-bold ${followed ? 'text-brand' : 'text-white'}`}
                >
                  {followed ? 'Following' : 'Follow'}
                </Typography>
              </GesturePressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            description="Try another search or clear the current query."
            icon={Users}
            title="No societies found"
          />
        }
      />
    </SafeAreaView>
  );
}
