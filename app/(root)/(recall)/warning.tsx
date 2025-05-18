import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

type FoodWarning = {
  name: string;
  amount: string;
  unit: string;
};

export default function WarningScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  let warningFoods: FoodWarning[] = [];
  try {
    if (params.warningFoods) {
      warningFoods = JSON.parse(params.warningFoods as string);
    }
  } catch (error) {
    console.error('Error parsing warning foods:', error);
  }

  return (
    <View className="flex-1 bg-[#40E0D0]">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#40E0D0]">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2"
        >
          <Image 
            source={require('../../../assets/icons/back-arrow.png')}
            className="w-6 h-6"
            contentFit="contain"
          />
        </TouchableOpacity>
        <Text className="flex-1 text-white text-xl font-bold ml-2">
          Recall Asupan Makanan 24 Jam
        </Text>
        <TouchableOpacity 
          onPress={() => router.replace('/')}
          className="p-2"
        >
          <Text className="text-white text-base">Keluar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-2">
        <Text className="text-red-500 text-2xl font-bold text-center mb-6">
          WARNING
        </Text>

        {warningFoods.length > 0 ? (
          <View className="space-y-3">
            {warningFoods.map((food, index) => (
              <View key={index} className="bg-white rounded-xl p-4">
                <Text className="text-red-500 text-base">
                  {`${food.name} ${food.amount} ${food.unit}`}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-white rounded-xl p-4">
            <Text className="text-center text-gray-600">
              Tidak ada makanan yang melebihi batas konsumsi
            </Text>
          </View>
        )}

        <TouchableOpacity 
          className="bg-white rounded-full py-3 px-6 mt-6 mb-4 items-center"
          onPress={() => router.push('./consultation')}
        >
          <Text className="text-[#40E0D0] font-semibold text-lg">
            YUK KONSUL
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
