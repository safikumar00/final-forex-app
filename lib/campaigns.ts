import { supabase } from './supabase';

export interface Campaign {
  id: string;
  title?: string;
  description?: string;
  image_1_4: string;
  image_1_3?: string;
  image_1_2?: string;
  is_active: boolean;
  views: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

// Fetch random campaign for signals page (1:4 ratio banner)
export async function getRandomSignalsPageCampaign(): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('is_active', true)
      .not('image_1_4', 'is', null)
      .limit(10); // Get multiple to randomize on client

    if (error) {
      console.error('Error fetching signals page campaigns:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Return random campaign from available ones
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error('Network error fetching signals page campaigns:', error);
    return null;
  }
}

// Fetch random campaign for signal modal (1:2 ratio banner)
export async function getRandomSignalModalCampaign(): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('is_active', true)
      .not('image_1_2', 'is', null)
      .limit(10); // Get multiple to randomize on client

    if (error) {
      console.error('Error fetching signal modal campaigns:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Return random campaign from available ones
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error('Network error fetching signal modal campaigns:', error);
    return null;
  }
}

// Increment campaign views
export async function incrementCampaignViews(campaignId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_campaign_views', {
      campaign_id: campaignId
    });

    if (error) {
      console.error('Error incrementing campaign views:', error);
    }
  } catch (error) {
    console.error('Network error incrementing campaign views:', error);
  }
}

// Increment campaign clicks
export async function incrementCampaignClicks(campaignId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_campaign_clicks', {
      campaign_id: campaignId
    });

    if (error) {
      console.error('Error incrementing campaign clicks:', error);
    }
  } catch (error) {
    console.error('Network error incrementing campaign clicks:', error);
  }
}

// Get all campaigns (for admin purposes)
export async function getAllCampaigns(): Promise<Campaign[]> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all campaigns:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Network error fetching all campaigns:', error);
    return [];
  }
}

// Update campaign status
export async function updateCampaignStatus(campaignId: string, isActive: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ is_active: isActive })
      .eq('id', campaignId);

    if (error) {
      console.error('Error updating campaign status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network error updating campaign status:', error);
    return false;
  }
}