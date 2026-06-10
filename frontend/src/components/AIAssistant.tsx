import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { useLanguage } from '../i18n/LanguageContext';
import styles from './AIAssistant.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedPath?: string;
  data?: Record<string, unknown>;
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Cześć! Jestem asystentem Smart Mysłowice. Zadaj pytanie o miasto! 🌆',
    },
  ]);
  const { sendQuery, loading, error } = useAIAssistant();
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingQueryRef = useRef(false);
  const prevErrorRef = useRef<string | null>(null);

  // Ustaw początkową wiadomość po zmianie języka
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      const greeting = t.aiAssistant.greeting;
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll do najnowszej wiadomości
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input po otwarciu
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Dodaj komunikat błędu do czatu gdy pojawi się nowy błąd po wysłaniu zapytania
  useEffect(() => {
    if (error && error !== prevErrorRef.current && pendingQueryRef.current) {
      prevErrorRef.current = error;
      pendingQueryRef.current = false;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ ${error}`,
        },
      ]);
    }
  }, [error]);

  const handleSubmit = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    pendingQueryRef.current = true;

    const result = await sendQuery(q, {
      currentPage: location.pathname,
    });

    if (result) {
      pendingQueryRef.current = false;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.answer,
          suggestedPath: result.suggestedPath,
          data: result.data,
        },
      ]);
    }
    // Gdy sendQuery zwróci null, useEffect [error] doda komunikat błędu do czatu
  }, [input, loading, sendQuery, location.pathname]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleSuggestionClick = useCallback(
    (path: string) => {
      navigate(path);
      setOpen(false);
    },
    [navigate],
  );

  return (
    <div className={styles.wrapper}>
      {/* Przycisk otwierania/zamykania */}
      <button
        className={`${styles.toggle} ${open ? styles.toggleActive : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.aiAssistant.close : t.aiAssistant.open}
        title={open ? t.aiAssistant.close : t.aiAssistant.title}
      >
        <span className={styles.toggleIcon}>{open ? '✕' : '🤖'}</span>
        {!open && <span className={styles.toggleLabel}>{t.aiAssistant.title}</span>}
      </button>

      {/* Panel czatu */}
      {open && (
        <div className={styles.panel} role="dialog" aria-label={`${t.aiAssistant.cityAssistant} Smart Mysłowice`}>
          {/* Nagłówek */}
          <div className={styles.header}>
            <span className={styles.headerIcon}>🤖</span>
            <span className={styles.headerTitle}>{t.aiAssistant.cityAssistant}</span>
          </div>

          {/* Lista wiadomości */}
          <div className={styles.messages} ref={listRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.assistantBubble}`}
                role="region"
                aria-label={msg.role === 'user' ? 'Twoja wiadomość' : 'Odpowiedź asystenta'}
              >
                <div className={styles.bubbleContent}>{msg.content}</div>
                {msg.role === 'assistant' && msg.suggestedPath && (
                  <button
                    className={styles.suggestedLink}
                    onClick={() => handleSuggestionClick(msg.suggestedPath!)}
                    aria-label={`${t.aiAssistant.goToPage}: ${msg.suggestedPath}`}
                  >
                    🔗 {t.aiAssistant.showDetails}
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className={`${styles.bubble} ${styles.assistantBubble}`} aria-label="Asystent pisze">
                <div className={styles.typing}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}
          </div>

          {/* Pole wprowadzania */}
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.aiAssistant.placeholder}
              maxLength={500}
              disabled={loading}
              aria-label={t.aiAssistant.placeholder}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              aria-label={t.aiAssistant.send}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
