import images from '@/constants/images';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  // item: Models.Document;
  onPress?: () => void;
}


export const Artikel = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      className="flex-1 w-[140px] h-[130px] mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
      onPress={onPress}
    >
      <Image source={images.artikel1} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          hura
        </Text>
        <Text className="text-xs font-rubik text-black-100">
          jalan pajajaran
        </Text>

      </View>
    </TouchableOpacity>
  );
};

// export const Artikel = ({ onPress }: Props) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       className="flex flex-col items-start w-60 h-80 relative">
//         <Image source={images.artikel1} className='size-full'/>
//     <View>
//       <Text>Berita</Text>
//     </View> 
//     </TouchableOpacity>
//   )
// }