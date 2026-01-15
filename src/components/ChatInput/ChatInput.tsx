import React, { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 500;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (message.trim() === '' || disabled) {
      return;
    }

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() !== '' && !disabled) {
        onSendMessage(message.trim());
        setMessage('');
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!disabled) {
      setMessage(suggestion);
      textareaRef.current?.focus();
    }
  };

  const suggestions = [
    'Suggest names for a coffee shop',
    'Tech startup names',
    'Fashion brand ideas',
    'Restaurant name suggestions',
  ];

  const remainingChars = maxLength - message.length;
  const charCountClass = 
    remainingChars < 50 ? styles.danger :
    remainingChars < 100 ? styles.warning :
    '';

  return (
    <div className={styles.inputContainer}>
      {/* Suggestion chips - only show when input is empty */}
      {message === '' && !disabled && (
        <div className={styles.suggestionsBar}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className={styles.suggestionChip}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className={styles.chipText}>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textInput}
            placeholder="Describe your business idea... (e.g., I want to start a tomato ketchup company)"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            aria-label="Message input"
          />
          {message.length > 0 && (
            <span className={`${styles.charCount} ${charCountClass}`}>
              {remainingChars}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={styles.sendButton}
          disabled={disabled || message.trim() === ''}
          aria-label="Send message"
          title="Send message"
        >
          {disabled ? (
            <span className={styles.spinner} />
          ) : (
            <span className={styles.sendIcon}>➤</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;