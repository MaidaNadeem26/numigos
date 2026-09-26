import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';
import { BrandMark } from '@/components/auth/BrandMark';
import { numigosTheme } from '@/lib/theme';

interface AuthScaffoldProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  onBack?: () => void;
  footer?: ReactNode;
}

export function AuthScaffold({ title, subtitle, onBack, children, footer }: AuthScaffoldProps) {
  return (
    <SafeAreaView className="bg-brand flex-1" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-5 pb-10">
            <View className="mb-7 h-11 justify-center">
              {onBack ? (
                <Button
                  accessibilityLabel="Go back"
                  className="size-11 self-start rounded-full border border-white/20 bg-white/10"
                  isIconOnly
                  onPress={onBack}
                  variant="tertiary"
                >
                  <Ionicons color={numigosTheme.colors.surface} name="chevron-back" size={21} />
                </Button>
              ) : null}
            </View>

            <View className="mb-7 flex-row items-center gap-4">
              <BrandMark compact />
              <Typography className="font-display text-[26px] text-white">Numigos</Typography>
            </View>

            <Typography className="font-display text-auth-title leading-tight text-white">
              {title}
            </Typography>
            <Typography className="text-auth-subtitle text-brand-soft mt-2 max-w-[340px] font-sans leading-6">
              {subtitle}
            </Typography>
          </View>

          <View className="auth-panel-shadow rounded-t-auth-panel bg-canvas pb-safe-offset-8 flex-1 px-6 pt-8">
            <View className="mx-auto w-full max-w-[440px]">{children}</View>
            {footer ? <View className="mx-auto mt-8 w-full max-w-[440px]">{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
