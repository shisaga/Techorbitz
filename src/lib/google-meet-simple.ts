// google-meet-service.ts
import { google } from "googleapis";

// --- Authorize with refresh token ---
async function authorize() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000"
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return client;
  }

  // Return null instead of throwing error - we'll handle this gracefully
  console.log("⚠️  No Google refresh token found. Using fallback Google Meet links.");
  console.log("   To enable real Google Meet integration, run: node get-refresh-token.js");
  return null;
}

export class GoogleMeetService {
  async createSpace(): Promise<{ success: boolean; meetingLink?: string; meetingId?: string; error?: string }> {
    try {
      const authClient = await authorize();
      
      // If no auth client (no refresh token), use fallback
      if (!authClient) {
        return this.generateMockMeetLink("No refresh token configured");
      }
      
      // Use Google Calendar API to create a meeting event with Google Meet
      const calendar = google.calendar({ version: 'v3', auth: authClient });
      
      const event = {
        summary: 'TechXak Meeting',
        description: 'Meeting created via TechXak scheduling system',
        start: {
          dateTime: new Date().toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
          timeZone: 'UTC',
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        attendees: [
          { email: 'hello@techxak.com' }
        ]
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'none'
      });

      const meetingLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
      const meetingId = response.data.id;

      if (meetingLink) {
        console.log(`✅ Google Meet URL created: ${meetingLink}`);
        return { success: true, meetingLink, meetingId };
      } else {
        throw new Error('No meeting link generated');
      }
    } catch (error: any) {
      console.error("❌ Error creating Google Meet space:", error);
      return this.generateMockMeetLink(error.message);
    }
  }

  private generateMockMeetLink(error?: string) {
    // Create a working Google Meet link using the "new" endpoint
    // This creates a real, functional Google Meet room when clicked
    const meetingId = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    return {
      success: false,
      meetingLink: `https://meet.google.com/new`,
      meetingId: meetingId,
      error: error || "Using Google Meet 'new' link - enable Calendar API for automatic meeting creation",
      fallback: true,
      instructions: "Click the link to create a new Google Meet room instantly"
    };
  }

  async createMeeting(meetingData: { title: string; description?: string }) {
    try {
      const result = await this.createSpace();
      if (result.success) {
        return { ...result, official: true };
      }
      return { ...result, fallback: true };
    } catch (error: any) {
      return this.generateMockMeetLink(error.message);
    }
  }
}

export const googleMeetService = new GoogleMeetService();
