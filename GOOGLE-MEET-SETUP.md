# Google Meet API Setup Guide

## 🚀 **Google Meet Integration Setup**

This guide will help you set up Google Meet API integration for your TechXak meeting scheduling system.

## 📋 **Prerequisites**

1. Google Cloud Console account
2. Google Workspace account (for Meet API access)
3. Node.js project with the required packages installed

## 🔧 **Step 1: Google Cloud Console Setup**

### 1.1 Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project: `TechXak-Meet-Integration`
4. Click "Create"

### 1.2 Enable Required APIs
1. Go to "APIs & Services" → "Library"
2. Enable the following APIs:
   - **Google Meet API**
   - **Google Calendar API**
   - **Google+ API** (if needed)

### 1.3 Create Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://techxak.com/api/auth/google/callback`
5. Download the JSON file and rename it to `credentials.json`

## 🔑 **Step 2: Environment Variables**

Add these variables to your `.env.local` file:

```bash
# Google Meet API Configuration
GOOGLE_MEET_API_KEY=your_google_meet_api_key_here
GOOGLE_MEET_CREDENTIALS_PATH=./credentials.json
GOOGLE_MEET_TOKEN_PATH=./token.json
GOOGLE_MEET_SCOPES=https://www.googleapis.com/auth/meet.space.created

# Google Calendar API (for meeting integration)
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key_here
GOOGLE_CALENDAR_CREDENTIALS_PATH=./credentials.json

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📁 **Step 3: File Structure**

Place your credentials file in the project root:

```
techorbitze/
├── credentials.json          # Google OAuth credentials
├── token.json               # Auto-generated token file
├── .env.local               # Environment variables
└── src/
    └── lib/
        └── google-meet.ts   # Google Meet service
```

## 🛠️ **Step 4: API Key Setup**

### 4.1 Get API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Add it to your `.env.local` as `GOOGLE_MEET_API_KEY`

### 4.2 Restrict API Key (Recommended)
1. Click on your API key
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domains:
   - `http://localhost:3000/*`
   - `https://techxak.com/*`
4. Under "API restrictions", select "Restrict key"
5. Choose "Google Meet API" and "Google Calendar API"

## 🔐 **Step 5: OAuth Consent Screen**

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - **App name**: TechXak Meeting Scheduler
   - **User support email**: hello@techxak.com
   - **Developer contact**: hello@techxak.com
4. Add scopes:
   - `https://www.googleapis.com/auth/meet.space.created`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`

## 🧪 **Step 6: Testing the Integration**

### 6.1 Test Google Meet Creation
```bash
# Run the development server
npm run dev

# Test the meeting API
curl -X POST http://localhost:3000/api/meeting/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15T14:00:00.000Z",
    "time": "14:00",
    "meetingType": "Free Consultation",
    "contactInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1-555-0123",
      "company": "Test Company",
      "message": "Testing Google Meet integration"
    }
  }'
```

### 6.2 Expected Response
```json
{
  "success": true,
  "meeting": {
    "id": "uuid-here",
    "date": "2024-01-15T14:00:00.000Z",
    "time": "14:00",
    "meetingType": "Free Consultation",
    "contactInfo": {...},
    "googleMeetLink": "https://meet.google.com/abc-defg-hij",
    "meetingCode": "abc-defg-hij",
    "status": "scheduled",
    "googleMeetData": {
      "success": true,
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "meetingCode": "abc-defg-hij"
    }
  }
}
```

## 🚨 **Troubleshooting**

### Common Issues:

1. **"API not enabled" error**
   - Ensure Google Meet API is enabled in Google Cloud Console
   - Check that your project has the correct APIs enabled

2. **"Invalid credentials" error**
   - Verify your `credentials.json` file is in the correct location
   - Check that the file contains valid OAuth credentials

3. **"Insufficient permissions" error**
   - Ensure your OAuth consent screen is properly configured
   - Check that the required scopes are added

4. **"Quota exceeded" error**
   - Check your API quotas in Google Cloud Console
   - Consider upgrading your quota limits

### Debug Mode:
Add this to your `.env.local` for detailed logging:
```bash
DEBUG=google-meet:*
```

## 📚 **API Features**

### Available Functions:

1. **`createGoogleMeetSpace()`** - Create a new Google Meet space
2. **`createCalendarEventWithMeet()`** - Create calendar event with Meet link
3. **`generateSimpleMeetLink()`** - Fallback simple Meet link
4. **`validateMeetLink()`** - Validate Meet link format
5. **`extractMeetingId()`** - Extract meeting ID from link

### Service Methods:

- **`googleMeetService.createMeeting()`** - Main meeting creation method
- **`googleMeetService.getMeetingDetails()`** - Get meeting information

## 🔒 **Security Best Practices**

1. **Never commit credentials to version control**
2. **Use environment variables for sensitive data**
3. **Restrict API keys to specific domains**
4. **Regularly rotate API keys**
5. **Monitor API usage and quotas**

## 📞 **Support**

If you encounter issues:
1. Check the Google Cloud Console logs
2. Verify your credentials and permissions
3. Test with the Google Meet API Explorer
4. Contact Google Cloud Support if needed

---

**Note**: Google Meet API requires a Google Workspace account for full functionality. For personal Google accounts, some features may be limited.

*Last updated: September 5, 2024*
