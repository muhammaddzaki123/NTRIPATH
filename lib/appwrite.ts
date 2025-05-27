import {
  Account,
  Avatars,
  Client,
  Databases,
  Query,
  Storage,
  Models,
  RealtimeResponseEvent,
  ID
} from "appwrite";
import { 
  Message, 
  Nutritionist, 
  ChatSession,
  ConsultationStatus,
  Notification
} from "@/types/chat";

type AppwriteMessage = Models.Document & {
  chatId: string;
  text: string;
  sender: 'user' | 'nutritionist';
  time: string;
  read: boolean;
  userId: string;
  nutritionistId: string;
};

type AppwriteConsultationStatus = Models.Document & {
  sessionId: string;
  userId: string;
  nutritionistId: string;
  status: 'waiting' | 'in_progress' | 'completed';
  currentQueue: number;
  estimatedTime: number;
  priority: number;
  endTime?: string;
};

export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  artikelCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ARTIKEL_COLLECTION_ID,
  recallCollectionId: process.env.NEXT_PUBLIC_APPWRITE_RECALL_COLLECTION_ID,
  reviewsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  propertiesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
  // Koleksi Profil Pengguna
  usersProfileCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_PROFILE_COLLECTION_ID,

  // nutritionist_profiles
  ahligiziCollectionId: process.env.NEXT_PUBLIC_APPWRITE_AHLIGIZI_COLLECTION_ID,

  // chat_messages
  chatMessagesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHAT_MESSAGES_COLLECTION_ID,
  // nutritionist chat collections
  nutritionistChatCollectionId: process.env.NEXT_PUBLIC_APPWRITE_NUTRITIONIST_CHAT_COLLECTION_ID,
  
  // New collections
  chatSessionsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHAT_SESSIONS_COLLECTION_ID,
  consultationStatusCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CONSULTATION_STATUS_COLLECTION_ID,
  notificationsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    // Create OAuth2 session for Google
    const session = await account.createOAuth2Session(
      "google" as any,
      process.env.NEXT_PUBLIC_OAUTH_SUCCESS_URL || 'http://localhost:8000/callback',
      process.env.NEXT_PUBLIC_OAUTH_FAILURE_URL || 'http://localhost:8000/sign-in'
    );
    return session;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

