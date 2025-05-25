import { loginAsNutritionist } from '@/lib/appwrite';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginAhliGizi() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await loginAsNutritionist(email, password);
      if (result) {
        router.replace('/dashboard' as any);
      }
    } catch (err) {
      setError('Email atau password salah');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6 justify-center">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
            Login Ahli Gizi
          </Text>
          <Text className="text-center text-gray-600">
            Masuk ke akun ahli gizi Anda untuk mulai konsultasi
          </Text>
        </View>

        {error && (
          <View className="bg-red-50 p-4 rounded-lg mb-4">
            <Text className="text-red-800 text-center">{error}</Text>
          </View>
        )}

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              className="p-4 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              className="p-4 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Masukkan password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-lg ${
              loading || !email || !password 
                ? 'bg-gray-300' 
                : 'bg-[#1CD6CE]'
            }`}
            onPress={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Masuk
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
