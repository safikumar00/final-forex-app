import 'dotenv/config';

export default {
  name: 'bolt-expo-nativewind',
  slug: 'bolt-expo-nativewind',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    googleServicesFile: './google-services.json', // ✅ important
    package: 'com.safikumar00.boltexponativewind',
    permissions: ['NOTIFICATIONS'], // 👈 required for Android 13+
  },
  plugins: ['expo-notifications'],
  extra: {
    eas: {
      projectId: '8ce373b5-978a-43ad-a4cb-3ad8feb6e149',
    },
  },
};
