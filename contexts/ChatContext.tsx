import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getChatMessages as getChatMessagesAPI,
  getNutritionists as getNutritionistsAPI,
  markMessageAsRead as markMessageAsReadAPI,
  sendMessage as sendMessageAPI,
  subscribeToChat as subscribeToChatAPI
} from '../lib/appwrite';
import { useGlobalContext } from '../lib/global-provider';
import { Message, Nutritionist } from '../types/chat';

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
      if (!user) return;
      
      try {
        setLoading(true);
        const fetchedNutritionists = await getNutritionistsAPI();
        setNutritionists(fetchedNutritionists);
      } catch (error) {
        console.error('Error fetching nutritionists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionists();
  }, [user]);

  // Subscribe to real-time messages for current chat
  useEffect(() => {
    if (!user || !currentChat) return;

    let unsubscribe: (() => void) | undefined;
    let isSubscribed = true; // Flag untuk mencegah update state setelah unmount
    
    const setupSubscription = async () => {
      try {
        console.log('Setting up subscription for chat:', currentChat);
        
        unsubscribe = await subscribeToChatAPI(currentChat, (newMessage: Message) => {
          if (!isSubscribed) return; // Jangan update state jika component sudah unmount

          console.log('Received new message:', newMessage);
          
          setMessages(prev => {
            const chatMessages = prev[newMessage.chatId] || [];
            // Cek apakah pesan sudah ada untuk menghindari duplikasi
            const messageExists = chatMessages.some(msg => msg.$id === newMessage.$id);
            if (messageExists) return prev;
            
            return {
              ...prev,
              [newMessage.chatId]: [...chatMessages, newMessage]
            };
          });

          // Update unread messages count untuk pesan dari ahli gizi
          if (newMessage.sender === 'nutritionist' && currentChat !== newMessage.chatId) {
            setUnreadMessages(prev => ({
              ...prev,
              [newMessage.chatId]: (prev[newMessage.chatId] || 0) + 1
            }));
          }
        });

        console.log('Chat subscription setup successful');
      } catch (error) {
        console.error('Error setting up chat subscription:', error);
        // Tambahkan retry logic jika diperlukan
      }
    };

    setupSubscription();

    return () => {
      isSubscribed = false; // Set flag false saat cleanup
      if (unsubscribe) {
        console.log('Cleaning up chat subscription');
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
    const timestamp = new Date().toISOString();
    
    const tempId = `temp-${Date.now()}`;
    // Tambahkan pesan ke state lokal untuk UX yang lebih responsif
    const tempMessage: Partial<Message> = {
      $id: tempId,
      chatId,
      text,
      sender: 'user',
      time: timestamp,
      read: false,
      userId: user.$id,
      nutritionistId
    };

    // Update state dengan pesan sementara
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), tempMessage as Message]
    }));

    try {
      // Kirim pesan ke server
      const sentMessage = await sendMessageAPI({
        userId: user.$id,
        nutritionistId,
        text,
        chatId
      });

      // Update pesan temporary dengan response dari server
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map(msg => 
          msg.$id === tempId ? sentMessage as Message : msg
        )
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Hapus pesan temporary jika pengiriman gagal
      setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].filter(msg => msg.$id !== tempId)
      }));
      throw error;
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