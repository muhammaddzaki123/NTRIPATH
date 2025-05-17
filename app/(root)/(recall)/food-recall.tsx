import { urtOptions } from '@/constants/urt-options';
import { Picker } from '@react-native-picker/picker';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  <View style={styles.foodRow}>
    <TextInput
      style={styles.foodNameInput}
      value={value.name}
      onChangeText={(text) => onChange({ ...value, name: text })}
      placeholder={placeholder}
    />
    <TextInput
      style={styles.amountInput}
      value={value.amount}
      onChangeText={(text) => onChange({ ...value, amount: text })}
      placeholder="Jumlah"
      keyboardType="numeric"
    />
    <View style={styles.unitContainer}>
      <Picker
        selectedValue={value.unit}
        onValueChange={(text) => onChange({ ...value, unit: text })}
        style={styles.unitPicker}
      >
        <Picker.Item label="URT" value="" />
        {urtOptions.map((unit) => (
          <Picker.Item key={unit} label={unit} value={unit} />
        ))}
      </Picker>
    </View>
  </View>
);

export default function FoodRecallScreen() {
  const { disease } = useLocalSearchParams();
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
      router.push({
        pathname: '/warning',
        params: { 
          meals: JSON.stringify(meals),
          disease: disease as string
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
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Recall Asupan Makanan 24 Jam',
          headerStyle: {
            backgroundColor: '#40E0D0',
          },
          headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Kembali</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Keluar</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {mealType === 'breakfast' ? 'Makan Pagi' :
           mealType === 'lunch' ? 'Makan Siang' : 'Makan Malam'}
        </Text>

        <View style={styles.foodList}>
          <Text style={styles.subTitle}>Nasi/karbohidrat:</Text>
          <FoodInputRow
            value={currentMeal.carbs}
            onChange={(data) => updateFood(mealType, 'carbs', 0, data)}
          />

          <Text style={styles.subTitle}>Lainnya:</Text>
          {currentMeal.others.map((food: FoodInput, index: number) => (
            <FoodInputRow
              key={`other-${index}`}
              value={food}
              onChange={(data) => updateFood(mealType, 'others', index, data)}
            />
          ))}

          <Text style={styles.subTitle}>Selingan:</Text>
          {currentMeal.snacks.map((food: FoodInput, index: number) => (
            <FoodInputRow
              key={`snack-${index}`}
              value={food}
              onChange={(data) => updateFood(mealType, 'snacks', index, data)}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {mealType === 'dinner' ? 'CEK ASUPAN' : 'NEXT'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0FFFF',
  },
  content: {
    padding: 20,
  },
  headerButton: {
    marginHorizontal: 10,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  foodList: {
    marginBottom: 24,
  },
  foodRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  foodNameInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  unitContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  unitPicker: {
    height: 45,
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#40E0D0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
