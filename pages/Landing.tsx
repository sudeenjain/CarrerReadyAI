import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Network, 
  Mic, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Landing: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<{ code?: string, message: string } | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);

  // Handle scrolling after the DOM view might have changed (e.g. closing login)
  useEffect(() => {
    if (!showLogin && pendingScrollId) {
      // Delay slightly to allow re-render and animations to settle
      const timer = setTimeout(() => {
        const el = document.getElementById(pendingScrollId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setPendingScrollId(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showLogin, pendingScrollId]);

  const handleFirebaseLogin = async () => {
    if (!agreedToTerms) {
      setError({ message: "Mandatory: You must agree to the Terms & Conditions to proceed." });
      return;
    }
    
    setIsAuthenticating(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      onLogin({
        name: user.displayName || 'Architect',
        email: user.email || '',
        picture: user.photoURL || ''
      });
      
      navigate('/onboarding');
    } catch (err: any) {
      console.error("Firebase Auth Error:", err);
      let friendlyMessage = "Failed to establish secure link via Firebase.";
      if (err.code === 'auth/unauthorized-domain') {
        friendlyMessage = "This environment domain is not whitelisted in the Security Registry.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        friendlyMessage = "Authentication window was closed before completion.";
      }
      setError({ code: err.code, message: friendlyMessage });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGuestLogin = () => {
    if (!agreedToTerms) {
      setError({ message: "Mandatory: You must agree to the Terms & Conditions to proceed." });
      return;
    }
    onLogin({ name: 'Architect Guest', email: 'guest@careerready.ai', picture: '' });
    navigate('/onboarding');
  };

  const scrollToSection = (id: string) => {
    if (showLogin) {
      setPendingScrollId(id);
      setShowLogin(false);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const features = [
    {
      icon: Cpu,
      title: "Evidence Engine",
      desc: "Deep-scans GitHub footprints and documentation to verify technical competency beyond keywords."
    },
    {
      icon: Network,
      title: "Gap Synthesis",
      desc: "Real-time mapping of your current stack against live hiring benchmarks from Tier-1 tech firms."
    },
    {
      icon: Mic,
      title: "Native Audio Drills",
      desc: "Low-latency voice interviews powered by Gemini 2.5 for sub-second technical stress testing."
    }
  ];

  return (
    <div className="bg-[#020617] min-h-screen relative overflow-x-hidden font-sans selection:bg-indigo-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.12)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <nav className="flex items-center justify-between py-6 mt-6 px-8 rounded-full glass-prestige animate-in fade-in slide-in-from-top-4 duration-1000">
           <div className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-105 duration-500" onClick={() => scrollToSection('hero-section')}>
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 tracking-tighter group-hover:rotate-6 transition-transform">CR</div>
              <span className="text-lg font-black text-white tracking-tight font-display">CareerReadyAI</span>
           </div>
           
           <div className="hidden md:flex items-center gap-10">
              <button 
                onClick={() => scrollToSection('hero-section')}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:tracking-[0.3em] transition-all duration-500"
              >
                Manifesto
              </button>
              <button 
                onClick={() => scrollToSection('features-section')}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:tracking-[0.3em] transition-all duration-500"
              >
                Technology
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className="px-8 py-2.5 rounded-full bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                Sign In
              </button>
           </div>
        </nav>

        {!showLogin ? (
          <div className="animate-in fade-in duration-1000">
            <div id="hero-section" className="flex flex-col items-center text-center pt-32 pb-48 scroll-mt-32">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/5 text-indigo-400 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-indigo-500/20 mb-16 shadow-[0_0_20px_rgba(79,70,229,0.05)] animate-in slide-in-from-bottom-4 duration-1000 animate-glow">
                <Sparkles size={12} className="animate-pulse" />
                <span>Next Gen Career Architecture</span>
              </div>
              
              <h1 className="text-6xl md:text-[140px] font-display font-black text-white tracking-tighter leading-[0.85] mb-12 animate-in slide-in-from-bottom-12 duration-1000 hover:scale-[1.01] transition-transform cursor-default">
                Bridge the <br /> 
                <span className="text-slate-500/50 italic font-light hover:text-indigo-400/50 transition-colors duration-700">Employment Gap.</span>
              </h1>
              
              <p className="max-w-2xl text-xl text-slate-400 font-medium leading-relaxed mb-16 px-4 animate-in fade-in duration-1000 delay-300 slide-in-from-bottom-8">
                Land your dream role with the world's most advanced AI-powered career navigator. <br className="hidden md:block"/> 
                Analyze gaps, verify skills, and follow ultra-personalized roadmaps.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in duration-1000 delay-500 slide-in-from-bottom-4">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-slate-100 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95 transition-all shadow-2xl shadow-white/10 group"
                >
                  Start Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="px-12 py-6 bg-slate-900/50 backdrop-blur-md border border-white/5 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 hover:-translate-y-1 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div id="features-section" className="py-32 grid grid-cols-1 md:grid-cols-3 gap-8 scroll-mt-32">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className="p-10 rounded-[40px] bg-slate-900/40 border border-white/5 backdrop-blur-sm group hover:border-indigo-500/30 hover:-translate-y-2 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <f.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-indigo-400 transition-colors">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium text-sm">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto pt-48 animate-in zoom-in-95 duration-500 mb-48">
            <div className="bg-[#0f172a]/80 backdrop-blur-2xl p-10 md:p-14 rounded-[40px] border border-white/10 shadow-2xl relative text-center group">
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
              >
                Back
              </button>
              
              <div className="mb-12">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500">CR</div>
                <h2 className="text-3xl font-display font-black text-white tracking-tight mb-2">Architect Access.</h2>
                <p className="text-slate-400 text-sm font-medium">Synchronize with Firebase to unlock the CareerReadyAI ecosystem.</p>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest leading-relaxed text-left flex flex-col gap-3 animate-in shake">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} />
                      <span>Security Notification</span>
                    </div>
                    <p>{error.message}</p>
                    {error.code === 'auth/unauthorized-domain' && (
                      <button 
                        onClick={handleGuestLogin}
                        className="mt-2 w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        Bypass Domain Security <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="w-4 h-4 rounded border-white/10 bg-black/20 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <label htmlFor="terms" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                    I agree and have read the <span className="text-indigo-400 underline decoration-indigo-500/30">Terms & Conditions</span>
                  </label>
                </div>

                <button 
                  onClick={handleFirebaseLogin}
                  disabled={isAuthenticating}
                  className={`w-full py-5 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-white/5 flex items-center justify-center gap-3 relative overflow-hidden group/btn ${!agreedToTerms && 'opacity-50 grayscale cursor-not-allowed'}`}
                >
                  {isAuthenticating ? (
                    <div className="flex items-center gap-3">
                      <Loader2 size={18} className="animate-spin text-indigo-600" />
                      Neural Sync Active...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                        <path fill="none" d="M0 0h48v48H0z"/>
                      </svg>
                      Sign In with Google
                    </div>
                  )}
                  {!isAuthenticating && agreedToTerms && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer transition-transform"></div>
                  )}
                </button>
                
                <div className="flex items-center gap-3 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl text-[10px] font-bold text-indigo-400 leading-relaxed uppercase tracking-tight text-left">
                  <ShieldCheck size={20} className="shrink-0" />
                  <span>Secure Firebase Auth 2.0 active. Your architectural data is persisted to your private local vault.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;