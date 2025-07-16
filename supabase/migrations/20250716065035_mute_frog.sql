/*
  # Create notification_impressions table

  1. New Tables
    - `notification_impressions`
      - `id` (uuid, primary key)
      - `notification_id` (uuid, foreign key to notifications.id)
      - `user_id` (uuid, foreign key to user_profiles.id)
      - `shown_at` (timestamp, default now())
      - `platform` (text, device platform)

  2. Security
    - Enable RLS on `notification_impressions` table
    - Add policy for users to read/write their own impressions
    - Add policy for service role full access

  3. Indexes
    - Index on (user_id, notification_id) for fast lookups
    - Index on notification_id for analytics
    - Index on shown_at for time-based queries

  4. Constraints
    - Unique constraint on (user_id, notification_id) to prevent duplicate impressions
*/

-- Create notification_impressions table
CREATE TABLE IF NOT EXISTS notification_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid NOT NULL,
  user_id uuid NOT NULL,
  shown_at timestamptz DEFAULT now(),
  platform text DEFAULT 'web',
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE notification_impressions 
ADD CONSTRAINT fk_notification_impressions_notification 
FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE;

ALTER TABLE notification_impressions 
ADD CONSTRAINT fk_notification_impressions_user 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Add check constraint for platform types
ALTER TABLE notification_impressions 
ADD CONSTRAINT notification_impressions_platform_check 
CHECK (platform IN ('web', 'ios', 'android'));

-- Add unique constraint to prevent duplicate impressions
ALTER TABLE notification_impressions 
ADD CONSTRAINT notification_impressions_user_notification_unique 
UNIQUE (user_id, notification_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notification_impressions_user_notification 
ON notification_impressions (user_id, notification_id);

CREATE INDEX IF NOT EXISTS idx_notification_impressions_notification 
ON notification_impressions (notification_id);

CREATE INDEX IF NOT EXISTS idx_notification_impressions_shown_at 
ON notification_impressions (shown_at);

CREATE INDEX IF NOT EXISTS idx_notification_impressions_platform 
ON notification_impressions (platform);

-- Enable Row Level Security
ALTER TABLE notification_impressions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own notification impressions"
  ON notification_impressions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own notification impressions"
  ON notification_impressions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Service role has full access to notification impressions"
  ON notification_impressions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert impressions (for device-based tracking)
CREATE POLICY "Anonymous users can insert notification impressions"
  ON notification_impressions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can read notification impressions"
  ON notification_impressions
  FOR SELECT
  TO anon
  USING (true);