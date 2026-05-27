/**
 * ═══════════════════════════════════════════════════════
 * Page: Support — Real-time Chat via Socket.io
 * Topic #21: WebSockets & Socket.io
 * Topic #9:  React State та робота з подіями
 * ═══════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  senderRole: string;
  timestamp: string;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000';

const SupportPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roomId = user?.id ?? `guest_${Date.now()}`;
  const displayName = user?.username ?? guestName;

  // ── Auto-scroll to bottom ──
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Connect to Socket.io ──
  const joinChat = useCallback(() => {
    if (!displayName.trim()) return;

    const socket = io(`${SOCKET_URL}/support`, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_room', { roomId, username: displayName });
      console.log('🟢 Connected to support chat');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔴 Disconnected from support chat');
    });

    socket.on('receive_message', (payload: ChatMessage) => {
      setMessages((prev) => [...prev, payload]);
    });

    socket.on('user_joined', ({ message }: { message: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `system_${Date.now()}`,
          message,
          sender: 'Система',
          senderRole: 'system',
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on('user_typing', ({ username }: { username: string }) => {
      setIsTyping(username);
    });

    socket.on('user_stop_typing', () => {
      setIsTyping(null);
    });

    setIsJoined(true);

    return () => {
      socket.disconnect();
    };
  }, [displayName, roomId]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ── Send message ──
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      roomId,
      message: inputValue.trim(),
      sender: displayName,
      senderRole: user?.role === 'admin' ? 'admin' : 'student',
    });

    socketRef.current.emit('stop_typing', { roomId });
    setInputValue('');
  };

  // ── Typing indicator ──
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (socketRef.current) {
      socketRef.current.emit('typing', { roomId, username: displayName });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('stop_typing', { roomId });
      }, 1500);
    }
  };

  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  // ── Pre-join screen ──
  if (!isJoined) {
    return (
      <motion.div
        className="container section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <div className="glass-card" style={{ padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>💬</span>
          <h2 style={{ marginBottom: '8px' }}>Чат підтримки</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Зв'яжіться з нашою командою підтримки в реальному часі через Socket.io
          </p>
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--color-accent-cyan)',
            fontFamily: 'var(--font-mono)',
          }}>
            🔌 WebSocket • Socket.io • Real-time • Тема #21
          </div>

          {isAuthenticated ? (
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={joinChat} id="join-chat-btn">
              Підключитися як {user?.username} →
            </button>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (guestName.trim()) joinChat(); }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                className="input"
                placeholder="Ваше ім'я"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                id="guest-name-input"
              />
              <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }} id="guest-join-btn">
                Підключитися →
              </button>
            </form>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Chat UI ──
  return (
    <motion.div
      className="container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ maxWidth: '700px', margin: '0 auto', padding: '24px' }}
    >
      <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '70vh' }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ fontSize: '16px' }}>💬 Чат підтримки</h3>
            <span style={{ fontSize: '12px', color: isConnected ? 'var(--color-accent-emerald)' : 'var(--color-accent-rose)' }}>
              {isConnected ? '🟢 Підключено' : '🔴 Відключено'}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            Room: {roomId.slice(0, 12)}...
          </span>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
              Поки тут тихо... Напишіть першим! 👋
            </div>
          )}

          {messages.map((msg) => {
            const isOwn = msg.sender === displayName;
            const isSystem = msg.senderRole === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)', padding: '4px 0' }}>
                  {msg.message}
                </div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
                  {msg.sender} • {formatTime(msg.timestamp)}
                </span>
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 16px',
                  borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isOwn ? 'var(--gradient-primary)' : 'rgba(99, 102, 241, 0.1)',
                  color: isOwn ? '#fff' : 'var(--color-text-primary)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}>
                  {msg.message}
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
              {isTyping} друкує...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            className="input"
            placeholder="Введіть повідомлення..."
            value={inputValue}
            onChange={handleInputChange}
            style={{ flex: 1 }}
            id="chat-input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputValue.trim() || !isConnected}
            id="send-message-btn"
          >
            📨
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default SupportPage;
