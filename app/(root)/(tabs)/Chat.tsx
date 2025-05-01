import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'nutritionist' | 'patient';
  time: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const filteredMessages = searchText
    ? messages.filter((msg) =>
        msg.text.toLowerCase().includes(searchText.toLowerCase())
      )
    : messages;

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'patient',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const deleteAllChats = () => {
    setMessages([]);
    setMenuVisible(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isNutritionist = item.sender === 'nutritionist';
    return (
      <View
        style={[
          styles.messageContainer,
          isNutritionist ? styles.nutritionistMessage : styles.patientMessage,
        ]}
      >
        <Text style={isNutritionist ? styles.nutritionistText : styles.patientText}>
          {item.text}
        </Text>
        <Text
          style={isNutritionist ? styles.nutritionistTime : styles.patientTime}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>BUDIONO</Text>
          <View style={styles.onlineStatusContainer}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pesan..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity onPress={() => { setSearchVisible(false); setSearchText(''); }}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setSearchVisible(true);
              }}
            >
              <Text style={styles.menuText}>Cari Pesan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={deleteAllChats}
            >
              <Text style={[styles.menuText, { color: 'red' }]}>Hapus Semua Chat</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14b8a6',
    padding: 16,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 12 },
  userInfo: { flex: 1 },
  userName: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  onlineStatusContainer: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: {
    width: 10,
    height: 10,
    backgroundColor: '#22c55e',
    borderRadius: 5,
    marginRight: 6,
  },
  onlineText: { color: 'white' },
  messagesList: { padding: 10, paddingBottom: 20 },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 15,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  nutritionistMessage: {
    backgroundColor: '#14b8a6',
    alignSelf: 'flex-start',
    borderBottomRightRadius: 0,
  },
  patientMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-end',
    borderBottomLeftRadius: 0,
  },
  nutritionistText: { color: 'white' },
  patientText: { color: 'black' },
  nutritionistTime: {
    fontSize: 10,
    marginTop: 4,
    color: '#064e48',
    textAlign: 'right',
  },
  patientTime: {
    fontSize: 10,
    marginTop: 4,
    color: '#6b7280',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'black',
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#14b8a6',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menu: {
    backgroundColor: 'white',
    width: 180,
    marginTop: 60,
    marginRight: 10,
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
  },
});

export default Chat;
