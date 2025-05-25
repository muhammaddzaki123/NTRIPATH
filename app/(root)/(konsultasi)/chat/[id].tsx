import { useChat } from '@/contexts/ChatContext';
import { Message, Nutritionist } from '@/types/chat';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { nutritionists, messages, addMessage, markMessageAsRead, loading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const nutritionist = nutritionists.find((n: Nutritionist) => n.$id === id);
  const chatMessages = messages[id] || [];

  useEffect(() => {
    // Scroll ke pesan terbaru ketika ada pesan baru
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  useEffect(() => {
    // Mark unread messages as read when opening chat
    chatMessages.forEach((message: Message) => {
      if (!message.read && message.sender === 'nutritionist') {
        markMessageAsRead(message.$id);
      }
    });
  }, [chatMessages, markMessageAsRead]);

  const handleSend = async () => {
    if (newMessage.trim() && nutritionist && !sending) {
      try {
        setSending(true);
        await addMessage(nutritionist.$id, newMessage.trim());
        setNewMessage('');
        // Scroll to bottom after sending
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (error) {
        console.error('Error sending message:', error);
        // You might want to show an error toast here
      } finally {
        setSending(false);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#1CD6CE] items-center justify-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Memuat percakapan...</Text>
      </SafeAreaView>
    );
  }

  if (!nutritionist) {
    return (
      <SafeAreaView className="flex-1 bg-[#1CD6CE] items-center justify-center">
        <Text className="text-white text-lg">Ahli gizi tidak ditemukan</Text>
        <Link href="/konsultasi" className="mt-4">
          <Text className="text-white underline">Kembali ke daftar ahli gizi</Text>
        </Link>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1CD6CE]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Link href="/konsultasi" className="mr-auto">
          <View className="w-8 h-8 justify-center">
            <Text className="text-white text-2xl">←</Text>
          </View>
        </Link>
        <View className="flex-row items-center absolute left-0 right-0 justify-center">
          <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-2">
            {nutritionist.avatar ? (
              <Image 
                source={{ uri: nutritionist.avatar }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <FontAwesome name="user-circle" size={24} color="#666" />
            )}
          </View>
          <Text className="text-white text-lg font-bold">
            {nutritionist.name}
          </Text>
          <View className={`w-2 h-2 rounded-full ${nutritionist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} ml-2`} />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 bg-white rounded-t-3xl px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {chatMessages.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-gray-500 text-center">
                Belum ada percakapan. Mulai chat dengan {nutritionist.name} sekarang!
              </Text>
            </View>
          ) : (
            chatMessages.map((message: Message, index: number) => (
              <View 
                key={message.$id || index}
                className={`flex-row ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <View 
                  className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-[#1CD6CE]' 
                      : 'bg-gray-100'
                  }`}
                >
                  <Text 
                    className={`${
                      message.sender === 'user' 
                        ? 'text-white' 
                        : 'text-gray-900'
                    }`}
                  >
                    {message.text}
                  </Text>
                  <Text 
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-white/70'
                        : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Message Input */}
        <View className="bg-white border-t border-gray-200 px-4 py-2">
          <View className="flex-row items-center">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Ketik pesan..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
              multiline
              maxLength={500}
              editable={!sending}
            />
            <TouchableOpacity 
              onPress={handleSend}
              disabled={!newMessage.trim() || sending}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                newMessage.trim() && !sending ? 'bg-[#1CD6CE]' : 'bg-gray-300'
              }`}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome name="send" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
