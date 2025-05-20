export interface User {
  $id: string;
  name: string;
  email: string;
  role: 'patient' | 'nutritionist';
  disease_category: 'hipertensi' | 'kanker' | 'diabetes';
  avatar?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface NutritionistProfile {
  $id: string;
  user_id: string;
  specialization: 'hipertensi' | 'kanker' | 'diabetes';
  education: string;
  certification: string;
  available: boolean;
  created_at: string;
  user?: User;
}

export interface ChatMessage {
  $id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatPartner {
  partnerId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  user: User;
}
