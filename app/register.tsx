import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

import icons from "@/constants/icons";
import images from "@/constants/images";
import { account, databases, config } from "@/lib/appwrite";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // "user" or "nutritionist"

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    // Generate valid userId: max 36 chars, allowed chars a-z, A-Z, 0-9, period, hyphen, underscore, cannot start with special char
    const generateUserId = (name: string) => {
      let id = name.toLowerCase().replace(/[^a-z0-9._-]/g, "");
      if (!id || id[0].match(/[^a-z0-9]/)) {
        id = "user" + id;
      }
      return id.substring(0, 36);
    };

    const userId = generateUserId(name);

    try {
      // Create account in Appwrite with userId
      await account.create(userId, email, password, name);

      // Create user document in appropriate collection
      const collectionId =
        userType === "nutritionist"
          ? config.ahligiziCollectionId
          : config.usersProfileCollectionId;

      await databases.createDocument(
        config.databaseId!,
        collectionId!,
        userId,
        {
          name,
          email,
          userType,
          avatar: "", // default or generate avatar
          status: userType === "nutritionist" ? "offline" : undefined,
          lastSeen: new Date().toISOString(),
          // password field removed to avoid invalid document structure error
        }
      );

      Alert.alert("Sukses", "Registrasi berhasil, silakan login");
      router.push("/sign-in");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Gagal registrasi");
    }
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
              Daftar Akun Baru
            </Text>
          </View>

          {/* Registration Form */}
          <View className="space-y-4">
            <TextInput
              placeholder="Nama Lengkap"
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-md px-4 py-3 text-base"
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-4 py-3 text-base"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="border border-gray-300 rounded-md px-4 py-3 text-base"
            />
            <View className="border border-gray-300 rounded-md px-4 py-3">
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue: string) => setUserType(itemValue)}
              >
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Ahli Gizi" value="nutritionist" />
              </Picker>
            </View>
            <TouchableOpacity
              onPress={handleRegister}
              className="bg-[#1CD6CE] rounded-full py-4 items-center"
            >
              <Text className="text-white text-lg font-rubik-medium">
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
