import type { ConfigContext, ExpoConfig } from '@expo/config';

type ExpoPlugins = NonNullable<ExpoConfig['plugins']>;

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.EAS_BUILD_PROFILE === 'production';

  const nativePlugins: ExpoPlugins =
    !isProduction &&
    process.env.EXPO_PLATFORM === 'native' &&
    process.env.EXPO_DEV_CLIENT === 'true'
      ? [['expo-dev-client', { launchMode: 'most-recent' }]]
      : [];

  return {
    ...config,
    name: 'NUTECH Events & Societies',
    slug: 'nutech-events',
    owner: 'waqas50505s-team',
    version: process.env.BILT_APP_VERSION ?? '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    icon: './assets/icon.png',
    scheme: 'nutech-events',
    assetBundlePatterns: ['**/*'],
    ios: {
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      supportsTablet: true,
      bundleIdentifier: process.env.BILT_IOS_BUNDLE_ID ?? 'pk.edu.nutech.events',
    },
    android: {
      package: process.env.BILT_ANDROID_PACKAGE ?? 'pk.edu.nutech.events',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0E3C29',
      },
      permissions: [
        'INTERNET',
        'ACCESS_NETWORK_STATE',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/icon.png',
    },
    extra: {
      ...config.extra,
      supabaseUrl:
        process.env.EXPO_PUBLIC_SUPABASE_URL ||
        'https://wwpqhxobjobqtnwddmya.supabase.co',
      supabasePublishableKey:
        process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        'sb_publishable_1cuVdNhLUUea5TQu9_33cA_OlxR6SUA',
      eas: {
        projectId:
          process.env.EAS_PROJECT_ID ||
          config.extra?.eas?.projectId ||
          '97238ded-1826-4278-a73d-9e30486b0466',
      },
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#FFFFFF',
        },
      ],
      ...nativePlugins,
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
