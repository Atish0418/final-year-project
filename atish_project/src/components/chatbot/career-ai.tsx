"use client"

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { SendHorizonal, Bot, Sparkles, User, Loader2, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';

import { chatWithAI } from '@/services/chatbotService';
import { useAuthStore } from '@/store/useAuthStore';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export function CareerAI() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: currentInput }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await chatWithAI(currentInput, messages);
      const botMessage: Message = { role: 'model', parts: [{ text: botResponse }] };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'model',
        parts: [{ text: 'Sorry, I encountered an issue. Please try again.' }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-h-[850px] max-w-5xl mx-auto w-full bg-white/20 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-premium overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white/40 border-b border-white/50 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
               <Bot className="text-white h-7 w-7" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-gray-900 tracking-tight">FuturePath <span className="text-primary font-extrabold italic">AI</span></h2>
               <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none pt-0.5">Always Online</span>
               </div>
            </div>
         </div>
         <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 border-2 rounded-xl text-gray-400 hover:text-primary">
                <Maximize2 size={18} />
            </Button>
            <Button onClick={() => setMessages([])} variant="ghost" size="icon" className="h-10 w-10 border-2 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50">
                <X size={18} />
            </Button>
         </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollAreaRef} 
        className="flex-grow overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-hide"
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="p-6 bg-primary/10 rounded-full mb-8 relative">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse"></div>
                 <Sparkles className="h-14 w-14 text-primary relative z-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                Welcome, {user?.email?.split('@')[0] || 'Traveler'}
              </h1>
              <p className="text-gray-500 leading-relaxed text-lg mb-8">
                I am your personal AI Career Architect. Ask me anything about engineering, roadmap design, or college admissions.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                 {['Suggest a career', 'Top 10 colleges', 'Skill roadmaps', 'Job trends'].map((tip) => (
                    <button 
                       key={tip}
                       onClick={() => setInput(tip)}
                       className="p-3 text-sm font-bold bg-white/50 border border-white hover:border-primary hover:text-primary transition-all rounded-xl shadow-sm cursor-pointer text-gray-700"
                    >
                       {tip}
                    </button>
                 ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center shadow-md",
                  msg.role === 'user' ? "bg-primary text-white" : "bg-white text-primary border border-primary/20"
                )}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={cn(
                  "p-5 rounded-3xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none shadow-premium-dark" 
                    : "bg-white/80 backdrop-blur-md rounded-tl-none border border-white shadow-premium text-gray-800"
                )}>
                   {msg.role === 'model' ? (
                     <div className="prose prose-sm max-w-none prose-headings:mb-2 prose-p:mb-2 prose-ul:list-disc prose-li:mb-1">
                        <Markdown>{msg.parts[0].text}</Markdown>
                     </div>
                   ) : (
                     msg.parts[0].text
                   )}
                </div>
              </motion.div>
            ))
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="h-10 w-10 rounded-2xl bg-white border border-primary/20 flex items-center justify-center shadow-md">
                 <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl rounded-tl-none border border-white shadow-premium">
                 <div className="flex gap-1.5 items-center h-5">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white/40 border-t border-white/50">
        <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-16 pl-8 pr-32 rounded-3xl bg-white/50 border-2 border-white focus-visible:ring-primary/20 focus-visible:border-primary text-base font-medium shadow-glass transition-all group-hover:bg-white"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
             <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="h-12 w-28 rounded-2xl bg-primary hover:bg-primary/90 font-bold transition-all shadow-lg active:scale-95"
             >
                <div className="flex items-center gap-2">
                   Send
                   <SendHorizonal size={18} />
                </div>
             </Button>
          </div>
        </form>
        <div className="mt-4 flex items-center justify-center gap-6 opacity-30">
           <div className="flex items-center gap-1.5">
              <Sparkles size={12} />
              <span className="text-[10px] uppercase font-bold tracking-tighter">AI Assistant</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Sparkles size={12} />
              <span className="text-[10px] uppercase font-bold tracking-tighter">Smart Matching</span>
           </div>
        </div>
      </div>
    </div>
  );
}
