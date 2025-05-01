import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const features = [
  {
    id: 'recall',
    title: 'Recall Asupan 24 Jam',
    description: 'Recall asupan 24 jam adalah fitur yang berfungsi melakukan pencatatan asupan makan selama 24 jam, untuk mengetahui dampak dari makanan tersebut terhadap kesehatan.',
    icon: 'https://i.ibb.co/2dQZ9qZ/recall.png',
  },
  {
    id: 'artikel',
    title: 'Artikel Gizi',
    description: 'Artikel gizi adalah fitur yang berisikan artikel-artikel gizi terkini yang selalu di up-date, yang bisa anda baca untuk menambah pengetahuan.',
    icon: 'https://i.ibb.co/3mZ9Q7v/artikel.png',
  },
  {
    id: 'dietplan',
    title: 'Diet Plan',
    description: 'Diet plan adalah fitur diet yang dapat digunakan untuk menghitung kebutuhan kalori harian anda, serta melihat standar menu diet berdasarkan penyakit anda.',
    icon: 'https://i.ibb.co/3mZ9Q7v/dietplan.png',
  },
  {
    id: 'konsultasi',
    title: 'Konsultasi Gizi',
    description: 'Konsultasi gizi adalah fitur konsultasi langsung dengan ahli gizi guna mengkomunikasikan masalah gizi anda dan tindak lanjut solusi diet anda.',
    icon: 'https://i.ibb.co/3mZ9Q7v/konsultasi.png',
  },
  {
    id: 'kalkulator',
    title: 'Kalkulator Gizi',
    description: 'Kalkulator gizi adalah fitur untuk mengetahui status gizi anda serta menghitung berat badan ideal anda.',
    icon: 'https://i.ibb.co/3mZ9Q7v/kalkulator.png',
  },
];

const FeaturesScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-teal-100">
      {/* Header */}
      <View className="flex-row items-center bg-teal-400 p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://i.ibb.co/7QpKsCX/my-nutripath-logo.png' }}
          className="w-32 h-10 mx-4"
          resizeMode="contain"
        />
        <Text className="text-white text-lg font-bold">My Nutripath Fitur</Text>
      </View>

      {/* Features List */}
      <View className="p-4">
        {features.map((feature) => (
          <View key={feature.id} className="bg-white rounded-lg p-4 mb-4 flex-row items-center shadow">
            <Image source={{ uri: feature.icon }} className="w-12 h-12 mr-4" />
            <View className="flex-1">
              <Text className="font-semibold text-base">{feature.title}</Text>
              <Text className="text-sm text-gray-700">{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Illustration */}
      <Image
        source={{ uri: 'https://i.ibb.co/3mZ9Q7v/bottom-illustration.png' }}
        className="w-full h-40"
        resizeMode="contain"
      />
    </ScrollView>
  );
};

export default FeaturesScreen;
