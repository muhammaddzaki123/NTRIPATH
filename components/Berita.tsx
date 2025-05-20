import icons from '@/constants/icons';
import images from '@/constants/images';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  // item: Models.Document;
  onPress?: () => void;
}

export const Artikel= ({onPress}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative'>

      <View className='flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50 '>
        <Image source={icons.star} className='size-2.5'/>
        <Text className='text-xs font-rubik-bold text-primary-300 ml-0.5'>4.4</Text>
      </View>

      <Image source={images.artikel1} className='w-full h-40 rounded-lg' />

      <View className='flex flex-col mt-2'>
          <Text className='text-base font-rubik-bold text-black-300'>
            apa ayooo lorem
          </Text>
          <Text className='text-xs font-rubik text-black-200'>
            lorem ipsum lambada
          </Text>

          <View className='flex flex-row items-center justify-between mt-2'>
              <Text className='text-base font-rubik-bold text-primary-300 '>
                Rp.3500.000
              </Text>
              <Image source={icons.heart} className='w-5 h-5 mr-2' tintColor="#111111"/>
          </View>
      </View>
    </TouchableOpacity>
  )
}

// export const Artikel = ({  onPress }: Props) => {
//   return (
//     <TouchableOpacity
//       className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative"
//       onPress={onPress}
//     >
//       <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
//         <Image source={icons.star} className="size-2.5" />
//         <Text className="text-xs font-rubik-bold text-primary-300 ml-0.5">
//           {}
//         </Text>
//       </View>

//       <Image source={images.artikel1} className="w-full h-40 rounded-lg" />

//       <View className="flex flex-col mt-2">
//         <Text className="text-base font-rubik-bold text-black-300">
//           fufufafa
//         </Text>
//         <Text className="text-xs font-rubik text-black-100">
//           fufufafa
//         </Text>

//         <View className="flex flex-row items-center justify-between mt-2">
//           <Text className="text-base font-rubik-bold text-primary-300">
//             fufufafa
//           </Text>
//           <Image
//             source={icons.heart}
//             className="w-5 h-5 mr-2"
//             tintColor="#191D31"
//           />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export const Artikel= ({onPress}: Props) => {
//   return (
//     <TouchableOpacity onPress={onPress} className='flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative'>

//       <View className='flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50 '>
//         <Image source={icons.star} className='size-2.5'/>
//         <Text className='text-xs font-rubik-bold text-primary-300 ml-0.5'>4.4</Text>
//       </View>

//       <Image source={images.artikel1} className='w-full h-40 rounded-lg' />

//       <View className='flex flex-col mt-2'>
//           <Text className='text-base font-rubik-bold text-black-300'>
//             apa ayooo lorem
//           </Text>
//           <Text className='text-xs font-rubik text-black-200'>
//             lorem ipsum lambada
//           </Text>

//           <View className='flex flex-row items-center justify-between mt-2'>
//               <Text className='text-base font-rubik-bold text-primary-300 '>
//                 Rp.3500.000
//               </Text>
//               <Image source={icons.heart} className='w-5 h-5 mr-2' tintColor="#111111"/>
//           </View>
//       </View>
//     </TouchableOpacity>
//   )
// }