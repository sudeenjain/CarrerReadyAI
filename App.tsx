import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Route as RouteIcon, 
  TrendingUp, 
  Briefcase, 
  Radio, 
  LogOut, 
  FileCheck, 
  Menu, 
  X as CloseIcon, 
  Zap, 
  Sparkles, 
  MessageSquare, 
  Mic,
  ChevronRight,
  Shield,
  BrainCircuit
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Analysis from './pages/Analysis';
import Roadmap from './pages/Roadmap';
import Interview from './pages/Interview';
import MarketPulse from './pages/MarketPulse';
import DigitalTwin from './pages/DigitalTwin';
import Report from './pages/Report';
import Feedback from './pages/Feedback';
import Jobs from './pages/Jobs';
import IntelligenceHub from './pages/IntelligenceHub';
import { CareerMentor } from './components/CareerMentor';
import { ResumeScanner } from './components/ResumeScanner';
import { GitHubSync } from './components/GitHubSync';
import { INITIAL_USER } from './constants';
import { UserProfile, Skill, Project } from './types';

const SidebarContent = ({ user, onOpenUpload, onLogout, closeMobileMenu }: { user: UserProfile, onOpenUpload: () => void, onLogout: () => void, closeMobileMenu?: () => void }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Mic, label: 'Interview Chamber', path: '/interview' },
    { icon: Zap, label: 'Opportunity Hub', path: '/jobs' },
    { icon: Target, label: 'Skill Analysis', path: '/analysis' },
    { icon: Radio, label: 'Market Pulse', path: '/pulse' },
    { icon: RouteIcon, label: 'Career Roadmap', path: '/roadmap' },
    { icon: TrendingUp, label: 'Digital Twin', path: '/twin' },
    { icon: BrainCircuit, label: 'Intelligence Hub', path: '/intelligence' },
    { icon: FileCheck, label: 'Readiness Audit', path: '/report' },
    { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#020617] border-r border-white/5">
      {/* Brand Section */}
      <div className="px-6 py-8 flex items-center">
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3.5 group cursor-pointer">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20 transform group-hover:rotate-6 transition-all duration-500">CR</div>
          <div className="flex flex-col">
            <h1 className="font-display font-black text-white tracking-tighter leading-none text-base">CareerReadyAI</h1>
            <p className="text-[8px] text-indigo-400 font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-1.5">
              <Shield size={10} className="shrink-0" /> <span className="truncate">Elite Architect</span>
            </p>
          </div>
        </Link>
      </div>
      
      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pt-2">
        <p className="px-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Architecture</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-white/5 text-white border border-white/10 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full"></div>
              )}
              <item.icon size={18} className={`${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'} transition-colors duration-300 shrink-0`} />
              <span className={`text-[10px] uppercase tracking-[0.15em] font-black ${isActive ? 'text-white' : 'text-inherit'}`}>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)] animate-pulse"></div>
              )}
            </Link>
          );
        })}
        
        {/* Action Button Section */}
        <div className="mt-8 pt-6 px-2 border-t border-white/5">
           <button 
            onClick={() => { onOpenUpload(); closeMobileMenu?.(); }}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-white bg-indigo-500/5 hover:bg-indigo-600 transition-all font-black border border-indigo-500/20 group relative overflow-hidden shadow-lg active:scale-95 duration-300"
           >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer transition-none"></div>
            <Sparkles size={16} className="relative z-10 group-hover:rotate-12 transition-transform text-indigo-400 group-hover:text-white shrink-0" />
            <span className="text-[9px] uppercase tracking-widest relative z-10">AI Skill Sync</span>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10 shrink-0" />
           </button>
        </div>
      </nav>

      {/* User Footer Section */}
      <div className="p-4 mt-auto border-t border-white/5 bg-[#020617]/50 backdrop-blur-xl">
        <div className="bg-white/[0.03] rounded-[24px] p-3 border border-white/5 flex items-center gap-3 hover:bg-white/[0.06] transition-colors cursor-default group">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-base shadow-inner shrink-0 group-hover:border-indigo-400/40 transition-colors">
             {user.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-100 truncate uppercase tracking-tight leading-none mb-1.5">{user.name || 'User'}</p>
            <div className="flex items-center gap-1.5">
              <div className="relative flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-green-500 animate-ping opacity-60"></div>
              </div>
              <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-none truncate">Architect Lvl {Math.floor((user.readinessScore || 0)/10)}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            title="Sign Out"
            className="p-2 text-slate-600 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/5 group/logout shrink-0 active:scale-90"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const location = useLocation();
  const pageTitle = {
    '/': 'Progress Tracker',
    '/interview': 'Interview Chamber',
    '/jobs': 'Opportunity Hub',
    '/analysis': 'Skill Gap Analysis',
    '/pulse': 'Live Market Pulse',
    '/roadmap': 'Career Roadmap',
    '/twin': 'Predictive Twin',
    '/report': 'Readiness Audit',
    '/feedback': 'Feedback Portal',
    '/intelligence': 'Intelligence Hub',
  }[location.pathname] || 'CareerReadyAI';

  return (
    <header className="h-20 nav-blur sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={onOpenMenu} 
          className="lg:hidden p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-95 flex items-center justify-center"
          aria-label="Open Menu"
        >
          <Menu size={18} />
        </button>
        <div className="flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-display font-black text-white tracking-tighter leading-none mb-1.5">{pageTitle}</h2>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="absolute w-2.5 h-2.5 rounded-full bg-green-500/40 animate-ping"></div>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Neural Connection Active</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <Link 
          to="/jobs" 
          className="hidden sm:flex items-center gap-2.5 px-6 py-2.5 bg-white text-[#020617] rounded-xl hover:bg-indigo-50 transition-all shadow-xl font-black text-[9px] uppercase tracking-widest active:scale-95 border border-white"
        >
          <Briefcase size={14} />
          <span>Match Feed</span>
        </Link>
        <div className="hidden sm:block w-px h-8 bg-white/10 mx-1"></div>
        <button 
          className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all group flex items-center justify-center"
          title="System Notifications"
        >
          <div className="relative">
            <Radio size={20} className="group-hover:animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#020617]"></div>
          </div>
        </button>
      </div>
    </header>
  );
};

