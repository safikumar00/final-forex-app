import { Platform } from 'react-native';
import { supabase } from '../supabase';
import { getCurrentDeviceId } from './core';

export interface NotificationClickData {
  notification_id: string;
  user_id: string;
  action_type: 'default' | 'view' | 'dismiss' | 'open_chart' | 'share';
  clicked_at: string;
  platform: 'web' | 'ios' | 'android';
  deep_link?: string;
}

// Log notification click to Supabase
export async function logNotificationClick(data: Omit<NotificationClickData, 'clicked_at' | 'platform'>): Promise<boolean> {
  try {
    const deviceId = await getCurrentDeviceId();
    
    const clickData: NotificationClickData = {
      ...data,
      user_id: data.user_id || deviceId,
      clicked_at: new Date().toISOString(),
      platform: Platform.OS as 'web' | 'ios' | 'android',
    };
    
    console.log('📊 Logging notification click:', clickData);
    
    // Insert into notification_clicks table
    const { error } = await supabase
      .from('notification_clicks')
      .insert({
        notification_id: clickData.notification_id,
        user_id: clickData.user_id,
        action: clickData.action_type,
        clicked_at: clickData.clicked_at,
        platform: clickData.platform,
        deep_link: clickData.deep_link,
      });
    
    if (error) {
      console.error('❌ Error logging notification click:', error);
      return false;
    }
    
    // Update notification statistics
    const { error: rpcError } = await supabase.rpc('increment_notification_click_count', {
      p_notification_id: data.notification_id,
      p_action_type: data.action_type
    });
    
    if (rpcError) {
      console.error('❌ Error updating notification stats:', rpcError);
      // Don't return false here - the click was logged successfully
    }
    
    // Add user to clicked list if it's a click action
    if (data.action_type === 'clicked' || data.action_type === 'view') {
      const { error: userError } = await supabase.rpc('add_user_to_clicked_list', {
        p_notification_id: data.notification_id,
        p_user_id: clickData.user_id
      });
      
      if (userError) {
        console.error('❌ Error adding user to clicked list:', userError);
      }
    }
    
    console.log('✅ Notification click logged successfully');
    return true;
  } catch (error) {
    console.error('❌ Error in logNotificationClick:', error);
    return false;
  }
}

// Get notification click analytics
export async function getNotificationClickAnalytics(notificationId?: string): Promise<any[]> {
  try {
    let query = supabase
      .from('notification_clicks')
      .select(`
        *,
        notifications(title, type, created_at)
      `)
      .order('clicked_at', { ascending: false });
    
    if (notificationId) {
      query = query.eq('notification_id', notificationId);
    }
    
    const { data, error } = await query.limit(100);
    
    if (error) {
      console.error('Error fetching click analytics:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Network error fetching click analytics:', error);
    return [];
  }
}

// Get click statistics for a notification
export async function getNotificationClickStats(notificationId: string): Promise<{
  total_clicks: number;
  action_breakdown: Record<string, number>;
  unique_users: number;
}> {
  try {
    const { data, error } = await supabase
      .from('notification_clicks')
      .select('action_type, user_id')
      .eq('notification_id', notificationId);
    
    if (error) {
      console.error('Error fetching click stats:', error);
      return { total_clicks: 0, action_breakdown: {}, unique_users: 0 };
    }
    
    const clicks = data || [];
    const actionBreakdown: Record<string, number> = {};
    const uniqueUsers = new Set<string>();
    
    clicks.forEach(click => {
      actionBreakdown[click.action_type] = (actionBreakdown[click.action_type] || 0) + 1;
      uniqueUsers.add(click.user_id);
    });
    
    return {
      total_clicks: clicks.length,
      action_breakdown: actionBreakdown,
      unique_users: uniqueUsers.size,
    };
  } catch (error) {
    console.error('Error calculating click stats:', error);
    return { total_clicks: 0, action_breakdown: {}, unique_users: 0 };
  }
}

// Track notification impression (when notification is shown)
export async function logNotificationImpression(notificationId: string, userId?: string): Promise<boolean> {
  try {
    const deviceId = await getCurrentDeviceId();
    
    const { error } = await supabase
      .from('notification_impressions')
      .insert({
        notification_id: notificationId,
        user_id: userId || deviceId,
        shown_at: new Date().toISOString(),
        platform: Platform.OS,
      });
    
    if (error) {
      console.error('❌ Error logging notification impression:', error);
      return false;
    }
    
    console.log('✅ Notification impression logged');
    return true;
  } catch (error) {
    console.error('❌ Error in logNotificationImpression:', error);
    return false;
  }
}