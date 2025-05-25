import { Models } from 'react-native-appwrite';

export interface Message extends Models.Document {
  chatId: string;
  userId: string;
  nutritionistId: string;
  text: string;
  sender: 'user' | 'nutritionist';
  time: string;
  read: boolean;
}

export interface Nutritionist extends Models.Document {
  name: string;
  status: 'online' | 'offline';
  type: string;
  specialization: string;
  avatar?: string;
  lastSeen?: string;
}

export interface ChatSubscriptionResponse {
  events: string[];
  payload: Message;
}

export interface SendMessageData {
  userId: string;
  nutritionistId: string;
  text: string;
  chatId: string;
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
}
