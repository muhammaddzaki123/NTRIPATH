import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export interface AppwriteTokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  removeToken: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

// Kunci yang digunakan untuk menyimpan token
export const TOKEN_KEY = "appwrite_session";
export const FALLBACK_KEY = "appwrite_fallback";

const createTokenCache = (): AppwriteTokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`Token retrieved from cache: ${key} 🔐`);
        } else {
          console.log(`No token found for key: ${key}`);
        }
        return item;
      } catch (error) {
        console.error("Error retrieving token from secure store:", error);
        // Jika terjadi error, hapus token yang mungkin rusak
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },

    saveToken: async (key: string, token: string) => {
      try {
        await SecureStore.setItemAsync(key, token);
        console.log(`Token saved to cache: ${key} 🔒`);
      } catch (error) {
        console.error("Error saving token to secure store:", error);
        // Jika primary storage gagal, coba gunakan fallback
        try {
          await SecureStore.setItemAsync(FALLBACK_KEY, token);
          console.log("Token saved to fallback storage 🔄");
        } catch (fallbackError) {
          console.error("Fallback storage also failed:", fallbackError);
          throw new Error("Failed to save token in any storage");
        }
      }
    },

    removeToken: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
        console.log(`Token removed from cache: ${key} 🗑️`);
      } catch (error) {
        console.error("Error removing token from secure store:", error);
      }
    },

    clear: async () => {
      try {
        await Promise.all([
          SecureStore.deleteItemAsync(TOKEN_KEY),
          SecureStore.deleteItemAsync(FALLBACK_KEY)
        ]);
        console.log("All tokens cleared from cache 🧹");
      } catch (error) {
        console.error("Error clearing token cache:", error);
      }
    }
  };
};

// SecureStore tidak didukung di web
export const tokenCache: AppwriteTokenCache | undefined =
  Platform.OS !== "web" ? createTokenCache() : undefined;

// Fungsi helper untuk mengecek apakah token masih valid
export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

// Fungsi helper untuk mendapatkan token yang valid
export const getValidToken = async (): Promise<string | null> => {
  if (!tokenCache) return null;

  try {
    // Coba ambil dari primary storage
    const token = await tokenCache.getToken(TOKEN_KEY);
    if (token && isTokenValid(token)) {
      return token;
    }

    // Jika token primary tidak valid, coba ambil dari fallback
    const fallbackToken = await tokenCache.getToken(FALLBACK_KEY);
    if (fallbackToken && isTokenValid(fallbackToken)) {
      // Jika fallback valid, pindahkan ke primary
      await tokenCache.saveToken(TOKEN_KEY, fallbackToken);
      await tokenCache.removeToken(FALLBACK_KEY);
      return fallbackToken;
    }

    // Jika kedua token tidak valid, hapus keduanya
    await tokenCache.clear();
    return null;
  } catch (error) {
    console.error("Error getting valid token:", error);
    return null;
  }
};
