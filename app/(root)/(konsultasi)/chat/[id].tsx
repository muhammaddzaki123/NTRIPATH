// import { useLocalSearchParams, useRouter } from 'expo-router';
// import React, { useEffect, useRef, useState } from 'react';
// import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import icons from '@/constants/icons';
// import { useChat } from '@/lib/chat-provider';
// import { Message } from '@/lib/chat-service';

// const ChatScreen = () => {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [messageText, setMessageText] = useState('');
//   const scrollViewRef = useRef<ScrollView>(null);
//   const { messages, sendMessage, onlineUsers, loading } = useChat();
  
//   // Filter messages for current chat
//   const chatMessages = messages.filter(
//     msg => (msg.sender_id === id || msg.receiver_id === id)
//   );

//   // Find chat partner info
//   const chatPartner = onlineUsers.find(user => user.id === id);

//   const handleSendMessage = async () => {
//     if (messageText.trim() && !loading) {
//       await sendMessage(id as string, messageText);
//       setMessageText('');
//     }
//   };

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     scrollViewRef.current?.scrollToEnd({ animated: true });
//   }, [messages]);

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       className="flex-1 bg-[#40E0D0]"
//     >
//       {/* Header */}
//       <View className="flex-row items-center p-4">
//         <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
//           <Image source={icons.rightArrow} className="w-6 h-6 rotate-180" />
//           <Image 
//             source={{ uri: chatPartner?.avatar }}
//             className="w-8 h-8 rounded-full ml-2"
//           />
//           <View className="ml-2">
//             <Text className="text-white text-lg font-bold">{chatPartner?.name}</Text>
//             <View className="flex-row items-center">
//               <View className={`w-2 h-2 rounded-full ${chatPartner?.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
//               <Text className="text-white text-sm ml-1">
//                 {chatPartner?.is_online ? 'online' : 'offline'}
//               </Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//         <TouchableOpacity className="ml-auto">
//           <Text className="text-3xl text-white">⋮</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Chat Messages */}
//       <ScrollView 
//         ref={scrollViewRef}
//         className="flex-1 bg-gray-100 px-4 pt-4"
//         onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
//       >
//         {chatMessages.map((msg: Message) => (
//           <View 
//             key={msg.id}
//             className={`mb-4 max-w-[80%] ${msg.sender_id === id ? 'self-start' : 'self-end'}`}
//           >
//             <View 
//               className={`p-3 rounded-2xl ${
//                 msg.sender_id === id 
//                   ? 'bg-white rounded-tl-none' 
//                   : 'bg-[#40E0D0] rounded-tr-none'
//               }`}
//             >
//               <Text className={msg.sender_id === id ? 'text-black' : 'text-white'}>
//                 {msg.text}
//               </Text>
//             </View>
//             <Text className={`text-xs mt-1 ${
//               msg.sender_id === id ? 'text-left' : 'text-right'
//             } text-gray-500`}>
//               {new Date(msg.timestamp).toLocaleTimeString('id-ID', { 
//                 hour: '2-digit', 
//                 minute: '2-digit' 
//               })}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Message Input */}
//       <View className="p-4 bg-white flex-row items-center">
//         <TextInput
//           className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
//           placeholder="Type a message"
//           value={messageText}
//           onChangeText={setMessageText}
//           multiline
//         />
//         <TouchableOpacity 
//           onPress={handleSendMessage}
//           disabled={loading}
//           className={`${loading ? 'opacity-50' : ''} bg-[#40E0D0] w-10 h-10 rounded-full items-center justify-center`}
//         >
//           <Image source={icons.star} className="w-5 h-5" />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default ChatScreen;
