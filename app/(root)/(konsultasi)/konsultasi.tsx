import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../../../contexts/ChatContext';
import { useGlobalContext } from '../../../lib/global-provider';
import { Nutritionist } from '../../../types/chat';

const KonsultasiScreen = () => {
  const { nutritionists, unreadMessages, loading, messages } = useChat();
  const { user } = useGlobalContext();

  // Jika tidak ada user yang login, tampilkan pesan error
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#1CD6CE] items-center justify-center">
        <Text className="text-white text-lg">Silakan login terlebih dahulu</Text>
      </SafeAreaView>
    );
  }

  // Tampilkan loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#1CD6CE] items-center justify-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">
          {user.userType === 'nutritionist' ? 'Memuat daftar chat...' : 'Memuat daftar ahli gizi...'}
        </Text>
      </SafeAreaView>
    );
  }

  // Jika user adalah ahli gizi, tampilkan daftar chat dari user
  if (user.userType === 'nutritionist') {
    // Dapatkan semua chat yang terkait dengan ahli gizi ini
    const nutritionistChats = Object.entries(messages)
      .filter(([chatId]) => chatId.includes(user.$id))
      .map(([chatId, chatMessages]) => {
        const lastMessage = chatMessages[chatMessages.length - 1];
        const userId = chatId.split('-')[0];
        const unreadCount = chatMessages.filter(
          msg => !msg.read && msg.sender === 'user'
        ).length;
        return { chatId, lastMessage, userId, unreadCount };
      });

    return (
      <SafeAreaView className="flex-1 bg-[#1CD6CE]">
        <View className="flex-row items-center px-4 py-3">
          <Link href="/" className="mr-auto">
            <View className="w-8 h-8 justify-center">
              <Text className="text-white text-2xl">←</Text>
            </View>
          </Link>
          <Text className="text-white text-xl font-bold absolute left-0 right-0 text-center">
            CHAT KONSULTASI
          </Text>
        </View>

        <ScrollView className="flex-1 bg-white rounded-t-3xl">
          <View className="p-4">
            {nutritionistChats.length > 0 ? (
              nutritionistChats.map(({ chatId, lastMessage, userId, unreadCount }) => (
                <Link
                  key={chatId}
                  href={`/chat/${userId}`}
                  asChild
                >
                  <TouchableOpacity className="mb-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                        <FontAwesome name="user-circle" size={30} color="#666" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="font-bold text-gray-900">
                          {lastMessage?.userName || messages[chatId]?.[0]?.userName || `User ${userId}`}
                        </Text>
                        {lastMessage && (
                          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                            {lastMessage.text}
                          </Text>
                        )}
                      </View>
                      {unreadCount > 0 && (
                        <View className="bg-red-500 rounded-full px-2 py-1 ml-2">
                          <Text className="text-white text-xs font-bold">
                            {unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Link>
              ))
            ) : (
              <View className="py-8">
                <Text className="text-center text-gray-500">
                  Belum ada chat konsultasi
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Jika user adalah user biasa, tampilkan daftar ahli gizi
  const getStatusColor = (status: 'online' | 'offline') => {
    return status === 'online' ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1CD6CE]">
      <View className="flex-row items-center px-4 py-3">
        <Link href="/" className="mr-auto">
          <View className="w-8 h-8 justify-center">
            <Text className="text-white text-2xl">←</Text>
          </View>
        </Link>
        <Text className="text-white text-xl font-bold absolute left-0 right-0 text-center">
          KONSULTASI GIZI
        </Text>
      </View>

      <ScrollView className="flex-1 bg-white rounded-t-3xl">
        <View className="p-4">
          {nutritionists && nutritionists.length > 0 ? (
            nutritionists.map((nutritionist: Nutritionist) => (
              <Link
                key={nutritionist.$id}
                href={`/chat/${nutritionist.$id}`}
                asChild
              >
                <TouchableOpacity className="mb-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Header with Status */}
                  <View className="flex-row items-center p-4 border-b border-gray-100">
                    <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center">
                      {nutritionist.avatar ? (
                        <Image 
                          source={{ uri: nutritionist.avatar }}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <FontAwesome name="user-circle" size={40} color="#666" />
                      )}
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-lg font-bold text-gray-900">
                        {nutritionist.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <View className={`w-2 h-2 rounded-full ${getStatusColor(nutritionist.status)} mr-2`} />
                        <Text className="text-sm text-gray-500 capitalize">
                          {nutritionist.status}
                        </Text>
                        {unreadMessages[nutritionist.$id] > 0 && (
                          <View className="ml-auto bg-red-500 rounded-full px-2 py-1">
                            <Text className="text-xs text-white font-bold">
                              {unreadMessages[nutritionist.$id]}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Specialist Info */}
                  <View className="p-4 bg-gray-50">
                    <View className="mb-2">
                      <Text className="text-sm font-semibold text-gray-700">
                        Spesialisasi:
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {nutritionist.specialization}
                      </Text>
                    </View>

                    <View className="mb-2">
                      <Text className="text-sm font-semibold text-gray-700">
                        Tipe:
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {nutritionist.type}
                      </Text>
                    </View>

                    {nutritionist.lastSeen && nutritionist.status === 'offline' && (
                      <View>
                        <Text className="text-xs text-gray-500">
                          Terakhir online: {new Date(nutritionist.lastSeen).toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Link>
            ))
          ) : (
            <View className="py-8">
              <Text className="text-center text-gray-500">
                Tidak ada ahli gizi yang tersedia saat ini
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KonsultasiScreen;
