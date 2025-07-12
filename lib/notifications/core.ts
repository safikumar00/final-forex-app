import { Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generate unique device ID
export function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create device ID
export async function getDeviceId(): Promise<string> {
  try {
    let deviceId: string | null = null;

    if (Platform.OS === 'web') {
      deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = generateDeviceId();
        localStorage.setItem('device_id', deviceId);
      }
    } else {
      const { getItemAsync, setItemAsync } = await import('expo-secure-store');
      deviceId = await getItemAsync('device_id');
      if (!deviceId) {
        deviceId = generateDeviceId();
        await setItemAsync('device_id', deviceId);
      }
    }

    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    return generateDeviceId();
  }
}

// Get current device ID (for display purposes)
export async function getCurrentDeviceId(): Promise<string> {
  return await getDeviceId();
}

// Get device information
export function getDeviceInfo() {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isDevice: Device.isDevice,
    deviceName: Device.deviceName,
    osName: Device.osName,
    osVersion: Device.osVersion,
  };
}

// Get device type
export function getDeviceType(): 'ios' | 'android' | 'web' {
  const deviceType =
    Platform.OS === 'ios'
      ? 'ios'
      : Platform.OS === 'android'
        ? 'android'
        : 'web';
  console.log('Device type:', deviceType);
  return deviceType;
}

// Clear device data (for testing/reset)
export async function clearDeviceData(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem('device_id');
    } else {
      const { deleteItemAsync } = await import('expo-secure-store');
      await deleteItemAsync('device_id');
    }
    
    await AsyncStorage.multiRemove(['device_id']);
    console.log('🗑️ Device data cleared');
  } catch (error) {
    console.error('❌ Error clearing device data:', error);
  }
}