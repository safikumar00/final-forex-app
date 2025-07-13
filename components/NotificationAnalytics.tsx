import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ChartBar as BarChart, Eye, MousePointer, Users, TrendingUp } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  getNotificationAnalytics,
  getNotificationEngagementMetrics,
  NotificationAnalytics,
} from '../lib/notifications/analytics';

interface NotificationAnalyticsProps {
  notificationId?: string;
}

export default function NotificationAnalyticsComponent({ notificationId }: NotificationAnalyticsProps) {
  const { colors, fontSizes } = useTheme();
  const [analytics, setAnalytics] = useState<NotificationAnalytics[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [notificationId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, metricsData] = await Promise.all([
        getNotificationAnalytics(notificationId),
        getNotificationEngagementMetrics(),
      ]);
      
      setAnalytics(analyticsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading notification analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    title: {
      fontSize: fontSizes.subtitle,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
    },
    loadingContainer: {
      padding: 40,
      alignItems: 'center',
    },
    loadingText: {
      color: colors.text,
      fontSize: fontSizes.medium,
      fontFamily: 'Inter-Medium',
      marginTop: 16,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    metricCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricValue: {
      fontSize: fontSizes.subtitle,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
      marginTop: 8,
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
    },
    notificationItem: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    notificationTitle: {
      fontSize: fontSizes.medium,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'Inter-SemiBold',
      flex: 1,
    },
    notificationStats: {
      flexDirection: 'row',
      gap: 16,
      marginTop: 8,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statText: {
      fontSize: fontSizes.small,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: fontSizes.medium,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
      marginTop: 16,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <BarChart size={18} color={colors.primary} />
        </View>
        <Text style={styles.title}>Notification Analytics</Text>
      </View>

      {/* Overall Metrics */}
      {metrics && (
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <TrendingUp size={24} color={colors.primary} />
            <Text style={styles.metricValue}>{metrics.total_notifications}</Text>
            <Text style={styles.metricLabel}>Total Sent</Text>
          </View>
          <View style={styles.metricCard}>
            <MousePointer size={24} color={colors.secondary} />
            <Text style={styles.metricValue}>{metrics.total_clicks}</Text>
            <Text style={styles.metricLabel}>Total Clicks</Text>
          </View>
          <View style={styles.metricCard}>
            <Eye size={24} color={colors.success} />
            <Text style={styles.metricValue}>{metrics.total_views}</Text>
            <Text style={styles.metricLabel}>Total Views</Text>
          </View>
          <View style={styles.metricCard}>
            <Users size={24} color={colors.warning} />
            <Text style={styles.metricValue}>
              {metrics.average_click_rate.toFixed(1)}%
            </Text>
            <Text style={styles.metricLabel}>Avg Click Rate</Text>
          </View>
        </View>
      )}

      {/* Individual Notification Analytics */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {analytics.length === 0 ? (
          <View style={styles.emptyState}>
            <BarChart size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No analytics data available</Text>
          </View>
        ) : (
          analytics.map((item) => (
            <View key={item.notification_id} style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle} numberOfLines={2}>
                  Notification Analytics
                </Text>
              </View>
              
              <View style={styles.notificationStats}>
                <View style={styles.statItem}>
                  <MousePointer size={16} color={colors.secondary} />
                  <Text style={styles.statText}>{item.click_count} clicks</Text>
                </View>
                <View style={styles.statItem}>
                  <Eye size={16} color={colors.success} />
                  <Text style={styles.statText}>{item.view_count} views</Text>
                </View>
                <View style={styles.statItem}>
                  <Users size={16} color={colors.warning} />
                  <Text style={styles.statText}>{item.unique_users} unique users</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}