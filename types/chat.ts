import { Models } from 'appwrite';

export interface Message extends Models.Document {
  chatId: string;
  text: string;
  sender: 'user' | 'nutritionist';
  time: string;
  read: boolean;
  userId: string;
  nutritionistId: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export interface Nutritionist extends Models.Document {
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline';
  type: string;
  specialization: string;
  description?: string;
  lastSeen: string;
  experience: number;
  rating: number;
  price: number;
  available: boolean;
}

export interface ChatSession extends Models.Document {
  userId: string;
  nutritionistId: string;
  status: 'active' | 'ended';
  startTime: string;
  endTime?: string;
  lastMessageTime: string;
  consultationType: string;
  notes?: string;
}

export interface ConsultationStatus extends Models.Document {
  sessionId: string;
  userId: string;
  nutritionistId: string;
  status: 'waiting' | 'in_progress' | 'completed';
  currentQueue: number;
  estimatedTime: number;
  priority: number;
  endTime?: string;
}

export interface Notification extends Models.Document {
  userId: string;
  type: 'message' | 'session_start' | 'session_end' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ChatContextType {
  messages: { [key: string]: Message[] };
  addMessage: (nutritionistId: string, text: string) => Promise<void>;
  nutritionists: Nutritionist[];
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
  markMessageAsRead: (messageId: string) => Promise<void>;
  unreadMessages: { [key: string]: number };
  loading: boolean;
  currentSession: ChatSession | null;
  consultationStatus: ConsultationStatus | null;
  createSession: (nutritionistId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  notifications: Notification[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
}

// Type guards
export function isMessage(obj: any): obj is Message {
  return obj && 
    typeof obj === 'object' && 
    'chatId' in obj && 
    'text' in obj && 
    'sender' in obj &&
    '$id' in obj &&
    '$collectionId' in obj &&
    '$databaseId' in obj;
}

export function isValidSession(obj: any): obj is ChatSession {
  return obj && 
    typeof obj === 'object' && 
    'userId' in obj && 
    'nutritionistId' in obj && 
    'status' in obj &&
    '$id' in obj &&
    '$collectionId' in obj &&
    '$databaseId' in obj;
}

export function isValidStatus(obj: any): obj is ConsultationStatus {
  return obj && 
    typeof obj === 'object' && 
    'sessionId' in obj && 
    'userId' in obj && 
    'nutritionistId' in obj && 
    'status' in obj &&
    '$id' in obj &&
    '$collectionId' in obj &&
    '$databaseId' in obj;
}

export interface UpdateConsultationStatusParams {
  status?: 'waiting' | 'in_progress' | 'completed';
  currentQueue?: number;
  estimatedTime?: number;
  priority?: number;
  endTime?: string;
}
