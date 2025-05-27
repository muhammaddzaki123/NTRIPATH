import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";
import images from "@/constants/images";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

export default function SignIn() {
  const router = useRouter();
  const { refetch, loading, isLogged } = useGlobalContext();

  React.useEffect(() => {
    if (!loading && isLogged) {
      router.replace('/');
    }
  }, [loading, isLogged]);

  const handleLogin = async () => {
    try {
      const result = await login();
      if (result) {
        refetch();
      } else {
        Alert.alert("Error", "Gagal login");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal login");
      console.error('Login error:', error);
    }
  };

  const handleAhliGiziLogin = () => {
    router.push('/LoginAhliGizi');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 py-12">
          {/* Logo */}
          <View className="items-center mb-8">
            <Image
              source={images.logoawal}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>

          {/* Welcome Text */}
          <View className="mb-12">
            <Text className="text-base text-center uppercase font-rubik text-gray-600">
              Selamat datang Di Nutripath
            </Text>

            <Text className="text-3xl font-rubik-bold text-gray-900 text-center mt-2">
              aplikasi konsultasi {"\n"}
              <Text className="text-[#1CD6CE]">Your Ideal Home</Text>
            </Text>

            <Text className="text-lg font-rubik text-gray-600 text-center mt-4">
              Gizi terjaga
            </Text>
          </View>

          {/* Login Buttons */}
          <View className="space-y-6">
            {/* Login User dengan Google */}
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-white shadow-md shadow-zinc-300 rounded-full py-4"
            >
              <View className="flex-row items-center justify-center">
                <Image
                  source={icons.google}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-lg font-rubik-medium text-gray-800 ml-2">
                  Login dengan Google
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500 font-rubik">atau</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Tombol Login Ahli Gizi */}
            <View>
              <TouchableOpacity 
                onPress={handleAhliGiziLogin}
                className="bg-[#1CD6CE] rounded-full py-4"
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-lg font-rubik-medium text-white">
                    Login sebagai Ahli Gizi
                  </Text>
                </View>
              </TouchableOpacity>

              <Text className="text-sm text-gray-500 text-center mt-2">
                Khusus untuk ahli gizi yang terdaftar di Nutripath
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}