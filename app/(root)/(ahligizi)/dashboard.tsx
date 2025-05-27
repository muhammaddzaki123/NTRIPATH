import { useChat } from '@/contexts/ChatContext';
import { useGlobalContext } from '@/lib/global-provider';
import { Message } from '@/types/chat';
import { FontAwesome } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NutritionistDashboard = () => {
  const { user, isNutritionist } = useGlobalContext();
  const { messages, nutritionists, loading, unreadMessages } = useChat();

  useEffect(() => {
    if (!isNutritionist) {
      Alert.alert('Akses Ditolak', 'Halaman ini hanya untuk ahli gizi');
      router.replace('/');
    }
  }, [isNutritionist]);

  if (loading || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1CD6CE" />
        <Text className="text-gray-600 mt-4">Memuat data...</Text>
      </SafeAreaView>
    );
  }

  // Get all chats where the nutritionist is involved
  const nutritionistChats = Object.entries(messages).filter(([chatId]) => 
    chatId.includes(user.$id)
  );

  // Sort chats by latest message
  const sortedChats = nutritionistChats.sort(([, messagesA], [, messagesB]) => {
    const latestA = messagesA[messagesA.length - 1]?.time || '';
    const latestB = messagesB[messagesB.length - 1]?.time || '';
    return new Date(latestB).getTime() - new Date(latestA).getTime();
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 bg-[#1CD6CE]">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-bold">Dashboard Ahli Gizi</Text>
            <Text className="text-white/80">
              {user.name} • {user.nutritionistProfile?.specialization}
            </Text>
          </View>
          <Link href="./profileAhligizi" asChild>
            <TouchableOpacity 
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <FontAwesome name="user" size={20} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Status Card */}
      <View className="m-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <Link href="./profileAhligizi.tsx" asChild>
          <TouchableOpacity 
            className="absolute right-2 top-2 p-2"
          >
            <FontAwesome name="pencil" size={16} color="#666" />
          </TouchableOpacity>
        </Link>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-800 font-medium">Status</Text>
          <View className={`px-2 py-1 rounded-full ${
            user.nutritionistProfile?.status === 'online' 
              ? 'bg-green-100' 
              : 'bg-gray-100'
          }`}>
            <Text className={
              user.nutritionistProfile?.status === 'online'
                ? 'text-green-600'
                : 'text-gray-600'
            }>
              {user.nutritionistProfile?.status === 'online' ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between mt-2">
          <View>
            <Text className="text-gray-600">Konsultasi Aktif</Text>
            <Text className="text-2xl font-bold text-[#1CD6CE]">
              {sortedChats.length}
            </Text>
          </View>
          <View>
            <Text className="text-gray-600">Pesan Belum Dibaca</Text>
            <Text className="text-2xl font-bold text-[#1CD6CE]">
              {Object.values(unreadMessages).reduce((a, b) => a + b, 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Chat List */}
      <ScrollView className="flex-1">
        <Text className="px-4 py-2 text-gray-600 font-medium">
          Daftar Percakapan
        </Text>
        {sortedChats.length === 0 ? (
          <View className="p-4 items-center">
            <Text className="text-gray-500">Belum ada percakapan aktif</Text>
          </View>
        ) : (
          sortedChats.map(([chatId, chatMessages]) => {
            const userId = chatId.replace(user.$id, '').replace('-', '');
            const lastMessage = chatMessages[chatMessages.length - 1] as Message;
            const unreadCount = unreadMessages[chatId] || 0;

            return (
              <Link 
                href={`/chat/${userId}`} 
                key={chatId}
                asChild
              >
                <TouchableOpacity>
                  <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
                      <FontAwesome name="user-circle" size={32} color="#666" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-900 font-medium">
                          User #{userId.slice(0, 8)}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {new Date(lastMessage.time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-gray-600 text-sm" numberOfLines={1}>
                          {lastMessage.text}
                        </Text>
                        {unreadCount > 0 && (
                          <View className="bg-[#1CD6CE] rounded-full w-5 h-5 items-center justify-center">
                            <Text className="text-white text-xs">
                              {unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NutritionistDashboard;
