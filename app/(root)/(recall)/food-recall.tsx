import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { foodRestrictions } from '@/constants/food-restrictions';

type FoodInput = {
  name: string;
  amount: string;
  unit: string;
};

type MealType = 'breakfast' | 'lunch' | 'dinner';

const FoodInputRow = ({ 
  value,
  onChange,
  placeholder = "Nama makanan"
}: { 
  value: FoodInput;
  onChange: (data: FoodInput) => void;
  placeholder?: string;
}) => (
  <View className="flex-row mb-3 space-x-2">
    <TextInput
      className="flex-2 bg-white rounded-xl p-3"
      value={value.name}
      onChangeText={(text) => onChange({ ...value, name: text })}
      placeholder={placeholder}
    />
    <TextInput
      className="w-20 bg-white rounded-xl p-3"
      value={value.amount}
      onChangeText={(text) => onChange({ ...value, amount: text })}
      placeholder="Jumlah"
      keyboardType="numeric"
    />
    <View className="w-20 bg-white rounded-xl overflow-hidden">
      <Picker
        selectedValue={value.unit}
        onValueChange={(text) => onChange({ ...value, unit: text })}
        className="h-12"
      >
        <Picker.Item label="URT" value="" />
        {['Porsi', 'Piring', 'Sendok', 'Buah', 'Potong'].map((unit) => (
          <Picker.Item key={unit} label={unit} value={unit} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function FoodRecallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const disease = params.disease as string;
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [meals, setMeals] = useState({
    breakfast: {
      carbs: { name: '', amount: '', unit: '' },
      others: Array(4).fill({ name: '', amount: '', unit: '' }),
      snacks: Array(4).fill({ name: '', amount: '', unit: '' })
    },
    lunch: {
      carbs: { name: '', amount: '', unit: '' },
      others: Array(4).fill({ name: '', amount: '', unit: '' }),
      snacks: Array(4).fill({ name: '', amount: '', unit: '' })
    },
    dinner: {
      carbs: { name: '', amount: '', unit: '' },
      others: Array(4).fill({ name: '', amount: '', unit: '' }),
      snacks: Array(4).fill({ name: '', amount: '', unit: '' })
    }
  });

  const updateFood = (
    type: MealType,
    category: 'carbs' | 'others' | 'snacks',
    index: number,
    data: FoodInput
  ) => {
    setMeals(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: category === 'carbs' 
          ? data 
          : prev[type][category].map((item: FoodInput, i: number) => 
              i === index ? data : item
            )
      }
    }));
  };

  const handleNext = () => {
    if (mealType === 'breakfast') {
      setMealType('lunch');
    } else if (mealType === 'lunch') {
      setMealType('dinner');
    } else {
      // Collect all foods from all meals
      const allFoods: ({ name: string; amount: string; unit: string; } | { name: string; amount: string; unit: string; } | { name: string; amount: string; unit: string; })[] = [];
      ['breakfast', 'lunch', 'dinner'].forEach((mealTime) => {
        const meal = meals[mealTime as keyof typeof meals];
        if (meal.carbs.name) {
          allFoods.push(meal.carbs);
        }
        meal.others.forEach(food => {
          if (food.name) {
            allFoods.push(food);
          }
        });
        meal.snacks.forEach(food => {
          if (food.name) {
            allFoods.push(food);
          }
        });
      });

      // Check against restrictions
      const restrictions = foodRestrictions[disease] || [];
      const warningFoods = allFoods.filter(food => {
        const restriction = restrictions.find(r => 
          r.name.toLowerCase() === food.name.toLowerCase()
        );
        return restriction && parseInt(food.amount) > restriction.maxAmount;
      });

      router.push({
        pathname: '/warning',
        params: { 
          warningFoods: JSON.stringify(warningFoods)
        }
      });
    }
  };

  const handleBack = () => {
    if (mealType === 'dinner') {
      setMealType('lunch');
    } else if (mealType === 'lunch') {
      setMealType('breakfast');
    } else {
      router.back();
    }
  };

  const currentMeal = meals[mealType];

  return (
    <View className="flex-1 bg-[#40E0D0]">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#40E0D0]">
        <TouchableOpacity 
          onPress={handleBack}
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
        <View className="space-y-4">
          <Text className="text-white text-xl font-semibold">
            {mealType === 'breakfast' ? 'Makan Pagi' :
             mealType === 'lunch' ? 'Makan Siang' : 'Makan Malam'}
          </Text>

          <View className="space-y-4">
            <Text className="text-white text-lg">Nasi/karbohidrat :</Text>
            <FoodInputRow
              value={currentMeal.carbs}
              onChange={(data) => updateFood(mealType, 'carbs', 0, data)}
            />

            <Text className="text-white text-lg mt-4">Lainnya :</Text>
            {currentMeal.others.map((food: FoodInput, index: number) => (
              <FoodInputRow
                key={`other-${index}`}
                value={food}
                onChange={(data) => updateFood(mealType, 'others', index, data)}
              />
            ))}

            <Text className="text-white text-lg mt-4">Selingan :</Text>
            {currentMeal.snacks.map((food: FoodInput, index: number) => (
              <FoodInputRow
                key={`snack-${index}`}
                value={food}
                onChange={(data) => updateFood(mealType, 'snacks', index, data)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity 
          className="bg-white rounded-full py-3 px-6 mt-6 mb-4 items-center"
          onPress={handleNext}
        >
          <Text className="text-[#40E0D0] font-semibold text-lg">
            {mealType === 'dinner' ? 'CEK ASUPAN' : 'NEXT'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
