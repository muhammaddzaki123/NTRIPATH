import { Account, Avatars, Client, Functions, OAuthProvider } from "react-native-appwrite";
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';

// Configuration with environment variables
export const config = {
  platform: 'com.jsm.propolist',
  endpoint: process.env.EXPO_PUBLIC_APRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APRITE_PROJECT_ID,
};

// Validate required environment variables
if (!config.endpoint || !config.projectId) {
  throw new Error("Missing required Appwrite environment variables!");
}

// Initialize Appwrite Client
export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

// Export Appwrite services
export const avatar = new Avatars(client);
export const account = new Account(client);

/**
 * Handles user login through Google OAuth
 * @returns {Promise<boolean>} Success status of the login attempt
 */
export async function login(): Promise<boolean> {
  try {
    const redirectUri = Linking.createURL("/");
    const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);
    
    if (!response) throw new Error("Failed to generate OAuth token");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") throw new Error("Failed to login in browser");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString() || "";
    const userId = url.searchParams.get("userId")?.toString() || "";

    if (!secret || !userId) throw new Error("Failed to retrieve login credentials");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create a session");

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

/**
 * Handles user logout by deleting the current session
 * @returns {Promise<boolean>} Success status of the logout attempt
 */
export async function logout(): Promise<boolean> {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

/**
 * Retrieves the current user's information including their avatar
 * @returns {Promise<User | null>} User object or null if not logged in
 */
export async function getCurrentUser() {
  try {
    const response = await account.get();
    if (response.$id) {
      const userAvatar = avatar.getInitials(response.name);
      return {
        ...response,
        avatar: userAvatar.toString()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
