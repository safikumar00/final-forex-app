import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken as getWebToken } from 'firebase/messaging'; // Web SDK
import { Platform } from 'react-native';

// Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
// };

let webMessaging: any = null;

if (Platform.OS === 'web') {
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  webMessaging = getMessaging(app);

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => { });
  }
}

export { webMessaging };

// 🔄 Final FCM Token function for both platforms
export async function getFCMToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return null;

      const vapidKey = process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey || !webMessaging) return null;

      const registration = await navigator.serviceWorker.ready;

      const token = await getWebToken(webMessaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      return token;
    } else {
      // Native (Android/iOS via @react-native-firebase)
      const { default: messaging } = await import('@react-native-firebase/messaging');

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) return null;

      const token = await messaging().getToken();
      return token;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}


// Listen for foreground messages (web only)
export function onForegroundMessage(callback: (payload: any) => void) {
  if (Platform.OS !== 'web' || !webMessaging) {
    return () => { };
  }

  return onMessage(webMessaging, callback);
}