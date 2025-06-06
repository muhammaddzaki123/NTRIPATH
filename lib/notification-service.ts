import { format } from 'date-fns';
import { type Notification, type NotificationParams } from '../types/notification';
import { getArticles } from './appwrite';

const isWithinTimeRange = (startHour: number, endHour: number): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= startHour && hour < endHour;
};

const isMorningTime = () => isWithinTimeRange(6, 10);
const isEveningTime = () => isWithinTimeRange(16, 20);

export const getNotifications = async ({
  unreadMessages = {},
  nutritionists = []
}: NotificationParams): Promise<Notification[]> => {
  const notifications: Notification[] = [];
  const now = new Date();

  try {
    // Chat notifications
    Object.entries(unreadMessages).forEach(([chatId, count]) => {
      if (count > 0) {
        const [userId, nutritionistId] = chatId.split('-');
        const nutritionist = nutritionists.find(n => n.$id === nutritionistId);
        const nutritionistName = nutritionist?.name || 'Ahli Gizi';
        
        notifications.push({
          id: `chat-${chatId}-${now.getTime()}`,
          type: 'chat',
          title: 'Pesan Baru',
          description: `Anda memiliki ${count} pesan baru dari ${nutritionistName}`,
          timestamp: now.toISOString(),
          data: { 
            chatId,
            nutritionistId 
          }
        });
      }
    });

    // Article notifications
    const articles = await getArticles();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    articles.forEach(article => {
      const articleDate = new Date(article.$createdAt);
      if (articleDate > last24Hours) {
        notifications.push({
          id: `article-${article.$id}`,
          type: 'article',
          title: 'Artikel Terbaru',
          description: article.title,
          timestamp: article.$createdAt,
          data: { articleId: article.$id }
        });
      }
    });

    // Recall notifications
    if (isMorningTime()) {
      notifications.push({
        id: `recall-morning-${format(now, 'yyyy-MM-dd')}`,
        type: 'recall',
        title: 'Peringatan Recall Pagi',
        description: 'Jangan lupa untuk mencatat makanan yang Anda konsumsi pagi ini!',
        timestamp: now.toISOString()
      });
    }

    if (isEveningTime()) {
      notifications.push({
        id: `recall-evening-${format(now, 'yyyy-MM-dd')}`,
        type: 'recall',
        title: 'Peringatan Recall Sore',
        description: 'Saatnya mencatat makanan yang Anda konsumsi hari ini!',
        timestamp: now.toISOString()
      });
    }

    // Sort notifications by timestamp (newest first)
    return notifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export { type Notification, type NotificationParams } from '../types/notification';
