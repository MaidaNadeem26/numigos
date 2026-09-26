import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { Typography } from 'heroui-native';

import { CampusHero } from '@/components/auth/CampusHero';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';

import { getScreenHorizontalPadding } from '@/lib/layout';

interface AuthScaffoldProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  onBack?: () => void;
  footer?: ReactNode;
  header?: ReactNode;
  compactHero?: boolean;
  dense?: boolean;
  heroHeight?: number;
  hideHeroBrand?: boolean;
  useHeroArtwork?: boolean;
  alignContentLeft?: boolean;
}

export function AuthScaffold({
  title,
  subtitle,
  onBack,
  children,
  footer,
  header,
  compactHero = false,
  dense = false,
  heroHeight,
  hideHeroBrand = false,
  useHeroArtwork = false,
  alignContentLeft = false,
}: AuthScaffoldProps) {
  const { width: viewportWidth } = useWindowDimensions();

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
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
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
            className={`auth-panel-shadow rounded-t-auth-panel bg-surface -mt-auth-overlap flex-1 ${
              dense ? 'pb-safe-offset-3 pt-4' : 'pt-auth-section pb-safe-offset-8'
            }`}
            style={{ paddingHorizontal: getScreenHorizontalPadding(viewportWidth) }}
          >
            <View className="mx-auto w-full max-w-[440px]">
              {header}
              <Typography
                className={`font-display text-auth-title text-ink leading-tight ${
                  alignContentLeft ? 'text-left' : 'text-center'
                }`}
              >
                {title}
              </Typography>
              <Typography
                className={`text-auth-subtitle text-ink-muted max-w-[340px] font-sans leading-5 ${
                  alignContentLeft ? 'mr-auto text-left' : 'mx-auto text-center'
                } ${dense ? 'mt-1' : 'mt-2'}`}
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
