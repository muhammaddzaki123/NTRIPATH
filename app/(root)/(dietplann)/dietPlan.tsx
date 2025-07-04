import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DietPlan = () => {
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [disease, setDisease] = useState('');
  const [bmr, setBmr] = useState(0);
  const [tee, setTee] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const activityLevels = [
    { label: 'Kurang gerak (sedikit atau tidak berolahraga)', value: 1.2 },
    { label: 'Aktifitas ringan (olahraga ringan/olahraga 1-3 hari/minggu)', value: 1.375 },
    { label: 'Cukup aktif (olahraga/olahraga sedang 3-5 hari/minggu)', value: 1.55 },
    { label: 'Sangat aktif (olahraga berat/olahraga 6-7 hari seminggu)', value: 1.725 },
    { label: 'Super aktif (olahraga sangat keras/pekerjaan fisik & olahraga dua kali sehari)', value: 1.9 },
  ];

  // PERUBAHAN DI SINI: Mengubah array string menjadi array objek { label, value }
  const diseasesOptions = [
    { label: 'Pilih Penyakit', value: '' },
    { label: 'Diabetes Melitus', value: 'diabetes_melitus' },
    { label: 'Hipertensi', value: 'hipertensi' },
    { label: 'Kanker', value: 'kanker' }
  ];

  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (gender && activityLevel && !isNaN(w) && !isNaN(h) && !isNaN(a) && w > 0 && h > 0 && a > 0) {
      let mifflinBMR = gender === 'Laki-Laki'
        ? (10 * w) + (6.25 * h) - (5 * a) + 5
        : (10 * w) + (6.25 * h) - (5 * a) - 161;

      setBmr(parseFloat(mifflinBMR.toFixed(2)));
      const activityMultiplier = parseFloat(activityLevel);
      setTee(parseFloat((mifflinBMR * activityMultiplier).toFixed(2)));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary-400 h-full p-4 mb-3 pb-3 '>
      <View className="flex-1 bg-primary-500 items-center-center rounded-xl mt-5" >
        {/* Header */}
        <View className="flex-row items-center pt-5 border-b border-white pb-2 mb-6">
          {/* Tombol Panah: Kembali ke halaman sebelumnya */}
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" className="ml-2" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-rubik-bold ml-4">DIET PLAN</Text>
          {/* Tombol Silang: Kembali ke halaman utama */}
          <TouchableOpacity onPress={() => router.replace('/')} className="ml-auto">
            <Text className="text-3xl text-white mr-4">×</Text>
          </TouchableOpacity>
        </View>

        <Stack.Screen
          options={{
            headerTitle: "DIET PLAN",
            headerStyle: { backgroundColor: '#40E0D0' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />

        <View className="m-4 p-6 bg-[#5F9EA0] rounded-xl">
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-white mb-2">Jenis Kelamin :</Text>
              <View className="bg-white rounded-lg">
                <Picker
                  selectedValue={gender}
                  onValueChange={setGender}
                  className="h-12"
                  style={{ color: 'black' }} 
                  dropdownIconColor="black"
                >
                  <Picker.Item label="Pilih" value="" style={{ color: 'black' }} />
                  <Picker.Item label="Laki-Laki" value="Laki-Laki" style={{ color: 'black' }} />
                  <Picker.Item label="Perempuan" value="Perempuan" style={{ color: 'black' }} />
                </Picker>
              </View>
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-white mb-2">Umur :</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                className="bg-white p-3 rounded-lg text-black" 
                placeholder="Umur"
                placeholderTextColor="#9CA3AF" 
              />
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-white mb-2">Berat Badan (kg) :</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                className="bg-white p-3 rounded-lg text-black"
                placeholder="Berat"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="flex-1 ml-2">
              <Text className="text-white mb-2">Tinggi Badan (cm) :</Text>
              <TextInput
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                className="bg-white p-3 rounded-lg text-black"
                placeholder="Tinggi"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-white mb-2">Level Aktivitas :</Text>
            <View className="bg-white rounded-lg">
              <Picker
                selectedValue={activityLevel}
                onValueChange={setActivityLevel}
                className="h-12"
                style={{ color: 'black' }}
                dropdownIconColor="black"
              >
                <Picker.Item label="Pilih Level Aktivitas" value="" style={{ color: 'black' }} />
                {activityLevels.map((level, index) => (
                  <Picker.Item key={index} label={level.label} value={level.value.toString()} style={{ color: 'black' }} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-white mb-2">Penyakit yang di Derita :</Text>
            <View className="bg-white rounded-lg">
              {/* PERUBAHAN DI SINI: Menggunakan data baru untuk merender Picker.Item */}
              <Picker
                selectedValue={disease}
                onValueChange={setDisease}
                className="h-12"
                style={{ color: 'black' }}
                dropdownIconColor="black"
              >
                {diseasesOptions.map((d, index) => (
                  <Picker.Item key={index} label={d.label} value={d.value} style={{ color: 'black' }} />
                ))}
              </Picker>
            </View>
          </View>

          {showResults && (
            <View className="mb-4">
              <Text className="text-white font-bold mb-2">Results :</Text>
              <Text className="text-white mb-1">BMR (Mifflin - St Jeor) :</Text>
              <View className="bg-white p-3 rounded-lg mb-2">
                <Text className="text-black">{bmr} kcal/day</Text>
              </View>

              <Text className="text-white mb-1">TEE Berdasarkan Tingkat Aktivitas Level (Mifflin - St Jeor) :</Text>
              <View className="bg-white p-3 rounded-lg">
                <Text className="text-black">{tee} kcal/day</Text>
              </View>
            </View>
          )}

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={calculateBMR}
              className="bg-white py-3 px-6 rounded-full mr-1"
            >
              <Text className="text-[#40E0D0] font-bold">HITUNG</Text>
            </TouchableOpacity>

            {showResults && (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/diet-recommendations",
                    params: {
                      disease: disease, // disease sekarang bernilai 'diabetes_melitus'
                      calories: tee.toString()
                    }
                  });
                }}
                className="bg-white py-3 px-6 rounded-full ml-1"
              >
                <Text className="text-[#40E0D0] font-bold">TEMUKAN DIET PLAN</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DietPlan;