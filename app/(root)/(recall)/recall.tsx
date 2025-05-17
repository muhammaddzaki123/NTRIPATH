import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const diseases = ['Diabetes', 'Hipertensi', 'Kanker'];

export default function UserInfoScreen() {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    disease: '',
  });

  const handleNext = () => {
    if (!userData.name || !userData.age || !userData.gender || !userData.disease) {
      alert('Mohon lengkapi semua data');
      return;
    }
    router.push({
      pathname: '/food-recall',
      params: { disease: userData.disease }
    });
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
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Keluar</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.form}>
        <Text style={styles.label}>Nama:</Text>
        <TextInput
          style={styles.input}
          value={userData.name}
          onChangeText={(text) => setUserData({...userData, name: text})}
          placeholder="Masukkan nama"
        />

        <Text style={styles.label}>Usia:</Text>
        <TextInput
          style={styles.input}
          value={userData.age}
          onChangeText={(text) => setUserData({...userData, age: text})}
          placeholder="Masukkan usia"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Jenis Kelamin:</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity 
            style={[
              styles.genderButton,
              userData.gender === 'Laki-laki' && styles.selectedGender
            ]}
            onPress={() => setUserData({...userData, gender: 'Laki-laki'})}
          >
            <Text style={[
              styles.genderText,
              userData.gender === 'Laki-laki' && styles.selectedText
            ]}>Laki-laki</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.genderButton,
              userData.gender === 'Perempuan' && styles.selectedGender
            ]}
            onPress={() => setUserData({...userData, gender: 'Perempuan'})}
          >
            <Text style={[
              styles.genderText,
              userData.gender === 'Perempuan' && styles.selectedText
            ]}>Perempuan</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Riwayat Penyakit:</Text>
        <View style={styles.diseaseContainer}>
          {diseases.map((disease) => (
            <TouchableOpacity
              key={disease}
              style={[
                styles.diseaseButton,
                userData.disease === disease && styles.selectedDisease
              ]}
              onPress={() => setUserData({...userData, disease})}
            >
              <Text style={[
                styles.diseaseText,
                userData.disease === disease && styles.selectedText
              ]}>{disease}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#40E0D0',
    borderColor: '#40E0D0',
  },
  genderText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  diseaseContainer: {
    marginBottom: 24,
  },
  diseaseButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  selectedDisease: {
    backgroundColor: '#40E0D0',
    borderColor: '#40E0D0',
  },
  diseaseText: {
    fontSize: 16,
    color: '#333',
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
