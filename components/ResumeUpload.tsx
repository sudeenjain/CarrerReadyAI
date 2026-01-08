
import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, Loader2 } from 'lucide-react';
// Import analysisService from the new source
import { analysisService } from '../analysisService';
import { Skill } from '../types';

type ResumeUploadProps = {
  onSkillsExtracted: (skills: Skill[]) => void;
  onClose: () => void;
};

export function ResumeUpload({ onSkillsExtracted, onClose }: ResumeUploadProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      // Use analysisService for skill extraction
      const result = await analysisService.extractSkillsFromResume(text);
      onSkillsExtracted(result.skills);
      onClose();
    } catch (err) {
      setError('Failed to analyze resume. Please check your text or try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/5">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gradient-bg text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Resume Scanner</h3>
              <p className="text-xs text-white/70 font-medium">Extract skills instantly using Gemini Pro</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText size={16} className="text-indigo-500" />
              Paste Resume Text
            </label>
            <textarea
              className="w-full h-64 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-sm text-slate-600 dark:text-slate-100 dark:placeholder-slate-500 custom-scrollbar"
              placeholder="Paste your resume content here (Experience, Education, Projects...)"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                isAnalyzing || !text.trim()
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'gradient-bg text-white shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Start Skill Extraction
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-all border border-transparent dark:border-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-900 border-2 border-white dark:border-slate-800"></div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            Used by 2,000+ students this week
          </p>
        </div>
      </div>
    </div>
  );
}
