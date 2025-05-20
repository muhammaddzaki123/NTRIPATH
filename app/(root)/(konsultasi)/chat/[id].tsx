import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { databases, config } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '@/lib/auth-provider';



interface Message {
  $id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatPartner {
  $id: string;
  name: string;
  avatar?: string;
  role: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatPartner();
    loadMessages();
  }, [id]);

  const loadChatPartner = async () => {
    try {
      const partnerData = await databases.getDocument(
        config.databaseId!,
        'users',
        id as string
      );
      setPartner(partnerData);
    } catch (error) {
      console.error('Error loading chat partner:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId!,
        'chat',
        [
          Query.or([
            Query.and([
              Query.equal('sender_id', user?.$id),
              Query.equal('receiver_id', id)
            ]),
            Query.and([
              Query.equal('sender_id', id),
              Query.equal('receiver_id', user?.$id)
            ])
          ]),
          Query.orderDesc('created_at')
        ]
      );
      setMessages(response.documents.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const message = {
        sender_id: user.$id,
        receiver_id: id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        is_read: false
      };

      const response = await databases.createDocument(
        config.databaseId!,
        'chat',
        'unique()',
        message
      );

      setMessages([...messages, response]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50"
    >
      {/* Header */}
      <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Image 
            source={require('../../../assets/icons/back-arrow.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: partner?.avatar || 'https://via.placeholder.com/40' }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3">
          <Text className="font-medium text-lg">{partner?.name}</Text>
          <Text className="text-gray-500 text-sm">
            {partner?.role === 'nutritionist' ? 'Ahli Gizi' : 'Pasien'}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        className="flex-1 p-4"
        keyExtractor={(item) => item.$id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => {
          const isOwn = item.sender_id === user?.$id;
          return (
            <View className={`flex-row mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <View className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                isOwn ? 'bg-primary' : 'bg-white'
              }`}>
                <Text className={isOwn ? 'text-white' : 'text-gray-800'}>
                  {item.content}
                </Text>
                <Text className={`text-xs mt-1 ${
                  isOwn ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {formatTime(item.created_at)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View className="p-4 bg-white border-t border-gray-200 flex-row items-center">
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Ketik pesan..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          multiline
        />
        <TouchableOpacity 
          onPress={sendMessage}
          disabled={!newMessage.trim()}
          className={`rounded-full p-2 ${
            newMessage.trim() ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <Image 
            source={require('../../../assets/icons/send.png')}
            style={{ width: 24, height: 24, tintColor: 'white' }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
