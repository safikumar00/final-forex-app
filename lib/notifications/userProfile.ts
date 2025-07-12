import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import { getDeviceId, getDeviceType } from './core';

export interface UserProfile {
  id: string;
  user_id: string;
  name?: string;
  dob?: string;
  language: string;
  fcm_token?: string;
  device_type?: 'ios' | 'android' | 'web';
  app_version?: string;
  onboarding_completed: boolean;
  last_active: string;
  created_at: string;
}

export interface DeviceProfile {
  id?: string;
  user_id: string;         // device_id
  fcm_token?: string;
  device_type?: 'ios' | 'android' | 'web';
  app_version?: string;
  last_active: string;
  created_at?: string;
}

export interface OnboardingData {
  name: string;
  dob: string;
  language: string;
}

// Get user profile
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const deviceId = await getDeviceId();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', deviceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Network error fetching user profile:', error);
    return null;
  }
}

// Create user profile
export async function createUserProfile(onboardingData: OnboardingData): Promise<boolean> {
  try {
    const deviceId = await getDeviceId();

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: deviceId,
        name: onboardingData.name,
        dob: onboardingData.dob,
        language: onboardingData.language,
        device_type: Platform.OS as 'ios' | 'android' | 'web',
        app_version: '1.0.0',
        onboarding_completed: true,
        last_active: new Date().toISOString(),
      });

    if (error) {
      console.error('Error creating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network error creating user profile:', error);
    return false;
  }
}

// Update user profile
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const deviceId = await getDeviceId();

    const { error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        last_active: new Date().toISOString(),
      })
      .eq('user_id', deviceId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network error updating user profile:', error);
    return false;
  }
}

// Upsert user profile (from database.ts)
export async function upsertUserProfile(profile: Omit<DeviceProfile, 'id' | 'created_at' | 'last_active'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        ...profile,
        last_active: new Date().toISOString(),
      });

    if (error) {
      console.error('Error upserting user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network error upserting user profile:', error);
    return false;
  }
}

// Check onboarding status
export async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    return profile?.onboarding_completed || false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

// Cache onboarding status locally for faster checks
export async function cacheOnboardingStatus(completed: boolean): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem('onboarding_completed', completed.toString());
    } else {
      await AsyncStorage.setItem('onboarding_completed', completed.toString());
    }
  } catch (error) {
    console.error('Error caching onboarding status:', error);
  }
}

// Get cached onboarding status
export async function getCachedOnboardingStatus(): Promise<boolean | null> {
  try {
    let status: string | null = null;

    if (Platform.OS === 'web') {
      status = localStorage.getItem('onboarding_completed');
    } else {
      status = await AsyncStorage.getItem('onboarding_completed');
    }

    return status ? status === 'true' : null;
  } catch (error) {
    console.error('Error getting cached onboarding status:', error);
    return null;
  }
}

// Get device profile
export async function getDeviceProfile(): Promise<DeviceProfile | null> {
  try {
    const deviceId = await getDeviceId();

    console.log('📖 Loading device profile for:', deviceId);

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', deviceId)
      .single();

    console.log('📖 Device profile data:', data);

    if (error === null) {
      // No profile found, create one
      console.log('📝 Creating new device profile...');
      const registerResult = await supabase
        .from('user_profiles')
        .insert({
          user_id: deviceId,
          fcm_token: null,
          device_type: getDeviceType(),
          app_version: '1.0.0',
          last_active: new Date().toISOString(),
        });

      if (!registerResult.error) {
        // Try to fetch again
        const { data: newData, error: newError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', deviceId)
          .single();

        if (!newError) {
          console.log('✅ Device profile created and loaded', newData);
          return newData;
        }
      }
      console.error('❌ Error loading device profile:', error);
      return null;
    }

    console.log('✅ Device profile loaded');
    return data;
  } catch (error) {
    console.error('❌ Error loading device profile:', error);
    return null;
  }
}

// Update FCM token
export async function updateFCMToken(fcmToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const deviceId = await getDeviceId();

    console.log('🔄 Updating FCM token for device:', deviceId);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        fcm_token: fcmToken,
        last_active: new Date().toISOString(),
      })
      .eq('user_id', deviceId);

    if (error) {
      console.error('❌ Error updating FCM token:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ FCM token updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating FCM token:', error);
    return { success: false, error: 'Failed to update FCM token' };
  }
}

// Register device for FCM
export async function registerDevice(fcmToken?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const deviceId = await getDeviceId();
    const deviceType = getDeviceType();

    const deviceData = {
      user_id: deviceId,
      fcm_token: fcmToken,
      device_type: deviceType,
      app_version: '1.0.0',
      last_active: new Date().toISOString(),
    };

    console.log('💾 Registering device:', {
      user_id: deviceId,
      device_type: deviceData.device_type,
      has_fcm_token: !!fcmToken
    });

    // Check if device already exists
    const { data: existingDevice, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, user_id')
      .eq('user_id', deviceId)
      .maybeSingle();

    console.log('🔍 Existing device check result:', existingDevice, deviceId);

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Error checking existing device:', fetchError);
      return { success: false, error: fetchError.message };
    }

    let result;
    if (existingDevice) {
      // Device exists, update it
      console.log('🔄 Updating existing device');
      result = await supabase
        .from('user_profiles')
        .update({
          fcm_token: deviceData.fcm_token,
          device_type: deviceData.device_type,
          app_version: deviceData.app_version,
          last_active: deviceData.last_active,
        })
        .eq('user_id', deviceId);
    } else {
      // Device doesn't exist, create it
      console.log('➕ Creating new device');
      result = await supabase
        .from('user_profiles')
        .insert(deviceData);
    }

    if (result.error) {
      console.error('❌ Supabase operation error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('✅ Device registered successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error registering device:', error);
    return { success: false, error: 'Failed to register device' };
  }
}