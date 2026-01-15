import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatInput from '../ChatInput/ChatInput';
import { generateNames } from '../../services/api';
import { generateChatTitle } from '../../services/storage';
import { Chat, Message } from '../../types';
import styles from './ChatContainer.module.css';

interface ChatContainerProps {
  chat: Chat;
  onUpdateChat: (updatedChat: Chat) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chat, onUpdateChat }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  // Handle scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (messagesAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesAreaRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
        setShowScrollButton(!isNearBottom && chat.messages.length > 0);
      }
    };

    const messagesArea = messagesAreaRef.current;
    if (messagesArea) {
      messagesArea.addEventListener('scroll', handleScroll);
      return () => messagesArea.removeEventListener('scroll', handleScroll);
    }
  }, [chat.messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (userMessage: string) => {
    setError(null);

    // Create user message
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };

    // Update chat with user message
    const updatedMessages = [...chat.messages, userMsg];
    const updatedChat: Chat = {
      ...chat,
      messages: updatedMessages,
      title: chat.messages.length === 0 ? generateChatTitle(userMessage) : chat.title,
      updatedAt: Date.now(),
    };

    onUpdateChat(updatedChat);
    setLoading(true);
    setLastQuery(userMessage);

    try {
      // Call API
      const names = await generateNames(userMessage);
      setLastResponse(names);

      // Create assistant message
      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: names.length > 0 
          ? 'Here are some available domain names for your business:' 
          : 'Sorry, I couldn\'t find any available domain names at the moment.',
        names: names.length > 0 ? names : undefined,
        timestamp: Date.now(),
      };

      // Update chat with assistant message
      const finalMessages = [...updatedMessages, assistantMsg];
      const finalChat: Chat = {
        ...updatedChat,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      onUpdateChat(finalChat);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch domain names. Please try again.');

      // Add error message to chat
      const errorMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, errorMsg];
      const finalChat: Chat = {
        ...updatedChat,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      onUpdateChat(finalChat);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestMore = async () => {
    setError(null);

    // Create "Suggest more" user message
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: 'Suggest more',
      timestamp: Date.now(),
    };

    // Update chat
    const updatedMessages = [...chat.messages, userMsg];
    const updatedChat: Chat = {
      ...chat,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    onUpdateChat(updatedChat);
    setLoading(true);

    try {
      // Create context message with previous query and responses
      const contextMessage = `${lastQuery}\n\nYou previously suggested these names: ${lastResponse.join(', ')}. Please suggest different available domain names.`;

      // Call API with context
      const names = await generateNames(contextMessage);
      setLastResponse(names);

      // Create assistant message
      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: names.length > 0 
          ? 'Here are more available domain names:' 
          : 'Sorry, I couldn\'t find more available domain names at the moment.',
        names: names.length > 0 ? names : undefined,
        timestamp: Date.now(),
      };

      // Update chat
      const finalMessages = [...updatedMessages, assistantMsg];
      const finalChat: Chat = {
        ...updatedChat,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      onUpdateChat(finalChat);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch more names. Please try again.');

      // Add error message
      const errorMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, errorMsg];
      const finalChat: Chat = {
        ...updatedChat,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      onUpdateChat(finalChat);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    if (!loading) {
      handleSendMessage(example);
    }
  };

  const examples = [
    {
      icon: '☕',
      title: 'Coffee Shop',
      description: 'I want to start a specialty coffee shop',
    },
    {
      icon: '💻',
      title: 'Tech Startup',
      description: 'I need a name for my SaaS company',
    },
    {
      icon: '👗',
      title: 'Fashion Brand',
      description: 'Looking for fashion boutique names',
    },
    {
      icon: '🍕',
      title: 'Restaurant',
      description: 'I want to open an Italian restaurant',
    },
  ];

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesArea} ref={messagesAreaRef}>
        <div className={styles.messagesWrapper}>
          {chat.messages.length === 0 ? (
            <div className={styles.welcomeContainer}>
              <div className={styles.welcomeIcon}>🔍</div>
              <h2 className={styles.welcomeTitle}>Welcome to Brands Digger!</h2>
              <p className={styles.welcomeSubtitle}>
                Describe your business idea and get AI-powered domain name suggestions 
                that are actually available to register.
              </p>

            </div>
          ) : (
            <>
              {chat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  names={message.names}
                  timestamp={message.timestamp}
                  onSuggestMore={
                    message.role === 'assistant' && message.names && !loading
                      ? handleSuggestMore
                      : undefined
                  }
                />
              ))}

              {loading && (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner} />
                  <p className={styles.loadingText}>
                    Finding available domain names<span className={styles.loadingDots}>...</span>
                  </p>
                </div>
              )}

              {error && (
                <div className={styles.errorContainer}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <p className={styles.errorText}>{error}</p>
                </div>
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>

      </div>

      {showScrollButton && (
        <button
          className={styles.scrollButton}
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          ↓
        </button>
      )}

      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatContainer;