import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, RoadmapStep } from '../types';
import { analysisService } from '../analysisService';
import { 
  Play, 
  FileText, 
  Code, 
  CheckCircle2, 
  ChevronDown, 
  WifiOff, 
  Sparkles, 
  CheckCircle,
  Circle,
  Zap,
  TrendingUp,
  Award,
  ExternalLink,
  ChevronRight,
  Loader2,
  Clock,
  Target,
  Brain,
  ListTodo,
  Hammer,
  Eye,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

const Roadmap: React.FC<{ user: UserProfile, onUpdateUser: (u: UserProfile) => void }> = ({ user, onUpdateUser }) => {
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePhase, setActivePhase] = useState<string>('Foundation');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const taskKeys = ['learn', 'practice', 'build', 'review'] as const;
  type TaskKey = typeof taskKeys[number];

  useEffect(() => {
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    const savedRoadmap = localStorage.getItem(`roadmap_daily_${user.targetRole}`);
    if (savedRoadmap) {
      setSteps(JSON.parse(savedRoadmap));
    } else if (navigator.onLine) {
      fetchRoadmap();
    }

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [user.targetRole]);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const data = await analysisService.generateRoadmap(user.currentSkills, user.targetRole);
      setSteps(data);
      localStorage.setItem(`roadmap_daily_${user.targetRole}`, JSON.stringify(data));
      // Auto-expand current day or day 1
      setExpandedDay(data[0]?.day || 1);
    } catch (err) {
      console.error("Roadmap generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const isTaskComplete = (day: number, taskKey: TaskKey) => {
    return (user.completedResources || []).includes(`day-${day}-${taskKey}`);
  };

  const isDayFullyComplete = (day: number) => {
    return taskKeys.every(key => isTaskComplete(day, key));
  };

  const getDayProgress = (day: number) => {
    const completed = taskKeys.filter(key => isTaskComplete(day, key)).length;
    return (completed / taskKeys.length) * 100;
  };

  const toggleTask = (day: number, taskKey: TaskKey) => {
    const key = `day-${day}-${taskKey}`;
    const current = user.completedResources || [];
    const updated = current.includes(key)
      ? current.filter(k => k !== key)
      : [...current, key];
    
    onUpdateUser({ ...user, completedResources: updated });
  };

  const toggleFullDay = (day: number) => {
    const current = user.completedResources || [];
    const dayTasks = taskKeys.map(key => `day-${day}-${key}`);
    const isFull = dayTasks.every(k => current.includes(k));
    
    let updated;
    if (isFull) {
      updated = current.filter(k => !dayTasks.includes(k));
    } else {
      const otherTasks = current.filter(k => !dayTasks.includes(k));
      updated = [...otherTasks, ...dayTasks];
    }
    
    onUpdateUser({ ...user, completedResources: updated });
  };

  const phases = ['Foundation', 'Skill Building', 'Projects', 'Interview Readiness'];

  const filteredSteps = useMemo(() => {
    return steps.filter(s => s.phase === activePhase);
  }, [steps, activePhase]);

  const globalProgress = useMemo(() => {
    if (steps.length === 0) return 0;
    const taskCompletionCount = (user.completedResources || []).filter(k => 
      k.match(/^day-\d+-(learn|practice|build|review)$/)
    ).length;
    const totalTasks = steps.length * 4;
    return Math.round((taskCompletionCount / totalTasks) * 100);
  }, [steps, user.completedResources]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={32} />
        </div>
        <div className="text-center">
          <p className="text-white font-black text-2xl tracking-tighter uppercase">Initializing Action Protocol</p>
          <p className="text-slate-500 text-sm font-bold mt-2">Constructing your 45-day daily mastery sequence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      {isOffline && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-400 text-xs font-bold">
          <WifiOff size={16} />
          <span>Local Cache Active: Syncing restricted until connectivity restored.</span>
        </div>
      )}

      {/* Hero Protocol Header */}
      <div className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-[48px] p-10 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
           <CalendarDays size={280} />
        </div>
        
        <div className="relative z-10 space-y-6 text-center lg:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] border border-indigo-500/20">
            <ShieldCheck size={14} className="animate-pulse" /> Operational Readiness Directive
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
            The Daily <br/><span className="gradient-text">Mastery Protocol.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
            A surgical 45-day roadmap. Every day is a mission. Every task is an evolution. Master the four quadrants to reach Tier-1 status.
          </p>
        </div>

        <div className="relative w-52 h-52 shrink-0">
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="50%" cy="50%" r="90" className="stroke-white/5" strokeWidth="12" fill="transparent" />
             <circle 
                cx="50%" 
                cy="50%" 
                r="90" 
                className="stroke-indigo-500 transition-all duration-1000 ease-out" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={565} 
                strokeDashoffset={565 - (globalProgress / 100) * 565} 
                strokeLinecap="round" 
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-5xl font-black text-white">{globalProgress}%</span>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Completion</span>
           </div>
        </div>
      </div>

      {/* Phased Navigation Selector */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {phases.map((p, i) => (
          <button 
            key={p}
            onClick={() => setActivePhase(p)}
            className={`px-10 py-5 rounded-[32px] border transition-all flex flex-col items-center gap-2 min-w-[200px] relative overflow-hidden group ${
              activePhase === p 
                ? 'bg-indigo-600 text-white border-transparent shadow-2xl shadow-indigo-500/20 scale-105 z-10' 
                : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
            }`}
          >
            <span className="text-[9px] font-black opacity-40 uppercase tracking-[0.3em]">Module 0{i+1}</span>
            <span className="text-xs font-black uppercase tracking-widest">{p}</span>
            {activePhase === p && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer transition-none"></div>
            )}
          </button>
        ))}
      </div>

      {/* Missions Timeline */}
      <div className="space-y-6">
        {filteredSteps.length === 0 && (
           <div className="py-24 text-center bg-[#0f172a]/40 rounded-[48px] border border-white/5">
              <Loader2 className="animate-spin mx-auto text-slate-700 mb-6" size={40} />
              <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-600">Syncing Phase Data...</p>
           </div>
        )}
        
        {filteredSteps.map((step) => {
          const isDone = isDayFullyComplete(step.day);
          const isExpanded = expandedDay === step.day;
          const dayProg = getDayProgress(step.day);

          return (
            <div key={step.day} className="group/day">
              <div className={`rounded-[40px] border transition-all duration-500 overflow-hidden ${
                isExpanded ? 'bg-[#0f172a] border-indigo-500/40 shadow-2xl' : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}>
                {/* Protocol Header */}
                <div 
                  className="p-8 cursor-pointer flex items-center justify-between gap-6"
                  onClick={() => setExpandedDay(isExpanded ? null : step.day)}
                >
                  <div className="flex items-center gap-8 flex-1 min-w-0">
                    <div className={`w-16 h-16 rounded-[24px] flex flex-col items-center justify-center shrink-0 border transition-all duration-500 ${
                      isDone 
                        ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/20' 
                        : isExpanded ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-500'
                    }`}>
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Mission</span>
                      <span className="text-2xl font-black">{step.day}</span>
                    </div>
                    
                    <div className="min-w-0">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1.5 flex items-center gap-2">
                         <Target size={12} /> {step.primaryGoal}
                       </p>
                       <h4 className={`text-2xl font-black tracking-tighter truncate leading-none ${isDone ? 'text-green-400' : 'text-white'}`}>
                         {isDone ? 'Deployment Successful' : isExpanded ? 'Operational Sync: Active' : 'Awaiting Deployment'}
                       </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Loadout Progress</p>
                       <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full transition-all duration-1000 ${isDone ? 'bg-green-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${dayProg}%` }}
                          ></div>
                       </div>
                    </div>
                    <ChevronDown className={`transition-transform duration-500 text-slate-600 ${isExpanded ? 'rotate-180 text-white' : ''}`} size={24} />
                  </div>
                </div>

                {/* Protocol Expansion Content */}
                {isExpanded && (
                  <div className="px-8 pb-10 pt-2 animate-in slide-in-from-top-4 duration-500 space-y-10">
                    {/* Mission Quadrants Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      {/* Quadrant 01: Learn */}
                      <div 
                        onClick={() => toggleTask(step.day, 'learn')}
                        className={`p-6 rounded-[32px] border space-y-4 group/card cursor-pointer transition-all ${
                          isTaskComplete(step.day, 'learn') 
                            ? 'bg-blue-500/10 border-blue-500/30' 
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                        }`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                           isTaskComplete(step.day, 'learn') ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                         }`}>
                            {isTaskComplete(step.day, 'learn') ? <CheckCircle size={24} /> : <Brain size={24} />}
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">01. Theoretical Scan (Learn)</h5>
                         <p className={`text-xs font-bold leading-relaxed transition-colors ${isTaskComplete(step.day, 'learn') ? 'text-blue-200' : 'text-slate-300'}`}>
                           {step.learningTask}
                         </p>
                      </div>
                      
                      {/* Quadrant 02: Practice */}
                      <div 
                        onClick={() => toggleTask(step.day, 'practice')}
                        className={`p-6 rounded-[32px] border space-y-4 group/card cursor-pointer transition-all ${
                          isTaskComplete(step.day, 'practice') 
                            ? 'bg-indigo-500/10 border-indigo-500/30' 
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                        }`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                           isTaskComplete(step.day, 'practice') ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                         }`}>
                            {isTaskComplete(step.day, 'practice') ? <CheckCircle size={24} /> : <Zap size={24} />}
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">02. Combat Drills (Practice)</h5>
                         <p className={`text-xs font-bold leading-relaxed transition-colors ${isTaskComplete(step.day, 'practice') ? 'text-indigo-200' : 'text-slate-300'}`}>
                           {step.practiceTask}
                         </p>
                      </div>

                      {/* Quadrant 03: Build */}
                      <div 
                        onClick={() => toggleTask(step.day, 'build')}
                        className={`p-6 rounded-[32px] border space-y-4 group/card cursor-pointer transition-all ${
                          isTaskComplete(step.day, 'build') 
                            ? 'bg-purple-500/10 border-purple-500/30' 
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                        }`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                           isTaskComplete(step.day, 'build') ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                         }`}>
                            {isTaskComplete(step.day, 'build') ? <CheckCircle size={24} /> : <Hammer size={24} />}
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">03. Systems Construct (Build)</h5>
                         <p className={`text-xs font-bold leading-relaxed transition-colors ${isTaskComplete(step.day, 'build') ? 'text-purple-200' : 'text-slate-300'}`}>
                           {step.buildingTask}
                         </p>
                      </div>

                      {/* Quadrant 04: Review */}
                      <div 
                        onClick={() => toggleTask(step.day, 'review')}
                        className={`p-6 rounded-[32px] border space-y-4 group/card cursor-pointer transition-all ${
                          isTaskComplete(step.day, 'review') 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                        }`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                           isTaskComplete(step.day, 'review') ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                         }`}>
                            {isTaskComplete(step.day, 'review') ? <CheckCircle size={24} /> : <Eye size={24} />}
                         </div>
                         <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">04. Quality Audit (Review)</h5>
                         <p className={`text-xs font-bold leading-relaxed transition-colors ${isTaskComplete(step.day, 'review') ? 'text-green-200' : 'text-slate-300'}`}>
                           {step.reviewTask}
                         </p>
                      </div>
                    </div>

                    {/* Mission Summary Protocol */}
                    <div className="flex flex-col md:flex-row items-stretch gap-6">
                       <div className="flex-1 p-8 bg-indigo-500/5 rounded-[40px] border border-indigo-500/10 flex items-center gap-8">
                          <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-inner ${isDone ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-600'}`}>
                             {isDone ? <Award size={32} /> : <Target size={32} />}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1.5">Deliverable Output</p>
                             <p className="text-lg font-black text-white">{step.expectedOutput}</p>
                          </div>
                       </div>
                       
                       <button 
                        onClick={() => toggleFullDay(step.day)}
                        className={`px-12 py-5 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl relative overflow-hidden group/btn ${
                          isDone 
                          ? 'bg-green-600 text-white shadow-green-500/20' 
                          : 'bg-white text-[#020617] hover:scale-[1.02] active:scale-95'
                        }`}
                       >
                         {isDone ? <CheckCircle2 size={20}/> : <TrendingUp size={20} />}
                         {isDone ? 'Mission Success' : 'Confirm Mission Completion'}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer transition-none"></div>
                       </button>
                    </div>

                    {/* Checkpoint Intelligence (Every 7 Days) */}
                    {step.day % 7 === 0 && (
                      <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[40px] flex items-center gap-6 group/check relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/check:scale-110 transition-transform"><Award size={100} /></div>
                         <div className="w-14 h-14 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center shrink-0"><Sparkles size={28} /></div>
                         <div className="relative z-10">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1.5">Elite Checkpoint Signal</p>
                            <p className="text-sm font-black text-white leading-relaxed">{step.milestone}</p>
                         </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mentor Directive Console */}
      <div className="bg-slate-900 rounded-[48px] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
         <div className="absolute -bottom-20 -right-20 p-20 opacity-[0.02] group-hover:scale-110 transition-transform"><Brain size={300} /></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-24 h-24 rounded-[32px] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 shrink-0 relative">
               <div className="absolute inset-0 rounded-[32px] border-4 border-white/10 animate-pulse"></div>
               <Award size={48} className="text-white" />
            </div>
            <div className="space-y-4 text-center lg:text-left flex-1">
               <h4 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Mentor Directive: Phase {phases.indexOf(activePhase) + 1}</h4>
               <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
                 Operational analysis indicates you are synchronizing with the {activePhase} module. Focus on the high-fidelity outputs of the <span className="text-indigo-400 font-bold">Construction Quadrant (Build)</span>. Industry readiness requires tangible technical proof.
               </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 bg-black/20 px-8 py-4 rounded-3xl border border-white/5">
               <div className="text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Load</p>
                  <p className="text-lg font-black text-white">4.5h/Day</p>
               </div>
               <div className="w-px h-8 bg-white/5"></div>
               <div className="text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Role</p>
                  <p className="text-lg font-black text-indigo-400">{user.targetRole}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Roadmap;