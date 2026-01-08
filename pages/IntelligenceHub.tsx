
import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  BrainCircuit, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Users, 
  Workflow, 
  Microscope,
  Sparkles,
  MessageSquareCode,
  ChevronRight,
  Radio,
  Trash2,
  Mail,
  User,
  Clock,
  Terminal,
  // Added missing icon import from lucide-react
  Network
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'syncing';
}

const IntelligenceHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'ai' | 'predictive' | 'social' | 'arch' | 'signals'>('ai');
  const [localSignals, setLocalSignals] = useState<FeedbackItem[]>([]);

  // Intercept local feedback signals
  useEffect(() => {
    const loadSignals = () => {
      const saved = localStorage.getItem('cr_feedback_pending');
      if (saved) {
        try {
          setLocalSignals(JSON.parse(saved));
        } catch (e) {
          console.error("Signal corruption detected.");
        }
      }
    };
    loadSignals();
    // Poll for new signals every 5 seconds
    const interval = setInterval(loadSignals, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearSignal = (id: string) => {
    const updated = localSignals.filter(s => s.id !== id);
    setLocalSignals(updated);
    localStorage.setItem('cr_feedback_pending', JSON.stringify(updated));
  };

  const suggestionCategories = [
    {
      id: 'ai',
      label: 'AI & Intel Layer',
      icon: Cpu,
      items: [
        { title: "Multi-Model Ensemble Architecture", desc: "Hybrid AI Pipeline: Combine Gemini, Claude, and GPT-4 for code analysis.", priority: "High Impact", complexity: "Advanced" },
        { title: "Skill Decay Modeling", desc: "Track skill obsolescence using half-life algorithms.", priority: "Quick Win", complexity: "Moderate" },
        { title: "Transfer Learning Mapper", desc: "Identify adjacent skills (e.g., React transfers 73% to React Native).", priority: "High Impact", complexity: "Moderate" },
        { title: "Stack Overflow Reputation Sync", desc: "Parse SO profiles for question quality and domain expertise.", priority: "High Impact", complexity: "Complex" }
      ]
    },
    {
      id: 'predictive',
      label: 'Predictive Systems',
      icon: TrendingUp,
      items: [
        { title: "Market Demand Forecasting", desc: "Use ARIMA/Prophet models on job data to predict skill surges.", priority: "Long Term", complexity: "High" },
        { title: "Salary Negotiation Advisor", desc: "Provide percentile-based comp ranges using web scraping.", priority: "Quick Win", complexity: "Moderate" },
        { title: "Spaced Repetition System", desc: "Implement SM-2 for long-term skill retention scheduling.", priority: "High Impact", complexity: "Moderate" },
        { title: "ATS Compatibility Simulator", desc: "Simulate how resumes parse in Workday and Greenhouse.", priority: "Quick Win", complexity: "Low" }
      ]
    },
    {
      id: 'signals',
      label: 'Signals (Feedback)',
      icon: Radio,
      items: [] // Handled by specialized view
    },
    {
      id: 'arch',
      label: 'Arch & Ethics',
      icon: ShieldCheck,
      items: [
        { title: "Differential Privacy Protocol", desc: "Add noise to stats to prevent individual re-identification.", priority: "Mandatory", complexity: "Mathematical" },
        { title: "Explainable AI (XAI)", desc: "SHAP values showing why skills were deemed critical for your match.", priority: "High Impact", complexity: "Complex" },
        { title: "Edge Computing Inference", desc: "Deploy models via Cloudflare Workers for <50ms latency.", priority: "Performance", complexity: "Infrastructure" }
      ]
    }
  ];

  const moonshotFeatures = [
    { icon: Workflow, title: "Generative Project Assignments", desc: "AI creates unique, realistic take-home projects matching your target role." },
    { icon: Microscope, title: "AR Interview Practice", desc: "Phone camera virtual recruiter hologram with gaze tracking analysis." },
    { icon: Network, title: "Quantum-Inspired Matching", desc: "Quantum annealing for optimal job-candidate matching at scale." }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="bg-[#0f172a]/60 backdrop-blur-xl rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
          <BrainCircuit size={240} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20">
            <Microscope size={14} className="animate-pulse" /> Engineering Prestige Laboratory
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">Intelligence <span className="text-indigo-500">Architecture.</span></h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
            Strategic blueprints for the next evolution. Access the **Signal Interceptor** to view incoming user architectural feedback.
          </p>
        </div>
      </div>

      {/* Main Grid Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {suggestionCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`p-6 rounded-[32px] border transition-all flex flex-col items-center gap-4 group relative ${
              activeCategory === cat.id 
                ? 'bg-indigo-500 text-white border-transparent shadow-xl shadow-indigo-500/20' 
                : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
            }`}
          >
            {cat.id === 'signals' && localSignals.length > 0 && (
              <span className="absolute top-4 right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
            <cat.icon size={28} className={`${activeCategory === cat.id ? 'text-white' : 'text-indigo-400'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Suggestion Modules or Signal Interceptor */}
      {activeCategory === 'signals' ? (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <Terminal size={20} className="text-indigo-400" />
              Signal Interceptor
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-500 uppercase tracking-widest">Live Monitoring</span>
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Found: {localSignals.length} Packets</p>
          </div>
          
          {localSignals.length === 0 ? (
            <div className="bg-[#0f172a]/40 border border-white/5 rounded-[40px] p-20 text-center space-y-4">
              <Radio size={48} className="mx-auto text-slate-700 animate-pulse" />
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">No incoming signals detected on local bus.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localSignals.map((signal) => (
                <div key={signal.id} className="p-8 rounded-[40px] bg-[#0f172a]/60 border border-indigo-500/20 backdrop-blur-xl group hover:border-indigo-400 transition-all flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                             <User size={14} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-white">{signal.name}</p>
                             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold tracking-tight">
                                <Mail size={10} /> {signal.email}
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 justify-end">
                            <Clock size={10} /> {new Date(signal.timestamp).toLocaleTimeString()}
                          </p>
                       </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/20 border border-white/5 text-slate-300 text-sm italic font-medium leading-relaxed">
                      "{signal.message}"
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Signal ID: {signal.id.substring(0,8)}</span>
                    <button 
                      onClick={() => clearSignal(signal.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors bg-white/5 rounded-xl border border-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestionCategories.find(c => c.id === activeCategory)?.items.map((item, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-[40px] bg-[#0f172a]/40 border border-white/5 backdrop-blur-sm group hover:border-indigo-500/30 transition-all relative overflow-hidden flex flex-col justify-between"
            >
               <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Sparkles size={80} />
               </div>
               
               <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                     <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
                       item.priority.includes('High') ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                     }`}>
                       {item.priority}
                     </span>
                     <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{item.complexity}</span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">{item.title}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
               </div>

               <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Architectural Approved</span>
                  </div>
                  <ChevronRight size={14} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Moonshot Lab Section */}
      <div className="space-y-8 mt-20">
        <div className="flex items-center gap-4 px-2">
           <Zap className="text-amber-400" size={20} />
           <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Moonshot Lab 2025</h3>
           <div className="h-px bg-white/5 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moonshotFeatures.map((m, i) => (
            <div key={i} className="p-8 rounded-[36px] bg-indigo-500/[0.03] border border-indigo-500/10 flex flex-col gap-5 hover:bg-indigo-500/[0.06] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <m.icon size={24} />
              </div>
              <div>
                <h4 className="font-black text-white text-lg mb-2">{m.title}</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-indigo-600 rounded-[40px] p-12 text-center space-y-6 shadow-2xl shadow-indigo-600/20 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] animate-[shimmer_3s_infinite] pointer-events-none"></div>
         <div className="relative z-10 space-y-4">
            <h3 className="text-3xl font-black text-white tracking-tighter">Ready to Evolve the Engine?</h3>
            <p className="text-indigo-100 font-medium max-w-lg mx-auto">These intelligence modules are currently being prioritized by our core architectural team.</p>
            <div className="flex justify-center gap-4 pt-4">
              <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <MessageSquareCode size={16} /> Submit Implementation Draft
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;
