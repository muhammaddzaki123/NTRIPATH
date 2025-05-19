// import { Client, Databases, Account, ID, Query, RealtimeResponseEvent } from 'appwrite';

// const client = new Client()
//   .setEndpoint('YOUR_APPWRITE_ENDPOINT') // Ganti dengan endpoint Appwrite Anda
//   .setProject('YOUR_PROJECT_ID'); // Ganti dengan Project ID Appwrite Anda

// const databases = new Databases(client);
// const account = new Account(client);

// const DATABASE_ID = 'YOUR_DATABASE_ID'; // ID database yang akan dibuat di Appwrite
// const MESSAGES_COLLECTION_ID = 'messages'; // Collection untuk menyimpan pesan
// const USERS_COLLECTION_ID = 'users'; // Collection untuk menyimpan data pengguna

// export interface Message {
//   id: string;
//   text: string;
//   sender_id: string;
//   receiver_id: string;
//   timestamp: Date;
// }

// export interface User {
//   id: string;
//   name: string;
//   role: 'patient' | 'nutritionist';
//   avatar: string;
//   is_online: boolean;
// }

// class ChatService {
//   // Mendapatkan daftar chat untuk pengguna tertentu
//   async getUserChats(userId: string) {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         MESSAGES_COLLECTION_ID,
//         [
//           Query.equal('sender_id', userId),
//           Query.orderDesc('timestamp'),
//         ]
//       );
//     } catch (error) {
//       console.error('Error getting user chats:', error);
//       throw error;
//     }
//   }

//   // Mengirim pesan baru
//   async sendMessage(senderId: string, receiverId: string, text: string) {
//     try {
//       const message = {
//         sender_id: senderId,
//         receiver_id: receiverId,
//         text,
//         timestamp: new Date(),
//       };

//       return await databases.createDocument(
//         DATABASE_ID,
//         MESSAGES_COLLECTION_ID,
//         ID.unique(),
//         message
//       );
//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error;
//     }
//   }

//   // Mendapatkan riwayat chat antara dua pengguna
//   async getChatHistory(userId1: string, userId2: string) {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         MESSAGES_COLLECTION_ID,
//         [
//           Query.equal('sender_id', [userId1, userId2]),
//           Query.equal('receiver_id', [userId1, userId2]),
//           Query.orderAsc('timestamp'),
//         ]
//       );
//     } catch (error) {
//       console.error('Error getting chat history:', error);
//       throw error;
//     }
//   }

//   // Subscribe ke pesan baru
//   subscribeToMessages(callback: (message: Message) => void) {
//     return client.subscribe(`databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`, 
//       (response: RealtimeResponseEvent<Message>) => {
//         if (response.events.includes('databases.*.collections.*.documents.*.create')) {
//           callback(response.payload);
//         }
//     });
//   }

//   // Update status online pengguna
//   async updateUserOnlineStatus(userId: string, isOnline: boolean) {
//     try {
//       return await databases.updateDocument(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         userId,
//         { is_online: isOnline }
//       );
//     } catch (error) {
//       console.error('Error updating user online status:', error);
//       throw error;
//     }
//   }

//   // Mendapatkan daftar ahli gizi yang online
//   async getOnlineNutritionists() {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [
//           Query.equal('role', 'nutritionist'),
//           Query.equal('is_online', true),
//         ]
//       );
//     } catch (error) {
//       console.error('Error getting online nutritionists:', error);
//       throw error;
//     }
//   }
// }

// export const chatService = new ChatService();
