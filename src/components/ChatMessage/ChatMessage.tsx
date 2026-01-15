import React, { useState } from 'react';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  names?: string[];
  timestamp?: number;
  onSuggestMore?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  names,
  timestamp,
  onSuggestMore,
}) => {
  const isUser = role === 'user';
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatTime = (ts?: number): string => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCopy = async (name: string, index: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIndex(index);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.messageContainer}>
        <div className={styles.messageHeader}>
          <div className={`${styles.avatar} ${isUser ? styles.user : styles.assistant}`}>
            {isUser ? '👤' : '🤖'}
          </div>
          <p className={styles.senderName}>{isUser ? 'You' : 'Brands Digger'}</p>
        </div>

        <div className={`${styles.messageBubble} ${isUser ? styles.user : styles.assistant}`}>
          {content && (
            <p className={styles.messageText}>{content}</p>
          )}

          {names && names.length > 0 && (
            <div className={styles.namesSection}>
              <p className={styles.namesHeader}>
                <span>💡</span>
                <span>Suggested Names</span>
              </p>
              <ul className={styles.namesList}>
                {names.map((name, index) => (
                  <li key={index} className={styles.nameItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span className={styles.nameText}>{name}</span>
                    <button
                      className={`${styles.copyButton} ${copiedIndex === index ? styles.copied : ''}`}
                      onClick={() => handleCopy(name, index)}
                      title={copiedIndex === index ? 'Copied!' : 'Copy name'}
                    >
                      {copiedIndex === index ? (
                        <>
                          <span>✓</span>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              {onSuggestMore && (
                <button
                  className={styles.suggestMoreButton}
                  onClick={onSuggestMore}
                >
                  <div className={styles.buttonContent}>
                    <span>✨</span>
                    <span>Suggest More Names</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {timestamp && (
          <div className={styles.timestamp}>
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;