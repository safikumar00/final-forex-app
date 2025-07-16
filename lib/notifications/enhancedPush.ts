import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { logNotificationClick, logNotificationImpression } from './clickTracking';
import { parseDeepLink, handleDeepLink, initializeDeepLinking } from './deepLinking';
import { RichNotificationData } from './rich Notifications';
import { getCurrentDeviceId } from './core';

// Enhanced notification response handler
export function setupEnhancedNotificationHandlers() {
  console.log('🔔 Setting up enhanced notification handlers...');
  
  // Initialize deep linking
  const cleanupDeepLinking = initializeDeepLinking();
  
  const listeners: (() => void)[] = [cleanupDeepLinking];
  
  if (Platform.OS === 'web') {
    // Web notification handling is done in service worker
    console.log('🌐 Web notification handling via service worker');
  } else {
    // Mobile notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log('📨 Notification received:', notification.request.content.title);
      
      // Log impression
      const notificationId = notification.request.content.data?.notification_id;
      if (notificationId) {
        await logNotificationImpression(notificationId);
      }
    });
    
    const responseListener = Notifications.addNotificationResponseReceivedListener(async (response) => {
      console.log('👆 Notification tapped:', response.notification.request.content.title);
      
      const data = response.notification.request.content.data;
      const notificationId = data?.notification_id;
      const actionIdentifier = response.actionIdentifier;
      
      // Determine action type
      let actionType = 'default';
      if (actionIdentifier && actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
        actionType = actionIdentifier;
      }
      
      // Log the click
      if (notificationId) {
        const deviceId = await getCurrentDeviceId();
        await logNotificationClick({
          notification_id: notificationId,
          user_id: deviceId,
          action_type: actionType,
          deep_link: data?.deep_link,
        });
      }
      
      // Handle deep linking
      if (data?.deep_link) {
        const linkData = parseDeepLink(data.deep_link);
        if (linkData) {
          // Delay navigation to ensure app is ready
          setTimeout(() => handleDeepLink(linkData), 500);
        }
      }
      
      // Handle specific actions
      switch (actionType) {
        case 'view':
          console.log('📈 User chose to view content');
          break;
        case 'open_chart':
          console.log('📊 User chose to open chart');
          break;
        case 'share':
          console.log('📤 User chose to share');
          // Implement sharing logic
          break;
        case 'dismiss':
          console.log('❌ User dismissed notification');
          break;
        default:
          console.log('👆 Default notification tap');
          break;
      }
    });
    
    listeners.push(() => {
      notificationListener.remove();
      responseListener.remove();
    });
  }
  
  console.log('✅ Enhanced notification handlers set up');
  
  // Return cleanup function
  return () => {
    console.log('🧹 Cleaning up enhanced notification handlers');
    listeners.forEach(cleanup => cleanup());
  };
}


// Create notification categories for iOS
export async function setupNotificationCategories(): Promise<void> {
  if (Platform.OS !== 'ios') return;
  
  try {
    await Notifications.setNotificationCategoryAsync('TRADING_SIGNAL', [
      {
        identifier: 'view',
        buttonTitle: '📈 View Signal',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'open_chart',
        buttonTitle: '📊 Chart',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'dismiss',
        buttonTitle: '❌ Dismiss',
        options: {
          opensAppToForeground: false,
        },
      },
    ]);
    
    await Notifications.setNotificationCategoryAsync('ACHIEVEMENT', [
      {
        identifier: 'view',
        buttonTitle: '🏆 View',
        options: {
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'share',
        buttonTitle: '📤 Share',
        options: {
          opensAppToForeground: true,
        },
      },
    ]);
    
    console.log('✅ iOS notification categories set up');
  } catch (error) {
    console.error('❌ Error setting up notification categories:', error);
  }
}