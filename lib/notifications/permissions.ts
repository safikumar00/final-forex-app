import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    console.log('📱 Requesting notification permissions...');

    if (Platform.OS === 'web') {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('🌐 Web notification permission:', permission);
        return permission === 'granted';
      }
      console.log('⚠️ Web notifications not supported');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    console.log('📱 Mobile notification permission:', finalStatus);
    return finalStatus === 'granted';
  } catch (error) {
    console.error('❌ Error requesting notification permissions:', error);
    return false;
  }
}