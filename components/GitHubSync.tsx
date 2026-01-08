
import React, { useState } from 'react';
import { Github, X, Search, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
// Updated import to use analysisService
import { analysisService } from '../analysisService';
import { Skill, Project } from '../types';

type GitHubSyncProps = {
  // Updated prop type to accept the object containing both skills and projects
  onSkillsSynced: (result: { skills: Skill[], projects: Project[] }) => void;
  onClose: () => void;
};

export function GitHubSync({ onSkillsSynced, onClose }: GitHubSyncProps) {
  const [username, setUsername] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleSync = async () => {
    if (!username.trim()) return;
    setIsSyncing(true);
    setError(null);
    setStatus('Fetching public repositories...');
    
    try {
      // 1. Fetch repos from GitHub API
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('GitHub user not found');
        throw new Error('Failed to fetch repositories');
      }
      
      const repos = await response.json();
      
      if (repos.length === 0) {
        throw new Error('No public repositories found for this user');
      }

      setStatus(`Found ${repos.length} repositories. Analyzing skills with AI...`);

      // 2. Analyze with analysisService (Gemini under the hood)
      const extractedResult = await analysisService.analyzeGitHubRepos(repos);
      
      // Call onSkillsSynced with the full result object
      onSkillsSynced(extractedResult);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sync with GitHub. Please check the username.');
      console.error(err);
    } finally {
      setIsSyncing(false);
      setStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Github size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">GitHub Skill Sync</h3>
              <p className="text-xs text-white/70 font-medium">Analyze repos for technical proof</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              GitHub Username
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm text-slate-600 pl-10"
                placeholder="e.g. torvalds"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSync()}
              />
              <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">
              Note: Only public repositories will be analyzed.
            </p>
          </div>

          {status && !error && (
            <div className="p-4 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-medium border border-indigo-100 flex items-center gap-3 animate-pulse">
              <Loader2 size={16} className="animate-spin" />
              {status}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleSync}
              disabled={isSyncing || !username.trim()}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                isSyncing || !username.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isSyncing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Start Syncing
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Verification increases Evidence Score by up to 20%
          </p>
        </div>
      </div>
    </div>
  );
}
