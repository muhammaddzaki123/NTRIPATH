import { useChat } from '@/contexts/ChatContext';
import { useGlobalContext } from '@/lib/global-provider';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message, Nutritionist } from '@/types/chat';

const ChatScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    nutritionists, 
    messages, 
    addMessage, 
    markMessageAsRead, 
    loading, 
    setCurrentChat,
    currentSession,
    consultationStatus,
    createSession,
    endSession
  } = useChat();
  const { user, isNutritionist } = useGlobalContext();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const nutritionist = nutritionists.find((n: Nutritionist) => n.$id === id);
  
  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !nutritionist) return;

      // Compute chatId based on role
      const chatIdComputed = isNutritionist
        ? `${id}-${user.$id}`      // ahli gizi chatting with user
        : `${user.$id}-${id}`;     // user chatting with ahli gizi

      setCurrentChat(chatIdComputed);
      
      if (!currentSession && !isNutritionist) {
        try {
          setSessionLoading(true);
          await createSession(nutritionist.$id);
        } catch (error) {
          console.error('Error creating chat session:', error);
          Alert.alert('Error', 'Gagal memulai sesi konsultasi');
        } finally {
          setSessionLoading(false);
        }
      }
    };

    initializeChat();
  }, [user, nutritionist, isNutritionist]);

  const chatId = user && nutritionist 
    ? (isNutritionist ? `${id}-${user.$id}` : `${user.$id}-${id}`)
    : null;
  const chatMessages = chatId ? (messages[chatId] || []) : [];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  useEffect(() => {
    chatMessages.forEach((message: Message) => {
      if (!message.read && message.sender === (isNutritionist ? 'user' : 'nutritionist')) {
        markMessageAsRead(message.$id);
      }
    });
  }, [chatMessages, markMessageAsRead, isNutritionist]);

  const handleSend = async () => {
    if (!user) {
      setErrorMessage('Anda harus login terlebih dahulu');
      return;
    }

    if (!nutritionist) {
      setErrorMessage('Ahli gizi tidak ditemukan');
      return;
    }

    if (!newMessage.trim()) {
      setErrorMessage('Pesan tidak boleh kosong');
      return;
    }

    if (sending) return;

    try {
      setSending(true);
      setErrorMessage(null);

      // Send message to the correct recipient based on role
      const recipientId = isNutritionist ? id : nutritionist.$id;
      await addMessage(recipientId, newMessage.trim());
      
      setNewMessage('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSending(false);
    }
  };

  const getMessageStyle = (sender: string) => {
    const isOwnMessage = 
      (isNutritionist && sender === 'nutritionist') ||
      (!isNutritionist && sender === 'user');

    return {
      containerStyle: `flex-row mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`,
      bubbleStyle: `rounded-2xl px-4 py-2 max-w-[80%] ${
        isOwnMessage ? 'bg-[#1CD6CE]' : 'bg-gray-100'
      }`,
      textStyle: isOwnMessage ? 'text-white' : 'text-gray-900',
      timeStyle: `text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`
    };
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      setSessionLoading(true);
      await endSession(currentSession.$id);
      router.replace('/konsultasi');
    } catch (error) {
      console.error('Error ending session:', error);
      Alert.alert('Error', 'Gagal mengakhiri sesi konsultasi');
    } finally {
      setSessionLoading(false);
    }
  };

  if (loading || !nutritionist) {
    return (
      <SafeAreaView className="flex-1 bg-[#1CD6CE] items-center justify-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">
          {loading ? 'Memuat percakapan...' : 'Ahli gizi tidak ditemukan'}
        </Text>
        {!loading && (
          <Link href="/konsultasi" className="mt-4">
            <Text className="text-white underline">Kembali ke daftar ahli gizi</Text>
          </Link>
        )}
      </SafeAreaView>
    );
  }

  if (sessionLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#1CD6CE] items-center justify-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white mt-4">Mempersiapkan sesi konsultasi...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1CD6CE]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 justify-between">
        <Link href="/konsultasi" className="mr-auto">
          <View className="w-8 h-8 justify-center">
            <Text className="text-white text-2xl">←</Text>
          </View>
        </Link>
        <View className="flex-row items-center justify-center flex-1 mx-4">
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
            {isNutritionist ? 'Chat with User' : nutritionist.name}
          </Text>
          <View className={`w-2 h-2 rounded-full ${nutritionist.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} ml-2`} />
        </View>
        {currentSession && !isNutritionist && (
          <TouchableOpacity
            onPress={handleEndSession}
            className="bg-red-500 rounded-full px-3 py-1"
          >
            <Text className="text-white text-sm font-medium">Akhiri</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Consultation Status - Only show for regular users */}
      {consultationStatus && !isNutritionist && (
        <View className="bg-white px-4 py-2 border-b border-gray-200">
          <Text className="text-sm text-gray-600">
            Status: <Text className="font-medium capitalize">{consultationStatus.status}</Text>
          </Text>
          {consultationStatus.status === 'waiting' && (
            <Text className="text-xs text-gray-500 mt-1">
              Antrian: {consultationStatus.currentQueue} • 
              Estimasi waktu: {consultationStatus.estimatedTime} menit
            </Text>
          )}
        </View>
      )}

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
                Belum ada percakapan. Mulai chat sekarang!
              </Text>
            </View>
          ) : (
            chatMessages.map((message: Message) => {
              const styles = getMessageStyle(message.sender);
              return (
                <View 
                  key={`${message.$id}-${message.time}`}
                  className={styles.containerStyle}
                >
                  <View className={styles.bubbleStyle}>
                    <Text className={styles.textStyle}>
                      {message.text}
                    </Text>
                    <Text className={styles.timeStyle}>
                      {new Date(message.time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Error Message */}
        {errorMessage && (
          <View className="bg-red-100 px-4 py-2">
            <Text className="text-red-600 text-center">{errorMessage}</Text>
          </View>
        )}

        {/* Message Input */}
        <View className={`bg-white border-t border-gray-200 px-4 py-2 ${!currentSession && !isNutritionist ? 'opacity-50' : ''}`}>
          <View className="flex-row items-center">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Ketik pesan..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
              multiline
              maxLength={500}
              editable={!sending && (isNutritionist || !!currentSession)}
            />
            <TouchableOpacity 
              onPress={handleSend}
              disabled={!newMessage.trim() || sending || (!currentSession && !isNutritionist)}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                newMessage.trim() && !sending && (isNutritionist || currentSession) ? 'bg-[#1CD6CE]' : 'bg-gray-300'
              }`}
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome name="send" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
          {!currentSession && !isNutritionist && (
            <Text className="text-xs text-gray-500 text-center mt-2">
              Sesi konsultasi telah berakhir
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
