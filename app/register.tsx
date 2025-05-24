// import { Picker } from "@react-native-picker/picker";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { registerUser } from "../lib/appwrite";

// const penyakitOptions = ["diabetes", "kanker", "hipertensi"];

// const Register = () => {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     penyakit: penyakitOptions[0],
//     berat_bedan: "",
//     tinggi_badan: "",
//     password: "",
//     namaLengkap: "",
//   });

//   const [errorMsg, setErrorMsg] = useState("");

//   const handleChange = (name: string, value: string) => {
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async () => {
//     setErrorMsg("");
//     const { username, email, penyakit, berat_bedan, tinggi_badan, password, namaLengkap } = form;

//     if (!username || !email || !penyakit || !berat_bedan || !tinggi_badan || !password || !namaLengkap) {
//       setErrorMsg("Semua field harus diisi");
//       return;
//     }

//     const berat = parseFloat(berat_bedan);
//     const tinggi = parseFloat(tinggi_badan);

//     if (isNaN(berat) || isNaN(tinggi)) {
//       setErrorMsg("Berat badan dan tinggi badan harus berupa angka");
//       return;
//     }

//     const result = await registerUser({
//       username,
//       email,
//       penyakit,
//       berat_bedan: berat,
//       tinggi_badan: tinggi,
//       password,
//       namaLengkap,
//     });

//     if (result) {
//       Alert.alert("Sukses", "Registrasi berhasil");
//       router.push("/sign-in");
//     } else {
//       setErrorMsg("Registrasi gagal, coba lagi");
//     }
//   };

//   return (
//     <SafeAreaView className="bg-blue-200 flex-1 justify-center items-center px-4">
//       <ScrollView className="w-full max-w-md bg-gray-200 rounded-lg p-6 shadow-md">
//         <Text className="text-center text-xl font-semibold mb-4">Register</Text>

//         <TextInput
//           placeholder="Username"
//           value={form.username}
//           onChangeText={(text) => handleChange("username", text)}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//           autoCapitalize="none"
//         />

//         <TextInput
//           placeholder="Email"
//           value={form.email}
//           onChangeText={(text) => handleChange("email", text)}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <View className="border border-blue-400 rounded-md mb-4">
//           <Picker
//             selectedValue={form.penyakit}
//             onValueChange={(itemValue) => handleChange("penyakit", itemValue)}
//             className="text-blue-700"
//           >
//             {penyakitOptions.map((option) => (
//               <Picker.Item key={option} label={option} value={option} />
//             ))}
//           </Picker>
//         </View>

//         <TextInput
//           placeholder="Berat Badan (kg)"
//           value={form.berat_bedan}
//           onChangeText={(text) => handleChange("berat_bedan", text)}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//           keyboardType="numeric"
//         />

//         <TextInput
//           placeholder="Tinggi Badan (cm)"
//           value={form.tinggi_badan}
//           onChangeText={(text) => handleChange("tinggi_badan", text)}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//           keyboardType="numeric"
//         />

//         <TextInput
//           placeholder="Password"
//           value={form.password}
//           onChangeText={(text) => handleChange("password", text)}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//           secureTextEntry
//         />

//         <TextInput
//           placeholder="Nama Lengkap"
//           value={form.namaLengkap}
//           onChangeText={(text) => handleChange("namaLengkap", text)}
//           className="border border-blue-400 rounded-md px-4 py-2 mb-4 text-blue-700"
//         />

//         {errorMsg ? (
//           <Text className="text-red-600 mb-4 text-center">{errorMsg}</Text>
//         ) : null}

//         <TouchableOpacity
//           onPress={handleSubmit}
//           className="bg-blue-900 rounded-lg py-3 flex-row justify-center items-center"
//         >
//           <Text className="text-white text-lg">Register</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Register;
