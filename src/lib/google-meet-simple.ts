// google-meet-service.ts
import { google } from "googleapis";
import { SpacesServiceClient } from "@google-apps/meet";

// --- Authorize with refresh token ---
async function authorize() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI_PROD || "https://techxak.com"
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
      
      const meetClient = new SpacesServiceClient({ auth: authClient });

      const [space] = await meetClient.createSpace({});
      const meetingUri = space.meetingUri;
      const meetingId = space.name;

      console.log(`✅ Google Meet URL created: ${meetingUri}`);
      return { success: true, meetingLink: meetingUri, meetingId };
    } catch (error: any) {
      console.error("❌ Error creating Google Meet space:", error);
      return this.generateMockMeetLink(error.message);
    }
  }

  private generateMockMeetLink(error?: string) {
    // Create a proper Google Meet link using the "new" endpoint
    // This creates a real, working Google Meet link
    const meetingId = `meet-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    return {
      success: false,
      meetingLink: `https://meet.google.com/new`,
      meetingId: meetingId,
      error: error || "Using Google Meet 'new' link - configure OAuth for automatic meeting creation",
      fallback: true,
      instructions: "Click the link to create a new Google Meet room"
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
