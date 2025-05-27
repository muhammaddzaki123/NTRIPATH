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
import { ChatSubscriptionResponse, Message, Nutritionist } from "@/types/chat";

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
  // Koleksi Profil Pengguna
  usersProfileCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_PROFILE_COLLECTION_ID,

  // nutritionist_profiles
  ahligiziCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AHLIGIZI_COLLECTION_ID,

  // chat_messages
  chatMessagesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CHAT_MESSAGES_COLLECTION_ID,
  // nutritionist chat collections
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

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function loginAsNutritionist(email: string, password: string) {
  try {
    // Login dengan email/password
    const session = await account.createSession(email, password);
    
    if (!session) throw new Error('Gagal membuat sesi');

    // Dapatkan data user
    const user = await account.get();
    
    // Verifikasi apakah user adalah ahli gizi
    const nutritionist = await databases.listDocuments(
      config.databaseId!,
      config.ahligiziCollectionId!,
      [
        Query.equal('email', email),
        Query.limit(1)
      ]
    );

    if (nutritionist.documents.length === 0) {
      // Jika user bukan ahli gizi, logout
      await account.deleteSession('current');
      throw new Error('Akun ini bukan akun ahli gizi');
    }

    // Update status online
    await databases.updateDocument(
      config.databaseId!,
      config.ahligiziCollectionId!,
      nutritionist.documents[0].$id,
      {
        status: 'online',
        lastSeen: new Date().toISOString()
      }
    );

    return {
      user,
      nutritionist: nutritionist.documents[0]
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Chat related functions
export async function sendMessage(message: Omit<Message, '$id' | 'sender' | 'time' | 'read'>) {
  try {
    // Validasi data pesan
    if (!message.text?.trim() || !message.chatId || !message.userId || !message.nutritionistId) {
      throw new Error('Data pesan tidak lengkap');
    }

    const timestamp = new Date().toISOString();
    
    // Buat dokumen pesan baru
    const response = await databases.createDocument(
      config.databaseId!,
      config.chatMessagesCollectionId!,
      'unique()',
      {
        ...message,
        text: message.text.trim(),
        sender: 'user',
        time: timestamp,
        read: false
      }
    );

    if (!response) {
      throw new Error('Gagal membuat dokumen pesan');
    }

    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    const response = await databases.updateDocument(
      config.databaseId!,
      config.chatMessagesCollectionId!,
      messageId,
      { read: true }
    );
    return response;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

export async function getNutritionists(): Promise<Nutritionist[]> {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.ahligiziCollectionId!,
      [Query.orderAsc('name')]
    );
    return response.documents.map(doc => ({
      ...doc,
      name: doc.name,
      status: doc.status as 'online' | 'offline',
      type: doc.type,
      specialization: doc.specialization,
      avatar: doc.avatar,
      lastSeen: doc.lastSeen
    })) as Nutritionist[];
  } catch (error) {
    console.error('Error getting nutritionists:', error);
    throw error;
  }
}

export async function logoutNutritionist(nutritionistId: string) {
  try {
    // Update status offline
    await databases.updateDocument(
      config.databaseId!,
      config.ahligiziCollectionId!,
      nutritionistId,
      {
        status: 'offline',
        lastSeen: new Date().toISOString()
      }
    );

    // Logout dari session
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.chatMessagesCollectionId!,
      [
        Query.equal('chatId', chatId),
        Query.orderAsc('time')
      ]
    );
    
    // Transform documents to Message type
    return response.documents.map(doc => ({
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions,
      $collectionId: doc.$collectionId,
      $databaseId: doc.$databaseId,
      chatId: doc.chatId,
      userId: doc.userId,
      nutritionistId: doc.nutritionistId,
      text: doc.text,
      sender: doc.sender,
      time: doc.time,
      read: doc.read
    })) as Message[];
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw error;
  }
}

export async function subscribeToChat(
  chatId: string, 
  callback: (message: Message) => void
) {
  if (!chatId) {
    throw new Error('Chat ID is required for subscription');
  }

  try {
    // Subscribe ke event pembuatan dokumen baru di collection chat messages
    const unsubscribe = await client.subscribe(
      `databases.${config.databaseId}.collections.${config.chatMessagesCollectionId}.documents`,
      (response: ChatSubscriptionResponse) => {
        // Filter event untuk pembuatan dokumen baru
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const message = response.payload;
          // Pastikan pesan untuk chat yang sedang aktif
          if (message && message.chatId === chatId) {
            console.log('New message received:', message);
            callback(message as Message);
          }
        }
      }
    );

    console.log('Chat subscription setup successful for chat:', chatId);
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up chat subscription:', error);
    throw new Error(`Failed to setup chat subscription: ${error}`);
  }
}