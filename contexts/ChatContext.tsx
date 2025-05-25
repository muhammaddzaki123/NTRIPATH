import { useGlobalContext } from '@/lib/global-provider';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'nutritionist';
  time: string;
}

type NutritionistType = 'Ahli Gizi Klinis' | 'Ahli Gizi Olahraga' | 'Ahli Gizi Medis';

interface Nutritionist {
  id: number;
  name: string;
  status: 'online' | 'offline';
  type: NutritionistType;
  avatar?: string;
  specialization?: string;
}

interface ChatContextType {
  messages: { [key: string]: Message[] };
  addMessage: (nutritionistId: string, message: Omit<Message, 'id'>) => void;
  nutritionists: Nutritionist[];
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
  markMessageAsRead: (chatId: string, messageId: number) => void;
  unreadMessages: { [key: string]: number };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});
  const { user } = useGlobalContext();
  
  const nutritionists: Nutritionist[] = [
    {
      id: 1,
      name: 'Dr. BUDIONO',
      status: 'online',
      type: 'Ahli Gizi Klinis',
      specialization: 'Spesialis Gizi Anak',
    },
    {
      id: 2,
      name: 'Dr. PURMONO',
      status: 'online',
      type: 'Ahli Gizi Olahraga',
      specialization: 'Spesialis Nutrisi Atlet',
    },
    {
      id: 3,
      name: 'Dr. VIONO',
      status: 'online',
      type: 'Ahli Gizi Medis',
      specialization: 'Spesialis Gizi Penyakit Dalam',
    },
  ];

  const specializedResponses: Record<NutritionistType, string[]> = {
    'Ahli Gizi Klinis': [
      'Untuk anak-anak, penting sekali memperhatikan asupan gizi seimbang. Bisa dijelaskan pola makan anak Anda saat ini?',
      'Pertumbuhan anak sangat tergantung pada nutrisi yang tepat. Mari kita diskusikan menu hariannya.',
      'Apakah ada alergi makanan yang perlu diperhatikan?',
    ],
    'Ahli Gizi Olahraga': [
      'Sebagai atlet, timing makan sangat penting. Bagaimana jadwal latihan Anda?',
      'Mari kita sesuaikan asupan nutrisi dengan intensitas latihan Anda.',
      'Apakah Anda sedang mempersiapkan kompetisi tertentu?',
    ],
    'Ahli Gizi Medis': [
      'Mohon jelaskan riwayat kesehatan Anda secara detail.',
      'Apakah ada pantangan makanan dari dokter sebelumnya?',
      'Mari kita bahas cara mengatur pola makan yang sesuai dengan kondisi Anda.',
    ],
  };

  const simulateNutritionistResponse = (nutritionistId: string, userMessage: string) => {
    setTimeout(() => {
      const nutritionist = nutritionists.find(n => n.id === Number(nutritionistId));
      if (!nutritionist) return;

      const responses = specializedResponses[nutritionist.type] || [
        'Baik, saya mengerti kondisi Anda. Mari kita bahas lebih detail.',
        'Terima kasih atas informasinya. Apakah ada keluhan lain?',
        'Mohon jelaskan lebih detail tentang pola makan Anda.',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      addMessage(nutritionistId, {
        text: randomResponse,
        sender: 'nutritionist',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1000 + Math.random() * 2000);
  };

  const addMessage = (nutritionistId: string, message: Omit<Message, 'id'>) => {
    setMessages(prev => {
      const nutritionistMessages = prev[nutritionistId] || [];
      const newMessage = {
        ...message,
        id: nutritionistMessages.length + 1,
      };

      if (message.sender === 'nutritionist' && currentChat !== nutritionistId) {
        setUnreadMessages(prev => ({
          ...prev,
          [nutritionistId]: (prev[nutritionistId] || 0) + 1
        }));
      }

      const updatedMessages = {
        ...prev,
        [nutritionistId]: [...nutritionistMessages, newMessage]
      };

      if (message.sender === 'user') {
        simulateNutritionistResponse(nutritionistId, message.text);
      }

      return updatedMessages;
    });
  };

  const markMessageAsRead = (chatId: string, messageId: number) => {
    setUnreadMessages(prev => ({
      ...prev,
      [chatId]: 0
    }));
  };

  useEffect(() => {
    if (currentChat) {
      setUnreadMessages(prev => ({
        ...prev,
        [currentChat]: 0
      }));
    }
  }, [currentChat]);

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        addMessage, 
        nutritionists, 
        currentChat, 
        setCurrentChat,
        markMessageAsRead,
        unreadMessages
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
