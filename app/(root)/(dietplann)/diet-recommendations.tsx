import { DIET_PLANS } from '@/constants/diet-config';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const DietRecommendations = () => {
  const params = useLocalSearchParams();
  const { disease, calories } = params;
  const roundedCalories = Math.round(Number(calories) / 100) * 100;
  const closestCalories = 1700; // For now we only have 1700 calorie plans

  const renderMealSection = (title: string, meals: Array<{
    bahan: string;
    berat: string;
    urt: string;
    penukar: string;
  }>) => (
    <View className="mt-4">
      <Text className="font-bold text-lg mb-2">{title}</Text>
      <View className="space-y-2">
        {meals.map((meal, index) => (
          <View key={index} className="flex-row justify-between">
            <Text className="w-24">{meal.bahan}</Text>
            <Text className="w-16">{meal.berat}</Text>
            <Text className="w-16">{meal.urt}</Text>
            <Text className="w-20">{meal.penukar}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDietPlan = () => {
    const plan = DIET_PLANS[disease as keyof typeof DIET_PLANS]?.[closestCalories];
    
    if (!plan) {
      return (
        <View className="bg-white rounded-lg p-4">
          <Text className="text-lg">Diet plan tidak tersedia untuk kondisi ini.</Text>
        </View>
      );
    }

    return (
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="text-xl font-bold mb-4">{plan.title}</Text>
        
        <View className="border-b border-gray-200 pb-2">
          <View className="flex-row justify-between mb-2">
            <Text className="font-bold w-24">Bahan</Text>
            <Text className="font-bold w-16">Berat</Text>
            <Text className="font-bold w-16">URT</Text>
            <Text className="font-bold w-20">Penukar</Text>
          </View>
        </View>

        {plan.meals.pagi && renderMealSection("Pagi", plan.meals.pagi)}
        {plan.meals.snackPagi && renderMealSection("Snack Pagi", plan.meals.snackPagi)}
        {plan.meals.siang && renderMealSection("Siang", plan.meals.siang)}
        {plan.meals.snackSiang && renderMealSection("Snack Siang", plan.meals.snackSiang)}
        {plan.meals.malam && renderMealSection("Malam", plan.meals.malam)}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#40E0D0]">
      <Stack.Screen
        options={{
          headerTitle: "DIET PLAN",
          headerStyle: { backgroundColor: '#40E0D0' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <View className="p-4">
        {renderDietPlan()}
      </View>
    </ScrollView>
  );
};

export default DietRecommendations;