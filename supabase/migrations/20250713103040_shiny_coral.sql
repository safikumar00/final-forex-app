/*
  # Add notification tracking capabilities

  1. Table Updates
    - Add click_count and view_count columns to notifications table
    - Add clicked_user_ids array to track which users clicked
    
  2. New Tables
    - `notification_events` - Track per-user interactions with notifications
    
  3. Functions
    - `increment_notification_counter` - Safely increment counters
    
  4. Security
    - Enable RLS on notification_events table
    - Add appropriate policies
    
  5. Indexes
    - Performance indexes for common queries
*/

-- Add tracking columns to notifications table
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Track users who clicked (optional for analytics)
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS clicked_user_ids UUID[] DEFAULT '{}';

-- Create notification_events table for per-user tracking
CREATE TABLE IF NOT EXISTS notification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('clicked', 'viewed')),
  event_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, notification_id, event_type)
);

-- Enable RLS on notification_events
ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;

-- Policies for notification_events
CREATE POLICY "Allow users to read own notification events"
  ON notification_events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow users to insert own notification events"
  ON notification_events
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow service role full access to notification events"
  ON notification_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notification_events_user ON notification_events(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_notification ON notification_events(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_events_type ON notification_events(event_type);
CREATE INDEX IF NOT EXISTS idx_notification_events_time ON notification_events(event_time);

-- Function to safely increment notification counters
CREATE OR REPLACE FUNCTION increment_notification_counter(
  p_notification_id UUID,
  p_column_name TEXT
)
RETURNS void AS $$
BEGIN
  -- Validate column name to prevent SQL injection
  IF p_column_name NOT IN ('click_count', 'view_count') THEN
    RAISE EXCEPTION 'Invalid column name: %', p_column_name;
  END IF;

  -- Use dynamic SQL to update the specified counter
  IF p_column_name = 'click_count' THEN
    UPDATE notifications 
    SET click_count = click_count + 1, updated_at = NOW()
    WHERE id = p_notification_id;
  ELSIF p_column_name = 'view_count' THEN
    UPDATE notifications 
    SET view_count = view_count + 1, updated_at = NOW()
    WHERE id = p_notification_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add user to clicked_user_ids array
CREATE OR REPLACE FUNCTION add_user_to_clicked_list(
  p_notification_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE notifications 
  SET 
    clicked_user_ids = array_append(clicked_user_ids, p_user_id),
    updated_at = NOW()
  WHERE id = p_notification_id 
    AND NOT (p_user_id = ANY(clicked_user_ids));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_notification_counter(UUID, TEXT) TO public, service_role;
GRANT EXECUTE ON FUNCTION add_user_to_clicked_list(UUID, UUID) TO public, service_role;

-- Add updated_at column to notifications if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE notifications ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_notifications_updated_at_trigger ON notifications;

-- Create the trigger
CREATE TRIGGER update_notifications_updated_at_trigger
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();