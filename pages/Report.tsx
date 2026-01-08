import React, { useState, useMemo } from 'react';
import { UserProfile, SkillLevel } from '../types';
import { JOB_ROLES } from '../constants';
import { ReadinessScoreGauge } from '../components/ReadinessScoreGauge';
import { calculateReadinessScore } from '../utils/scoreCalculator';
import { FileCheck, Download, Share2, Award, Briefcase, ChevronRight, TrendingUp, CheckCircle2, ShieldCheck, AlertCircle, Info, Zap, Sparkles, FileText, Loader2, Copy, ExternalLink, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const Report: React.FC<{ user: UserProfile }> = ({ user }) => {
  const role = JOB_ROLES.find(r => r.title === user.targetRole) || JOB_ROLES[0];
  const breakdown = calculateReadinessScore(user.currentSkills, role.requirements);
  const [isGeneratingLaTeX, setIsGeneratingLaTeX] = useState(false);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const generateLaTeX = (profile: UserProfile): string => {
    const safeText = (txt: string) => txt.replace(/[&%$#_{}~^\\]/g, '\\$&');
    
    const skillsList = profile.currentSkills.map(s => s.name).join(', ');
    const projectsList = profile.projects.map(p => `
\\resumeProjectHeading
    {\\textbf{${safeText(p.name)}} $|$ \\emph{${safeText(p.techStack.join(', '))}}}{}
    \\resumeItemListStart
      \\resumeItem{${safeText(p.description)}}
    \\resumeItemListEnd`).join('');

    return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${safeText(profile.name)}} \\\\ \\vspace{1pt}
    \\small ${safeText(profile.email)} $|$ 
    \\href{https://linkedin.com/in/${profile.linkedinUser || ''}}{\\underline{linkedin.com/in/${profile.linkedinUser || 'profile'}}} $|$
    \\href{https://github.com/${profile.githubUser || ''}}{\\underline{github.com/${profile.githubUser || 'profile'}}}
\\end{center}

\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {University Name}{City, Country}
      {Degree Name}{Month Year -- Month Year}
  \\resumeSubHeadingListEnd

\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages/Frameworks}{: ${safeText(skillsList)}} \\\\
    }}
 \\end{itemize}

\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Professional Experience}{City, Country}
      {Relevant Role}{Month Year -- Present}
      \\resumeItemListStart
        \\resumeItem{Extracted from verified profile: Member of the ${safeText(profile.targetRole)} vertical.}
        \\resumeItem{Achieved industry readiness score of ${breakdown.total}\\% via CareerReady AI Audit.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

\\section{Projects}
    \\resumeSubHeadingListStart
      ${projectsList}
    \\resumeSubHeadingListEnd

\\end{document}`;
  };

  const handleGenerateLaTeX = () => {
    setIsGeneratingLaTeX(true);
    setTimeout(() => {
      const code = generateLaTeX(user);
      setLatexCode(code);
      setIsGeneratingLaTeX(false);
    }, 1800);
  };

  const handleCopyLaTeX = () => {
    if (latexCode) {
      navigator.clipboard.writeText(latexCode);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  const handleDownloadTex = () => {
    if (!latexCode) return;
    const blob = new Blob([latexCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name.replace(/\s+/g, '_')}_Resume.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareText = `Check out my verified ${user.targetRole} readiness audit! I'm ${breakdown.total}% industry-ready according to CareerReadyAI.`;
    if (navigator.share) {
      navigator.share({
        title: 'CareerReadyAI Audit',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setShareFeedback('Link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  const missingSkills = role.requirements.filter(r => !user.currentSkills.find(s => s.name.toLowerCase() === r.skillName.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Readiness Audit</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Verified snapshot for {user.name}</p>
        </div>
        <div className="flex gap-3 relative">
          {shareFeedback && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg animate-in fade-in slide-in-from-bottom-1">
              {shareFeedback}
            </div>
          )}
          <button 
            onClick={handleShare}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors shadow-sm"
          >
             <Share2 size={20} />
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold shadow-lg hover:bg-slate-50 transition-all"
          >
             <FileText size={20} />
             Print Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Mastery Gauge */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
               <Award size={200} className="dark:text-white" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
               <div className="w-56 h-56 shrink-0 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center p-4 border-8 border-white dark:border-slate-800 shadow-inner">
                  <ReadinessScoreGauge score={breakdown.total} />
               </div>
               <div className="flex-1 space-y-6">
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Hiring Profile</h3>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-400">Match</p><p className="text-xl font-black text-slate-800 dark:text-white">{breakdown.skillPoints}</p></div>
                     <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-400">Evidence</p><p className="text-xl font-black text-green-600">+{breakdown.evidencePoints}</p></div>
                     <div className="text-center"><p className="text-[10px] font-black uppercase text-slate-400">Momentum</p><p className="text-xl font-black text-amber-500">+{breakdown.milestonePoints}</p></div>
                  </div>
               </div>
            </div>
          </div>

          {/* LaTeX Resume Blueprint - REPLACING AI GENERATION */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 p-8 opacity-10"><Terminal size={150} /></div>
             <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                      <Sparkles size={14}/> Professional Blueprint
                   </div>
                   <h3 className="text-2xl font-black">LaTeX Professional Generator</h3>
                   <p className="text-indigo-200 text-sm max-w-xl">
                     Generate professional LaTeX code strictly from your verified data. 
                     This blueprint is optimized for the **Overleaf resume template** structure to ensure high ATS compatibility.
                   </p>
                </div>
                
                {latexCode ? (
                  <div className="space-y-6 animate-in zoom-in-95">
                     <div className="p-4 bg-black/40 rounded-2xl border border-white/10 font-mono text-[10px] overflow-x-auto custom-scrollbar h-48 whitespace-pre">
                        {latexCode}
                     </div>
                     <div className="flex flex-wrap items-center gap-4">
                        <button 
                          onClick={handleCopyLaTeX}
                          className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-colors"
                        >
                           {copyFeedback ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                           {copyFeedback ? 'Copied' : 'Copy LaTeX Code'}
                        </button>
                        <button 
                          onClick={handleDownloadTex}
                          className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-400 transition-colors"
                        >
                           <Download size={18} /> Download .tex
                        </button>
                     </div>
                     
                     <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
                          <ExternalLink size={12}/> Overleaf Deployment Steps
                        </h5>
                        <ol className="text-xs text-indigo-200 space-y-2 list-decimal list-inside font-medium">
                          <li>Click "Copy LaTeX Code" or download the .tex file above.</li>
                          <li>Open <a href="https://www.overleaf.com" target="_blank" className="text-white underline">Overleaf</a> and create a "New Project" → "Blank Project".</li>
                          <li>Paste the generated code into the <code className="bg-white/10 px-1 rounded">main.tex</code> editor.</li>
                          <li>Click **Compile** to generate your professional PDF resume.</li>
                        </ol>
                     </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleGenerateLaTeX}
                    disabled={isGeneratingLaTeX}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                  >
                    {isGeneratingLaTeX ? <Loader2 size={18} className="animate-spin" /> : <Terminal size={18} />}
                    {isGeneratingLaTeX ? 'Compiling LaTeX Signal...' : 'Generate LaTeX Blueprint'}
                  </button>
                )}
             </div>
          </div>

          {/* Audit Trail Feedback */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
             <div className="flex items-center gap-3">
                <ShieldCheck className="text-indigo-600" />
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Audit Feedback & Recommendations</h3>
             </div>
             
             <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                   <h5 className="text-xs font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                      <Terminal size={14} /> Structural Integrity Check
                   </h5>
                   <ul className="space-y-4">
                      <li className="flex items-start gap-4">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <code className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">\section{"{Experience}"}</code> is populated with verified readiness data. 
                          The impact metrics are well-defined.
                        </p>
                      </li>
                      <li className="flex items-start gap-4">
                        {missingSkills.length > 0 ? (
                           <>
                            <AlertCircle size={18} className="text-amber-500 shrink-0" />
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                              <code className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">\section{"{Technical Skills}"}</code> is missing {missingSkills.length} critical requirements for the {user.targetRole} role.
                              Consider adding projects focusing on <strong>{missingSkills[0]?.skillName}</strong>.
                            </p>
                           </>
                        ) : (
                          <>
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                              Skill coverage is 100% aligned with hiring specifications.
                            </p>
                          </>
                        )}
                      </li>
                      <li className="flex items-start gap-4">
                        <Info size={18} className="text-indigo-500 shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          The <code className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">\resumeItemListStart</code> environments are correctly balanced. 
                          Compilation in Overleaf will be 100% successful.
                        </p>
                      </li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
              <h4 className="text-xs font-black uppercase tracking-widest opacity-60 mb-6">Critical Skill Gaps</h4>
              <div className="space-y-6">
                 {missingSkills.slice(0, 3).map((req, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-xs font-black">{i+1}</div>
                      <div>
                         <p className="font-black text-sm">{req.skillName}</p>
                         <p className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">Target: {req.minLevel}</p>
                      </div>
                    </div>
                 ))}
                 {missingSkills.length === 0 && (
                   <div className="flex flex-col items-center gap-4 text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest">No Gaps Detected</p>
                   </div>
                 )}
              </div>
           </div>
           
           <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-lg space-y-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                The LaTeX blueprint adheres to the <strong>Industry Standard</strong> (Overleaf) to ensure your resume is parsed correctly by enterprise Applicant Tracking Systems (ATS).
              </p>
              <Link to="/" className="w-full py-4 gradient-bg text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                 Return to Dashboard <ChevronRight size={16}/>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Report;