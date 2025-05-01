import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import images from '@/constants/images';

const features = [
  { id: 'recall', title: 'Recall Asupan 24 Jam', icon: 'https://i.ibb.co/2dQZ9qZ/recall.png' },
  { id: 'kalkulator', title: 'Kalkulator Gizi', icon: 'https://i.ibb.co/3mZ9Q7v/kalkulator.png' },
  { id: 'dietplan', title: 'Diet Plan', icon: 'https://i.ibb.co/3mZ9Q7v/dietplan.png' },
  { id: 'artikel', title: 'Artikel Gizi', icon: 'https://i.ibb.co/3mZ9Q7v/artikel.png' },
  { id: 'konsultasi', title: 'Konsultasi Gizi', icon: 'https://i.ibb.co/3mZ9Q7v/konsultasi.png' },
];

const IndexScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#14b8a6', padding: 16 }}>
        <Image
          source={images.logoawal}
          style={{ width: 128, height: 40, resizeMode: 'contain' }}
        />
        <TouchableOpacity>
          <Image
            source={images.logoawal}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </View>

      {/* Banner Section */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 16 }}>
        <View style={{ width: 288, backgroundColor: 'white', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginRight: 16 }}>
          <Image
            source={{ uri: 'https://i.ibb.co/7QpKsCX/gizi-seimbang.png' }}
            style={{ width: '100%', height: 160, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            resizeMode="cover"
          />
          <View style={{ padding: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>Gizi Seimbang</Text>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>Tekan untuk Info Lebih Lanjut</Text>
          </View>
        </View>
        <View style={{ width: 288, backgroundColor: 'white', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>Apa itu gizi seimbang?</Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Gizi adalah zat yang dibutuhkan tubuh untuk tumbuh dan berkembang. Gizi seimbang adalah asupan gizi yang sesuai dengan kebutuhan tubuh.
          </Text>
        </View>
      </ScrollView>

      {/* Lihat Lebih Lanjut Button */}
      <TouchableOpacity style={{ borderTopWidth: 1, borderTopColor: '#d1d5db', padding: 16 }} onPress={() => navigation.navigate('')}>
        <Text style={{ textAlign: 'right', color: '#14b8a6', fontWeight: '600' }}>Lihat lebih lanjut</Text>
      </TouchableOpacity>

      {/* Features Section */}
      <View style={{ backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {features.map((feature) => (
            <TouchableOpacity key={feature.id} style={{ width: '30%', alignItems: 'center', marginBottom: 24 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Image source={{ uri: feature.icon }} style={{ width: 40, height: 40 }} />
              </View>
              <Text style={{ textAlign: 'center', fontSize: 12 }}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Illustration */}
      <Image
        source={{ uri: 'https://i.ibb.co/3mZ9Q7v/bottom-illustration.png' }}
        style={{ width: '100%', height: 160, resizeMode: 'contain' }}
      />
    </ScrollView>
  );
};

export default IndexScreen;
