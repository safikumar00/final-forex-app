/*
  # Create notification_clicks table

  1. New Tables
    - `notification_clicks`
      - `id` (uuid, primary key)
      - `notification_id` (uuid, foreign key to notifications.id)
      - `user_id` (uuid, foreign key to user_profiles.id)
      - `action` (text, click action type)
      - `clicked_at` (timestamp, default now())
      - `platform` (text, device platform)
      - `deep_link` (text, optional deep link URL)

  2. Security
    - Enable RLS on `notification_clicks` table
    - Add policy for users to read/write their own clicks
    - Add policy for service role full access

  3. Indexes
    - Index on (user_id, notification_id) for fast lookups
    - Index on notification_id for analytics
    - Index on clicked_at for time-based queries
*/

-- Create notification_clicks table
CREATE TABLE IF NOT EXISTS notification_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL,
  user_id uuid NOT NULL,
  action text NOT NULL DEFAULT 'clicked',
  clicked_at timestamptz DEFAULT now(),
  platform text DEFAULT 'web',
  deep_link text,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE notification_clicks 
ADD CONSTRAINT fk_notification_clicks_notification 
FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE;

ALTER TABLE notification_clicks 
ADD CONSTRAINT fk_notification_clicks_user 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Add check constraint for action types
ALTER TABLE notification_clicks 
ADD CONSTRAINT notification_clicks_action_check 
CHECK (action IN ('clicked', 'view', 'share', 'dismiss', 'open_chart', 'default'));

-- Add check constraint for platform types
ALTER TABLE notification_clicks 
ADD CONSTRAINT notification_clicks_platform_check 
CHECK (platform IN ('web', 'ios', 'android'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notification_clicks_user_notification 
ON notification_clicks (user_id, notification_id);

CREATE INDEX IF NOT EXISTS idx_notification_clicks_notification 
ON notification_clicks (notification_id);

CREATE INDEX IF NOT EXISTS idx_notification_clicks_clicked_at 
ON notification_clicks (clicked_at);

CREATE INDEX IF NOT EXISTS idx_notification_clicks_action 
ON notification_clicks (action);

-- Enable Row Level Security
ALTER TABLE notification_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own notification clicks"
  ON notification_clicks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own notification clicks"
  ON notification_clicks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Service role has full access to notification clicks"
  ON notification_clicks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert clicks (for device-based tracking)
CREATE POLICY "Anonymous users can insert notification clicks"
  ON notification_clicks
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can read notification clicks"
  ON notification_clicks
  FOR SELECT
  TO anon
  USING (true);