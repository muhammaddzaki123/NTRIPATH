import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const diseases = [
  'Pilih penyakit',
  'Diabetes',
  'Hipertensi',
  'Kolesterol',
  'Asam Urat',
  'Maag'
];

export default function RecallScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    disease: 'Pilih penyakit',
  });

  const handleNext = () => {
    if (!userData.name || !userData.age || !userData.gender || userData.disease === 'Pilih penyakit') {
      alert('Mohon lengkapi semua data');
      return;
    }
    router.push({
      pathname: '/food-recall',
      params: { disease: userData.disease.toLowerCase() }
    });
  };

  return (
    <View className="flex-1 bg-[#40E0D0]">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#40E0D0]">
        <TouchableOpacity 
          onPress={() => router.back()}
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

      {/* Form Content */}
      <ScrollView className="flex-1 px-6 py-6 bg-[#40E0D0]">
        <View className="space-y-6">
          {/* Nama */}
          <View>
            <Text className="text-white text-lg font-medium mb-2">Nama :</Text>
            <TextInput
              className="w-full bg-white rounded-xl p-4 text-base"
              placeholder="Masukkan nama"
              value={userData.name}
              onChangeText={(text) => setUserData({...userData, name: text})}
            />
          </View>

          {/* Row for Usia and Jenis Kelamin */}
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Text className="text-white text-lg font-medium mb-2">Usia :</Text>
              <TextInput
                className="w-full bg-white rounded-xl p-4 text-base"
                placeholder="Usia"
                keyboardType="numeric"
                value={userData.age}
                onChangeText={(text) => setUserData({...userData, age: text})}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-medium mb-2">Jenis Kelamin :</Text>
              <View className="bg-white rounded-xl overflow-hidden">
                <Picker
                  selectedValue={userData.gender}
                  onValueChange={(value) => setUserData({...userData, gender: value})}
                  style={{ height: 50, backgroundColor: 'white' }}
                >
                  <Picker.Item label="Pilih" value="" />
                  <Picker.Item label="Laki-laki" value="Laki-laki" />
                  <Picker.Item label="Perempuan" value="Perempuan" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Riwayat Penyakit */}
          <View>
            <Text className="text-white text-lg font-medium mb-2">Riwayat Penyakit :</Text>
            <View className="bg-white rounded-xl overflow-hidden">
              <Picker
                selectedValue={userData.disease}
                onValueChange={(value) => setUserData({...userData, disease: value})}
                style={{ height: 50, backgroundColor: 'white' }}
              >
                {diseases.map((disease) => (
                  <Picker.Item 
                    key={disease} 
                    label={disease} 
                    value={disease}
                    style={{ fontSize: 16 }}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          className="bg-white rounded-full py-4 px-6 mt-8 mb-4 items-center shadow-lg"
          onPress={handleNext}
        >
          <Text className="text-[#40E0D0] font-semibold text-lg">NEXT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
