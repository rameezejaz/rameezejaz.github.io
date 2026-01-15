export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  names?: string[];
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface StorageData {
  chats: Chat[];
  activeChat: string | null;
}