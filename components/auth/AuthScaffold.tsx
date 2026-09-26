import { goBackOrReplace } from '@/lib/navigation';
import { Button, Typography } from 'heroui-native';
import { type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from '@/components/ui/primitives/SafeAreaView';

type AuthScaffoldProps = {
  title: string;
  children: ReactNode;
  backFallback?: Href;
  footer?: ReactNode;
};

export function AuthScaffold({ title, children, backFallback, footer }: AuthScaffoldProps) {
  return (
    <SafeAreaView className="bg-background flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow px-5 pb-8 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mx-auto w-full max-w-lg grow">
            {backFallback ? (
              <Button
                className="mb-5 self-start"
                size="sm"
                variant="ghost"
                onPress={() => goBackOrReplace(backFallback)}
              >
                <Button.Label>Back</Button.Label>
              </Button>
            ) : null}

            <View className="mb-8 items-center">
              <View className="bg-accent mb-4 size-16 items-center justify-center rounded-2xl">
                <Typography className="text-accent-foreground text-2xl font-bold">N</Typography>
              </View>
              <Typography className="text-foreground text-center text-3xl font-bold">
                {title}
              </Typography>
            </View>

            <View className="grow">{children}</View>
            {footer ? <View className="mt-6">{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
