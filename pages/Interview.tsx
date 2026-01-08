import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { UserProfile } from '../types';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  Sparkles, 
  User, 
  Bot, 
  Loader2, 
  Play, 
  ShieldAlert, 
  Award, 
  AudioLines as WaveIcon, 
  Clock, 
  Zap,
  Activity
} from 'lucide-react';

// Manual base64 decoding implementation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual base64 encoding implementation
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Manual audio decoding logic
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Interview: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<'listening' | 'thinking' | 'responding' | 'idle'>('idle');
  const [transcript, setTranscript] = useState<{ role: 'user' | 'model', text: string, timestamp: string }[]>([]);
  
  // Unified display buffers
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [speechTimer, setSpeechTimer] = useState(0);
  
  const currentInputRef = useRef('');
  const currentOutputRef = useRef('');
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const segmentIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Handle Turn End Logic (Silence or Segment Limit)
  const commitTurn = () => {
    if (!currentInputRef.current && !currentOutputRef.current) return;
    
    setTranscript(prev => [
      ...prev,
      ...(currentInputRef.current ? [{ role: 'user' as const, text: currentInputRef.current, timestamp: new Date().toLocaleTimeString() }] : []),
      ...(currentOutputRef.current ? [{ role: 'model' as const, text: currentOutputRef.current, timestamp: new Date().toLocaleTimeString() }] : [])
    ]);

    currentInputRef.current = '';
    currentOutputRef.current = '';
    setCurrentInput('');
    setCurrentOutput('');
    setSpeechTimer(0);
    setStatus('idle');
  };

  const startInterview = async () => {
    setIsConnecting(true);
    setCurrentInput('');
    setCurrentOutput('');
    currentInputRef.current = '';
    currentOutputRef.current = '';
    setSpeechTimer(0);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } 
          },
          systemInstruction: `You are an elite technical interviewer at a Tier-1 tech company. 
          Interviewing: ${user.name} for ${user.targetRole}. 
          
          CONSTRAINTS:
          1. WAIT for the user to be silent for at least 2 seconds before responding.
          2. Consolidate your response into one clear block. 
          3. Do not interrupt if the user pauses briefly.
          
          Start by greeting the user and asking their first core technical challenge question.`,
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setStatus('listening');
            
            // Turn Duration Monitoring (45s Limit)
            segmentIntervalRef.current = setInterval(() => {
              setSpeechTimer(prev => {
                if (prev >= 45) {
                  // Segment limit reached - force commit visual turn
                  setStatus('thinking');
                  return 45;
                }
                return prev + 1;
              });
            }, 1000);

            const source = inputCtx.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (speechTimer >= 45) return; // Cut off mic input visually if segment limit reached
              
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlobData = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: pcmBlobData, mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Audio Playback Handler
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              setStatus('responding');
              const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // User Input Transcription - Unified Box & Silence Detection
            if (msg.serverContent?.inputTranscription) {
              setStatus('listening');
              currentInputRef.current += msg.serverContent.inputTranscription.text;
              setCurrentInput(currentInputRef.current);

              // 2-Second Silence Timer
              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = setTimeout(() => {
                setStatus('thinking');
              }, 2000);
            }

            // Model Output Transcription - Consolidated Box
            if (msg.serverContent?.outputTranscription) {
              currentOutputRef.current += msg.serverContent.outputTranscription.text;
              setCurrentOutput(currentOutputRef.current);
            }

            // Turn Completion Signal
            if (msg.serverContent?.turnComplete) {
              commitTurn();
              setStatus('listening');
            }

            // Interruption Protocol
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopInterview(),
          onerror: (e) => console.error("Neural Interface Error:", e)
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopInterview = () => {
    setIsActive(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    sessionRef.current?.close();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (segmentIntervalRef.current) clearInterval(segmentIntervalRef.current);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-100 dark:border-red-900/30">
            <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-red-500 animate-ping' : 'bg-slate-300'}`}></div>
            Secure Interview Protocol v2.5
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            The <span className="gradient-text">Architect's Chamber.</span>
          </h2>
        </div>
        
        {isActive && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-6 animate-in slide-in-from-right-4">
            <div className="text-center px-4 border-r border-slate-100 dark:border-slate-800">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Turn Timer</p>
              <div className={`flex items-center gap-2 font-black text-xl ${speechTimer > 35 ? 'text-red-500' : 'text-indigo-600'}`}>
                <Clock size={18} />
                {45 - speechTimer}s
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <div className="px-4 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                {status}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Info & Visualizer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/10">
             <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform"><Bot size={200} /></div>
             <div className="relative z-10 space-y-8">
                <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl transition-all duration-500 ${status === 'responding' ? 'bg-green-500 scale-110' : 'bg-indigo-500'}`}>
                  <Bot size={48} className={status === 'responding' ? 'animate-bounce' : ''} />
                </div>
                <div>
                   <h3 className="text-2xl font-black tracking-tight">Evaluator Puck</h3>
                   <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Tier-1 Silicon Valley Logic</p>
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <ShieldAlert size={16} className="text-red-400" />
                      <span>Silence Buffer: 2.0s</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <Zap size={16} className="text-amber-400" />
                      <span>Segment Limit: 45s</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                      <Activity size={16} className="text-green-400" />
                      <span>Live Scoring: Active</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center space-y-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
               Neural Signal detected via {user.targetRole} benchmark.
             </p>
          </div>
        </div>

        {/* Unified Conversation Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 flex flex-col min-h-[600px] relative overflow-hidden shadow-2xl">
            {!isActive && !isConnecting ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10 animate-in zoom-in-95">
                <div className="relative">
                   <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 ring-[24px] ring-indigo-50/50 dark:ring-indigo-900/10">
                      <Play size={56} className="ml-2" />
                   </div>
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                      <Zap size={14} className="text-white fill-white" />
                   </div>
                </div>
                <div className="space-y-4 max-w-sm">
                   <h3 className="text-2xl font-black dark:text-white tracking-tight">System Ready.</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                     Initiate connection to begin your high-stakes technical drill. Neural Link will auto-calibrate to your profile.
                   </p>
                </div>
                <button 
                  onClick={startInterview} 
                  className="px-16 py-6 gradient-bg text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Initiate Secure Connection
                </button>
              </div>
            ) : isConnecting ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-8 animate-in fade-in">
                 <div className="relative">
                    <Loader2 size={80} className="animate-spin text-indigo-600" />
                    <Bot size={32} className="absolute inset-0 m-auto text-indigo-600" />
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-[12px] font-black uppercase tracking-[0.4em] text-indigo-600 animate-pulse">Syncing Neural Link...</p>
                    <p className="text-xs font-bold text-slate-400">Negotiating latency with Gemini 2.5 Flash</p>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-8 md:p-12">
                 {/* Transcription Feed */}
                 <div className="flex-1 overflow-y-auto space-y-10 px-4 custom-scrollbar">
                    {transcript.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                        <div className="flex items-center gap-3 mb-2 px-1">
                           {m.role === 'model' && <Bot size={14} className="text-indigo-500" />}
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{m.role === 'user' ? 'You' : 'Evaluator'} • {m.timestamp}</span>
                           {m.role === 'user' && <User size={14} className="text-slate-400" />}
                        </div>
                        <div className={`max-w-[85%] p-6 rounded-[32px] text-[15px] font-bold leading-relaxed shadow-sm ${
                          m.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    
                    {/* UNIFIED CURRENT USER BOX */}
                    {currentInput && (
                      <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-2 px-1">
                           <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Live Pulse Transcription</span>
                           <Activity size={12} className="text-indigo-400 animate-pulse" />
                        </div>
                        <div className="max-w-[85%] p-6 rounded-[32px] rounded-tr-none bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-2 border-dashed border-indigo-500/20 text-[15px] font-bold italic leading-relaxed">
                           {currentInput}
                        </div>
                      </div>
                    )}

                    {/* UNIFIED CURRENT BOT BOX */}
                    {currentOutput && (
                      <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="flex items-center gap-3 mb-2 px-1">
                           <Bot size={14} className="text-green-500" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Evaluator response...</span>
                        </div>
                        <div className="max-w-[85%] p-6 rounded-[32px] rounded-tl-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-green-500/20 shadow-xl text-[15px] font-black leading-relaxed">
                          {currentOutput}
                        </div>
                      </div>
                    )}
                 </div>

                 {/* Interaction Footer */}
                 <div className="pt-10 flex flex-col items-center justify-center gap-8 border-t border-slate-100 dark:border-slate-800 mt-8">
                    <div className="flex items-center gap-10">
                       <div className="flex flex-col items-center gap-3">
                          <button 
                            onClick={stopInterview}
                            className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                            title="Disconnect Session"
                          >
                             <PhoneOff size={24} />
                          </button>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">End Session</span>
                       </div>

                       <div className="relative">
                          {/* Visual Wave Ring */}
                          <div className={`absolute inset-0 -m-4 rounded-full border-4 border-indigo-500/20 ${status === 'listening' ? 'animate-ping' : ''}`}></div>
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-2xl relative z-10 ${
                            status === 'listening' ? 'bg-indigo-600 scale-110' : 
                            status === 'responding' ? 'bg-green-500' : 'bg-slate-700'
                          }`}>
                             {status === 'listening' ? <Mic size={36} className="animate-pulse" /> : status === 'thinking' ? <Loader2 size={36} className="animate-spin" /> : <WaveIcon size={36} />}
                          </div>
                       </div>

                       <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700">
                             <Award size={24} />
                          </div>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Final Audit</span>
                       </div>
                    </div>
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                      {status === 'listening' ? 'System listening: Ignored micro-pauses active.' : status === 'thinking' ? 'Commit detected. Puck is calculating evaluation.' : 'Evaluator transmitting response.'}
                    </p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
