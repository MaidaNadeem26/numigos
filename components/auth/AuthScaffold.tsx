import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Typography } from 'heroui-native';

import { CampusHero } from '@/components/auth/CampusHero';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';

interface AuthScaffoldProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  onBack?: () => void;
  footer?: ReactNode;
  compactHero?: boolean;
  dense?: boolean;
  heroHeight?: number;
  hideHeroBrand?: boolean;
  singleViewport?: boolean;
  useHeroArtwork?: boolean;
}

export function AuthScaffold({
  title,
  subtitle,
  onBack,
  children,
  footer,
  compactHero = false,
  dense = false,
  heroHeight,
  hideHeroBrand = false,
  singleViewport = false,
  useHeroArtwork = false,
}: AuthScaffoldProps) {
  return (
    <SafeAreaView className="bg-brand flex-1" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          bounces={false}
          className="bg-canvas flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!singleViewport}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <CampusHero
            compact={compactHero}
            height={heroHeight}
            onBack={onBack}
            showBrand={!hideHeroBrand}
            useArtwork={useHeroArtwork}
          />

          <View
            className={`auth-panel-shadow rounded-t-auth-panel bg-surface -mt-auth-overlap px-auth-screen flex-1 ${
              dense ? 'pb-safe-offset-3 pt-4' : 'pt-auth-section pb-safe-offset-8'
            }`}
          >
            <View className="mx-auto w-full max-w-[440px]">
              <Typography className="font-display text-auth-title text-ink text-center leading-tight">
                {title}
              </Typography>
              <Typography
                className={`text-auth-subtitle text-ink-muted mx-auto max-w-[340px] text-center font-sans leading-5 ${
                  dense ? 'mt-1' : 'mt-2'
                }`}
              >
                {subtitle}
              </Typography>
              <View className={dense ? 'mt-3' : 'mt-auth-section'}>{children}</View>
            </View>
            {footer ? <View className="mx-auto mt-8 w-full max-w-[440px]">{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
