import { useChat } from '@/contexts/ChatContext';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const KonsultasiScreen = () => {
  const { nutritionists, unreadMessages } = useChat();

  const getStatusColor = (status: string) => {
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
          {nutritionists.map((nutritionist) => (
            <Link
              key={nutritionist.$id}
              href={`/chat/${nutritionist.id}`}
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
                      {unreadMessages[nutritionist.$id] && (
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
                      {nutritionist.type}
                    </Text>
                  </View>

                  <View className="mb-2">
                    <Text className="text-sm font-semibold text-gray-700">
                      Pengalaman:
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {nutritionist.experience} Tahun
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

                {/* Footer with Stats */}
                <View className="flex-row justify-between items-center px-4 py-3 bg-white border-t border-gray-100">
                  <View className="flex-row items-center">
                    <FontAwesome name="star" size={14} color="#FFD700" />
                    <Text className="ml-1 text-sm text-gray-600">
                      {nutritionist.rating?.toFixed(1) || '0.0'}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600">
                    {nutritionist.totalConsultations} Konsultasi
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KonsultasiScreen;
