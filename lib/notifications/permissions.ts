import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

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

    // Only request on physical devices
    if (!Device.isDevice) {
      console.log('⚠️ Notifications not supported on simulator/emulator');
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

// Request notification permission if needed (for app startup)
export async function requestNotificationPermissionIfNeeded(): Promise<boolean> {
  try {
    // Skip on web and simulators
    if (Platform.OS === 'web' || !Device.isDevice) {
      return false;
    }

    const settings = await Notifications.getPermissionsAsync();

    if (!settings.granted) {
      console.log('📱 Requesting notification permissions on app startup...');
      const finalStatus = await Notifications.requestPermissionsAsync();
      
      if (!finalStatus.granted) {
        console.warn('🔕 Notifications permission denied.');
        return false;
      }
      
      console.log('✅ Notification permissions granted on startup');
      return true;
    }

    console.log('✅ Notification permissions already granted');
    return true;
  } catch (error) {
    console.error('❌ Error requesting notification permissions on startup:', error);
    return false;
  }
}