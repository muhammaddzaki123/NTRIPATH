import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { foodRestrictions, FoodRestriction } from '@/constants/food-restrictions';

type FoodInput = {
  name: string;
  amount: number;
  unit: string;
};

type MealData = {
  carbs: FoodInput;
  others: FoodInput[];
  snacks: FoodInput[];
};

type Meals = {
  breakfast: MealData;
  lunch: MealData;
  dinner: MealData;
};

export default function WarningScreen() {
  const params = useLocalSearchParams();
  const [warningFoods, setWarningFoods] = useState<string[]>([]);

  useEffect(() => {
    if (params.meals) {
      const meals: Meals = JSON.parse(params.meals as string);
      const userDisease = params.disease as string;
      const restrictions = foodRestrictions[userDisease.toLowerCase()];

      const warningList: string[] = [];

      // Helper function to check food against restrictions
      const checkFood = (food: FoodInput) => {
        if (!food.name) return;
        
        const restriction = restrictions.find((r: FoodRestriction) => 
          r.name.toLowerCase() === food.name.toLowerCase()
        );

        if (restriction && food.amount > restriction.maxAmount) {
          warningList.push(
            `${food.name} ${food.amount} ${food.unit}`
          );
        }
      };

      // Check all meals
      ['breakfast', 'lunch', 'dinner'].forEach((mealTime) => {
        const meal = meals[mealTime as keyof Meals];
        
        // Check carbs
        checkFood(meal.carbs);
        
        // Check other foods
        meal.others.forEach(checkFood);
        
        // Check snacks
        meal.snacks.forEach(checkFood);
      });

      setWarningFoods(warningList);
    }
  }, [params.meals, params.disease]);

  const handleConsult = () => {
    // Navigate to consultation screen or trigger consultation action
    alert('Menuju halaman konsultasi...');
  };

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
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
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
        <Text style={styles.warningTitle}>WARNING</Text>

        {warningFoods.length > 0 ? (
          <View style={styles.warningList}>
            {warningFoods.map((food, index) => (
              <View key={index} style={styles.warningItem}>
                <Text style={styles.warningText}>{food}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noWarningContainer}>
            <Text style={styles.noWarningText}>
              Tidak ada makanan yang melebihi batas konsumsi
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.consultButton}
          onPress={handleConsult}
        >
          <Text style={styles.consultButtonText}>YUK KONSUL</Text>
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
  headerButton: {
    marginHorizontal: 10,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  warningList: {
    marginBottom: 24,
  },
  warningItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  warningText: {
    fontSize: 16,
    color: '#FF0000',
  },
  noWarningContainer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  noWarningText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  consultButton: {
    backgroundColor: '#40E0D0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
