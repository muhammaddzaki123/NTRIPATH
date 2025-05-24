// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { Redirect, useRouter } from "expo-router";
// import icons from "../constants/icons";
// import { login, loginManual } from "../lib/appwrite";
// import { useGlobalContext } from "../lib/global-provider";

// const Auth = () => {
//   const router = useRouter();
//   const { refetch, loading: globalLoading, isLogged } = useGlobalContext();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!globalLoading && isLogged) return <Redirect href="/" />;

//   const handleLoginGoogle = async () => {
//     try {
//       setLoading(true);
//       const result = await login();
//       if (result) {
//         refetch();
//       } else {
//         Alert.alert("Error", "Failed to login with Google");
//       }
//     } catch (error) {
//       Alert.alert("Error", "An error occurred during Google login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginManual = async () => {
//     try {
//       setErrorMsg("");
//       if (!email || !password) {
//         setErrorMsg("Email dan password harus diisi");
//         return;
//       }
//       setLoading(true);
//       await loginManual(email, password);
//       refetch();
//     } catch (error: any) {
//       setErrorMsg(error.message || "Terjadi kesalahan saat login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="bg-blue-200 flex-1 justify-center items-center px-4">
//       <View className="bg-gray-200 rounded-lg p-6 w-full max-w-md shadow-md">
//         <Text className="text-center text-xl font-semibold mb-4">Sign In</Text>

//         <TextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//           autoCapitalize="none"
//           keyboardType="email-address"
//         />

//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//           secureTextEntry
//         />

//         {errorMsg ? (
//           <Text className="text-red-600 mb-4 text-center">{errorMsg}</Text>
//         ) : null}

//         <TouchableOpacity
//           onPress={handleLoginGoogle}
//           className="flex-row items-center justify-center border border-blue-400 rounded-md py-2 mb-4 bg-white"
//         >
//           <Image
//             source={icons.google}
//             className="w-5 h-5 mr-2"
//             resizeMode="contain"
//           />
//           <Text className="text-blue-700 text-base">Sign in with Google</Text>
//         </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleLoginManual}
//             disabled={loading}
//             className={`bg-blue-900 rounded-lg py-3 flex-row justify-center items-center ${
//               loading ? 'opacity-50' : ''
//             }`}
//           >
//             {loading ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <>
//                 <Text className="text-white text-lg mr-2">Login</Text>
//                 <Text className="text-white text-lg">{'>'}</Text>
//               </>
//             )}
//           </TouchableOpacity>
//       </View>

//       <TouchableOpacity 
//         onPress={() => router.push("/register")}
//         className="mt-6 bg-blue-900 rounded-full px-6 py-3"
//       >
//         <Text className="text-white text-center">Create Account?</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default Auth;