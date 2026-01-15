import React from 'react';
import { Chat } from '../../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  isOpen: boolean;
  onCreateNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  isOpen,
  onCreateNewChat,
  onSelectChat,
  onDeleteChat,
  onClose,
}) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      onDeleteChat(chatId);
    }
  };

  const handleOverlayClick = () => {
    // Only close sidebar on mobile when overlay is clicked
    if (onClose && window.innerWidth <= 992) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
        onClick={handleOverlayClick}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
        <div className={styles.sidebarHeader}>
          <button
            className={styles.newChatButton}
            onClick={onCreateNewChat}
            aria-label="Create new chat"
          >
            <span className={styles.buttonIcon}>+</span>
            <span>New Chat</span>
          </button>
        </div>

        <div className={styles.chatList}>
          {chats.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>💬</div>
              <p className={styles.emptyText}>No chats yet.<br />Start a new conversation!</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${
                  activeChat?.id === chat.id ? styles.active : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className={styles.chatInfo}>
                  <h4 className={styles.chatTitle}>{chat.title}</h4>
                  <p className={styles.chatDate}>{formatDate(chat.updatedAt)}</p>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteClick(e, chat.id)}
                  aria-label="Delete chat"
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;