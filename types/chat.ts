export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'nutritionist';
  time: string;
}

export interface Nutritionist {
  id: number;
  name: string;
  status: 'online' | 'offline';
  type: string;
}

export interface ChatRoom {
  id: number;
  nutritionist: Nutritionist;
  messages: Message[];
  lastMessage?: Message;
}
