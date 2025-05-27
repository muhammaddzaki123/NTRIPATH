import { ChatSubscriptionResponse, Message, Nutritionist } from "../types/chat";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
  Storage
} from "react-native-appwrite";

export const config = {
  platform: "com.poltekes.nutripath",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  artikelCollectionId:process.env.EXPO_PUBLIC_APPWRITE_ARTIKEL_COLLECTION_ID,
  recallCollectionId: process.env.EXPO_PUBLIC_APPWRITE_RECALL_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  propertiesCollectionId:process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
  usersProfileCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_PROFILE_COLLECTION_ID,
  ahligiziCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AHLIGIZI_COLLECTION_ID,
  chatMessagesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CHAT_MESSAGES_COLLECTION_ID,
  nutritionistChatCollectionId: process.env.EXPO_PUBLIC_APPWRITE_NUTRITIONIST_CHAT_COLLECTION_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Simpan data user yang sedang login
let currentUser: any = null;

export async function getCurrentUser() {
  try {
    if (currentUser) {
      console.log("Returning current user:", currentUser);
      return currentUser;
    }
    console.log("No current user found");
    return null;
  } catch (error) {
    console.log("Error getting current user:", error);
    return null;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    console.log("Mencoba login dengan email:", email);
    
    const users = await databases.listDocuments(
      config.databaseId!,
      config.usersProfileCollectionId!,
      [Query.equal("email", email)]
    );

    console.log("Query result:", {
      totalUsers: users.documents.length,
      firstUser: users.documents[0] ? {
        email: users.documents[0].email,
        hasPassword: !!users.documents[0].password,
        currentUserType: users.documents[0].userType
      } : null
    });

    if (users.documents.length === 1) {
      const user = users.documents[0];
      
      const inputPass = String(password).trim();
      const storedPass = user.password ? String(user.password).trim() : '';
      console.log("Password comparison:", {
        inputLength: inputPass.length,
        storedLength: storedPass.length,
        isMatch: inputPass === storedPass
      });

      if (storedPass && inputPass === storedPass) {
        console.log("Login berhasil untuk user:", user.email);

        try {
          if (user.userType !== "user") {
            await databases.updateDocument(
              config.databaseId!,
              config.usersProfileCollectionId!,
              user.$id,
              {
                userType: "user",
                lastSeen: new Date().toISOString()
              }
            );
          }

          // Simpan data user yang login
          currentUser = {
            $id: user.$id,
            name: user.name || email.split('@')[0],
            email: user.email,
            avatar: avatar.getInitials(user.name || email.split('@')[0]).toString(),
            userType: "user"
          };

          console.log("Current user set to:", currentUser);
        } catch (updateError) {
          console.error("Gagal update user type:", updateError);
        }

        return true;
      } else {
        console.log("Password tidak cocok");
        throw new Error("Email atau password salah");
      }
    } else {
      console.log("User tidak ditemukan");
      throw new Error("Email atau password salah");
    }
  } catch (error) {
    console.error("Login user error:", error);
    return false;
  }
}

export async function loginNutritionist(email: string, password: string) {
  try {
    console.log("Mencoba login ahli gizi dengan email:", email);
    
    const nutritionists = await databases.listDocuments(
      config.databaseId!,
      config.ahligiziCollectionId!,
      [Query.equal("email", email)]
    );

    console.log("Query result ahli gizi:", {
      totalFound: nutritionists.documents.length,
      firstNutritionist: nutritionists.documents[0] ? {
        email: nutritionists.documents[0].email,
        hasPassword: !!nutritionists.documents[0].password,
        currentUserType: nutritionists.documents[0].userType
      } : null
    });

    if (nutritionists.documents.length === 1) {
      const nutritionist = nutritionists.documents[0];
      
      const inputPass = String(password).trim();
      const storedPass = nutritionist.password ? String(nutritionist.password).trim() : '';
      console.log("Password comparison ahli gizi:", {
        inputLength: inputPass.length,
        storedLength: storedPass.length,
        isMatch: inputPass === storedPass
      });

      if (storedPass && inputPass === storedPass) {
        console.log("Login berhasil untuk ahli gizi:", nutritionist.email);
        
        const updateData: any = {
          status: "online",
          lastSeen: new Date().toISOString()
        };

        if (nutritionist.userType !== "nutritionist") {
          updateData.userType = "nutritionist";
        }

        try {
          await databases.updateDocument(
            config.databaseId!,
            config.ahligiziCollectionId!,
            nutritionist.$id,
            updateData
          );

          // Simpan data nutritionist yang login
          currentUser = {
            $id: nutritionist.$id,
            name: nutritionist.name || email.split('@')[0],
            email: nutritionist.email,
            avatar: avatar.getInitials(nutritionist.name || email.split('@')[0]).toString(),
            userType: "nutritionist",
            specialization: nutritionist.specialization,
            status: "online"
          };

          console.log("Current user (nutritionist) set to:", currentUser);
        } catch (updateError) {
          console.error("Gagal update status:", updateError);
        }

        return {
          nutritionist: {
            ...nutritionist,
            userType: "nutritionist",
            status: "online",
            lastSeen: new Date().toISOString()
          }
        };
      } else {
        console.log("Password tidak cocok untuk ahli gizi");
        throw new Error("Email atau password salah");
      }
    } else {
      console.log("Ahli gizi tidak ditemukan dengan email:", email);
      throw new Error("Email atau password salah");
    }
  } catch (error) {
    console.error("Login ahli gizi error:", error);
    return false;
  }
}

export async function logout() {
  try {
    currentUser = null;
    console.log("User logged out, currentUser cleared");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logoutNutritionist(nutritionistId: string) {
  try {
    await databases.updateDocument(
      config.databaseId!,
      config.ahligiziCollectionId!,
      nutritionistId,
      {
        status: 'offline',
        lastSeen: new Date().toISOString()
      }
    );
    currentUser = null;
    console.log("Nutritionist logged out, currentUser cleared");
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// ... Rest of the code remains the same ...
