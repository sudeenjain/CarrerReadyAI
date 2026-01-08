
import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, Loader2, AlertTriangle, Edit3, Plus, Sparkles, Github, Linkedin, ArrowRight } from 'lucide-react';
// Updated import to use analysisService
import { analysisService } from '../analysisService';
import { Skill } from '../types';

type ResumeScannerProps = {
  onSkillsExtracted: (skills: Skill[]) => void;
  onClose: () => void;
};

export function ResumeScanner({ onSkillsExtracted, onClose }: ResumeScannerProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<'upload' | 'verify' | 'fallback'>('upload');
  const [extractedSkills, setExtractedSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateResumeContent = (content: string) => {
    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    if (words < 150) return "⚠️ Invalid document detected. A full Resume content usually contains at least 150 words.";
    
    const keywords = ['experience', 'education', 'skills', 'projects', 'internship', 'certifications', 'summary', 'work'];
    const found = keywords.filter(k => content.toLowerCase().includes(k));
    
    if (found.length < 2) return "⚠️ Invalid document detected. This looks like a marksheet or single certificate. Please upload your RESUME only (Experience, Skills, and Education sections).";
    return null;
  };

  const handleAnalyze = async () => {
    const validationError = validateResumeContent(text);
    if (validationError) {
      setError(validationError);
      setStep('fallback'); // Move to fallback if validation fails
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      // Use analysisService for extraction
      const result = await analysisService.extractSkillsFromResume(text);
      setExtractedSkills(result.skills);
      setStep('verify');
    } catch (err) {
      setError('AI Analysis failed. Document format unreadable.');
      setStep('fallback');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gradient-bg text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {step === 'upload' ? <Upload size={20} /> : step === 'fallback' ? <AlertTriangle size={20} /> : <Edit3 size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {step === 'upload' ? 'Resume Analysis Gate' : step === 'fallback' ? 'Identity Fallback' : 'Verified Expertise'}
              </h3>
              <p className="text-xs text-white/70 font-medium">
                {step === 'upload' ? 'Strict skill extraction for accuracy' : step === 'fallback' ? 'Resume failed? Use your social profile.' : 'Intelligence detected by AI'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <textarea
                  className="w-full h-64 p-6 rounded-[24px] border border-slate-100 dark:border-slate-700 outline-none transition-all resize-none text-sm placeholder:text-slate-300 dark:placeholder:text-slate-500 custom-scrollbar font-bold"
                  placeholder="Paste your resume content here..."
                  value={text}
                  onChange={(e) => { setText(e.target.value); setError(null); }}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
                className="w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 gradient-bg text-white shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]"
              >
                {isAnalyzing ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
                {isAnalyzing ? 'Gate Validation...' : 'Confirm & Scan'}
              </button>
            </div>
          )}

          {step === 'fallback' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="p-5 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-2xl text-xs font-bold border border-amber-100 dark:border-amber-800 flex items-start gap-3">
                <AlertTriangle size={18} className="shrink-0" />
                <div>
                  <p className="font-black text-sm mb-1">Resume could not be validated.</p>
                  <p className="leading-relaxed">{error || "Ensure you upload a professional experience document (Min 150 words)."}</p>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-center text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest">Continue with Fallback Options</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                       <Github className="text-slate-900 dark:text-slate-100" size={24} />
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Connect GitHub</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Use Code History</p>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                       <Linkedin className="text-blue-600 dark:text-blue-400" size={24} />
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Connect LinkedIn</p>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Use Professional Bio</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('upload')} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-transparent dark:border-slate-700">Try Resume Again</button>
                <button onClick={onClose} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                   Skip to Social Sync <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {extractedSkills.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-user-200">{skill.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase">{skill.level}</p>
                    </div>
                    <CheckCircle size={14} className="text-green-500" />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => { onSkillsExtracted(extractedSkills); onClose(); }}
                className="w-full py-5 gradient-bg text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]"
              >
                Confirm Intelligence
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
