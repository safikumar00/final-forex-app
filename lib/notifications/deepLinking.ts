import { Linking } from 'react-native';
import { router } from 'expo-router';

export interface DeepLinkData {
  type: 'signal' | 'chat' | 'offer' | 'settings' | 'home';
  id?: string;
  params?: Record<string, string>;
}

// Parse deep link URL and extract data
export function parseDeepLink(url: string): DeepLinkData | null {
  try {
    console.log('🔗 Parsing deep link:', url);
    
    // Handle both custom scheme and universal links
    const cleanUrl = url.replace(/^(myapp:\/\/|https:\/\/tradingsignals\.app\/)/, '');
    const [type, id, ...params] = cleanUrl.split('/');
    
    if (!type) return null;
    
    const linkData: DeepLinkData = {
      type: type as DeepLinkData['type'],
      id,
      params: {}
    };
    
    // Parse additional parameters
    if (params.length > 0) {
      for (let i = 0; i < params.length; i += 2) {
        if (params[i] && params[i + 1]) {
          linkData.params![params[i]] = params[i + 1];
        }
      }
    }
    
    console.log('✅ Parsed deep link data:', linkData);
    return linkData;
  } catch (error) {
    console.error('❌ Error parsing deep link:', error);
    return null;
  }
}

// Handle deep link navigation
export function handleDeepLink(linkData: DeepLinkData): void {
  try {
    console.log('🚀 Handling deep link navigation:', linkData);
    
    switch (linkData.type) {
      case 'signal':
        if (linkData.id) {
          // Navigate to specific signal
          router.push(`/(tabs)/signals?id=${linkData.id}`);
        } else {
          // Navigate to signals list
          router.push('/(tabs)/signals');
        }
        break;
        
      case 'chat':
        if (linkData.id) {
          // Navigate to specific chat/offer
          router.push(`/chat/${linkData.id}`);
        }
        break;
        
      case 'offer':
        if (linkData.id) {
          // Navigate to specific offer
          router.push(`/offer/${linkData.id}`);
        }
        break;
        
      case 'settings':
        router.push('/(tabs)/settings');
        break;
        
      case 'home':
      default:
        router.push('/(tabs)/');
        break;
    }
    
    console.log('✅ Deep link navigation completed');
  } catch (error) {
    console.error('❌ Error handling deep link:', error);
    // Fallback to home screen
    router.push('/(tabs)/');
  }
}

// Initialize deep linking system
export function initializeDeepLinking(): () => void {
  console.log('🔗 Initializing deep linking system...');
  
  // Handle initial URL if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('📱 App opened with initial URL:', url);
      const linkData = parseDeepLink(url);
      if (linkData) {
        // Delay navigation to ensure app is fully loaded
        setTimeout(() => handleDeepLink(linkData), 1000);
      }
    }
  });
  
  // Listen for incoming deep links while app is running
  const subscription = Linking.addEventListener('url', ({ url }) => {
    console.log('📱 Received deep link while app running:', url);
    const linkData = parseDeepLink(url);
    if (linkData) {
      handleDeepLink(linkData);
    }
  });
  
  console.log('✅ Deep linking system initialized');
  
  // Return cleanup function
  return () => {
    subscription?.remove();
  };
}

// Generate deep link URL
export function generateDeepLink(data: DeepLinkData): string {
  let url = `myapp://${data.type}`;
  
  if (data.id) {
    url += `/${data.id}`;
  }
  
  if (data.params) {
    const paramPairs = Object.entries(data.params).flat();
    if (paramPairs.length > 0) {
      url += `/${paramPairs.join('/')}`;
    }
  }
  
  return url;
}

// Generate universal link (for web/sharing)
export function generateUniversalLink(data: DeepLinkData): string {
  let url = `https://tradingsignals.app/${data.type}`;
  
  if (data.id) {
    url += `/${data.id}`;
  }
  
  if (data.params) {
    const searchParams = new URLSearchParams(data.params);
    url += `?${searchParams.toString()}`;
  }
  
  return url;
}