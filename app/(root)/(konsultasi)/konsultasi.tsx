import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import icons from '@/constants/icons';
import { useChat } from '@/lib/chat-provider';
import { User } from '@/lib/chat-service';

interface ChatUserProps {
  name: string;
  role: string;
  is_online: boolean;
  avatar: string;
}

const ChatUser = ({ name, role, is_online, avatar }: ChatUserProps) => (
  <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-200">
    <Image 
      source={{ uri: avatar }}
      className="w-12 h-12 rounded-full"
    />
    <View className="flex-1 ml-4">
      <Text className="text-lg font-bold">{name}</Text>
      <Text className="text-gray-600">{role}</Text>
    </View>
    <View className="flex-row items-center">
      <View className={`w-2 h-2 rounded-full ${is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
      <Text className="ml-2 text-sm text-gray-600">{is_online ? 'online' : 'offline'}</Text>
    </View>
  </TouchableOpacity>
);

const KonsultasiScreen = () => {
  const router = useRouter();
  const { onlineUsers } = useChat();

  return (
    <View className="flex-1 bg-[#40E0D0]">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.rightArrow} className="w-6 h-6 rotate-180" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">KONSULTASI GIZI</Text>
        <TouchableOpacity onPress={() => router.back()} className="ml-auto">
          <Text className="text-3xl text-white">×</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView className="flex-1 bg-white rounded-t-xl">
        {onlineUsers.map((user: User) => (
          <TouchableOpacity 
            key={user.id}
            onPress={() => router.push(`./chat/${user.id}`)}
          >
            <ChatUser {...user} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between p-4">
        <TouchableOpacity>
          <Image source={icons.home} className="w-6 h-6" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={icons.bell} className="w-6 h-6" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={icons.person} className="w-6 h-6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default KonsultasiScreen;
