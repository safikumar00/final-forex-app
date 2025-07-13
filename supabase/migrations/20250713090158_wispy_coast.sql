/*
  # Create campaigns table for dynamic banner management

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `title` (text, optional)
      - `description` (text, optional)
      - `image_1_4` (text, required) - 1:4 ratio banner for signals page
      - `image_1_3` (text, optional) - 1:3 ratio banner (reserved for future)
      - `image_1_2` (text, optional) - 1:2 ratio banner for signal modal
      - `is_active` (boolean, default true)
      - `views` (integer, default 0)
      - `clicks` (integer, default 0)
      - `created_at` (timestamp with timezone, default now)
      - `updated_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on `campaigns` table
    - Add policy for public read access to active campaigns only
    - Add policy for service role to manage campaigns
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_1_4 text NOT NULL,
  image_1_3 text,
  image_1_2 text,
  is_active boolean DEFAULT true,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active campaigns only
CREATE POLICY "Allow public read access to active campaigns"
  ON campaigns
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policy for service role to manage campaigns
CREATE POLICY "Allow service role full access to campaigns"
  ON campaigns
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_campaigns_updated_at_trigger
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_campaigns_updated_at();

-- Insert sample campaigns for testing
INSERT INTO campaigns (title, description, image_1_4, image_1_2, is_active) VALUES
(
  'Premium Trading Signals',
  'Get access to our premium trading signals with 90% accuracy rate',
  'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800&h=200',
  'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
  true
),
(
  'Gold Trading Masterclass',
  'Learn advanced gold trading strategies from professional traders',
  'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=800&h=200',
  'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
  true
),
(
  'Risk Management Course',
  'Master the art of risk management in forex and commodity trading',
  'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=800&h=200',
  'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=400&h=200',
  true
);