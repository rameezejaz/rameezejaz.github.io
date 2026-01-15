import { Chat, StorageData } from '../types';

const STORAGE_KEY = 'brands_digger_chats';

// Get all chats from localStorage
export const getChats = (): Chat[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed: StorageData = JSON.parse(data);
    return parsed.chats || [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Get active chat ID
export const getActiveChatId = (): string | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed: StorageData = JSON.parse(data);
    return parsed.activeChat || null;
  } catch (error) {
    console.error('Error reading active chat:', error);
    return null;
  }
};

// Save all chats and active chat ID
export const saveChats = (chats: Chat[], activeChatId: string | null): void => {
  try {
    const data: StorageData = {
      chats,
      activeChat: activeChatId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Create a new chat
export const createNewChat = (): Chat => {
  const now = Date.now();
  return {
    id: `chat_${now}`,
    title: 'New Chat',
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
};

// Update a specific chat
export const updateChat = (chatId: string, updatedChat: Chat): void => {
  try {
    const chats = getChats();
    const activeChatId = getActiveChatId();
    const index = chats.findIndex(chat => chat.id === chatId);
    
    if (index !== -1) {
      chats[index] = { ...updatedChat, updatedAt: Date.now() };
      saveChats(chats, activeChatId);
    }
  } catch (error) {
    console.error('Error updating chat:', error);
  }
};

// Delete a chat
export const deleteChat = (chatId: string): void => {
  try {
    const chats = getChats();
    const activeChatId = getActiveChatId();
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    
    const newActiveChatId = activeChatId === chatId ? null : activeChatId;
    saveChats(filteredChats, newActiveChatId);
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
};

// Get a specific chat by ID
export const getChatById = (chatId: string): Chat | null => {
  try {
    const chats = getChats();
    return chats.find(chat => chat.id === chatId) || null;
  } catch (error) {
    console.error('Error getting chat:', error);
    return null;
  }
};

// Generate chat title from first message
export const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 30;
  if (firstMessage.length <= maxLength) {
    return firstMessage;
  }
  return firstMessage.substring(0, maxLength) + '...';
};