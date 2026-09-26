import { Typography } from 'heroui-native';
import { Check, Plus, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, TextInput, View } from 'react-native';

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
            className="bg-brand h-10 w-10 items-center justify-center rounded-full active:opacity-80"
            onPress={() => router.push('/societies/register')}
          >
            <Plus color="white" size={19} />
          </GesturePressable>
        }
      />
      <View className="px-4 pt-3 pb-3">
        <View className="border-home-card-border bg-surface h-11 flex-row items-center rounded-full border px-4">
          <Search color={numigosTheme.colors.homeMuted} size={17} />
          <TextInput
            className="text-home-ink ml-2 min-w-0 flex-1 text-[12px]"
            onChangeText={setQuery}
            placeholder="Search societies"
            placeholderTextColor={numigosTheme.colors.homeMuted}
            value={query}
          />
        </View>
      </View>
      <FlatList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        data={societies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const followed = followedIds.includes(item.id);
          return (
            <GesturePressable
              accessibilityRole="button"
              className="border-home-card-border bg-surface flex-row items-center rounded-2xl border p-3 active:opacity-75"
              onPress={() => router.push({ pathname: '/societies/[id]', params: { id: item.id } })}
            >
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="cover"
                source={item.logo}
                style={{ width: 52, height: 52, borderRadius: 26 }}
              />
              <View className="min-w-0 flex-1 pl-3">
                <Typography className="text-home-ink text-[13px] font-bold" numberOfLines={1}>
                  {item.fullName}
                </Typography>
                <Typography className="text-home-muted mt-1 text-[9px]">
                  {item.category} · {item.members ?? 120} members
                </Typography>
              </View>
              <GesturePressable
                accessibilityLabel={
                  followed ? `Unfollow ${item.fullName}` : `Follow ${item.fullName}`
                }
                accessibilityRole="button"
                className={`ml-2 h-9 min-w-[76px] flex-row items-center justify-center rounded-full px-3 ${followed ? 'bg-brand-mist' : 'bg-brand'}`}
                onPress={() => toggleFollow(item.id)}
              >
                {followed ? (
                  <Check color={numigosTheme.colors.brand} size={14} />
                ) : (
                  <Plus color="white" size={14} />
                )}
                <Typography
                  className={`ml-1 text-[10px] font-bold ${followed ? 'text-brand' : 'text-white'}`}
                >
                  {followed ? 'Following' : 'Follow'}
                </Typography>
              </GesturePressable>
            </GesturePressable>
          );
        }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Typography className="text-home-ink font-bold">No societies found</Typography>
            <Typography className="text-home-muted mt-1 text-xs">Try another search.</Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
}
