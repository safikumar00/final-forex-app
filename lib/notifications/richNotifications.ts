import { Platform } from 'react-native';
import { DeepLinkData, generateDeepLink } from './deepLinking';

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface RichNotificationData {
  title: string;
  body: string;
  image?: string;
  actions?: NotificationAction[];
  deepLink?: DeepLinkData;
  data?: Record<string, any>;
}

// Generate FCM v1 message with rich content and actions
export function createRichFCMMessage(
  token: string,
  notification: RichNotificationData,
  notificationId: string
): any {
  const deepLinkUrl = notification.deepLink ? generateDeepLink(notification.deepLink) : undefined;
  
  const message = {
    message: {
      token: token,
      notification: {
        title: notification.title,
        body: notification.body,
        image: notification.image,
      },
      data: {
        notification_id: notificationId,
        deep_link: deepLinkUrl || '',
        click_action: 'NOTIFICATION_CLICKED',
        ...notification.data,
      },
      webpush: {
        headers: {
          TTL: '86400', // 24 hours
          Urgency: 'high',
        },
        notification: {
          icon: '/assets/images/icon.png',
          badge: '/assets/images/icon.png',
          image: notification.image,
          requireInteraction: true,
          actions: notification.actions?.map(action => ({
            action: action.action,
            title: action.title,
            icon: action.icon || '/assets/images/icon.png',
          })) || [
            {
              action: 'view',
              title: '📈 View Signal',
              icon: '/assets/images/icon.png',
            },
            {
              action: 'dismiss',
              title: '❌ Dismiss',
            },
          ],
        },
        fcm_options: {
          link: deepLinkUrl || '/',
        },
      },
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#31954b',
          sound: 'default',
          click_action: 'NOTIFICATION_CLICKED',
          image: notification.image,
          channel_id: 'trading_signals',
        },
        data: {
          notification_id: notificationId,
          deep_link: deepLinkUrl || '',
          ...notification.data,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: notification.title,
              body: notification.body,
            },
            sound: 'default',
            badge: 1,
            category: 'TRADING_SIGNAL',
            'mutable-content': 1,
          },
          notification_id: notificationId,
          deep_link: deepLinkUrl || '',
          ...notification.data,
        },
      },
    },
  };
  
  return message;
}

// Create rich notification for different signal types
export function createSignalNotification(signal: {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry_price: number;
  status: string;
}): RichNotificationData {
  const emoji = signal.type === 'BUY' ? '📈' : '📉';
  const statusEmoji = signal.status === 'active' ? '🚀' : '🔄';
  
  return {
    title: `${statusEmoji} ${signal.pair} ${signal.type} Signal`,
    body: `${emoji} Entry: $${signal.entry_price.toFixed(2)} • Tap to view details`,
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800&h=200',
    actions: [
      {
        action: 'view',
        title: '📈 View Signal',
      },
      {
        action: 'open_chart',
        title: '📊 Open Chart',
      },
      {
        action: 'dismiss',
        title: '❌ Dismiss',
      },
    ],
    deepLink: {
      type: 'signal',
      id: signal.id,
    },
    data: {
      signal_id: signal.id,
      pair: signal.pair,
      type: signal.type,
      entry_price: signal.entry_price.toString(),
      status: signal.status,
    },
  };
}

// Create achievement notification
export function createAchievementNotification(achievement: {
  title: string;
  description: string;
  type: string;
}): RichNotificationData {
  return {
    title: `🏆 Achievement Unlocked: ${achievement.title}`,
    body: achievement.description,
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=800&h=200',
    actions: [
      {
        action: 'view',
        title: '🏆 View Achievement',
      },
      {
        action: 'share',
        title: '📤 Share',
      },
      {
        action: 'dismiss',
        title: '❌ Dismiss',
      },
    ],
    deepLink: {
      type: 'home',
      params: {
        tab: 'achievements',
        achievement: achievement.type,
      },
    },
    data: {
      achievement_type: achievement.type,
      achievement_title: achievement.title,
    },
  };
}

// Create market update notification
export function createMarketUpdateNotification(update: {
  title: string;
  message: string;
  market: string;
  sentiment: string;
}): RichNotificationData {
  const emoji = update.sentiment === 'bullish' ? '🐂' : update.sentiment === 'bearish' ? '🐻' : '📊';
  
  return {
    title: `${emoji} Market Update: ${update.title}`,
    body: update.message,
    image: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800&h=200',
    actions: [
      {
        action: 'view',
        title: '📊 View Market',
      },
      {
        action: 'open_chart',
        title: '📈 Open Chart',
      },
      {
        action: 'dismiss',
        title: '❌ Dismiss',
      },
    ],
    deepLink: {
      type: 'home',
      params: {
        market: update.market,
      },
    },
    data: {
      market: update.market,
      sentiment: update.sentiment,
      update_type: 'market_analysis',
    },
  };
}

// Get default actions for notification type
export function getDefaultActions(type: 'signal' | 'achievement' | 'announcement' | 'alert'): NotificationAction[] {
  switch (type) {
    case 'signal':
      return [
        { action: 'view', title: '📈 View Signal' },
        { action: 'open_chart', title: '📊 Chart' },
        { action: 'dismiss', title: '❌ Dismiss' },
      ];
    
    case 'achievement':
      return [
        { action: 'view', title: '🏆 View' },
        { action: 'share', title: '📤 Share' },
        { action: 'dismiss', title: '❌ Dismiss' },
      ];
    
    case 'announcement':
      return [
        { action: 'view', title: '📖 Read More' },
        { action: 'dismiss', title: '❌ Dismiss' },
      ];
    
    case 'alert':
      return [
        { action: 'view', title: '⚠️ View Alert' },
        { action: 'dismiss', title: '❌ Dismiss' },
      ];
    
    default:
      return [
        { action: 'view', title: '👀 View' },
        { action: 'dismiss', title: '❌ Dismiss' },
      ];
  }
}