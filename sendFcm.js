// sendFcm.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Your FCM token here
const fcmToken =
  'cc5aL9vYbnDk7oKf8BklDk:APA91bFe9QWZAJ7rp0tG20gKdmAaL_QFREeyPQA7pEglMLw2XZOlM-KR1jHGblZVA9WDkzcHaqP86jAjA_39sgrXtIwpqlTlNnlVnkXFjc25STq5w4OKp7Y';

const message = {
  token: fcmToken,
  notification: {
    title: '🚀 Test Push',
    body: 'This is a test notification via HTTP v1',
  },
};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log('✅ Successfully sent message:', response);
  })
  .catch((error) => {
    console.error('❌ Error sending message:', error);
  });
