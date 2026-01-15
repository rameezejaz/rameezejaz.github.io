import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ChatContainer from './components/ChatContainer/ChatContainer';
import { getChats, getActiveChatId, saveChats, createNewChat } from './services/storage';
import { Chat } from './types';
import styles from './App.module.css';

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = getChats();
    const activeChatId = getActiveChatId();

    if (savedChats.length > 0) {
      setChats(savedChats);
      
      if (activeChatId) {
        const chat = savedChats.find(c => c.id === activeChatId);
        setActiveChat(chat || null);
      }
    } else {
      // Create first chat if none exists
      const newChat = createNewChat();
      setChats([newChat]);
      setActiveChat(newChat);
      saveChats([newChat], newChat.id);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      saveChats(chats, activeChat?.id || null);
    }
  }, [chats, activeChat]);

  const handleCreateNewChat = () => {
    const newChat = createNewChat();
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    
    if (activeChat?.id === chatId) {
      const remainingChats = chats.filter(c => c.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0]);
      } else {
        const newChat = createNewChat();
        setChats([newChat]);
        setActiveChat(newChat);
      }
    }
  };

  const handleUpdateChat = (updatedChat: Chat) => {
    setChats(prev => 
      prev.map(c => c.id === updatedChat.id ? updatedChat : c)
    );
    
    if (activeChat?.id === updatedChat.id) {
      setActiveChat(updatedChat);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className={styles.app}>
      <Header onToggleSidebar={toggleSidebar} onCreateNewChat={handleCreateNewChat} />
      
      <div className={styles.mainContainer}>
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          isOpen={sidebarOpen}
          onCreateNewChat={handleCreateNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onClose={toggleSidebar}
        />
        
        <div className={styles.contentArea}>
          {activeChat && (
            <ChatContainer
              chat={activeChat}
              onUpdateChat={handleUpdateChat}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;