type AppUser = UserProfile & { isOnboardingComplete: boolean };

const App: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('career_ready_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed) setUser(parsed);
      } catch (e) {
        localStorage.removeItem('career_ready_user');
      }
    }
  }, []);

  const handleLogin = (loginData: { name: string, email: string }) => {
    const newUser: AppUser = {
      ...INITIAL_USER,
      name: loginData.name,
      email: loginData.email,
      isOnboardingComplete: false,
    };
    setUser(newUser);
    localStorage.setItem('career_ready_user', JSON.stringify(newUser));
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data, isOnboardingComplete: true };
    setUser(updatedUser as AppUser);
    localStorage.setItem('career_ready_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('career_ready_user');
    window.location.hash = '/landing';
  };

  const handleSyncResult = (result: { skills: Skill[], projects?: Project[] }) => {
    setUser(prev => {
      if (!prev) return null;
      
      const skillMap = new Map();
      prev.currentSkills.forEach(s => skillMap.set(s.name.toLowerCase(), s));
      result.skills.forEach(s => skillMap.set(s.name.toLowerCase(), s));
      
      const projectMap = new Map();
      prev.projects.forEach(p => projectMap.set(p.name.toLowerCase(), p));
      if (result.projects) {
        result.projects.forEach(p => projectMap.set(p.name.toLowerCase(), p));
      }

      const updated = { 
        ...prev, 
        currentSkills: Array.from(skillMap.values()),
        projects: Array.from(projectMap.values())
      };
      
      localStorage.setItem('career_ready_user', JSON.stringify(updated));
      return updated as AppUser;
    });
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...updated };
      localStorage.setItem('career_ready_user', JSON.stringify(newUser));
      return newUser as AppUser;
    });
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-[#020617] text-slate-200">
        {user?.isOnboardingComplete && (
          <aside className="w-72 bg-[#020617] h-screen sticky top-0 flex flex-col hidden lg:flex shrink-0 z-40">
            <SidebarContent user={user} onOpenUpload={() => setIsUploadOpen(true)} onLogout={handleLogout} />
          </aside>
        )}

        {/* Mobile Menu Overlay */}
        {user?.isOnboardingComplete && isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div 
              className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300" 
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#020617] animate-in slide-in-from-left duration-500 flex flex-col shadow-2xl border-r border-white/5">
              <div className="flex justify-end p-5">
                 <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-2.5 text-slate-500 hover:text-white rounded-xl hover:bg-white/10 transition-all active:scale-95"
                  aria-label="Close Menu"
                 >
                    <CloseIcon size={18} />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent 
                  user={user} 
                  onOpenUpload={() => setIsUploadOpen(true)} 
                  onLogout={handleLogout} 
                  closeMobileMenu={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </aside>
          </div>
        )}
        
        <main className="flex-1 flex flex-col min-w-0">
          {user?.isOnboardingComplete && (
            <Header onOpenMenu={() => setIsMobileMenuOpen(true)} />
          )}
          <div className={`flex-1 overflow-x-hidden ${user?.isOnboardingComplete ? 'p-6 md:p-10 max-w-[1440px] mx-auto w-full main-content-area' : ''}`}>
            <Routes>
              <Route path="/landing" element={user ? <Navigate to={user.isOnboardingComplete ? "/" : "/onboarding"} /> : <Landing onLogin={handleLogin} />} />
              <Route path="/onboarding" element={user ? (user.isOnboardingComplete ? <Navigate to="/" /> : <Onboarding user={user} onComplete={handleOnboardingComplete} />) : <Navigate to="/landing" />} />
              <Route path="/" element={user?.isOnboardingComplete ? <Dashboard user={user} onOpenUpload={() => setIsUploadOpen(true)} onOpenGitHub={() => setIsGitHubOpen(true)} /> : <Navigate to="/landing" />} />
              <Route path="/interview" element={user?.isOnboardingComplete ? <Interview user={user} /> : <Navigate to="/landing" />} />
              <Route path="/analysis" element={user?.isOnboardingComplete ? <Analysis user={user} /> : <Navigate to="/landing" />} />
              <Route path="/roadmap" element={user?.isOnboardingComplete ? <Roadmap user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/landing" />} />
              <Route path="/pulse" element={user?.isOnboardingComplete ? <MarketPulse user={user} /> : <Navigate to="/landing" />} />
              <Route path="/twin" element={user?.isOnboardingComplete ? <DigitalTwin user={user} /> : <Navigate to="/landing" />} />
              <Route path="/report" element={user?.isOnboardingComplete ? <Report user={user} /> : <Navigate to="/landing" />} />
              <Route path="/feedback" element={user?.isOnboardingComplete ? <Feedback /> : <Navigate to="/landing" />} />
              <Route path="/jobs" element={user?.isOnboardingComplete ? <Jobs user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/landing" />} />
              <Route path="/intelligence" element={user?.isOnboardingComplete ? <IntelligenceHub /> : <Navigate to="/landing" />} />
            </Routes>
          </div>
          {user?.isOnboardingComplete && <CareerMentor user={user} />}
        </main>
      </div>
      {isUploadOpen && <ResumeScanner onSkillsExtracted={(skills) => handleSyncResult({ skills })} onClose={() => setIsUploadOpen(false)} />}
      {isGitHubOpen && <GitHubSync onSkillsSynced={(result) => handleSyncResult(result)} onClose={() => setIsGitHubOpen(false)} />}
    </Router>
  );
};

export default App;