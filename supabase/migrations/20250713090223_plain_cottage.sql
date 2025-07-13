/*
  # Create functions for campaign analytics

  1. Functions
    - `increment_campaign_views` - Safely increment view count
    - `increment_campaign_clicks` - Safely increment click count
*/

-- Function to increment campaign views
CREATE OR REPLACE FUNCTION increment_campaign_views(campaign_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE campaigns 
  SET views = views + 1, updated_at = now()
  WHERE id = campaign_id AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment campaign clicks
CREATE OR REPLACE FUNCTION increment_campaign_clicks(campaign_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE campaigns 
  SET clicks = clicks + 1, updated_at = now()
  WHERE id = campaign_id AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;