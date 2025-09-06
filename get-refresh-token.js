const { google } = require('googleapis');
const readline = require('readline');

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI_PROD || 'https://techxak.com'
);

// Scopes for Google Meet API
const SCOPES = ['https://www.googleapis.com/auth/meetings.space.created'];

async function getRefreshToken() {
  try {
    console.log('🔍 Google OAuth Refresh Token Generator');
    console.log('=====================================');
    
    // Check if environment variables are set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('❌ Missing environment variables:');
      console.error('   GOOGLE_CLIENT_ID');
      console.error('   GOOGLE_CLIENT_SECRET');
      console.error('   GOOGLE_REDIRECT_URI_PROD (optional)');
      console.error('\nPlease add these to your .env file and try again.');
      return;
    }
    
    console.log('✅ Environment variables found');
    console.log('📧 Client ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('🔗 Redirect URI:', process.env.GOOGLE_REDIRECT_URI_PROD || 'https://techxak.com');
    
    // Generate the authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force consent screen to get refresh token
    });
    
    console.log('\n🌐 Please visit this URL to authorize the application:');
    console.log('==================================================');
    console.log(authUrl);
    console.log('==================================================');
    
    // Create readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Ask for authorization code
    const authCode = await new Promise((resolve) => {
      rl.question('\n📝 Enter the authorization code from the URL: ', (code) => {
        rl.close();
        resolve(code);
      });
    });
    
    if (!authCode) {
      console.error('❌ No authorization code provided');
      return;
    }
    
    // Exchange authorization code for tokens
    console.log('🔄 Exchanging authorization code for tokens...');
    const { tokens } = await oauth2Client.getToken(authCode);
    
    console.log('✅ Tokens received successfully!');
    console.log('\n📋 Add this to your .env file:');
    console.log('================================');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('================================');
    
    // Test the refresh token
    console.log('\n🧪 Testing refresh token...');
    oauth2Client.setCredentials(tokens);
    
    // Try to create a test meeting space
    const { SpacesServiceClient } = require('@google-apps/meet');
    const meetClient = new SpacesServiceClient({ auth: oauth2Client });
    
    try {
      const [space] = await meetClient.createSpace({});
      console.log('✅ Refresh token works! Test meeting created:', space.meetingUri);
    } catch (error) {
      console.log('⚠️  Refresh token received but test failed:', error.message);
      console.log('   This might be due to API permissions or quota limits.');
    }
    
    console.log('\n🎉 Setup complete! Your Google Meet integration is ready.');
    
  } catch (error) {
    console.error('❌ Error generating refresh token:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your Google Cloud project has the Google Meet API enabled');
    console.error('2. Check that your OAuth2 credentials are correct');
    console.error('3. Verify the redirect URI matches your OAuth2 configuration');
  }
}

// Run the script
getRefreshToken();
