import icons from '@/constants/icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BBICalculator = () => {
  const router = useRouter();
  const [height, setHeight] = useState('');
  const [result, setResult] = useState('');

  const calculateBBI = () => {
    if (height) {
      const heightInCm = parseFloat(height);
      // Formula BBI = (Height - 100) - ((Height - 100) x 10%)
      const bbi = (heightInCm - 100) - ((heightInCm - 100) * 0.1);
      setResult(`Berat Badan Ideal Anda adalah ${bbi.toFixed(1)} kg`);
    }
  };

  return (
  <SafeAreaView className='bg-primary-500 h-full p-4'>
    <View className="flex-1 bg-[#40E0D0]">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.rightArrow} className="w-6 h-6 rotate-180" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">HITUNG BBI</Text>
        <TouchableOpacity onPress={() => router.back()} className="ml-auto">
          <Text className="text-3xl text-white">×</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-4">
        <View className="bg-[#5F9EA0] rounded-xl p-6 mt-4">
          <Text className="text-white text-lg mb-2">Tinggi Badan :</Text>
          <View className="bg-white rounded-xl flex-row items-center px-4 mb-4">
            <TextInput
              className="flex-1 py-3 text-lg"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="Masukkan tinggi badan"
            />
            <Text className="text-gray-500">cm</Text>
          </View>

          <Text className="text-white text-lg mb-2">Result :</Text>
          <View className="bg-white rounded-xl p-4 mb-4 min-h-[100]">
            <Text className="text-lg">{result}</Text>
          </View>

          <TouchableOpacity 
            className="bg-white rounded-xl p-4"
            onPress={calculateBBI}
          >
            <Text className="text-center text-lg font-semibold">HITUNG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </SafeAreaView>
  );
};

export default BBICalculator;
