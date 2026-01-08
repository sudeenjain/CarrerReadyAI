import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { analysisService } from '../analysisService';
import { UserProfile, ChatMessage } from '../types';

export function CareerMentor({ user }: { user: UserProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi **${user.name}**! I'm your **AI Career Mentor**.\n\nI've analyzed your **${user.targetRole}** roadmap. How can I help you level up today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const profileSummary = `Name: ${user.name}, Role: ${user.targetRole}, Readiness: ${user.readinessScore}%, Skills: ${user.currentSkills.map(s => s.name).join(', ')}`;
      const advice = await analysisService.getMentorAdvice(messages.map(m => ({ role: m.role, text: m.text })), profileSummary);
      setMessages(prev => [...prev, { role: 'model', text: advice }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to render basic markdown formatting for better readability
  const renderFormattedText = (text: string) => {
    // Replace **bold** with actual bold elements
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <span className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-black text-indigo-600 dark:text-indigo-400">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 gradient-bg rounded-full shadow-2xl flex items-center justify-center text-white transition-all z-[100] hover:scale-110 active:scale-95 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={28} />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[90vw] md:w-[420px] h-[650px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col z-[101] overflow-hidden animate-in slide-in-from-bottom-4 border border-slate-100 dark:border-slate-800">
          <div className="p-5 gradient-bg text-white flex items-center justify-between shadow-lg relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest leading-none mb-1">Career Mentor</h4>
                <div className="flex items-center gap-1.5 text-[10px] opacity-70">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div> Strategic Intelligence Ready
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-950 pt-8">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                  {renderFormattedText(m.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Synthesizing Advice...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask about your roadmap or target roles..."
                className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-bold dark:text-slate-100 shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all disabled:opacity-30 active:scale-90"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest mt-3">
              Powered by CareerReady Architecture v2.5
            </p>
          </div>
        </div>
      )}
    </>
  );
}