// Enhanced Firebase Service Worker with Silent Notification Support
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyBpNUxyC4stfKOuEoZiZOq0cxkvnGjTkHM',
  authDomain: 'forex-signal-app-c0c32.firebaseapp.com',
  projectId: 'forex-signal-app-c0c32',
  storageBucket: 'forex-signal-app-c0c32.firebasestorage.app',
  messagingSenderId: '245922029776',
  appId: '1:245922029776:web:ad1ff5d97ac5e4e01d3ed5',
  measurementId: 'G-VSC3CR04FV',
});

const messaging = firebase.messaging();

// Handle background messages (when app is not in focus)
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 Background message received:', payload);

  const { data } = payload;

  // Check if this is a silent notification
  if (data?.silent === 'true' || data?.type?.includes('background')) {
    console.log('🔇 Processing silent notification in background');

    // Send message to main app for silent processing
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SILENT_NOTIFICATION',
          payload: data,
        });
      });
    });

    // Don't show notification for silent types
    return;
  }

  // For non-silent notifications, show normal notification
  const notificationTitle =
    payload.notification?.title || data?.title || 'Trading Signal';
  const notificationOptions = {
    body:
      payload.notification?.body ||
      data?.message ||
      'New trading opportunity available',
    icon: 'https://easyappicon.com/image/adaptive-icon.svg',
    badge: 'https://easyappicon.com/image/adaptive-icon.svg',
    data: data,
    tag: data?.type || 'default',
    requireInteraction: data?.type === 'signal',
    actions:
      data?.type === 'signal'
        ? [
            {
              action: 'view',
              title: 'View Signal',
              icon: 'https://easyappicon.com/image/adaptive-icon.svg',
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
            },
          ]
        : undefined,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event);

  event.notification.close();

  const { action } = event;
  const data = event.notification.data || {};
  const notificationId = data.notification_id;
  const deepLink = data.deep_link;

  // Log notification click event
  if (notificationId) {
    console.log('📊 Logging notification click event');
    
    // Determine action type
    let actionType = 'default';
    if (action) {
      actionType = action;
    }

    // Log the click event (fire and forget - don't block the main action)
    fetch(
      `${self.location.origin.replace(
        'localhost:8081',
        'govngwsrefzqnuczhzdi.supabase.co'
      )}/functions/v1/log-notification-event`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification_id: notificationId,
          user_id: data.user_id || 'web_user',
          event_type: 'clicked',
          action_type: actionType,
          deep_link: deepLink,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log('✅ Notification click logged successfully');
        } else {
          console.warn('⚠️ Failed to log notification click:', response.status);
        }
      })
      .catch((err) => {
        console.error('⚠️ Error logging notification click:', err);
      });
  }

  // Handle different actions
  switch (action) {
    case 'view':
      console.log('📈 User chose to view content');
      handleNotificationAction(data, deepLink);
      break;
    case 'open_chart':
      console.log('📊 User chose to open chart');
      handleNotificationAction(data, deepLink, 'chart');
      break;
    case 'share':
      console.log('📤 User chose to share');
      handleNotificationAction(data, deepLink, 'share');
      break;
    case 'dismiss':
      console.log('❌ User dismissed notification');
      // Just close the notification (already done above)
      break;
    default:
      console.log('👆 Default notification tap');
      handleNotificationAction(data, deepLink);
      break;
  }
});

// Handle notification action with deep linking
function handleNotificationAction(data, deepLink, actionType = 'default') {
  const targetUrl = determineTargetUrl(data, deepLink, actionType);
  
  // Open the app or focus existing window
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    // Check if app is already open
    for (const client of clients) {
      if (client.url.includes(self.location.origin) && 'focus' in client) {
        // Send message to client to handle navigation
        client.postMessage({
          type: 'NOTIFICATION_ACTION',
          action: actionType,
          data: data,
          deepLink: deepLink,
          targetUrl: targetUrl,
        });
        return client.focus();
      }
    }

    // Open new window if app is not open
    if (self.clients.openWindow) {
      return self.clients.openWindow(targetUrl);
    }
  });
}

// Determine target URL based on action and data
function determineTargetUrl(data, deepLink, actionType) {
  // If we have a deep link, use it
  if (deepLink) {
    // Convert deep link to web URL
    const webUrl = deepLink.replace('myapp://', self.location.origin + '/');
    return webUrl;
  }
  
  // Fallback based on data
  if (data?.signal_id) {
    if (actionType === 'chart') {
      return `${self.location.origin}/?chart=${data.signal_id}`;
    }
    return `${self.location.origin}/(tabs)/signals?id=${data.signal_id}`;
  }
  
  // Default to home
  return self.location.origin;
}

// Handle push subscription changes
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('🔄 Push subscription changed:', event);

  // Handle subscription renewal if needed
  event.waitUntil(
    // You could implement subscription renewal logic here
    Promise.resolve()
  );
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('🔧 Service worker installing...');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('✅ Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle messages from main app
self.addEventListener('message', (event) => {
  console.log('📨 Message received in service worker:', event.data);

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});