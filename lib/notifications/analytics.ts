import { supabase } from '../supabase';

export interface NotificationAnalytics {
  notification_id: string;
  click_count: number;
  view_count: number;
  clicked_user_ids: string[];
  total_events: number;
  unique_users: number;
}

export interface NotificationEvent {
  id: string;
  user_id: string;
  notification_id: string;
  event_type: 'clicked' | 'viewed';
  event_time: string;
  created_at: string;
}

// Log notification event (view or click)
export async function logNotificationEvent(
  userId: string,
  notificationId: string,
  eventType: 'clicked' | 'viewed'
): Promise<boolean> {
  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl || supabaseUrl.includes('demo-project')) {
      console.log('Demo mode - notification event logging not available');
      return false;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/log-notification-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        notification_id: notificationId,
        event_type: eventType,
      }),
    });

    if (!response.ok) {
      console.error('Failed to log notification event:', response.status, response.statusText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Notification ${eventType} event logged:`, result);
    
    return result.success;
  } catch (error) {
    console.error('Error logging notification event:', error);
    return false;
  }
}

// Get notification analytics
export async function getNotificationAnalytics(notificationId?: string): Promise<NotificationAnalytics[]> {
  try {
    let query = supabase
      .from('notifications')
      .select('id, title, type, click_count, view_count, clicked_user_ids, created_at')
      .order('created_at', { ascending: false });

    if (notificationId) {
      query = query.eq('id', notificationId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notification analytics:', error);
      return [];
    }

    return (data || []).map(notification => ({
      notification_id: notification.id,
      click_count: notification.click_count || 0,
      view_count: notification.view_count || 0,
      clicked_user_ids: notification.clicked_user_ids || [],
      total_events: (notification.click_count || 0) + (notification.view_count || 0),
      unique_users: (notification.clicked_user_ids || []).length,
    }));
  } catch (error) {
    console.error('Network error fetching notification analytics:', error);
    return [];
  }
}

// Get notification events for a specific notification
export async function getNotificationEvents(notificationId: string): Promise<NotificationEvent[]> {
  try {
    const { data, error } = await supabase
      .from('notification_events')
      .select('*')
      .eq('notification_id', notificationId)
      .order('event_time', { ascending: false });

    if (error) {
      console.error('Error fetching notification events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Network error fetching notification events:', error);
    return [];
  }
}

// Get user's notification interaction history
export async function getUserNotificationHistory(userId: string): Promise<NotificationEvent[]> {
  try {
    const { data, error } = await supabase
      .from('notification_events')
      .select(`
        *,
        notifications(title, type, message)
      `)
      .eq('user_id', userId)
      .order('event_time', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching user notification history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Network error fetching user notification history:', error);
    return [];
  }
}

// Get notification engagement metrics
export async function getNotificationEngagementMetrics(): Promise<{
  total_notifications: number;
  total_clicks: number;
  total_views: number;
  average_click_rate: number;
  average_view_rate: number;
}> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('click_count, view_count')
      .not('click_count', 'is', null)
      .not('view_count', 'is', null);

    if (error) {
      console.error('Error fetching engagement metrics:', error);
      return {
        total_notifications: 0,
        total_clicks: 0,
        total_views: 0,
        average_click_rate: 0,
        average_view_rate: 0,
      };
    }

    const notifications = data || [];
    const totalNotifications = notifications.length;
    const totalClicks = notifications.reduce((sum, n) => sum + (n.click_count || 0), 0);
    const totalViews = notifications.reduce((sum, n) => sum + (n.view_count || 0), 0);

    return {
      total_notifications: totalNotifications,
      total_clicks: totalClicks,
      total_views: totalViews,
      average_click_rate: totalNotifications > 0 ? totalClicks / totalNotifications : 0,
      average_view_rate: totalNotifications > 0 ? totalViews / totalNotifications : 0,
    };
  } catch (error) {
    console.error('Network error fetching engagement metrics:', error);
    return {
      total_notifications: 0,
      total_clicks: 0,
      total_views: 0,
      average_click_rate: 0,
      average_view_rate: 0,
    };
  }
}