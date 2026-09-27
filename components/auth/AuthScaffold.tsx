import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { CampusHero } from '@/components/auth/CampusHero';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';

import { getScreenHorizontalPadding } from '@/lib/layout';

interface AuthScaffoldProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  footer?: ReactNode;
  header?: ReactNode;
  compactHero?: boolean;
  dense?: boolean;
  heroHeight?: number;
  hideHeroBrand?: boolean;
  useHeroArtwork?: boolean;
  alignContentLeft?: boolean;
  noScroll?: boolean;
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
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const isCompactHeight = viewportHeight <= 660;
  const horizontalPadding = Math.max(22, getScreenHorizontalPadding(viewportWidth));

  return (
    <View style={{ backgroundColor: '#0B1813', flex: 1 }}>
      <SafeAreaView
        className="flex-1 overflow-hidden"
        edges={['top', 'left', 'right']}
        style={{
          backgroundColor: '#FAF9F5',
          borderRadius: Platform.OS === 'web' ? 28 : 0,
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            bounces={false}
            className="flex-1"
            contentContainerStyle={{
              backgroundColor: '#FAF9F5',
              flexGrow: 1,
            }}
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
              className={
                useHeroArtwork
                  ? ''
                  : `auth-panel-shadow rounded-t-auth-panel bg-surface -mt-auth-overlap ${
                      dense ? 'pb-safe-offset-3 pt-4' : 'pt-auth-section pb-safe-offset-8'
                    }`
              }
              style={{
                backgroundColor: '#FAF9F5',
                borderTopLeftRadius: useHeroArtwork ? 0 : 32,
                borderTopRightRadius: useHeroArtwork ? 0 : 32,
                flexShrink: 0,
                marginTop: useHeroArtwork ? -2 : undefined,
                paddingBottom: isCompactHeight ? 14 : 18,
                paddingHorizontal: horizontalPadding,
                paddingTop: useHeroArtwork ? (isCompactHeight ? 4 : 6) : undefined,
              }}
            >
              <View className="mx-auto w-full max-w-[440px]">
                {header}
                {title ? (
                  <Text
                    style={{
                      color: '#162620',
                      fontFamily: Platform.select({
                        web: "Georgia, 'Times New Roman', serif",
                        default: undefined,
                      }),
                      fontSize: isCompactHeight ? 21 : 24,
                      fontWeight: '600',
                      letterSpacing: -0.3,
                      lineHeight: isCompactHeight ? 25 : 29,
                      textAlign: alignContentLeft ? 'left' : 'center',
                    }}
                  >
                    {title}
                  </Text>
                ) : null}
                {subtitle ? (
                  <Text
                    style={{
                      alignSelf: alignContentLeft ? 'flex-start' : 'center',
                      color: '#66736E',
                      fontSize: isCompactHeight ? 11.5 : 12.5,
                      lineHeight: isCompactHeight ? 16 : 18,
                      marginTop: isCompactHeight ? 3 : 5,
                      maxWidth: 260,
                      textAlign: alignContentLeft ? 'left' : 'center',
                    }}
                  >
                    {subtitle}
                  </Text>
                ) : null}
                <View
                  style={{
                    marginTop: title || subtitle ? (isCompactHeight ? 10 : 14) : 4,
                  }}
                >
                  {children}
                </View>
              </View>
              {footer ? <View className="mx-auto mt-4 w-full max-w-[440px]">{footer}</View> : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
