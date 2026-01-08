
import React, { useMemo } from 'react';
import { UserProfile, RoadmapStep } from '../types';
import { ReadinessScoreGauge } from '../components/ReadinessScoreGauge';
import { calculateReadinessScore } from '../utils/scoreCalculator';
import { JOB_ROLES } from '../constants';
import { Zap, Trophy, ChevronRight, Plus, Github, Flame, ShieldCheck, Sparkles, Star, TrendingUp, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ 
  user: UserProfile, 
  onOpenUpload: () => void,
  onOpenGitHub: () => void 
}> = ({ user, onOpenUpload, onOpenGitHub }) => {
  const role = JOB_ROLES.find(r => r.title === user.targetRole) || JOB_ROLES[0];
  
  // Total potential tasks in a 45-day roadmap (4 per day)
  const totalRoadmapTasks = 45 * 4;
  
  // Extract completed roadmap tasks from completedResources
  const roadmapCompletions = (user.completedResources || []).filter(k => 
    k.match(/^day-\d+-(learn|practice|build|review)$/)
  ).length;

  const breakdown = calculateReadinessScore(
    user.currentSkills, 
    role.requirements, 
    roadmapCompletions,
    totalRoadmapTasks
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-up duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mastery Overview */}
        <div className="lg:col-span-2 bg-[#0f172a]/60 backdrop-blur-xl rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
            <Sparkles size={180} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-56 h-56 shrink-0 relative">
              <ReadinessScoreGauge score={breakdown.total} />
            </div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                  Neural Scan Synchronized
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Architect Progress, {user.name.split(' ')[0]}</h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  Your <span className="text-white">Mastery Score</span> is strictly cumulative. You have unlocked <span className="text-indigo-400 font-bold">{breakdown.total}%</span> of the {user.targetRole} ecosystem.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  <Flame size={14} />
                  <span>{user.streak} Day Streak</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span>Level {Math.floor(breakdown.total/10)} Seeker</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global XP Stats & Evidence Sync */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#020617] rounded-[32px] p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
               <Zap size={100} />
            </div>
            <h4 className="font-black text-[10px] uppercase tracking-widest text-indigo-400 mb-6">Total Achievement XP</h4>
            <div className="flex items-end gap-3">
               <span className="text-6xl font-black">{breakdown.total * 12}</span>
               <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Points</span>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Industry Ready Velocity</p>
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp size={12} />
                <span className="text-[10px] font-black">Accelerated</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onOpenGitHub}
            className="bg-[#0f172a]/40 backdrop-blur-md rounded-[32px] p-6 border border-white/5 hover:border-indigo-500/30 transition-all group text-left w-full"
          >
            <h4 className="font-black text-slate-100 text-[10px] uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
              <Github size={14} className="group-hover:rotate-12 transition-transform" /> Evidence Pulse
            </h4>
            <div className="space-y-2">
               <p className="text-xs font-bold text-slate-200">GitHub AI Verification</p>
               <p className="text-[10px] text-slate-500 font-medium">Deep-scan repositories to verify technical expertise signals.</p>
               <div className="flex items-center gap-1.5 pt-2 text-indigo-400">
                  <span className="text-[10px] font-black uppercase tracking-widest">Sync Evidence</span>
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </button>

          <Link to="/intelligence" className="bg-[#0f172a]/40 backdrop-blur-md rounded-[32px] p-6 border border-white/5 hover:border-indigo-500/30 transition-all group">
            <h4 className="font-black text-indigo-400 text-[10px] uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
              <BrainCircuit size={14} /> Strategic Intelligence
            </h4>
            <div className="space-y-2">
               <p className="text-xs font-bold text-slate-200">AI Ensemble Ready</p>
               <p className="text-[10px] text-slate-500 font-medium">Explore the Multi-Model Roadmap and Skill Decay predictions.</p>
               <div className="flex items-center gap-1.5 pt-2 text-indigo-400">
                  <span className="text-[10px] font-black uppercase tracking-widest">View Blueprint</span>
                  <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Achievements List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-2xl font-black text-white tracking-tighter">Verified Masteries</h4>
            <Link to="/analysis" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Audit All Skills</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.currentSkills.slice(0, 6).map((skill, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <div>
                    <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">{skill.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Verified via {skill.source}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-white/5">
                  {skill.level}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Unlocks */}
        <div className="space-y-8">
          <h4 className="text-2xl font-black text-white tracking-tighter px-2">Next Unlocks</h4>
          <div className="space-y-4">
            {role.requirements.filter(req => !user.currentSkills.some(s => s.name.toLowerCase() === req.skillName.toLowerCase())).slice(0, 4).map((req, i) => (
              <Link key={i} to="/roadmap" className="flex items-center gap-5 p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <Sparkles size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{req.skillName}</p>
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">+12 Mastery Points</p>
                </div>
                <ChevronRight size={16} className="text-slate-700 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
