<<<<<<< HEAD
import { Models } from 'react-native-appwrite';
import { Article } from '../constants/article';
import { Nutritionist } from '../constants/chat';
import { RecallData } from '../lib/recall-service';

export type NotificationType = 'chat' | 'article' | 'recall';

export interface NotificationData {
  chatId?: string;
  articleId?: string;
  nutritionistId?: string;
  recallId?: string;
  userId?: string;
  isRecallShare?: boolean;
  articleTitle?: string;
  recallData?: RecallData;
  articleData?: Article;
}

// Base notification interface
export interface Notification {
  $id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read?: boolean;
  data?: NotificationData;
}

// Parameters for getting notifications
export interface NotificationParams {
  userId: string;
  unreadMessages?: { [key: string]: number };
  nutritionists?: Nutritionist[];
  page?: number;
  pageSize?: number;
}

// Props for notification item component
export interface NotificationItemProps {
  id: string;
  type: NotificationType;
=======
import { Nutritionist } from '../constants/chat';

export interface Notification {
  id: string;
  type: 'chat' | 'article' | 'recall';
  title: string;
  description: string;
  timestamp: string;
  data?: {
    chatId?: string;
    articleId?: string;
    nutritionistId?: string;
  };
}

export interface NotificationParams {
  unreadMessages: { [key: string]: number };
  nutritionists: Nutritionist[];
}

export interface NotificationItemProps {
  id: string;
  type: 'chat' | 'article' | 'recall';
>>>>>>> 825a3fa33b5dd7ce1a4b6db6c93e3960a4634e26
  title: string;
  description: string;
  timestamp: string;
  onPress: () => void;
<<<<<<< HEAD
  onDelete: () => void;
  read?: boolean;
}

// Parameters for creating a notification
export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  read?: boolean;
  data?: NotificationData;
}

// Extended notification document from Appwrite
export interface NotificationDocument extends Models.Document {
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  data?: NotificationData;
}
=======
}
>>>>>>> 825a3fa33b5dd7ce1a4b6db6c93e3960a4634e26
