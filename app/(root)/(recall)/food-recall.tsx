import { foodRestrictions } from '@/constants/food-restrictions';
import { urtOptions } from '@/constants/urt-options';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type FoodInput = {
  name: string;
  amount: string;
  unit: string;
};

type MealType = 'breakfast' | 'lunch' | 'dinner';

type MealData = {
  carbs: FoodInput;
  others: FoodInput[];
  snacks: FoodInput[];
};

type MealsState = {
  [key in MealType]: MealData;
};

const FoodInputRow = ({ 
  value,
  onChange,
  placeholder = "Nama makanan"
}: { 
  value: FoodInput;
  onChange: (data: FoodInput) => void;
  placeholder?: string;
}) => (
  <View className="mb-6">
    <View className="flex-row items-center space-x-3">
      <TextInput
        className="w-32 bg-white rounded-xl p-3 text-base"
        value={value.name}
        onChangeText={(text: string) => onChange({ ...value, name: text })}
        placeholder={placeholder}
      />
      <TextInput
        className="w-20 bg-white rounded-xl p-3 text-base"
        value={value.amount}
        onChangeText={(text: string) => onChange({ ...value, amount: text })}
        placeholder="Jumlah"
        keyboardType="numeric"
      />
      <View className="flex-1 bg-white rounded-xl overflow-hidden">
        <Picker
          selectedValue={value.unit}
          onValueChange={(text: string) => onChange({ ...value, unit: text })}
          style={{ height: 48, backgroundColor: 'white' }}
        >
          <Picker.Item label="Pilih URT" value="" />
          {urtOptions.map((unit: string) => 
            <Picker.Item 
              key={unit} 
              label={unit} 
              value={unit}
              style={{ fontSize: 16 }}
            />
          )}
        </Picker>
      </View>
    </View>
  </View>
);

export default function FoodRecallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const disease = params.disease as string;
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [meals, setMeals] = useState<MealsState>({
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
    category: keyof MealData,
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
      const allFoods: FoodInput[] = [];
      ['breakfast', 'lunch', 'dinner'].forEach((mealTime) => {
        const meal = meals[mealTime as MealType];
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

      <ScrollView className="flex-1 px-6 py-6">
        <View className="space-y-8">
          <Text className="text-white text-2xl font-semibold">
            {mealType === 'breakfast' ? 'Makan Pagi' :
             mealType === 'lunch' ? 'Makan Siang' : 'Makan Malam'}
          </Text>

          <View className="space-y-8">
            <View>
              <Text className="text-white text-lg font-medium mb-4">Nasi/karbohidrat :</Text>
              <FoodInputRow
                value={currentMeal.carbs}
                onChange={(data) => updateFood(mealType, 'carbs', 0, data)}
              />
            </View>

            <View>
              <Text className="text-white text-lg font-medium mb-4">Lainnya :</Text>
              {currentMeal.others.map((food: FoodInput, index: number) => (
                <FoodInputRow
                  key={`other-${index}`}
                  value={food}
                  onChange={(data) => updateFood(mealType, 'others', index, data)}
                />
              ))}
            </View>

            <View>
              <Text className="text-white text-lg font-medium mb-4">Selingan :</Text>
              {currentMeal.snacks.map((food: FoodInput, index: number) => (
                <FoodInputRow
                  key={`snack-${index}`}
                  value={food}
                  onChange={(data) => updateFood(mealType, 'snacks', index, data)}
                />
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-white rounded-full py-4 px-6 mt-8 mb-6 items-center shadow-lg"
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
