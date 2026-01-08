
import React from 'react';
import { UserProfile, JobRequirement, SkillLevel, SkillPriority, GapAnalysis } from '../types';
import { JOB_ROLES } from '../constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle2, MinusCircle, Info } from 'lucide-react';

const SkillGapAnalysis: React.FC<{ user: UserProfile }> = ({ user }) => {
  const role = JOB_ROLES.find(r => r.title === user.targetRole) || JOB_ROLES[0];
  
  const analysis: GapAnalysis[] = role.requirements.map(req => {
    const userSkill = user.currentSkills.find(s => s.name === req.skillName);
    let status: 'Strong' | 'Partial' | 'Missing' = 'Missing';
    
    if (userSkill) {
      const levels = [SkillLevel.BASIC, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED];
      const userLevelIdx = levels.indexOf(userSkill.level);
      const reqLevelIdx = levels.indexOf(req.minLevel);
      
      if (userLevelIdx >= reqLevelIdx) status = 'Strong';
      else if (userLevelIdx >= 0) status = 'Partial';
    }
    
    return {
      skillName: req.skillName,
      status,
      currentLevel: userSkill?.level || 'None',
      requiredLevel: req.minLevel,
      priority: req.priority
    };
  });

  const chartData = analysis.map(a => ({
    subject: a.skillName,
    A: a.currentLevel === 'None' ? 0 : (a.currentLevel === SkillLevel.BASIC ? 33 : (a.currentLevel === SkillLevel.INTERMEDIATE ? 66 : 100)),
    B: a.requiredLevel === SkillLevel.BASIC ? 33 : (a.requiredLevel === SkillLevel.INTERMEDIATE ? 66 : 100),
    fullMark: 100,
  }));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Visualization */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm sticky top-24">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800">Skill Coverage Visualization</h3>
            <p className="text-sm text-slate-500">Comparing your expertise vs. industry benchmark</p>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Radar
                  name="Current Skills"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Required Skills"
                  dataKey="B"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-xs font-semibold text-slate-600">You</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <span className="text-xs font-semibold text-slate-600">Requirement</span>
            </div>
          </div>
        </div>

        {/* Matrix */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              Skill Gap Matrix
              <Info size={18} className="text-slate-300" />
            </h3>
            
            <div className="space-y-4">
              {analysis.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className={`p-2 rounded-xl ${
                    item.status === 'Strong' ? 'bg-green-100 text-green-600' :
                    item.status === 'Partial' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {item.status === 'Strong' ? <CheckCircle2 size={24} /> :
                     item.status === 'Partial' ? <AlertCircle size={24} /> : <MinusCircle size={24} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-slate-800 truncate">{item.skillName}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                        item.priority === SkillPriority.CRITICAL ? 'bg-red-50 text-red-600' :
                        item.priority === SkillPriority.IMPORTANT ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <p>Current: <span className="font-bold text-slate-700">{item.currentLevel}</span></p>
                      <p>Target: <span className="font-bold text-slate-700">{item.requiredLevel}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
            <h4 className="font-bold text-indigo-900 mb-2">AI Recommendation</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Prioritize <strong>{analysis.filter(a => a.status === 'Missing' && a.priority === SkillPriority.CRITICAL)[0]?.skillName || 'Next.js'}</strong> first. This is a critical gap for {user.targetRole} roles and will boost your readiness score by ~12 points upon completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
