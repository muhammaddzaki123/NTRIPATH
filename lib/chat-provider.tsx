// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { chatService, Message, User } from './chat-service';

// interface ChatContextType {
//   messages: Message[];
//   sendMessage: (receiverId: string, text: string) => Promise<void>;
//   onlineUsers: User[];
//   currentUser?: User;
//   setCurrentUser: (user: User) => void;
//   loading: boolean;
//   error: string | null;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
//   const [currentUser, setCurrentUser] = useState<User>();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Subscribe to real-time messages
//   useEffect(() => {
//     if (!currentUser) return;

//     const unsubscribe = chatService.subscribeToMessages((newMessage) => {
//       if (newMessage.sender_id === currentUser.id || newMessage.receiver_id === currentUser.id) {
//         setMessages((prev) => [...prev, newMessage]);
//       }
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [currentUser]);

//   // Update online status when user logs in/out
//   useEffect(() => {
//     if (!currentUser) return;

//     const updateOnlineStatus = async () => {
//       try {
//         await chatService.updateUserOnlineStatus(currentUser.id, true);
        
//         // Update status to offline when user leaves
//         const handleBeforeUnload = () => {
//           chatService.updateUserOnlineStatus(currentUser.id, false);
//         };
        
//         window.addEventListener('beforeunload', handleBeforeUnload);
//         return () => {
//           window.removeEventListener('beforeunload', handleBeforeUnload);
//           chatService.updateUserOnlineStatus(currentUser.id, false);
//         };
//       } catch (err) {
//         console.error('Error updating online status:', err);
//       }
//     };

//     updateOnlineStatus();
//   }, [currentUser]);

//   // Fetch online nutritionists periodically
//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchOnlineUsers = async () => {
//       try {
//         const nutritionists = await chatService.getOnlineNutritionists();
//         setOnlineUsers(nutritionists.documents.map(doc => ({
//           id: doc.$id,
//           name: doc.name,
//           role: doc.role,
//           avatar: doc.avatar,
//           is_online: doc.is_online
//         })));
//       } catch (err) {
//         console.error('Error fetching online nutritionists:', err);
//       }
//     };

//     fetchOnlineUsers();
//     const interval = setInterval(fetchOnlineUsers, 30000); // Update every 30 seconds

//     return () => clearInterval(interval);
//   }, [currentUser]);

//   const sendMessage = async (receiverId: string, text: string) => {
//     if (!currentUser) return;

//     setLoading(true);
//     setError(null);
//     try {
//       await chatService.sendMessage(currentUser.id, receiverId, text);
//     } catch (err) {
//       setError('Gagal mengirim pesan. Silakan coba lagi.');
//       console.error('Error sending message:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = {
//     messages,
//     sendMessage,
//     onlineUsers,
//     currentUser,
//     setCurrentUser,
//     loading,
//     error,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };
