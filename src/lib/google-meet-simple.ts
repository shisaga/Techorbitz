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

  throw new Error("❌ No refresh token found. Run get-refresh-token.ts first.");
}

export class GoogleMeetService {
  async createSpace(): Promise<{ success: boolean; meetingLink?: string; meetingId?: string; error?: string }> {
    try {
      const authClient = await authorize();
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
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const randomPart = (len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    const code = `${randomPart(3)}-${randomPart(4)}-${randomPart(3)}`;
    return {
      success: false,
      meetingLink: `https://meet.google.com/${code}`,
      meetingId: `meet-${code}`,
      error: error || "Using mock link",
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
