import { config, databases } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NutritionistProfile = () => {
  const { user, refetch } = useGlobalContext();
  const [updating, setUpdating] = useState(false);

  if (!user?.nutritionistProfile) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Profil tidak ditemukan</Text>
      </SafeAreaView>
    );
  }

  const { status, available } = user.nutritionistProfile;

  const toggleAvailability = async () => {
    try {
      setUpdating(true);
      await databases.updateDocument(
        config.databaseId!,
        config.ahligiziCollectionId!,
        user.$id,
        {
          available: !available,
          lastSeen: new Date().toISOString()
        }
      );
      await refetch();
      Alert.alert(
        'Sukses',
        `Status ketersediaan diubah menjadi ${!available ? 'tersedia' : 'tidak tersedia'}`
      );
    } catch (error) {
      console.error('Error toggling availability:', error);
      Alert.alert('Error', 'Gagal mengubah status ketersediaan');
    } finally {
      setUpdating(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      setUpdating(true);
      await databases.updateDocument(
        config.databaseId!,
        config.ahligiziCollectionId!,
        user.$id,
        {
          status: status === 'online' ? 'offline' : 'online',
          lastSeen: new Date().toISOString()
        }
      );
      await refetch();
      Alert.alert(
        'Sukses',
        `Status diubah menjadi ${status === 'online' ? 'offline' : 'online'}`
      );
    } catch (error) {
      console.error('Error toggling online status:', error);
      Alert.alert('Error', 'Gagal mengubah status online');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 bg-[#1CD6CE] flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-3"
        >
          <Text className="text-white text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Profil Ahli Gizi</Text>
      </View>

      {/* Profile Info */}
      <View className="items-center py-6 bg-white">
        <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-3">
          {user.avatar ? (
            <Image 
              source={{ uri: user.avatar }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
            />
          ) : (
            <FontAwesome name="user-circle" size={64} color="#666" />
          )}
        </View>
        <Text className="text-xl font-bold text-gray-900">{user.name}</Text>
        <Text className="text-gray-600">{user.email}</Text>
        <Text className="text-[#1CD6CE] font-medium mt-1">
          {user.nutritionistProfile.specialization}
        </Text>
      </View>

      {/* Status Controls */}
      <View className="px-4 py-6 border-t border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Pengaturan Status
        </Text>

        {/* Online Status */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-900 font-medium">Status Online</Text>
            <Text className="text-gray-600 text-sm">
              {status === 'online' 
                ? 'Anda terlihat online oleh user'
                : 'Anda terlihat offline oleh user'
              }
            </Text>
          </View>
          <Switch
            value={status === 'online'}
            onValueChange={toggleOnlineStatus}
            disabled={updating}
            trackColor={{ false: '#767577', true: '#1CD6CE' }}
          />
        </View>

        {/* Availability */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-900 font-medium">Ketersediaan</Text>
            <Text className="text-gray-600 text-sm">
              {available 
                ? 'Menerima konsultasi baru'
                : 'Tidak menerima konsultasi baru'
              }
            </Text>
          </View>
          <Switch
            value={available}
            onValueChange={toggleAvailability}
            disabled={updating}
            trackColor={{ false: '#767577', true: '#1CD6CE' }}
          />
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-6 border-t border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Statistik
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-[#1CD6CE]">
              {user.nutritionistProfile.experience}
            </Text>
            <Text className="text-gray-600">Tahun Pengalaman</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-[#1CD6CE]">
              {user.nutritionistProfile.rating.toFixed(1)}
            </Text>
            <Text className="text-gray-600">Rating</Text>
          </View>
        </View>
      </View>

      {updating && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <ActivityIndicator size="large" color="#1CD6CE" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default NutritionistProfile;
