
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
// Updated import to use analysisService
import { analysisService } from '../analysisService';
import { Radio, Flame, Zap, TrendingUp, ExternalLink, Globe, Loader2, AlertCircle } from 'lucide-react';

const MarketPulse: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [pulse, setPulse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPulse = async () => {
      setLoading(true);
      // Use analysisService to fetch live market pulse
      const data = await analysisService.fetchLiveMarketPulse(user.targetRole);
      setPulse(data);
      setLoading(false);
    };
    getPulse();
  }, [user.targetRole]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <div className="text-center">
          <p className="text-slate-800 font-bold">Scanning Global Market...</p>
          <p className="text-slate-500 text-sm animate-pulse">Grounding analysis with live search results</p>
        </div>
      </div>
    );
  }

  if (!pulse) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-800">Pulse Unavailable</h3>
        <p className="text-red-600">We couldn't reach the live market service. Try again in a few minutes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm overflow-hidden relative group">
        <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform">
          <Globe size={300} className="text-indigo-600" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black tracking-widest uppercase animate-pulse">
              <Radio size={12} />
              Live Industry Pulse
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Hiring Intel: {user.targetRole}</h2>
            <p className="text-slate-500 flex items-center gap-2">
              <Globe size={16} /> Verified market data for <strong>India Region (Q3 2024)</strong>
            </p>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-2xl text-white min-w-[240px]">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Avg. Market Salary</p>
            <p className="text-2xl font-black text-indigo-400">{pulse.salaryRange}</p>
            <p className="text-[10px] text-slate-500 mt-2 italic">Based on 10,000+ data points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hot Skills */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Flame size={20} className="text-orange-500" />
                Critical Hiring Requirements
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pulse.hotSkills.map((skill: string, idx: number) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all flex items-center justify-between group">
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600">{skill}</span>
                  <TrendingUp size={16} className="text-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="absolute bottom-0 right-0 p-8 opacity-10">
                <Zap size={150} />
             </div>
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Zap size={20} className="text-amber-400" />
               Emerging Trends
             </h3>
             <ul className="space-y-4 relative z-10">
               {pulse.emergingTrends.map((trend: string, idx: number) => (
                 <li key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-indigo-100 font-medium">{trend}</p>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* Sources & Sentiment */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Market Outlook</h4>
            <div className="p-4 rounded-2xl bg-slate-50 text-slate-600 text-sm leading-relaxed italic">
              "{pulse.marketOutlook}"
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
              <Globe size={14} />
              Grounding Sources
            </h4>
            <div className="space-y-3">
              {pulse.sources.map((url: string, idx: number) => (
                <a 
                  key={idx} 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 text-[10px] font-medium text-indigo-600 truncate flex items-center justify-between group"
                >
                  {new URL(url).hostname}
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
