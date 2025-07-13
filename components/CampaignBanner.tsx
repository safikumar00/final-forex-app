import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Campaign, incrementCampaignViews, incrementCampaignClicks } from '../lib/campaigns';

interface CampaignBannerProps {
  campaign: Campaign;
  aspectRatio: '1:4' | '1:2';
  onPress?: () => void;
}

export default function CampaignBanner({ campaign, aspectRatio, onPress }: CampaignBannerProps) {
  const { colors, fontSizes } = useTheme();

  useEffect(() => {
    // Increment views when banner is shown
    incrementCampaignViews(campaign.id);
  }, [campaign.id]);

  const handlePress = async () => {
    // Increment clicks when banner is tapped
    await incrementCampaignClicks(campaign.id);
    
    if (onPress) {
      onPress();
    } else if (campaign.description) {
      // Default action - could open a link or show more info
      console.log('Campaign clicked:', campaign.title);
    }
  };

  const getImageSource = () => {
    if (aspectRatio === '1:4') {
      return campaign.image_1_4;
    } else {
      return campaign.image_1_2 || campaign.image_1_4;
    }
  };

  const getContainerHeight = () => {
    return aspectRatio === '1:4' ? 80 : 120;
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: 12,
      overflow: 'hidden',
      marginVertical: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      height: getContainerHeight(),
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 8,
    },
    title: {
      fontSize: fontSizes.medium,
      fontWeight: 'bold',
      color: '#ffffff',
      fontFamily: 'Inter-Bold',
    },
    description: {
      fontSize: fontSizes.small,
      color: '#ffffff',
      fontFamily: 'Inter-Regular',
      marginTop: 2,
      opacity: 0.9,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <Image source={{ uri: getImageSource() }} style={styles.image} />
      {(campaign.title || campaign.description) && (
        <View style={styles.overlay}>
          {campaign.title && (
            <Text style={styles.title} numberOfLines={1}>
              {campaign.title}
            </Text>
          )}
          {campaign.description && aspectRatio === '1:2' && (
            <Text style={styles.description} numberOfLines={2}>
              {campaign.description}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}