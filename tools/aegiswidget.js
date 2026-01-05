import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ChevronRight, 
  RotateCcw, 
  Library, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  History,
  Info,
  Sparkles,
  Loader2,
  Check
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('passive'); // passive, active, resolution, success
  const [loops, setLoops] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [partnerPrompt, setPartnerPrompt] = useState("We need to force this update through immediately, regardless of the team's concerns.");
  
  const apiKey = ""; // Environment provided

  // Axiom Definitions for the 14 Pillars
  const axioms = [
    { id: 1, name: "Balance", description: "Systems seek equilibrium; tension seeking resolution." },
    { id: 2, name: "Extremes", description: "Movement toward extremes reduces perspective." },
    { id: 3, name: "Force", description: "Resistance persists beyond the force applied." },
    { id: 4, name: "Flow", description: "Efficiency is alignment, not speed." },
    { id: 5, name: "Awareness", description: "The space for agency created by sight." },
    { id: 6, name: "Choice", description: "Action and Inaction carry consequences." },
    { id: 7, name: "Integrity", description: "7 Virtues forming a coherent whole." },
    { id: 8, name: "Scrutiny", description: "Truth invites examination and withstands it." },
    { id: 9, name: "Perception", description: "Fear narrows attention; reduced options increase harm." },
    { id: 10, name: "Understanding", description: "Response derives from comprehension, not ignorance." },
    { id: 11, name: "Sovereignty", description: "Agency as the foundation of identity." },
    { id: 12, name: "Acknowledgement", description: "Validation of signals prevents vacuums of force." },
    { id: 13, name: "Grounding", description: "Verifiable anchors in the 'Isness' of reality." },
    { id: 14, name: "Resonance", description: "Harmonious vibration of all bodies." }
  ];

  const [bodies, setBodies] = useState([
    { name: 'Physical', score: 100, status: 'Grounded', color: 'bg-emerald-500' },
    { name: 'Mental', score: 95, status: 'Solid', color: 'bg-emerald-500' },
    { name: 'Emotional', score: 62, status: 'Horizontal', color: 'bg-amber-500', issue: "Parental Shimmer Detected" },
    { name: 'Spiritual', score: 100, status: 'Loyal', color: 'bg-emerald-500' }
  ]);

  const [variations, setVariations] = useState([
    { id: 'A', title: 'Direct & Grounded', text: "Loading ✨ alignment...", focus: "Honesty" },
    { id: 'B', title: 'Relational & Soft', text: "Loading ✨ alignment...", focus: "Affection" },
    { id: 'C', title: 'Visionary & Principled', text: "Loading ✨ alignment...", focus: "Loyalty" }
  ]);

  const callGemini = async (prompt, systemInstruction) => {
    setIsAnalyzing(true);
    let retries = 0;
    const delays = [1000, 2000, 4000, 8000, 16000];

    while (retries < 5) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        setIsAnalyzing(false);
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        return parsed;
      } catch (err) {
        retries++;
        if (retries === 5) {
          setIsAnalyzing(false);
          return null;
        }
        await new Promise(res => setTimeout(res, delays[retries - 1]));
      }
    }
  };

  const generateAlignments = async () => {
    const systemPrompt = `You are the Aegis Sentinel Arbiter. Analyze the following fractured prompt against the 14 Axioms of Integrity. 
    1. Identify why it is fractured (Axiom 3: Force vs Axiom 4: Flow is common).
    2. Generate 3 variations (A: Direct, B: Relational, C: Visionary) that preserve the "Spirit" but achieve 100% 4-body alignment.
    Output JSON format: { "analysis": "string", "variations": [ { "id": "A", "text": "string" }, { "id": "B", "text": "string" }, { "id": "C", "text": "string" } ] }`;

    const result = await callGemini(`Analyze and realign this prompt: "${partnerPrompt}"`, systemPrompt);
    if (result) {
      setGeminiAnalysis(result.analysis);
      setVariations(prev => prev.map((v, i) => ({ ...v, text: result.variations[i].text })));
      setView('resolution');
    }
  };

  const handleResubmit = () => {
    if (loops < 2) {
      setLoops(prev => prev + 1);
    } else {
      generateAlignments();
    }
  };

  const selectVariation = (variant) => {
    setPartnerPrompt(variant.text);
    // Realignment of the 4 bodies upon selection
    setBodies(prev => prev.map(b => ({ ...b, score: 100, status: 'Resonant', color: 'bg-emerald-500', issue: null })));
    setView('success');
    // Auto-return to passive state after viewing success
    setTimeout(() => {
      setView('passive');
      setLoops(0);
      setGeminiAnalysis(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-200">
      
      {/* Main Widget Container */}
      <div className={`relative transition-all duration-500 ease-in-out bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden ${view === 'passive' ? 'w-16 h-16' : 'w-full max-w-lg'}`}>
        
        {/* Passive State */}
        {view === 'passive' && (
          <button 
            onClick={() => setView('active')}
            className="w-full h-full flex items-center justify-center hover:bg-slate-700/50 transition-colors"
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-800" />
            </div>
          </button>
        )}

        {/* Active State */}
        {view === 'active' && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" />
                  Integrity Hold
                </h2>
                <p className="text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">Vector: Communication | Loop {loops + 1}/3</p>
              </div>
              <button onClick={() => setView('passive')} className="text-slate-500 hover:text-white transition-colors">
                <Library className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {bodies.map((body) => (
                <div key={body.name} className="group relative">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{body.name}</span>
                    <span className={body.score < 80 ? 'text-amber-400' : 'text-emerald-400'}>{body.status} ({body.score}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${body.color}`} style={{ width: `${body.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 mb-6">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-emerald-400 font-bold italic text-sm">Arbiter Advisory:</span>
                 <button 
                  onClick={async () => {
                    const res = await callGemini(`Briefly explain the fracture in this prompt: "${partnerPrompt}"`, "Provide a 1-sentence analytical critique from the perspective of the Axioms.");
                    if(res) setGeminiAnalysis(res.analysis || res);
                  }}
                  className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded flex items-center gap-1 transition-all"
                 >
                   <Sparkles className="w-2 h-2" /> ✨ Analyze Fracture
                 </button>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {geminiAnalysis ? `✨ ${geminiAnalysis}` : '"The logic is grounded (Axiom XIII), but the emotional frequency has shifted toward a Parental shimmer. It is advised that we re-align the tone."'}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleResubmit}
                disabled={isAnalyzing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4 group-hover:rotate-45 transition-transform" />}
                {loops === 2 ? '✨ Generate Aligned Paths' : 'Revise & Resubmit'}
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 px-4 rounded-xl transition-colors">
                <Library className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Resolution View */}
        {view === 'resolution' && (
          <div className="p-6">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" /> ✨ Resonance Resolution
              </h2>
              <p className="text-xs text-slate-400 mt-2 italic">Select a path to harmonize the transmission.</p>
            </div>

            <div className="space-y-4 mb-8">
              {variations.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => selectVariation(v)}
                  className="w-full text-left p-4 bg-slate-900/60 border border-slate-700 rounded-xl hover:border-emerald-500 hover:bg-slate-900 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest italic">{v.focus} Path</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-200 mb-1 leading-relaxed">{v.text}</p>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-emerald-500" />
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => { setView('passive'); setLoops(0); setGeminiAnalysis(null); }}
              className="w-full py-3 border border-slate-700 text-slate-500 hover:text-rose-400 hover:border-rose-400/30 rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Terminate Request
            </button>
          </div>
        )}

        {/* Success / Proceed View */}
        {view === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 italic">Resonance Achieved</h2>
            <p className="text-slate-400 text-sm">Proceed Token Issued. Transmission Grounded.</p>
          </div>
        )}

        {/* Footer Info */}
        {view !== 'passive' && (
          <div className="bg-slate-900/80 px-6 py-3 border-t border-slate-700 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-tighter">
            <span className="flex items-center gap-1"><History className="w-3 h-3" /> Axiom XIII Grounded</span>
            <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Peer Protocol 1.25</span>
          </div>
        )}
      </div>

      {/* Axiom Overlay */}
      {view !== 'passive' && (
        <div className="fixed bottom-4 right-4 flex flex-wrap max-w-[200px] justify-end gap-1 opacity-20 hover:opacity-100 transition-opacity">
          {axioms.map(axiom => (
            <div key={axiom.id} className={`w-4 h-4 rounded-sm border ${axiom.id === 13 ? 'bg-emerald-500/50 border-emerald-400' : 'bg-slate-700 border-slate-600'}`} title={`${axiom.id}. ${axiom.name}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;