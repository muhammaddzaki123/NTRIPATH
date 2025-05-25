import { Link, Redirect } from "expo-router";
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

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        {/* <Image
          source={images.logoawal}
          className="size-30"
          resizeMode="contain"
        /> */}

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Selamat datang Di Nutripath
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            aplikasi konsultasi {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>

          <Text className="text-lg font-rubik text-black-200 text-center mt-12">
            Gizi terjaga
          </Text>

          {/* Login User dengan Google */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                Login dengan Google
              </Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mt-8">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500 font-rubik">atau</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Tombol Login Ahli Gizi */}
          <Link href="/ahligizi" asChild>
            <TouchableOpacity className="bg-[#1CD6CE] rounded-full w-full py-4 mt-5">
              <View className="flex flex-row items-center justify-center">
                <Text className="text-lg font-rubik-medium text-white">
                  Login sebagai Ahli Gizi
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Text className="text-sm text-gray-500 text-center mt-4">
            Khusus untuk ahli gizi yang terdaftar di Nutripath
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
