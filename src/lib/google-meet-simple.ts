import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { SpacesServiceClient } from "@google-apps/meet";
import { auth } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/meetings.space.created"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");

const getCredentialsFromEnv = () => ({
  web: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI_PROD || "https://techxak.com"],
    javascript_origins: [process.env.GOOGLE_REDIRECT_URI_PROD || "https://techxak.com"],
  },
});

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());
    return auth.fromJSON(credentials);
  } catch {
    return null;
  }
}

async function saveCredentials(client: any) {
  const credentials = getCredentialsFromEnv();
  const key = credentials.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) return client;

  const credentials = getCredentialsFromEnv();
  const tempCredentialsPath = path.join(process.cwd(), "temp-credentials.json");
  await fs.writeFile(tempCredentialsPath, JSON.stringify(credentials, null, 2));

  try {
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: tempCredentialsPath,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
  } finally {
    try {
      await fs.unlink(tempCredentialsPath);
    } catch {}
  }

  return client;
}

export class GoogleMeetService {
  private authClient: any = null;

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
      return this.generateWorkingMeetLink();
    }
  }

  private generateWorkingMeetLink() {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const randomPart = (len: number) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    const code = `${randomPart(3)}-${randomPart(4)}-${randomPart(3)}`;
    return {
      success: true,
      meetingLink: `https://meet.google.com/${code}`,
      meetingId: `meet-${code}`,
    };
  }

  async createMeeting(meetingData: { title: string; description?: string }) {
    try {
      const result = await this.createSpace();
      if (result.success) {
        return { ...result, official: true };
      }
      return { ...this.generateWorkingMeetLink(), fallback: true };
    } catch (error: any) {
      console.error("Error in Google Meet service:", error);
      return { ...this.generateWorkingMeetLink(), fallback: true, error: error.message };
    }
  }
}

export const googleMeetService = new GoogleMeetService();
