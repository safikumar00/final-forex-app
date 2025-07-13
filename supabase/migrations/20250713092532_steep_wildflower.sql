/*
  # Create app_info table for dynamic About section

  1. New Tables
    - `app_info`
      - `id` (uuid, primary key)
      - `title` (text) - App name or section title
      - `subtitle` (text) - Tagline or short purpose
      - `description` (text) - Long-form content
      - `features` (text[]) - List of app features
      - `how_to_use` (text[]) - Steps on using the app
      - `contact_email` (text) - Support email
      - `twitter_url` (text) - Social link
      - `linkedin_url` (text) - Social link
      - `telegram_url` (text) - Community link
      - `updated_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `app_info` table
    - Add policy for public read access
    - Add policy for service role write access

  3. Sample Data
    - Insert default app information
*/

-- Create the app_info table
CREATE TABLE IF NOT EXISTS app_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Gold & Silver Trading Signals',
  subtitle text NOT NULL DEFAULT 'Professional Trading Opportunities',
  description text NOT NULL DEFAULT 'Get real-time trading signals for Gold (XAU/USD) and Silver (XAG/USD) with professional analysis, technical indicators, and risk management guidance.',
  features text[] NOT NULL DEFAULT ARRAY[
    'Real-time Gold & Silver trading signals',
    'Professional technical analysis',
    'Risk management guidance',
    'Live price tracking',
    'Trading calculators',
    'Multi-language support'
  ],
  how_to_use text[] NOT NULL DEFAULT ARRAY[
    'Browse live trading signals on the Signals tab',
    'Use calculators to manage risk and position sizing',
    'Monitor live prices and technical indicators',
    'Follow signal updates and profit/loss tracking',
    'Customize settings and preferences'
  ],
  contact_email text DEFAULT 'support@tradingsignals.com',
  twitter_url text DEFAULT NULL,
  linkedin_url text DEFAULT NULL,
  telegram_url text DEFAULT 'https://t.me/tradingsignals',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE app_info ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to app_info"
  ON app_info
  FOR SELECT
  TO public
  USING (true);

-- Create policy for service role write access
CREATE POLICY "Allow service role write access to app_info"
  ON app_info
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert default app information
INSERT INTO app_info (
  title,
  subtitle,
  description,
  features,
  how_to_use,
  contact_email,
  telegram_url
) VALUES (
  'Gold & Silver Trading Signals',
  'Professional Trading Opportunities at Your Fingertips',
  'Our app provides real-time trading signals for precious metals with comprehensive technical analysis. Whether you''re a beginner or experienced trader, get the insights you need to make informed trading decisions in the Gold and Silver markets.',
  ARRAY[
    '📊 Real-time Gold & Silver signals',
    '📈 Professional technical analysis',
    '🎯 Risk management tools',
    '💰 Live price tracking',
    '🧮 Advanced trading calculators',
    '🌍 Multi-language support',
    '📱 Cross-platform compatibility'
  ],
  ARRAY[
    'Open the Signals tab to view live trading opportunities',
    'Tap any signal to see detailed entry, take profit, and stop loss levels',
    'Use the Calculator tab for position sizing and risk management',
    'Monitor live prices and technical indicators on the Home tab',
    'Customize your experience in Settings with themes and languages'
  ],
  'support@tradingsignals.com',
  'https://t.me/tradingsignals'
) ON CONFLICT DO NOTHING;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_app_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_app_info_updated_at_trigger
  BEFORE UPDATE ON app_info
  FOR EACH ROW
  EXECUTE FUNCTION update_app_info_updated_at();