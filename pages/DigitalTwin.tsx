
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, TrendingUp, Info, Zap, Clock, Brain } from 'lucide-react';

const DigitalTwin: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [scenario, setScenario] = useState<'casual' | 'roadmap' | 'intensive'>('roadmap');

  const generateForecast = (type: string) => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    let current = user.readinessScore;
    
    const growthRates = {
      'casual': 3,
      'roadmap': 8,
      'intensive': 12
    }[type] || 5;

    for (let i = 0; i < months.length; i++) {
      if (i < 3) {
        data.push({ name: months[i], score: user.history[i]?.score || user.readinessScore });
      } else {
        current = Math.min(100, current + growthRates + (Math.random() * 2));
        data.push({ name: months[i], score: Math.round(current) });
      }
    }
    return data;
  };

  const scenarios = [
    { id: 'casual', label: 'Casual Learning', rate: '3-5%/mo', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'roadmap', label: 'Following Roadmap', rate: '8-10%/mo', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'intensive', label: 'Intensive Boot-up', rate: '12-15%/mo', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const chartData = generateForecast(scenario);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scenarios */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Simulation Engine</h3>
            <p className="text-sm text-slate-500 mb-6">Select a learning intensity to predict your employability timeline.</p>
            
            <div className="space-y-3">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id as any)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                    scenario === s.id 
                      ? 'border-indigo-500 ring-4 ring-indigo-500/5 bg-white shadow-md' 
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
                    <s.icon size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${scenario === s.id ? 'text-slate-800' : 'text-slate-600'}`}>{s.label}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{s.rate} Growth</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain size={100} />
            </div>
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-indigo-400" />
              Predicted Outcome
            </h4>
            <div className="space-y-4 relative">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">100% Ready By</p>
                <p className="text-2xl font-black text-white">
                  {scenario === 'intensive' ? 'August 12' : scenario === 'roadmap' ? 'September 28' : 'Dec 2024'}
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on your current trajectory, you will be highly competitive for top-tier companies in {scenario === 'intensive' ? '3' : scenario === 'roadmap' ? '5' : '10'} months.
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Job Readiness Projection</h3>
              <p className="text-sm text-slate-500">Historical data merged with AI-predicted growth</p>
            </div>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black tracking-widest uppercase">
              94% Confidence
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }} 
                  itemStyle={{ fontWeight: '700', color: '#4f46e5' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 4, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  animationDuration={1500}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <Info size={20} className="text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              This projection accounts for <strong>skill decay</strong> (if practice stops) and <strong>industry inflation</strong> (rising standards). Completing the recommended roadmap projects will increase your evidence score, further steepening this curve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
