import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Query } from 'appwrite';
import { config, databases } from '@/lib/appwrite';

interface ChatListProps {
  userId: string;
}

interface ChatPartner {
  partnerId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  user: any;
}

export function ChatList({ userId }: ChatListProps) {
  const router = useRouter();
  const [chats, setChats] = useState<ChatPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, [userId]);

  const loadChats = async () => {
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
      const chatPartners = messages.documents.reduce((acc: ChatPartner[], message: any) => {
        const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        if (!acc.find((chat) => chat.partnerId === partnerId)) {
          acc.push({
            partnerId,
            lastMessage: message.content,
            timestamp: message.created_at,
            unread: message.receiver_id === userId && !message.is_read ? 1 : 0,
            user: null
          });
        }
        return acc;
      }, []);

      // Get user details for each partner
      const chatsWithUserDetails = await Promise.all(
        chatPartners.map(async (chat) => {
          const user = await databases.getDocument(
            config.databaseId!,
            'users',
            chat.partnerId
          );
          return { ...chat, user };
        })
      );

      setChats(chatsWithUserDetails);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-500">Belum ada chat</Text>
      </View>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.partnerId}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/chat/${item.partnerId}`)}
          className="flex-row items-center p-4 bg-white mb-2 rounded-lg shadow-sm"
        >
          <Image
            source={{ uri: item.user?.avatar || 'https://via.placeholder.com/40' }}
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-3 flex-1">
            <View className="flex-row justify-between items-center">
              <Text className="font-medium">{item.user?.name}</Text>
              <Text className="text-gray-500 text-xs">{formatTime(item.timestamp)}</Text>
            </View>
            <Text className="text-gray-500 text-sm" numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
          {item.unread > 0 && (
            <View className="bg-primary w-6 h-6 rounded-full items-center justify-center ml-2">
              <Text className="text-white text-xs">{item.unread}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    />
  );
}
