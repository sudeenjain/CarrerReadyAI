import React, { useState, useEffect } from 'react';
import { Mail, Send, User, MessageSquare, CheckCircle, AlertCircle, Loader2, Sparkles, ShieldCheck, Clock, Trash2, RefreshCcw } from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'syncing';
}

const DRAFT_KEY = 'cr_feedback_draft';
const PENDING_KEY = 'cr_feedback_pending';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojvgpla';

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [pendingItems, setPendingItems] = useState<FeedbackItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'locally_saved'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load draft and pending items on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (e) {
        localStorage.removeItem(DRAFT_KEY);
      }
    }

    const savedPending = localStorage.getItem(PENDING_KEY);
    if (savedPending) {
      try {
        setPendingItems(JSON.parse(savedPending));
      } catch (e) {
        localStorage.removeItem(PENDING_KEY);
      }
    }
  }, []);

  // Persist draft on every change
  useEffect(() => {
    if (formData.name || formData.email || formData.message) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const sendToFormspree = async (item: FeedbackItem) => {
    // We send to Formspree using fetch as requested
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: item.name,
        email: item.email,
        message: item.message,
        timestamp: item.timestamp,
        _subject: `New CareerReadyAI Architect Feedback from ${item.name}`
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors?.[0]?.message || 'Formspree transmission failed');
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const newItem: FeedbackItem = {
      id: crypto.randomUUID(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // 1. Persist to Local Storage immediately as Fallback (Reliability Constraint)
    const updatedPending = [newItem, ...pendingItems];
    setPendingItems(updatedPending);
    localStorage.setItem(PENDING_KEY, JSON.stringify(updatedPending));
    localStorage.removeItem(DRAFT_KEY);

    try {
      // 2. Attempt Real-time Transmission to Formspree
      await sendToFormspree(newItem);
      
      // 3. Success: Remove from pending outbox
      const finalPending = updatedPending.filter(i => i.id !== newItem.id);
      setPendingItems(finalPending);
      localStorage.setItem(PENDING_KEY, JSON.stringify(finalPending));
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      // 4. Failure: Keep in local storage and notify user (Production-ready UX)
      setStatus('locally_saved');
      setFormData({ name: '', email: '', message: '' });
      console.warn("Formspree link unavailable, feedback stored in local vault.", err);
    }
  };

  const handleRetry = async (id: string) => {
    const item = pendingItems.find(i => i.id === id);
    if (!item) return;

    // Update status to syncing
    setPendingItems(prev => prev.map(i => i.id === id ? { ...i, status: 'syncing' } : i));

    try {
      await sendToFormspree(item);
      const remaining = pendingItems.filter(i => i.id !== id);
      setPendingItems(remaining);
      localStorage.setItem(PENDING_KEY, JSON.stringify(remaining));
    } catch (err) {
      setPendingItems(prev => prev.map(i => i.id === id ? { ...i, status: 'pending' } : i));
      alert("Synchronization failed. Check your network connection.");
    }
  };

  const removePending = (id: string) => {
    const remaining = pendingItems.filter(i => i.id !== id);
    setPendingItems(remaining);
    localStorage.setItem(PENDING_KEY, JSON.stringify(remaining));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-100 dark:border-indigo-800 shadow-sm">
          <Sparkles size={14} className="animate-pulse" />
          Direct Architect Access
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter leading-none">
          Evolve the <span className="text-indigo-600">Engine.</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
          Your feedback is processed by our elite strategist team to sharpen our AI benchmark models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Sidebar Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/10">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
              <MessageSquare size={160} />
            </div>
            <h3 className="text-xl font-black mb-4 relative z-10">Persistence Protocol</h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex gap-3 text-sm text-slate-400 font-medium">
                <div className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 font-black text-[10px]">01</div>
                Automatic Draft Recovery
              </li>
              <li className="flex gap-3 text-sm text-slate-400 font-medium">
                <div className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 font-black text-[10px]">02</div>
                Offline-Ready Outbox
              </li>
              <li className="flex gap-3 text-sm text-slate-400 font-medium">
                <div className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 font-black text-[10px]">03</div>
                Direct Formspree Sync
              </li>
            </ul>
          </div>

          {/* Outbox / Pending Feedback */}
          {pendingItems.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-[32px] p-6 space-y-4 animate-in slide-in-from-left-4 duration-500">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                    <Clock size={14} /> Neural Outbox ({pendingItems.length})
                  </h4>
               </div>
               <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/10 shadow-sm space-y-3">
                       <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 italic">"{item.message}"</p>
                       <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saved locally</span>
                          <div className="flex gap-2">
                             <button 
                               onClick={() => removePending(item.id)} 
                               className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                             >
                                <Trash2 size={14} />
                             </button>
                             <button 
                               onClick={() => handleRetry(item.id)}
                               disabled={item.status === 'syncing'}
                               className={`p-1.5 text-indigo-500 hover:text-indigo-600 transition-colors ${item.status === 'syncing' ? 'animate-spin opacity-50' : ''}`}
                             >
                                <RefreshCcw size={14} />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={20} className="text-indigo-500" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Verified Delivery</h4>
             </div>
             <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Architect Contact:</p>
             <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 underline decoration-indigo-500/30 underline-offset-4">sudinhr1@gmail.com</p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="md:col-span-3">
          {(status === 'success' || status === 'locally_saved') ? (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-12 border border-slate-100 dark:border-slate-800 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ${
                status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 ring-green-50' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 ring-amber-50'
              }`}>
                {status === 'success' ? <CheckCircle size={40} /> : <Clock size={40} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {status === 'success' ? 'Packet Delivered.' : 'Stored in Outbox.'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">
                  {status === 'success' 
                    ? 'Your feedback has been transmitted to our primary architects via Formspree.' 
                    : 'The cloud channel is currently offline or unreachable. Your packet is stored in your local Neural Outbox and will be delivered to sudinhr1@gmail.com later.'}
                </p>
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
              >
                Draft Another Packet
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-1">Elite Identity</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                      <input 
                        type="text" 
                        name="name"
                        required
                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-1">Secure Channel</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
                      <input 
                        type="email" 
                        name="email"
                        required
                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-1">Encrypted Message</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-4 top-5 text-slate-400 dark:text-slate-600" />
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none custom-scrollbar"
                      placeholder="Share your architectural insights or report bugs..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake">
                  <AlertCircle size={18} />
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-5 gradient-bg text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {status === 'loading' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {status === 'loading' ? 'Broadcasting...' : 'Transmit Feedback'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;