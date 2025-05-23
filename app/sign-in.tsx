import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Redirect } from "expo-router";
import icons from "../constants/icons";
import { login, loginManual } from "../lib/appwrite";
import { useGlobalContext } from "../lib/global-provider";

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLoginGoogle = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login with Google");
    }
  };

  const handleLoginManual = async () => {
    setErrorMsg("");
    if (!username || !password) {
      setErrorMsg("Username dan password harus diisi");
      return;
    }
    const result = await loginManual(username, password);
    if (result) {
      refetch();
    } else {
      setErrorMsg("Login gagal. Periksa username dan password.");
    }
  };

  return (
    <SafeAreaView className="bg-blue-200 flex-1 justify-center items-center px-4">
      <View className="bg-gray-200 rounded-lg p-6 w-full max-w-md shadow-md">
        <Text className="text-center text-xl font-semibold mb-4">Sign In</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
          secureTextEntry
        />

        {errorMsg ? (
          <Text className="text-red-600 mb-4 text-center">{errorMsg}</Text>
        ) : null}

        <TouchableOpacity
          onPress={handleLoginGoogle}
          className="flex-row items-center justify-center border border-blue-400 rounded-md py-2 mb-4 bg-white"
        >
          <Image
            source={icons.google}
            className="w-5 h-5 mr-2"
            resizeMode="contain"
          />
          <Text className="text-blue-700 text-base">Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLoginManual}
          className="bg-blue-900 rounded-b-lg py-3 flex-row justify-center items-center"
        >
          <Text className="text-white text-lg mr-2">Next</Text>
          <Text className="text-white text-lg">{'>'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="mt-6 bg-blue-900 rounded-full px-6 py-3">
        <Text className="text-white text-center">Create Account?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Auth;
