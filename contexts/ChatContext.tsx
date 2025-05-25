import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGlobalContext } from '../lib/global-provider';
import { Message, Nutritionist, ChatSubscriptionResponse } from '../types/chat';
import { 
  sendMessage as sendMessageAPI, 
  getNutritionists as getNutritionistsAPI,
  getChatMessages as getChatMessagesAPI,
  markMessageAsRead as markMessageAsReadAPI,
  subscribeToChat as subscribeToChatAPI
} from '@/lib/appwrite';

interface ChatContextType {
  messages: { [key: string]: Message[] };
  addMessage: (nutritionistId: string, text: string) => Promise<void>;
  nutritionists: Nutritionist[];
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
  markMessageAsRead: (messageId: string) => Promise<void>;
  unreadMessages: { [key: string]: number };
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useGlobalContext();

  // Fetch nutritionists
  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        const fetchedNutritionists = await getNutritionistsAPI();
        setNutritionists(fetchedNutritionists);
      } catch (error) {
        console.error('Error fetching nutritionists:', error);
      }
    };

    fetchNutritionists();
  }, []);

  // Subscribe to real-time messages for current chat
  useEffect(() => {
    if (!user || !currentChat) return;

    let unsubscribe: (() => void) | undefined;
    
    const setupSubscription = async () => {
      try {
        unsubscribe = await subscribeToChatAPI(currentChat, (newMessage: Message) => {
          setMessages(prev => {
            const chatMessages = prev[newMessage.chatId] || [];
            return {
              ...prev,
              [newMessage.chatId]: [...chatMessages, newMessage]
            };
          });

          // Update unread messages count for nutritionist messages
          if (newMessage.sender === 'nutritionist' && currentChat !== newMessage.chatId) {
            setUnreadMessages(prev => ({
              ...prev,
              [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
            }));
          }
        });
      } catch (error) {
        console.error('Error setting up chat subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, currentChat]);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !currentChat) return;
      
      try {
        setLoading(true);
        const chatMessages = await getChatMessagesAPI(currentChat);
        
        setMessages(prev => ({
          ...prev,
          [currentChat]: chatMessages as Message[]
        }));

        // Reset unread count for current chat
        setUnreadMessages(prev => ({
          ...prev,
          [currentChat]: 0
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, currentChat]);

  const addMessage = async (nutritionistId: string, text: string) => {
    if (!user) return;

    const chatId = `${user.$id}-${nutritionistId}`;
    
    try {
      await sendMessageAPI({
        userId: user.$id,
        nutritionistId,
        text,
        chatId
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await markMessageAsReadAPI(messageId);
      
      // Update local state
      setMessages(prev => {
        const updatedMessages = { ...prev };
        Object.keys(updatedMessages).forEach(chatId => {
          updatedMessages[chatId] = updatedMessages[chatId].map(msg => 
            msg.$id === messageId ? { ...msg, read: true } : msg
          );
        });
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        addMessage, 
        nutritionists, 
        currentChat, 
        setCurrentChat,
        markMessageAsRead,
        unreadMessages,
        loading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
