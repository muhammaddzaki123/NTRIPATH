import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { databases, config } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface NutritionistListProps {
  diseaseCategory: string;
}

export function NutritionistList({ diseaseCategory }: NutritionistListProps) {
  const router = useRouter();
  const [nutritionists, setNutritionists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNutritionists();
  }, [diseaseCategory]);

  const loadNutritionists = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId!,
        'ahligizi',
        [
          Query.equal('specialization', diseaseCategory),
          Query.equal('available', true)
        ]
      );

      // Get user details for each nutritionist
      const nutritionistsWithDetails = await Promise.all(
        response.documents.map(async (nutritionist) => {
          const user = await databases.getDocument(
            config.databaseId!,
            'users',
            nutritionist.user_id
          );
          return { ...nutritionist, user };
        })
      );

      setNutritionists(nutritionistsWithDetails);
    } catch (error) {
      console.error('Error loading nutritionists:', error);
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

  if (nutritionists.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-500">Tidak ada ahli gizi yang tersedia</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={nutritionists}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push(`/chat/${item.user_id}`)}
          className="w-64 mr-4 bg-white rounded-lg shadow-sm p-4"
        >
          <Image
            source={{ uri: item.user.avatar || 'https://via.placeholder.com/60' }}
            className="w-16 h-16 rounded-full mb-3"
          />
          <Text className="font-medium text-lg">{item.user.name}</Text>
          <Text className="text-gray-600 mb-2">Spesialis {item.specialization}</Text>
          <Text className="text-gray-500 text-sm" numberOfLines={2}>
            {item.education}
          </Text>
          <View className="mt-3 bg-primary px-4 py-2 rounded-lg">
            <Text className="text-white text-center">Mulai Chat</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
