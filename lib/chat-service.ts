import { ChatMessage, ChatPartner, NutritionistProfile, User } from '@/types/chat';
import { Query } from 'appwrite';
import { config, databases } from './appwrite';

class ChatService {
  async getNutritionistsByCategory(diseaseCategory: string): Promise<NutritionistProfile[]> {
    try {
      const response = await databases.listDocuments(
        config.databaseId!,
        'ahligizi',
        [
          Query.equal('specialization', diseaseCategory),
          Query.equal('available', true)
        ]
      );

      // Get user details for each nutritionist
      const nutritionistsWithDetails = await Promise.all(
        response.documents.map(async (nutritionist) => {
          const user = await databases.getDocument(
            config.databaseId!,
            'users',
            nutritionist.user_id
          );
          return { ...nutritionist, user };
        })
      );

      return nutritionistsWithDetails;
    } catch (error) {
      console.error('Error getting nutritionists:', error);
      return [];
    }
  }

  async getChatPartners(userId: string): Promise<ChatPartner[]> {
    try {
      const messages = await databases.listDocuments(
        config.databaseId!,
        'chat',
        [
          Query.or([
            Query.equal('sender_id', userId),
            Query.equal('receiver_id', userId)
          ]),
          Query.orderDesc('created_at'),
          Query.limit(100)
        ]
      );

      // Get unique chat partners
      const chatPartners = messages.documents.reduce((acc: ChatPartner[], message: ChatMessage) => {
        const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        if (!acc.find((chat) => chat.partnerId === partnerId)) {
          acc.push({
            partnerId,
            lastMessage: message.content,
            timestamp: message.created_at,
            unread: message.receiver_id === userId && !message.is_read ? 1 : 0,
            user: {} as User // Will be populated below
          });
        }
        return acc;
      }, []);

      // Get user details for each partner
      const partnersWithDetails = await Promise.all(
        chatPartners.map(async (chat) => {
          const user = await databases.getDocument(
            config.databaseId!,
            'users',
            chat.partnerId
          );
          return { ...chat, user };
        })
      );

      return partnersWithDetails;
    } catch (error) {
      console.error('Error getting chat partners:', error);
      return [];
    }
  }

  async getChatMessages(userId: string, partnerId: string): Promise<ChatMessage[]> {
    try {
      const response = await databases.listDocuments(
        config.databaseId!,
        'chat',
        [
          Query.or([
            Query.and([
              Query.equal('sender_id', userId),
              Query.equal('receiver_id', partnerId)
            ]),
            Query.and([
              Query.equal('sender_id', partnerId),
              Query.equal('receiver_id', userId)
            ])
          ]),
          Query.orderDesc('created_at')
        ]
      );

      return response.documents;
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<ChatMessage | null> {
    try {
      const message = {
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        is_read: false,
        created_at: new Date().toISOString()
      };

      const response = await databases.createDocument(
        config.databaseId!,
        'chat',
        'unique()',
        message
      );

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        config.databaseId!,
        'chat',
        messageId,
        { is_read: true }
      );
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  async updateAvailability(nutritionistId: string, available: boolean): Promise<boolean> {
    try {
      await databases.updateDocument(
        config.databaseId!,
        'ahligizi',
        nutritionistId,
        { available }
      );
      return true;
    } catch (error) {
      console.error('Error updating availability:', error);
      return false;
    }
  }
}

export const chatService = new ChatService();
