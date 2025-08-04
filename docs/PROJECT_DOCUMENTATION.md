# Gold & Silver Trading Signals App - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features List](#features-list)
3. [Architecture & Folder Structure](#architecture--folder-structure)
4. [Dependencies & Technologies](#dependencies--technologies)
5. [Setup Instructions](#setup-instructions)
6. [Configuration & Environment Variables](#configuration--environment-variables)
7. [Database & Data Flow](#database--data-flow)
8. [Key Components & Functions](#key-components--functions)
9. [API Endpoints](#api-endpoints)
10. [Authentication & Authorization](#authentication--authorization)
11. [UI/UX Flow](#uiux-flow)
12. [Error Handling & Logging](#error-handling--logging)
13. [Security Measures](#security-measures)
14. [Build & Deployment Guide](#build--deployment-guide)
15. [Limitations & Future Improvements](#limitations--future-improvements)
16. [Glossary](#glossary)

---

## Project Overview

### Purpose
The **Gold & Silver Trading Signals App** is a professional-grade mobile and web application that provides real-time trading signals for precious metals (Gold XAU/USD and Silver XAG/USD). The app delivers actionable trading opportunities with technical analysis, risk management tools, and comprehensive market data.

### Target Audience
- Forex and commodity traders
- Investment professionals
- Trading enthusiasts
- Financial market participants

### Main Technology Stack
- **Frontend**: React Native with Expo SDK 52.0.30
- **Navigation**: Expo Router 4.0.17
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **Push Notifications**: Firebase Cloud Messaging (FCM v1 API)
- **Styling**: React Native StyleSheet with custom theming
- **State Management**: React Context API
- **Real-time Data**: Supabase real-time subscriptions
- **Charts**: TradingView widgets via WebView
- **Internationalization**: i18n-js with 4 languages

---

## Features List

### 🏠 Core Trading Features

#### 1. **Real-time Trading Signals**
- Live BUY/SELL signals for XAU/USD (Gold) and XAG/USD (Silver)
- Multiple take-profit levels per signal
- Stop-loss management
- Signal accuracy tracking
- Risk-to-reward ratio calculations
- Real-time signal status updates (active, closed, pending)

#### 2. **Live Market Data**
- Real-time price feeds for precious metals
- Daily high/low tracking
- Volume information
- Price change percentages
- Market overview dashboard

#### 3. **Technical Analysis**
- RSI (Relative Strength Index) indicators
- MACD (Moving Average Convergence Divergence)
- ATR (Average True Range) volatility measures
- Multiple timeframe analysis
- Color-coded signal strength

#### 4. **Trading Calculators**
- **Pip Calculator**: Calculate pips between entry and exit prices
- **Lot Size Calculator**: Position sizing based on risk management
- **P&L Calculator**: Profit and loss calculations
- Support for different currency pairs
- Risk percentage calculations

### 📱 User Experience Features

#### 5. **Multi-language Support**
- English, Tamil, Hindi, Arabic
- RTL (Right-to-Left) language support
- Dynamic language switching
- Localized number formatting

#### 6. **Theming System**
- Light, Dark, and System themes
- Customizable font sizes (Small, Medium, Large)
- Consistent color schemes
- Accessibility considerations

#### 7. **Interactive Charts**
- TradingView integration
- Multiple timeframes (1M, 5M, 15M, 1H, 4H, 1D, 1W)
- Professional charting tools
- Real-time price updates

### 🔔 Advanced Notification System

#### 8. **Push Notifications (FCM v1 API)**
- Real-time signal alerts
- Achievement notifications
- Market update announcements
- Cross-platform delivery (Web, iOS, Android)
- Rich notifications with action buttons
- Deep linking capabilities

#### 9. **Silent Notifications**
- Background data synchronization
- Price updates without UI interruption
- Signal refresh capabilities
- Cache management
- System maintenance tasks

#### 10. **Notification Analytics**
- Click tracking and engagement metrics
- User interaction analytics
- Delivery status monitoring
- Performance optimization

### 🎯 Marketing & Engagement

#### 11. **Campaign Management**
- Dynamic banner advertisements
- Multiple aspect ratios (1:4, 1:2)
- View and click tracking
- A/B testing capabilities

#### 12. **User Analytics**
- Trading session tracking
- Signal performance metrics
- User engagement patterns
- Device and platform analytics

### 🛠 Developer & Admin Features

#### 13. **Backend Monitoring**
- System health monitoring
- API status tracking
- Manual trigger capabilities
- Performance metrics dashboard

#### 14. **Testing Infrastructure**
- Notification testing panels
- Silent notification testing
- Backend monitoring tools
- Debug logging systems

---

## Architecture & Folder Structure

```
bolt-expo-nativewind/
├── app/                          # Expo Router app directory
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Home screen
│   │   ├── signals.tsx          # Trading signals screen
│   │   ├── calculator.tsx       # Trading calculators
│   │   └── settings.tsx         # App settings
│   ├── _layout.tsx              # Root layout with providers
│   └── +not-found.tsx           # 404 error page
├── components/                   # Reusable UI components
│   ├── AssetSwitcher.tsx        # Gold/Silver asset selector
│   ├── SignalCard.tsx           # Individual signal display
│   ├── TimeframeSwitcher.tsx    # Chart timeframe selector
│   ├── NotificationSheet.tsx    # Notification history modal
│   ├── CampaignBanner.tsx       # Marketing banner component
│   └── [other components]       # Various UI components
├── contexts/                     # React Context providers
│   ├── ThemeContext.tsx         # Theme and styling management
│   └── LanguageContext.tsx      # Internationalization
├── lib/                         # Core business logic
│   ├── supabase.ts              # Database client configuration
│   ├── database.ts              # Database operations
│   ├── forex.ts                 # Trading calculations
│   ├── notifications/           # Notification system
│   │   ├── index.ts            # Main exports
│   │   ├── push.ts             # Push notification logic
│   │   ├── silent.ts           # Silent notification handling
│   │   ├── firebase.ts         # Firebase integration
│   │   ├── analytics.ts        # Notification analytics
│   │   ├── clickTracking.ts    # Click event tracking
│   │   ├── deepLinking.ts      # Deep link handling
│   │   └── [other modules]     # Additional notification features
│   ├── i18n/                   # Internationalization
│   │   ├── index.ts            # i18n configuration
│   │   ├── en.ts               # English translations
│   │   ├── ta.ts               # Tamil translations
│   │   ├── hi.ts               # Hindi translations
│   │   └── ar.ts               # Arabic translations
│   └── [other modules]         # Additional business logic
├── supabase/                    # Backend configuration
│   ├── functions/               # Edge Functions
│   │   ├── send-push-notification/ # Push notification sender
│   │   ├── update-signals/      # Signal data updater
│   │   ├── update-indicators/   # Technical indicator updater
│   │   └── [other functions]    # Additional serverless functions
│   └── migrations/              # Database schema migrations
├── public/                      # Web assets
│   └── firebase-messaging-sw.js # Service worker for web push
├── android/                     # Android-specific configuration
├── docs/                        # Documentation files
├── app.config.js               # Expo configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

### Key Architecture Principles

#### 1. **Modular Design**
- Each feature is contained in its own module
- Clear separation of concerns
- Reusable components and utilities

#### 2. **Cross-Platform Compatibility**
- Single codebase for Web, iOS, and Android
- Platform-specific optimizations where needed
- Consistent user experience across platforms

#### 3. **Real-time Architecture**
- WebSocket connections for live data
- Push notification system for instant alerts
- Background synchronization capabilities

#### 4. **Scalable Backend**
- Serverless Edge Functions for API endpoints
- PostgreSQL database with real-time subscriptions
- Automatic scaling with Supabase infrastructure

---

## Dependencies & Technologies

### Frontend Dependencies

#### Core Framework
```json
{
  "expo": "^53.0.0",
  "react": "19.0.0",
  "react-native": "0.79.4",
  "expo-router": "~5.1.0"
}
```

#### UI & Styling
```json
{
  "@expo-google-fonts/inter": "^0.2.3",
  "lucide-react-native": "^0.475.0",
  "react-native-safe-area-context": "5.4.0",
  "react-native-svg": "15.11.2"
}
```

#### Navigation & Routing
```json
{
  "@react-navigation/native": "^7.0.14",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "expo-linking": "^7.1.7"
}
```

#### Data & Storage
```json
{
  "@supabase/supabase-js": "^2.50.0",
  "@react-native-async-storage/async-storage": "^2.1.2",
  "expo-secure-store": "~14.2.3"
}
```

#### Notifications & Firebase
```json
{
  "expo-notifications": "~0.31.4",
  "@react-native-firebase/app": "^22.4.0",
  "@react-native-firebase/messaging": "^22.4.0",
  "firebase": "^10.7.1"
}
```

#### Internationalization
```json
{
  "i18n-js": "^4.5.1",
  "expo-localization": "^16.1.5"
}
```

#### Charts & Visualization
```json
{
  "react-native-webview": "13.13.5",
  "react-native-chart-kit": "^6.12.0"
}
```

### Backend Technologies

#### Database & Backend
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Edge Functions**: Serverless functions for API endpoints
- **Row Level Security (RLS)**: Database-level security

#### External APIs
- **TwelveData API**: Market data and technical indicators
- **Firebase Cloud Messaging**: Push notification delivery
- **TradingView**: Professional charting widgets

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- Git
- Supabase account
- Firebase project (for push notifications)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd bolt-expo-nativewind

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

# EAS Configuration
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database migrations in order:
   ```sql
   -- Execute each migration file in supabase/migrations/ 
   -- in chronological order
   ```
3. Configure Row Level Security policies
4. Set up database triggers for automatic notifications

### 4. Firebase Setup

1. Create a Firebase project
2. Enable Cloud Messaging
3. Generate service account credentials
4. Configure VAPID keys for web push
5. Add Firebase configuration to Supabase secrets

### 5. Run the Application

```bash
# Start development server
npm run dev

# For specific platforms
npm run android  # Android
npm run ios      # iOS
```

---

## Configuration & Environment Variables

### App Configuration (`app.config.js`)

```javascript
export default {
  name: 'bolt-expo-nativewind',
  slug: 'bolt-expo-nativewind',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'myapp',  // Deep linking scheme
  plugins: [
    'expo-router',
    'expo-notifications',
    'expo-linking',
    'expo-secure-store'
  ],
  // Platform-specific configurations
  ios: { supportsTablet: true },
  android: { 
    package: 'com.safikumar00.boltexponativewind',
    googleServicesFile: './google-services.json'
  }
}
```

### Environment Variables

#### Required Variables
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project identifier
- `EXPO_PUBLIC_FIREBASE_API_KEY`: Firebase web API key
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: FCM sender ID
- `EXPO_PUBLIC_FIREBASE_APP_ID`: Firebase app identifier
- `EXPO_PUBLIC_FIREBASE_VAPID_KEY`: Web push VAPID key

#### Supabase Secrets (Edge Functions)
- `FIREBASE_ADMIN_CREDENTIALS`: Firebase service account JSON
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `EDGE_SECRET_KEY`: Security key for Edge Function access

---

## Database & Data Flow

### Database Schema

#### Core Tables

**1. signals**
```sql
CREATE TABLE signals (
  id uuid PRIMARY KEY,
  pair text NOT NULL,                    -- XAU/USD, XAG/USD
  type text CHECK (type IN ('BUY', 'SELL')),
  entry_price numeric NOT NULL,
  current_price numeric,
  take_profit_levels numeric[] NOT NULL,
  stop_loss numeric NOT NULL,
  status text CHECK (status IN ('active', 'closed', 'pending')),
  accuracy numeric DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  description text,
  risk_reward text,
  pnl numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

**2. market_data**
```sql
CREATE TABLE market_data (
  id uuid PRIMARY KEY,
  pair text NOT NULL UNIQUE,
  price numeric NOT NULL,
  change numeric DEFAULT 0,
  change_percent numeric DEFAULT 0,
  high numeric NOT NULL,
  low numeric NOT NULL,
  volume text DEFAULT '0',
  updated_at timestamptz DEFAULT now()
);
```

**3. notifications**
```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY,
  type text CHECK (type IN ('signal', 'achievement', 'announcement', 'alert')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  target_user text,
  status text CHECK (status IN ('pending', 'sent', 'failed')),
  click_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  clicked_user_ids uuid[] DEFAULT '{}',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

**4. user_profiles**
```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY,
  user_id text NOT NULL UNIQUE,
  fcm_token text,
  device_type text CHECK (device_type IN ('ios', 'android', 'web')),
  app_version text,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

#### Analytics Tables

**5. technical_indicators**
- Stores RSI, MACD, ATR values
- Real-time indicator status
- Color-coded signal strength

**6. notification_clicks**
- Tracks user interactions with notifications
- Action type classification
- Platform-specific analytics

**7. campaigns**
- Marketing banner management
- View and click tracking
- A/B testing support

### Data Flow Architecture

#### 1. **Real-time Signal Updates**
```
External API → Edge Function → Database → Real-time Subscription → Client
```

#### 2. **Push Notification Flow**
```
Database Trigger → Edge Function → FCM v1 API → Device → User Interaction → Analytics
```

#### 3. **Market Data Flow**
```
TwelveData API → Edge Function → price_summary Table → Real-time Updates → UI
```

---

## Key Components & Functions

### Frontend Components

#### 1. **SignalCard.tsx**
```typescript
interface SignalCardProps {
  signal: Signal;
}
```
- Displays individual trading signals
- Shows entry price, take profit levels, stop loss
- Real-time status updates
- Modal with detailed information

#### 2. **AssetSwitcher.tsx**
```typescript
interface AssetSwitcherProps {
  selectedAsset: 'XAU/USD' | 'BTC/USD';
  onAssetChange: (asset: 'XAU/USD' | 'BTC/USD') => void;
}
```
- Toggle between Gold and Silver
- Smooth transition animations
- Asset-specific styling

#### 3. **NotificationSheet.tsx**
- Displays notification history
- Real-time notification updates
- User interaction tracking

### Core Business Logic

#### 1. **Forex Calculations (`lib/forex.ts`)**
```typescript
// Calculate pips between prices
export function calculatePips(
  pair: string,
  entryPrice: number,
  exitPrice: number,
  type: 'BUY' | 'SELL'
): PipCalculatorResult

// Calculate position size based on risk
export function calculateLotSize(
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number,
  pipValue: number
): LotSizeResult
```

#### 2. **Notification System (`lib/notifications/`)**
```typescript
// Register device for push notifications
export async function registerForPushNotifications(): Promise<string | null>

// Send rich notifications with actions
export async function createPushNotification(data: PushNotificationData): Promise<string | null>

// Handle silent background notifications
export async function handleSilentNotification(payload: SilentNotificationPayload): Promise<SilentNotificationResult>
```

#### 3. **Database Operations (`lib/database.ts`)**
```typescript
// Fetch real-time market data
export async function fetchMarketData(): Promise<MarketData[]>

// Subscribe to real-time updates
export function subscribeToMarketData(callback: (data: MarketData[]) => void)

// Create notifications
export async function createNotification(notification: NotificationData): Promise<string | null>
```

### Context Providers

#### 1. **ThemeContext**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: Theme) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (fontSize: FontSize) => void;
  colors: ColorScheme;
  fontSizes: FontSizes;
}
```

#### 2. **LanguageContext**
```typescript
interface LanguageContextType {
  currentLanguage: string;
  availableLanguages: LanguageOption[];
  changeLanguage: (languageCode: string) => Promise<void>;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
}
```

---

## API Endpoints

### Supabase Edge Functions

#### 1. **send-push-notification**
- **URL**: `/functions/v1/send-push-notification`
- **Method**: POST
- **Purpose**: Send push notifications via FCM v1 API

**Request Format**:
```typescript
{
  type: 'signal' | 'achievement' | 'announcement' | 'alert';
  title: string;
  message: string;
  data?: any;
  target_user?: string;
  rich_content?: {
    image?: string;
    actions?: NotificationAction[];
    deep_link?: DeepLinkData;
  };
}
```

**Response Format**:
```typescript
{
  success: boolean;
  notification_id: string;
  recipients: number;
  fcm_tokens: number;
  expo_tokens: number;
  api_version: 'FCM_v1';
}
```

#### 2. **update-signals**
- **URL**: `/functions/v1/update-signals`
- **Method**: POST
- **Purpose**: Update signal statuses and market prices
- **Authentication**: Edge secret key required

#### 3. **update-indicators**
- **URL**: `/functions/v1/update-indicators`
- **Method**: POST
- **Purpose**: Fetch and update technical indicators
- **Data Source**: TwelveData API

#### 4. **log-notification-event**
- **URL**: `/functions/v1/log-notification-event`
- **Method**: POST
- **Purpose**: Track notification clicks and views

**Request Format**:
```typescript
{
  user_id: string;
  notification_id: string;
  event_type: 'clicked' | 'viewed';
  action_type?: string;
  deep_link?: string;
}
```

### Database Functions

#### 1. **increment_notification_counter**
```sql
SELECT increment_notification_counter(notification_id, 'click_count');
```

#### 2. **add_user_to_clicked_list**
```sql
SELECT add_user_to_clicked_list(notification_id, user_id);
```

#### 3. **increment_campaign_views/clicks**
```sql
SELECT increment_campaign_views(campaign_id);
SELECT increment_campaign_clicks(campaign_id);
```

---

## Authentication & Authorization

### Device-Based Authentication

The app uses a **device-based authentication system** rather than traditional user accounts:

#### 1. **Device Registration**
```typescript
// Generate unique device ID
const deviceId = await getDeviceId();

// Register device with FCM token
await registerForPushNotifications();
```

#### 2. **Row Level Security (RLS)**
```sql
-- Example policy for device-based access
CREATE POLICY "Allow device access to own data"
  ON user_profiles
  FOR ALL
  TO anon
  USING (user_id = current_setting('request.jwt.claims')::json->>'device_id');
```

#### 3. **Permission Levels**
- **Anonymous (anon)**: Read access to public data, device registration
- **Service Role**: Full access for Edge Functions
- **Authenticated**: Reserved for future user account features

### Security Features

#### 1. **FCM Token Management**
- Secure token storage using Expo SecureStore
- Automatic token refresh
- Device-specific token validation

#### 2. **API Security**
- Edge Function authentication with secret keys
- CORS headers for web security
- Input validation and sanitization

---

## UI/UX Flow

### Navigation Structure

#### Tab-Based Navigation
```
Home Tab (index.tsx)
├── Live price display
├── Technical indicators
├── Market overview
└── TradingView charts

Signals Tab (signals.tsx)
├── Signal list with filters
├── Performance statistics
├── Signal detail modals
└── Campaign banners

Calculator Tab (calculator.tsx)
├── Pip calculator
├── Lot size calculator
├── P&L calculator
└── Currency pair selector

Settings Tab (settings.tsx)
├── Theme preferences
├── Language selection
├── Notification management
└── Device information
```

### User Journey

#### 1. **First Launch**
1. App loads with system theme
2. Device registration for notifications
3. Permission requests (notifications)
4. Home screen with live data

#### 2. **Daily Usage**
1. Check live prices on Home tab
2. Review new signals on Signals tab
3. Use calculators for position sizing
4. Receive push notifications for new signals

#### 3. **Signal Interaction**
1. Receive push notification
2. Tap notification → Deep link to signal
3. View signal details in modal
4. Track signal performance

### Responsive Design

#### Breakpoints
- **Mobile**: < 768px (primary target)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (web version)

#### Platform Adaptations
- **iOS**: Native navigation patterns, haptic feedback
- **Android**: Material Design elements, notification channels
- **Web**: Keyboard navigation, mouse interactions

---

## Error Handling & Logging

### Error Handling Strategy

#### 1. **Network Errors**
```typescript
try {
  const data = await fetchMarketData();
  setMarketData(data);
} catch (error) {
  console.error('Error fetching market data:', error);
  setMarketData(getMockMarketData()); // Fallback to mock data
}
```

#### 2. **Database Errors**
- Graceful degradation to mock data
- User-friendly error messages
- Automatic retry mechanisms

#### 3. **Notification Errors**
- FCM delivery status tracking
- Error logging to `notification_logs` table
- Fallback notification methods

### Logging System

#### 1. **Console Logging**
```typescript
// Structured logging with emojis for easy identification
console.log('✅ Success operation');
console.warn('⚠️ Warning message');
console.error('❌ Error occurred');
```

#### 2. **Database Logging**
- **notification_logs**: Push notification delivery status
- **silent_notifications**: Background task execution
- **notification_clicks**: User interaction tracking

#### 3. **Analytics Logging**
- User engagement metrics
- Signal performance tracking
- Campaign effectiveness measurement

---

## Security Measures

### 1. **Data Protection**

#### Row Level Security (RLS)
```sql
-- Example RLS policy
CREATE POLICY "Users can only access own data"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid()::text);
```

#### Input Validation
```typescript
// Validate notification event types
if (!['clicked', 'viewed'].includes(payload.event_type)) {
  throw new Error('Invalid event_type');
}

// UUID validation
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
```

### 2. **API Security**

#### CORS Configuration
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

#### Authentication Headers
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
}
```

### 3. **Firebase Security**

#### FCM v1 API with OAuth2
- Service account-based authentication
- Short-lived access tokens (1 hour)
- Secure credential storage in Supabase secrets

#### Token Management
- Secure storage using Expo SecureStore
- Automatic token refresh
- Device-specific validation

---

## Build & Deployment Guide

### Development Build

```bash
# Start development server
npm run dev

# Run on specific platforms
npx expo run:android
npx expo run:ios
```

### Production Build

#### 1. **EAS Build Configuration**
```json
// eas.json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "distribution": "store",
      "android": { "buildType": "apk" },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "production-url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "production-key"
      }
    }
  }
}
```

#### 2. **Build Commands**
```bash
# Build for production
eas build --platform all --profile production

# Build APK for testing
eas build --platform android --profile apk
```

### Web Deployment

#### 1. **Export Web Build**
```bash
# Export static web files
expo export --platform web

# Deploy to hosting service
# (Netlify, Vercel, etc.)
```

#### 2. **Service Worker Setup**
- Configure `firebase-messaging-sw.js`
- Set up VAPID keys
- Test web push notifications

### Database Deployment

#### 1. **Migration Deployment**
```bash
# Run migrations in Supabase dashboard
# Or use Supabase CLI (if available)
supabase db push
```

#### 2. **Edge Function Deployment**
```bash
# Deploy Edge Functions
supabase functions deploy send-push-notification
supabase functions deploy update-signals
supabase functions deploy update-indicators
```

---

## Limitations & Future Improvements

### Current Limitations

#### 1. **Data Sources**
- Limited to TwelveData API for market data
- Manual signal generation (no automated trading algorithms)
- Basic technical indicator set

#### 2. **User Management**
- Device-based authentication only
- No user accounts or profiles
- Limited personalization options

#### 3. **Trading Features**
- No direct broker integration
- No automated trade execution
- Limited to Gold and Silver pairs

#### 4. **Platform Limitations**
- Web version has limited native features
- No offline data caching
- Requires internet connection for all features

### Future Improvements

#### 1. **Enhanced Trading Features**
- **Broker Integration**: Connect with MT4/MT5 platforms
- **Automated Trading**: Algorithm-based signal generation
- **More Assets**: Forex pairs, cryptocurrencies, indices
- **Social Trading**: Copy trading functionality

#### 2. **Advanced Analytics**
- **AI-Powered Insights**: Machine learning for signal accuracy
- **Portfolio Tracking**: Complete trading journal
- **Performance Analytics**: Detailed trading statistics
- **Risk Management**: Advanced position sizing algorithms

#### 3. **User Experience**
- **User Accounts**: Traditional login/registration system
- **Personalization**: Custom watchlists, preferences
- **Social Features**: Community discussions, signal sharing
- **Educational Content**: Trading tutorials, market analysis

#### 4. **Technical Enhancements**
- **Offline Support**: Cache critical data for offline access
- **Real-time Chat**: Live support and community features
- **Advanced Charts**: Custom charting with drawing tools
- **Voice Notifications**: Audio alerts for signals

#### 5. **Business Features**
- **Subscription Model**: Premium signal tiers
- **Payment Integration**: In-app purchases with RevenueCat
- **Affiliate Program**: Referral system
- **White Label**: Customizable app for brokers

---

## Glossary

### Trading Terms

- **Signal**: A trading recommendation with entry, take profit, and stop loss levels
- **Pip**: The smallest price move in a currency pair (usually 0.0001)
- **Lot Size**: The number of units being traded
- **Take Profit (TP)**: Price level where profits are realized
- **Stop Loss (SL)**: Price level where losses are cut
- **Risk-Reward Ratio**: Ratio of potential profit to potential loss
- **Spread**: Difference between bid and ask prices

### Technical Terms

- **FCM**: Firebase Cloud Messaging - Google's push notification service
- **RLS**: Row Level Security - Database-level access control
- **Edge Functions**: Serverless functions that run close to users
- **Real-time Subscriptions**: Live database change notifications
- **Deep Linking**: URLs that open specific app screens
- **Silent Notifications**: Background notifications without UI alerts
- **VAPID**: Voluntary Application Server Identification for web push

### Application Terms

- **Device ID**: Unique identifier for each app installation
- **Campaign**: Marketing banner with tracking capabilities
- **Analytics**: User interaction and engagement metrics
- **Migration**: Database schema change script
- **Trigger**: Database function that runs automatically
- **Webhook**: HTTP callback for external service integration

---

## Development Guidelines

### Code Style

#### 1. **TypeScript Standards**
- Strict type checking enabled
- Interface definitions for all data structures
- Proper error handling with try-catch blocks

#### 2. **Component Structure**
```typescript
// Standard component template
interface ComponentProps {
  // Props interface
}

export default function Component({ prop }: ComponentProps) {
  const { colors, fontSizes } = useTheme();
  
  const styles = StyleSheet.create({
    // Styles using theme colors
  });
  
  return (
    // JSX with proper styling
  );
}
```

#### 3. **File Organization**
- One component per file
- Clear naming conventions
- Proper import/export structure
- Modular architecture

### Testing Strategy

#### 1. **Manual Testing**
- Built-in notification test panels
- Backend monitoring tools
- Silent notification testing
- Cross-platform compatibility testing

#### 2. **Automated Testing** (Future)
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows

### Performance Optimization

#### 1. **Database Optimization**
- Proper indexing on frequently queried columns
- Efficient query patterns
- Real-time subscription management

#### 2. **Frontend Optimization**
- Lazy loading for heavy components
- Image optimization and caching
- Efficient re-rendering patterns

#### 3. **Network Optimization**
- API response caching
- Batch requests where possible
- Graceful offline handling

---

## Support & Maintenance

### Monitoring

#### 1. **Application Monitoring**
- Real-time error tracking
- Performance metrics
- User engagement analytics

#### 2. **Infrastructure Monitoring**
- Database performance
- Edge Function execution times
- Push notification delivery rates

### Maintenance Tasks

#### 1. **Regular Updates**
- Dependency updates
- Security patches
- Feature enhancements

#### 2. **Data Maintenance**
- Database cleanup
- Log rotation
- Performance optimization

### Troubleshooting

#### Common Issues
1. **Push Notifications Not Working**
   - Check Firebase configuration
   - Verify FCM tokens
   - Review Edge Function logs

2. **Real-time Updates Failing**
   - Check Supabase connection
   - Verify RLS policies
   - Review subscription setup

3. **Charts Not Loading**
   - Check TradingView widget configuration
   - Verify internet connection
   - Review WebView permissions

---

## Conclusion

The Gold & Silver Trading Signals App represents a comprehensive solution for precious metals trading, combining real-time data, advanced notifications, and professional-grade analytics. The architecture is designed for scalability, maintainability, and cross-platform compatibility.

The application successfully implements modern development practices including:
- **Future-proof APIs** (FCM v1)
- **Real-time capabilities** (Supabase subscriptions)
- **Cross-platform compatibility** (Expo framework)
- **Advanced analytics** (User engagement tracking)
- **Professional UI/UX** (Multi-theme, multi-language)

This documentation serves as a complete reference for developers, stakeholders, and future maintainers of the application.

---

*Last Updated: December 29, 2024*
*Version: 1.0.0*
*Documentation Version: 1.0*