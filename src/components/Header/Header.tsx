import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.css';

interface HeaderProps {
  onToggleSidebar: () => void;
  onCreateNewChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onCreateNewChat }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          className={styles.menuButton}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          ☰
        </button>

        <a href="/" className={styles.logoContainer}>
          <img
            src="/logo.png"
            alt="Brands Digger Logo"
            className={styles.logo}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className={styles.brandInfo}>
            <h1 className={styles.brandName}>Brands Digger</h1>
            <p className={styles.tagline}>Find Available Domain Names</p>
          </div>
        </a>
      </div>

      <div className={styles.rightSection}>
        <div
          className={`${styles.themeToggle} ${theme === 'light' ? styles.light : ''}`}
          onClick={toggleTheme}
          role="button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <div className={styles.toggleSlider}>
            {theme === 'light' ? '☀️' : '🌙'}
          </div>
          <div className={styles.toggleLabels}>
            <span className={`${styles.toggleLabel} ${theme === 'dark' ? styles.active : ''}`}>
              <span className={styles.toggleIcon}>🌙</span>
              <span>Dark</span>
            </span>
            <span className={`${styles.toggleLabel} ${theme === 'light' ? styles.active : ''}`}>
              <span>Light</span>
              <span className={styles.toggleIcon}>☀️</span>
            </span>
          </div>
        </div>

        {onCreateNewChat && (
          <button
            className={styles.newChatButton}
            onClick={onCreateNewChat}
            aria-label="Create new chat"
            title="Create new chat"
          >
            <span className={styles.buttonIcon}>+</span>
            <span className={styles.buttonText}>New Chat</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;