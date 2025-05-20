import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-provider';
import { NutritionistList } from '@/components/chat/NutritionistList';
import { ChatList } from '@/components/chat/ChatList';

export default function KonsultasiScreen() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg mb-4">Silakan login terlebih dahulu</Text>
        <TouchableOpacity 
          onPress={() => router.push('/sign-in')}
          className="bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-xl font-semibold">Konsultasi Gizi</Text>
      </View>

      {user.role === 'patient' ? (
        <>
          <View className="p-4">
            <Text className="text-lg font-medium mb-3">Ahli Gizi Tersedia</Text>
            <NutritionistList diseaseCategory={user.disease_category} />
          </View>
          <View className="p-4 flex-1">
            <Text className="text-lg font-medium mb-3">Riwayat Chat</Text>
            <ChatList userId={user.$id} />
          </View>
        </>
      ) : (
        <View className="p-4 flex-1">
          <Text className="text-lg font-medium mb-3">Daftar Chat Pasien</Text>
          <ChatList userId={user.$id} />
        </View>
      )}
    </View>
  );
}
