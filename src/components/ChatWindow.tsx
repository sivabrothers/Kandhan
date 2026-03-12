import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, MessageSquare } from 'lucide-react';

interface Message {
  fromId: number;
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  currentUserId: number;
  targetUserId: number;
  targetName: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUserId, targetUserId, targetName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}?userId=${currentUserId}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.fromId === targetUserId) {
        setMessages(prev => [...prev, msg]);
      }
    };

    return () => {
      socket.close();
    };
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !socketRef.current) return;

    const msg = {
      toId: targetUserId,
      text: inputText,
      timestamp: new Date().toISOString()
    };

    socketRef.current.send(JSON.stringify(msg));
    setMessages(prev => [...prev, { fromId: currentUserId, text: inputText, timestamp: msg.timestamp }]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-accent-500/20 flex flex-col z-50 overflow-hidden">
      <div className="bg-primary-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-primary-900" />
          </div>
          <div>
            <div className="text-sm font-bold">{targetName}</div>
            <div className="text-[10px] text-accent-500 font-bold uppercase">Online</div>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-bg-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.fromId === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.fromId === currentUserId 
                ? 'bg-primary-700 text-white rounded-tr-none' 
                : 'bg-white text-primary-900 border border-accent-500/10 rounded-tl-none'
            }`}>
              {msg.text}
              <div className={`text-[8px] mt-1 opacity-60 ${msg.fromId === currentUserId ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-primary-700/40 opacity-50">
            <MessageSquare size={32} className="mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">Start a conversation</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-accent-500/10 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-grow bg-bg-50 border border-accent-500/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent-500"
        />
        <button 
          onClick={handleSend}
          className="bg-accent-500 text-primary-900 p-2 rounded-xl hover:bg-accent-600 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
