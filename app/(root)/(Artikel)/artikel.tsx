import { Artikel } from '@/components/Berita';
import Search from '@/components/Search';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const artikel = () => {
  return (
    <SafeAreaView className='bg-primary-500 h-full p-4'>
      {/* Header */}
      <View className="flex-row items-center ">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={"white"} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold  ml-4 ">ARTIKEL GIZI</Text>
        <TouchableOpacity onPress={() => router.back()} className="ml-auto">
          <Text className="text-3xl text-white mr-4">×</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className='felx flex-col mt-5 border-t pt-2 border-white'>
      <Search/>
      </View>
      
      <ScrollView className='h-full w-full bg-primary-400 p-5 mt-5'
            showsVerticalScrollIndicator={false}
          >
      <View className='bg-primary-400 p-4  h-full w-full'>
        <Artikel />
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default artikel