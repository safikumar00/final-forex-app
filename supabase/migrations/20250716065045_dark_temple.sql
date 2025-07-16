/*
  # Add notification analytics functions

  1. Functions
    - `increment_notification_click_count` - Increment click counters
    - `get_notification_analytics` - Get comprehensive analytics
    - `get_user_notification_stats` - Get user-specific stats

  2. Purpose
    - Provide efficient analytics queries
    - Support real-time click tracking
    - Enable comprehensive reporting
*/

-- Function to increment notification click count
CREATE OR REPLACE FUNCTION increment_notification_click_count(
  p_notification_id uuid,
  p_action_type text DEFAULT 'clicked'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the notifications table with click count
  UPDATE notifications 
  SET 
    click_count = COALESCE(click_count, 0) + 1,
    updated_at = now()
  WHERE id = p_notification_id;
  
  -- If it's a click action, also update view count
  IF p_action_type = 'clicked' OR p_action_type = 'view' THEN
    UPDATE notifications 
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = p_notification_id;
  END IF;
END;
$$;

-- Function to add user to clicked list
CREATE OR REPLACE FUNCTION add_user_to_clicked_list(
  p_notification_id uuid,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add user to clicked_user_ids array if not already present
  UPDATE notifications 
  SET 
    clicked_user_ids = CASE 
      WHEN clicked_user_ids IS NULL THEN ARRAY[p_user_id]
      WHEN NOT (p_user_id = ANY(clicked_user_ids)) THEN array_append(clicked_user_ids, p_user_id)
      ELSE clicked_user_ids
    END,
    updated_at = now()
  WHERE id = p_notification_id;
END;
$$;

-- Function to get comprehensive notification analytics
CREATE OR REPLACE FUNCTION get_notification_analytics(
  p_notification_id uuid DEFAULT NULL,
  p_days_back integer DEFAULT 30
)
RETURNS TABLE (
  notification_id uuid,
  title text,
  type text,
  created_at timestamptz,
  total_impressions bigint,
  total_clicks bigint,
  unique_users bigint,
  click_rate numeric,
  top_actions jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id as notification_id,
    n.title,
    n.type,
    n.created_at,
    COALESCE(imp.impression_count, 0) as total_impressions,
    COALESCE(clicks.click_count, 0) as total_clicks,
    COALESCE(clicks.unique_users, 0) as unique_users,
    CASE 
      WHEN COALESCE(imp.impression_count, 0) > 0 
      THEN ROUND((COALESCE(clicks.click_count, 0)::numeric / imp.impression_count::numeric) * 100, 2)
      ELSE 0
    END as click_rate,
    COALESCE(clicks.action_breakdown, '[]'::jsonb) as top_actions
  FROM notifications n
  LEFT JOIN (
    SELECT 
      notification_id,
      COUNT(*) as impression_count
    FROM notification_impressions
    WHERE shown_at >= now() - (p_days_back || ' days')::interval
    GROUP BY notification_id
  ) imp ON n.id = imp.notification_id
  LEFT JOIN (
    SELECT 
      notification_id,
      COUNT(*) as click_count,
      COUNT(DISTINCT user_id) as unique_users,
      jsonb_agg(
        jsonb_build_object(
          'action', action,
          'count', action_count
        ) ORDER BY action_count DESC
      ) as action_breakdown
    FROM (
      SELECT 
        notification_id,
        user_id,
        action,
        COUNT(*) as action_count
      FROM notification_clicks
      WHERE clicked_at >= now() - (p_days_back || ' days')::interval
      GROUP BY notification_id, user_id, action
    ) action_stats
    GROUP BY notification_id
  ) clicks ON n.id = clicks.notification_id
  WHERE 
    (p_notification_id IS NULL OR n.id = p_notification_id)
    AND n.created_at >= now() - (p_days_back || ' days')::interval
  ORDER BY n.created_at DESC;
END;
$$;

-- Function to get user notification statistics
CREATE OR REPLACE FUNCTION get_user_notification_stats(
  p_user_id uuid,
  p_days_back integer DEFAULT 30
)
RETURNS TABLE (
  total_received bigint,
  total_clicked bigint,
  total_impressions bigint,
  engagement_rate numeric,
  favorite_action text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(received.count, 0) as total_received,
    COALESCE(clicked.count, 0) as total_clicked,
    COALESCE(impressions.count, 0) as total_impressions,
    CASE 
      WHEN COALESCE(impressions.count, 0) > 0 
      THEN ROUND((COALESCE(clicked.count, 0)::numeric / impressions.count::numeric) * 100, 2)
      ELSE 0
    END as engagement_rate,
    COALESCE(top_action.action, 'none') as favorite_action
  FROM (
    SELECT COUNT(*) as count
    FROM notifications n
    WHERE 
      (target_user = p_user_id::text OR target_user IS NULL)
      AND created_at >= now() - (p_days_back || ' days')::interval
  ) received
  CROSS JOIN (
    SELECT COUNT(*) as count
    FROM notification_clicks
    WHERE 
      user_id = p_user_id
      AND clicked_at >= now() - (p_days_back || ' days')::interval
  ) clicked
  CROSS JOIN (
    SELECT COUNT(*) as count
    FROM notification_impressions
    WHERE 
      user_id = p_user_id
      AND shown_at >= now() - (p_days_back || ' days')::interval
  ) impressions
  LEFT JOIN (
    SELECT action
    FROM notification_clicks
    WHERE 
      user_id = p_user_id
      AND clicked_at >= now() - (p_days_back || ' days')::interval
    GROUP BY action
    ORDER BY COUNT(*) DESC
    LIMIT 1
  ) top_action ON true;
END;
$$;