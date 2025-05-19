import icons from '@/constants/icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const KalkulatorGizi = () => {
  const router = useRouter();

  return (
    <SafeAreaView className='bg-primary-500 h-full p-4'>
      <View className="flex-1 bg-[#40E0D0]">
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image 
              source={icons.rightArrow}
              className="w-6 h-6 rotate-180"
            />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">KALKULATOR GIZI</Text>
          <TouchableOpacity onPress={() => router.back()} className="ml-auto">
            <Text className="text-3xl text-white">×</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 justify-center px-4">
          <View className="bg-[#5F9EA0] rounded-xl p-6">
            <TouchableOpacity 
              className="bg-white rounded-xl p-4 mb-4"
              onPress={() => router.push('/bbi')}
            >
              <Text className="text-center text-lg font-semibold">HITUNG BBI</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white rounded-xl p-4"
              onPress={() => router.push('/imt')}
            >
              <Text className="text-center text-lg font-semibold">HITUNG IMT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  </SafeAreaView>
  );
};

export default KalkulatorGizi;
