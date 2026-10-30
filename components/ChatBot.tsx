import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, sendChatMessageStream, ChatMessage } from '../services/chatService';
// FIX: Removed 'PaperAirplaneIcon' from the import statement as it is locally defined within this file and not exported from './icons'.
import { XMarkIcon, ChatBubbleLeftRightIcon, CpuChipIcon } from './icons';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const currentHistory = [...messages];
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      let isFirstChunk = true;
      await sendChatMessageStream(currentHistory, userMsg, (chunkText) => {
        if (isFirstChunk) {
          isFirstChunk = false;
          setIsLoading(false);
          setMessages(prev => [...prev, { role: 'model', text: chunkText }]);
        } else {
          setMessages(prev => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === 'model') {
              next[next.length - 1] = { role: 'model', text: chunkText };
            }
            return next;
          });
        }
      });
    } catch (streamError) {
      // Fallback to standard unary call if stream interrupted
      try {
        const response = await sendChatMessage(currentHistory, userMsg);
        setMessages(prev => {
          const next = [...prev];
          if (next.length > 0 && next[next.length - 1].role === 'model') {
            next[next.length - 1] = { role: 'model', text: response || '' };
          } else {
            next.push({ role: 'model', text: response || '' });
          }
          return next;
        });
      } catch (fallbackError: any) {
        setMessages(prev => [
          ...prev,
          { role: 'model', text: fallbackError.message || "Më vjen keq, pati një problem me lidhjen me asistentin Nora." },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 left-8 z-[100] font-sans">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        } bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-white/20`}
        aria-label="Hap bisedën me Norën"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'
        } absolute bottom-0 left-0 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 origin-bottom-left overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 bg-primary-600 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-slate-800">
              <img src="https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg" alt="Nora AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-none">Nora Assistant</h3>
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-mono">System v3.0 // Online</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          {messages.length === 0 && (
            <div className="text-center py-10 opacity-50 space-y-2">
              <CpuChipIcon className="w-12 h-12 mx-auto text-slate-400" />
              <p className="text-xs font-medium dark:text-slate-400 uppercase tracking-widest">Si mund t'ju ndihmoj sot?</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Shkruaj një pyetje..."
            className="flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md transition-all active:scale-90 disabled:opacity-50 disabled:grayscale"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);