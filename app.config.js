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
    package: 'com.safikumar00.boltexponativewind',
    googleServicesFile: './google-services.json',
    versionCode: 1,
    icon: './assets/images/ic_notification.png', // required for push icon
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#FFFFFF',
    },
    notification: {
      icon: './assets/images/ic_notification.png', // small monochrome
      color: '#FF0000', // optional accent color
    },
  },
  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/images/ic_notification.png',
        color: '#FF0000',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '8ce373b5-978a-43ad-a4cb-3ad8feb6e149',
    },
  },
};
