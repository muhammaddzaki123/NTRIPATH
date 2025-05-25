import { useChat } from '@/contexts/ChatContext';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const KonsultasiScreen = () => {
  const { nutritionists } = useChat();

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
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
              key={nutritionist.id}
              href={`/chat/${nutritionist.id}`}
              asChild
            >
              <TouchableOpacity className="flex-row items-center p-4 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
                  <FontAwesome name="user-circle" size={32} color="#666" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {nutritionist.name}
                  </Text>
                  <Text className="text-sm text-gray-500">{nutritionist.type}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className={`w-2 h-2 rounded-full ${nutritionist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} mr-1`} />
                  <Text className="text-sm text-gray-500">{nutritionist.status}</Text>
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
