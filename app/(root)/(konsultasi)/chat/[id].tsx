import { useChat } from '@/contexts/ChatContext';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const { nutritionists, messages, addMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const nutritionist = nutritionists.find(n => n.$id === id);
  const chatMessages = messages[id as string] || [];

  useEffect(() => {
    // Scroll ke pesan terbaru ketika ada pesan baru
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      // Sekarang hanya mengirim text saja, karena sender dan time diatur di backend
      addMessage(id as string, newMessage.trim());
      setNewMessage('');
    }
  };

  if (!nutritionist) return null;

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
            <FontAwesome name="user-circle" size={24} color="#666" />
          </View>
          <Text className="text-white text-lg font-bold">
            {nutritionist.name}
          </Text>
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
          {chatMessages.map((message, index) => (
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
          ))}
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
            />
            <TouchableOpacity 
              onPress={handleSend}
              className="w-10 h-10 rounded-full bg-[#1CD6CE] items-center justify-center"
            >
              <FontAwesome name="send" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
