import { DIET_PLANS } from '@/constants/diet-config';
import icons from '@/constants/icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const DietRecommendations = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { disease, calories } = params;
  
  // Round to nearest 100 calories
  const roundedCalories = Math.round(Number(calories) / 100) * 100;
  
  // Find closest available calorie plan
  const availableCalories = Object.keys(DIET_PLANS[disease as keyof typeof DIET_PLANS] || {}).map(Number);
  const closestCalories = availableCalories.reduce((prev, curr) => {
    return Math.abs(curr - roundedCalories) < Math.abs(prev - roundedCalories) ? curr : prev;
  }, availableCalories[0] || 1700);

  const renderMealSection = (title: string, meals: Array<{
    bahan: string;
    berat: string;
    urt: string;
    penukar: string;
    exmenu: string;
  }>) => (
    <View className="mt-4">
      <Text className="text-gray-800 font-semibold text-base mb-2">{title}</Text>
      <View className="space-y-2">
        {meals.map((meal, index) => (
          <View key={`${title}-${index}`} className="flex-row justify-between items-center py-1">
            <Text className="flex-1 text-gray-700">{meal.bahan}</Text>
            <Text className="w-20 text-center text-gray-700">{meal.berat}</Text>
            <Text className="w-24 text-center text-gray-700">{meal.urt}</Text>
            <Text className="w-24 text-center text-gray-700">{meal.penukar}</Text>
            <Text className="w-24 text-center text-gray-700">{meal.exmenu}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDietPlan = () => {
    const plan = DIET_PLANS[disease as keyof typeof DIET_PLANS]?.[closestCalories];
    
    if (!plan) {
      return (
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-lg text-center text-gray-800">
            Diet plan tidak tersedia untuk kondisi ini.
          </Text>
        </View>
      );
    }

    return (
      <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <Text className="text-xl font-bold text-center text-gray-800 mb-6">
          {plan.title}
        </Text>
        
        <View className="border-b border-gray-200 pb-2 mb-4">
          <View className="flex-row justify-between">
            <Text className="flex-1 font-bold text-gray-800">Bahan</Text>
            <Text className="w-20 text-center font-bold text-gray-800">Berat</Text>
            <Text className="w-24 text-center font-bold text-gray-800">URT</Text>
            <Text className="w-24 text-center font-bold text-gray-800">Penukar</Text>
            <Text className="w-24 text-center font-bold text-gray-800">exmenu</Text>
          </View>
        </View>

        {plan.meals.pagi && renderMealSection("Pagi", plan.meals.pagi)}
        {plan.meals.selinganPagi && renderMealSection("Selingan Pagi", plan.meals.selinganPagi)}
        {plan.meals.siang && renderMealSection("Siang", plan.meals.siang)}
        {plan.meals.selinganSiang && renderMealSection("Selingan Siang", plan.meals.selinganSiang)}
        {plan.meals.malam && renderMealSection("Malam", plan.meals.malam)}
      </View>
    );
  };

  return (
    <SafeAreaView className='bg-primary-500 h-full p-4'>
        {/* Header */}
        <ScrollView className="flex-1 bg-[#40E0D0]">
              <View className="flex-row items-center ">
                <TouchableOpacity onPress={() => router.back()}>
                    <Image 
                      source={icons.rightArrow}
                      className="w-6 h-6 rotate-180"
                    />
                    </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">DIET RECOMENDATIONS</Text>
              <TouchableOpacity onPress={() => router.back()} className="ml-auto">
            <Text className="text-3xl text-white mr-4">×</Text>
        </TouchableOpacity>
      </View>

      <Stack.Screen
        options={{
          headerTitle: "DIET PLAN",
          headerStyle: { backgroundColor: '#40E0D0' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
        }}
      />
      <View className="p-4">
        {renderDietPlan()}
        
        <View className="flex-row justify-between space-x-4 mt-2 mb-6">
          <TouchableOpacity 
            className="flex-1 bg-white rounded-full py-4 items-center shadow-sm"
            onPress={() => router.back()}
          >
            <Text className="text-gray-800 font-semibold">HITUNG ULANG</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 bg-white rounded-full py-4 items-center shadow-sm"
            onPress={() => {
              // Navigate to diet recommendations
              router.push({
                pathname: "/diet-recommendations",
                params: { disease, calories: roundedCalories }
              });
            }}
          >
            <Text className="text-gray-800 font-semibold">TEMUKAN DIET PLAN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

export default DietRecommendations;
