import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { Mail, MessageCircle, Twitter, Linkedin, ExternalLink, CheckCircle, Play } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AppInfo, fetchAppInfo } from '../lib/appInfo';
import CampaignBanner from './CampaignBanner';
import { Campaign, getRandomSignalsPageCampaign } from '../lib/campaigns';

export default function AboutAppSection() {
  const { colors, fontSizes } = useTheme();
  const { t } = useLanguage();
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppInfo();
    loadCampaign();
  }, []);

  const loadAppInfo = async () => {
    try {
      const info = await fetchAppInfo();
      setAppInfo(info);
    } catch (error) {
      console.error('Error loading app info:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaign = async () => {
    try {
      const randomCampaign = await getRandomSignalsPageCampaign();
      setCampaign(randomCampaign);
    } catch (error) {
      console.error('Error loading campaign:', error);
    }
  };

  const handleSocialLink = async (url: string | undefined, platform: string) => {
    if (!url) return;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Cannot open ${platform} URL: ${url}`);
      }
    } catch (error) {
      console.error(`Error opening ${platform} link:`, error);
    }
  };

  const handleEmailContact = async () => {
    if (!appInfo?.contact_email) return;

    const emailUrl = `mailto:${appInfo.contact_email}?subject=Trading Signals App Support`;
    try {
      await Linking.openURL(emailUrl);
    } catch (error) {
      console.error('Error opening email:', error);
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
    loadingText: {
      fontSize: fontSizes.medium,
      fontFamily: 'Inter-Regular',
      textAlign: 'center',
      padding: 20,
    },
    title: {
      fontSize: fontSizes.title,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fontSizes.subtitle,
      color: colors.primary,
      fontFamily: 'Inter-SemiBold',
      marginBottom: 16,
      textAlign: 'center',
    },
    description: {
      fontSize: fontSizes.medium,
      color: colors.text,
      fontFamily: 'Inter-Regular',
      lineHeight: 22,
      marginBottom: 24,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: fontSizes.subtitle,
      fontWeight: 'bold',
      color: colors.text,
      fontFamily: 'Inter-Bold',
      marginBottom: 12,
      marginTop: 8,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    featureText: {
      fontSize: fontSizes.medium,
      color: colors.text,
      fontFamily: 'Inter-Regular',
      marginLeft: 8,
      flex: 1,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    stepNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    stepNumberText: {
      fontSize: fontSizes.small,
      color: colors.background,
      fontFamily: 'Inter-Bold',
    },
    stepText: {
      fontSize: fontSizes.medium,
      color: colors.text,
      fontFamily: 'Inter-Regular',
      flex: 1,
      lineHeight: 20,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    socialButtonText: {
      fontSize: fontSizes.small,
      color: colors.text,
      fontFamily: 'Inter-Medium',
    },
    campaignContainer: {
      marginBottom: 16,
    },
  });

  if (loading || !appInfo) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('loading')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Campaign Banner */}
      {campaign && (
        <View style={styles.campaignContainer}>
          <CampaignBanner campaign={campaign} aspectRatio="1:4" />
        </View>
      )}

      {/* App Title & Description */}
      <Text style={styles.title}>{appInfo.title}</Text>
      <Text style={styles.subtitle}>{appInfo.subtitle}</Text>
      <Text style={styles.description}>{appInfo.description}</Text>

      {/* Features Section */}
      <Text style={styles.sectionTitle}>✨ Key Features</Text>
      {appInfo?.features?.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <CheckCircle size={16} color={colors.success} />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}

      {/* How to Use Section */}
      <Text style={styles.sectionTitle}>🚀 How to Get Started</Text>
      {appInfo?.how_to_use?.map((step, index) => (
        <View key={index} style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      {/* Social Links */}
      <View style={styles.socialContainer}>
        {appInfo.contact_email && (
          <TouchableOpacity style={styles.socialButton} onPress={handleEmailContact}>
            <Mail size={16} color={colors.primary} />
            <Text style={styles.socialButtonText}>Support</Text>
          </TouchableOpacity>
        )}

        {appInfo.telegram_url && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLink(appInfo.telegram_url, 'Telegram')}
          >
            <MessageCircle size={16} color={colors.secondary} />
            <Text style={styles.socialButtonText}>Telegram</Text>
          </TouchableOpacity>
        )}

        {appInfo.twitter_url && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLink(appInfo.twitter_url, 'Twitter')}
          >
            <Twitter size={16} color={colors.warning} />
            <Text style={styles.socialButtonText}>Twitter</Text>
          </TouchableOpacity>
        )}

        {appInfo.linkedin_url && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLink(appInfo.linkedin_url, 'LinkedIn')}
          >
            <Linkedin size={16} color={colors.primary} />
            <Text style={styles.socialButtonText}>LinkedIn</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}