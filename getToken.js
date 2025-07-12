// getToken.js
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

async function getAccessToken() {
  const keyPath = path.join(__dirname, 'serviceAccountKey.json');

  const auth = new GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  console.log('✅ Access Token:\n');
  console.log(token.token);
}

getAccessToken().catch(console.error);
