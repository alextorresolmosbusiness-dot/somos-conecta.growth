
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Minimize2, Trash2 } from 'lucide-react';
import { chatWithNex } from '../services/geminiService';
import NexMascot from './NexMascot';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const STORAGE_KEY = 'conecta_growth_chat_history';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize messages from localStorage or use default
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
    return [{ role: 'model', text: '¡Hola! Soy NEX 🤖. Sistema operativo listo. ¿En qué puedo ayudarte hoy para impulsar tu marca?' }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (messages.length <= 1) return; // Don't clear if it's just the greeting

    // Use timeout to allow UI event to finish processing before alert blocks thread
    setTimeout(() => {
        if (window.confirm('¿Estás seguro de que deseas borrar todo el historial del chat?')) {
            localStorage.removeItem(STORAGE_KEY);
            setMessages([{ role: 'model', text: '¡Hola! Soy NEX 🤖. Sistema operativo listo. ¿En qué puedo ayudarte hoy para impulsar tu marca?' }]);
        }
    }, 10);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // --- Sound Effects System ---
  const playSound = (type: 'send' | 'receive') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        if (type === 'send') {
            // Subtle high-pitch "pop" for user message
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
        } else {
            // Soft "tech bloop" for bot message (Dual Tone)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, ctx.currentTime);
            
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.2);

            // Second tone harmonic
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.05);
            
            gain2.gain.setValueAtTime(0, ctx.currentTime);
            gain2.gain.setValueAtTime(0.03, ctx.currentTime + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            
            osc2.start(ctx.currentTime + 0.05);
            osc2.stop(ctx.currentTime + 0.2);
        }
    } catch (e) {
        console.error("Audio playback error", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    playSound('send');
    setIsLoading(true);

    try {
      const responseText = await chatWithNex(messages, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      playSound('receive');
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Error de sistema. Reintentando conexión...' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NexMascot onClick={toggleChat} isOpen={isOpen} />

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-[70] w-[90vw] md:w-[400px] h-[500px] flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-75 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Glass Container */}
        <div className="absolute inset-0 bg-brand-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-blue to-brand-lightBlue p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                <Bot className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg leading-none">NEX</h3>
                <span className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  En línea
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={handleClearChat}
                disabled={messages.length <= 1}
                className={`transition-all p-2 rounded-full ${
                    messages.length <= 1 
                    ? 'text-white/30 cursor-not-allowed' 
                    : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-110 cursor-pointer'
                }`}
                title={messages.length <= 1 ? "Historial vacío" : "Limpiar historial"}
              >
                <Trash2 size={18} />
              </button>
              <button 
                type="button"
                onClick={toggleChat}
                className="text-white/80 hover:text-white hover:bg-white/10 hover:rotate-90 transition-all p-2 rounded-full cursor-pointer"
                title="Minimizar"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-brand-gray scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-brand-blue text-white rounded-tr-none' 
                      : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md shrink-0">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntale a NEX..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all placeholder-gray-500"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-brand-blue text-white rounded-full hover:bg-brand-lightBlue transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </div>
            <div className="text-center mt-2">
               <p className="text-[10px] text-gray-600">NEX Powered by Google Gemini AI</p>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default ChatBot;