export async function loginWithEmailPassword(email: string, password: string) {
  try {
    const session = await account.createSession(email, password);
    return session;
  } catch (error) {
    console.error('Email/password login error:', error);
    throw error;
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

export async function loginAsNutritionist(email: string, password: string): Promise<{ 
  user: Models.User<Models.Preferences>;
  nutritionist: Models.Document;
}> {
  try {
    // Cek dulu apakah email terdaftar sebagai ahli gizi
    const nutritionist = await databases.listDocuments(
      config.databaseId!,
      config.ahligiziCollectionId!,
      [
        Query.equal('email', email),
        Query.limit(1)
      ]
    );

    if (nutritionist.documents.length === 0) {
      throw new Error('Email tidak terdaftar sebagai ahli gizi');
    }

    // Login dengan email/password
    const session = await account.createSession(email, password);
    if (!session) throw new Error('Gagal membuat sesi');

    // Dapatkan data user dengan role nutritionist
    const user = await getCurrentUser();
    if (!user || user.role !== 'nutritionist') {
      await account.deleteSession('current');
      throw new Error('Gagal memverifikasi akun ahli gizi');
    }

    // Update status online dan last seen
    await databases.updateDocument(
      config.databaseId!,
      config.ahligiziCollectionId!,
      nutritionist.documents[0].$id,
      {
        status: 'online',
        lastSeen: new Date().toISOString()
      }
    );

    // Buat atau update sesi khusus nutritionist
    await databases.createDocument(
      config.databaseId!,
      config.nutritionistChatCollectionId!,
      'unique()',
      {
        nutritionistId: nutritionist.documents[0].$id,
        status: 'online',
        lastActive: new Date().toISOString(),
        sessionType: 'active'
      }
    );

    return {
      user,
      nutritionist: nutritionist.documents[0]
    };
  } catch (error) {
    console.error('Login error:', error);
    // Pastikan session dihapus jika terjadi error
    try {
      await account.deleteSession('current');
    } catch (e) {
      console.error('Error cleaning up session:', e);
    }
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (!result.$id) return null;

    const userAvatar = avatar.getInitials(result.name);
    
    // Check if user is a nutritionist
    const nutritionist = await databases.listDocuments(
      config.databaseId!,
      config.ahligiziCollectionId!,
      [Query.equal('email', result.email), Query.limit(1)]
    );

    if (nutritionist.documents.length > 0) {
      const nutritionistData = nutritionist.documents[0];
      return {
        ...result,
        avatar: nutritionistData.avatar || userAvatar.toString(),
        role: 'nutritionist',
        nutritionistProfile: {
          specialization: nutritionistData.specialization,
          type: nutritionistData.type,
          experience: nutritionistData.experience,
          rating: nutritionistData.rating,
          status: nutritionistData.status,
          available: nutritionistData.available
        }
      };
    }

    // Regular user
    const userProfile = await databases.listDocuments(
      config.databaseId!,
      config.usersProfileCollectionId!,
      [Query.equal('email', result.email), Query.limit(1)]
    );

    return {
      ...result,
      avatar: userProfile.documents[0]?.avatar || userAvatar.toString(),
      role: 'user'
    };

  } catch (error) {
    console.error('Error getting current user:', error);
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
      email: doc.email,
      status: doc.status as 'online' | 'offline',
      type: doc.type,
      specialization: doc.specialization,
      description: doc.description,
      lastSeen: doc.lastSeen,
      experience: doc.experience,
      rating: doc.rating,
      price: doc.price,
      available: doc.available,
      avatar: doc.avatar
    })) as unknown as Nutritionist[];
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

// Chat Session Management
export async function createChatSession(userId: string, nutritionistId: string): Promise<ChatSession> {
  try {
    const response = await databases.createDocument(
      config.databaseId!,
      config.chatSessionsCollectionId!,
      'unique()',
      {
        userId,
        nutritionistId,
        status: 'active',
        startTime: new Date().toISOString(),
        lastMessageTime: new Date().toISOString(),
        consultationType: 'general'
      }
    );
    return response as unknown as ChatSession;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

export async function endChatSession(sessionId: string): Promise<ChatSession> {
  try {
    const response = await databases.updateDocument(
      config.databaseId!,
      config.chatSessionsCollectionId!,
      sessionId,
      {
        status: 'ended',
        endTime: new Date().toISOString()
      }
    );
    return response as unknown as ChatSession;
  } catch (error) {
    console.error('Error ending chat session:', error);
    throw error;
  }
}

// Consultation Status Management
export async function createConsultationStatus(
  sessionId: string,
  userId: string,
  nutritionistId: string
): Promise<ConsultationStatus> {
  try {
    const response = await databases.createDocument(
      config.databaseId!,
      config.consultationStatusCollectionId!,
      'unique()',
      {
        sessionId,
        userId,
        nutritionistId,
        status: 'waiting',
        currentQueue: 0,
        estimatedTime: 0,
        priority: 1
      }
    );
    return response as unknown as ConsultationStatus;
  } catch (error) {
    console.error('Error creating consultation status:', error);
    throw error;
  }
}

export async function updateConsultationStatus(
  statusId: string,
  updates: Partial<ConsultationStatus>
): Promise<ConsultationStatus> {
  try {
    const response = await databases.updateDocument(
      config.databaseId!,
      config.consultationStatusCollectionId!,
      statusId,
      updates
    );
    return response as unknown as ConsultationStatus;
  } catch (error) {
    console.error('Error updating consultation status:', error);
    throw error;
  }
}

// Notification Management
export async function createNotification(
  userId: string,
  type: 'message' | 'session_start' | 'session_end' | 'reminder',
  title: string,
  message: string,
  metadata?: Record<string, any>
): Promise<Notification> {
  try {
    const response = await databases.createDocument(
      config.databaseId!,
      config.notificationsCollectionId!,
      'unique()',
      {
        userId,
        type,
        title,
        message,
        read: false,
        createdAt: new Date().toISOString(),
        metadata
      }
    );
    return response as Notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  try {
    const response = await databases.updateDocument(
      config.databaseId!,
      config.notificationsCollectionId!,
      notificationId,
      { read: true }
    );
    return response as Notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.notificationsCollectionId!,
      [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt')
      ]
    );
    return response.documents as unknown as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
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
      (response: RealtimeResponseEvent<AppwriteMessage>) => {
        // Filter event untuk pembuatan dokumen baru
        if (response.events?.includes('databases.*.collections.*.documents.*.create')) {
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

// Subscribe to consultation status changes
export async function subscribeToConsultationStatus(
  statusId: string,
  callback: (status: ConsultationStatus) => void
) {
  if (!statusId) {
    throw new Error('Status ID is required for subscription');
  }

  try {
    const unsubscribe = await client.subscribe(
      `databases.${config.databaseId}.collections.${config.consultationStatusCollectionId}.documents.${statusId}`,
      (response: RealtimeResponseEvent<AppwriteConsultationStatus>) => {
        if (response.events?.includes('databases.*.collections.*.documents.*.update')) {
          console.log('Consultation status updated:', response.payload);
          const status = response.payload;
          callback(status as ConsultationStatus);
        }
      }
    );

    console.log('Consultation status subscription setup successful for:', statusId);
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up consultation status subscription:', error);
    throw new Error(`Failed to setup consultation status subscription: ${error}`);
  }
}
