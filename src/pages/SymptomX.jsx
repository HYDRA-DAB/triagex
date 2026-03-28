import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import HealthTrajectoryGraph from '../components/symptomx/HealthTrajectoryGraph';
import SymptomHeader from '../components/symptomx/SymptomHeader';
import SymptomInput from '../components/symptomx/SymptomInput';
import SymptomResult from '../components/symptomx/SymptomResult';
import SymptomActions from '../components/symptomx/SymptomActions';
import { analyzeSymptoms, getSuggestedSymptoms, getSymptomSuggestions, generateFollowUpQuestions } from '../services/symptomxService';
import { fetchMedicalContext } from '../utils/ncbiUtils';

function calculateConfidence({ painLevel, answersCount, symptomsCount, discomfortLevel }) {
  let score = 40;
  score += painLevel * 2;
  score += answersCount * 4;
  score += symptomsCount * 5;
  if (discomfortLevel >= 6) score += 10;
  return Math.min(score, 92);
}

const SymptomX = () => {
  const navigate = useNavigate();
  
  // Triage state
  const [step, setStep] = useState(1);
  const [unlockedStep, setUnlockedStep] = useState(1);
  const [input, setInput] = useState('');
  const [painLevel, setPainLevel] = useState(0);

  // Dynamic questions state
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Additional symptoms state
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [suggestedSymptoms, setSuggestedSymptoms] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [autoSuggestions, setAutoSuggestions] = useState([]);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Analysis state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Close autocomplete dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAutoSuggestions([]);
        setHighlightIdx(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced autocomplete fetcher
  const handleCustomInputChange = useCallback((val) => {
    setCustomInput(val);
    setHighlightIdx(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setAutoSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const suggestions = await getSymptomSuggestions(val.trim(), input);
      const filtered = suggestions.filter(s => !selectedSymptoms.includes(s));
      setAutoSuggestions(filtered);
    }, 300);
  }, [input, selectedSymptoms]);

  // Handle Input Reset
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setStep(1);
    setUnlockedStep(1);
    setPainLevel(0);
    setFollowUpQuestions([]);
    setFollowUpAnswers({});
    setSelectedSymptoms([]);
    setSuggestedSymptoms([]);
    setResult(null);
    setError(null);
  };

  const handleStartAssessment = async () => {
    if (input.trim().length > 0) {
      setStep(2);
      setUnlockedStep(Math.max(unlockedStep, 2));

      // Fetch AI questions and symptom suggestions in background
      setQuestionsLoading(true);
      const [questions] = await Promise.all([
        generateFollowUpQuestions(input),
        getSuggestedSymptoms(input).then(res => setSuggestedSymptoms(res))
      ]);
      setFollowUpQuestions(questions);
      setQuestionsLoading(false);
    }
  };

  // Pain Slider
  const handlePainChangeEnd = () => {
    if (step === 2) {
      setTimeout(() => {
        setStep(3);
        setUnlockedStep(Math.max(unlockedStep, 3));
      }, 300);
    }
  };

  // Follow-up question answer handler
  const handleFollowUpAnswer = (idx, answer) => {
    setFollowUpAnswers(prev => ({ ...prev, [idx]: answer }));
  };

  // Check if all questions answered → auto-advance to step 4
  const answeredCount = Object.keys(followUpAnswers).length;
  const allQuestionsAnswered = followUpQuestions.length > 0 && answeredCount >= followUpQuestions.length;

  useEffect(() => {
    if (allQuestionsAnswered && step === 3) {
      setTimeout(() => {
        setStep(4);
        setUnlockedStep(Math.max(unlockedStep, 4));
      }, 400);
    }
  }, [allQuestionsAnswered, step]);

  // Chips Toggle
  const toggleSymptom = (symptom) => {
    if (symptom === 'None') {
      setSelectedSymptoms(['None']);
      return;
    }
    
    setSelectedSymptoms((prev) => {
      const filtered = prev.filter(s => s !== 'None');
      return filtered.includes(symptom) 
        ? filtered.filter((s) => s !== symptom)
        : [...filtered, symptom];
    });
  };

  // Extract max discomfort from scale-type answers
  const discomfortLevel = Math.max(0, ...Object.entries(followUpAnswers)
    .filter(([idx]) => followUpQuestions[idx]?.type === 'scale')
    .map(([, val]) => parseInt(val) || 0)
  );

  // Live Assessment Panel Logic — STRICT severity
  let liveSeverity = "Low";
  if (painLevel >= 8 || discomfortLevel >= 6) {
    liveSeverity = "High";
  } else if (painLevel >= 5) {
    liveSeverity = "Medium";
  }

  const liveConfidence = calculateConfidence({
    painLevel,
    answersCount: answeredCount,
    symptomsCount: selectedSymptoms.filter(s => s !== 'None').length,
    discomfortLevel
  });

  const confLabel = liveConfidence >= 85 ? "High" : liveConfidence >= 70 ? "Moderate" : "Low";

  // API Call / Evaluate
  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStep(5);

    // Compile follow-up Q&A
    const qaString = followUpQuestions.map((q, idx) => {
      const ans = followUpAnswers[idx];
      if (ans == null) return null;
      return `Q: ${q.question} A: ${ans}`;
    }).filter(Boolean).join('\n');

    const searchQuery = `${input} ${selectedSymptoms.join(' ')} clinical diagnosis`.trim();
    const ncbiContext = await fetchMedicalContext(searchQuery);
    
    const contextString = ncbiContext.length > 0 
      ? `\nMedical references:\n- ${ncbiContext.join('\n- ')}` 
      : '';

    const compiledInput = `Primary symptom: ${input}
Pain level: ${painLevel}/10
Discomfort level: ${discomfortLevel}/6

Follow-up assessment:
${qaString || 'No follow-up answers provided.'}

Additional symptoms: ${selectedSymptoms.filter(s => s !== 'None').join(', ') || 'none'}
${contextString}`;

    const data = await analyzeSymptoms(compiledInput);
    if (data) {
      // Override the OpenAI confidence with our strict math formula to prevent hallucinations
      const finalResult = { ...data, confidenceScore: liveConfidence };
      setResult(finalResult);
    } else {
      setError("Analysis failed. Please try again.");
      setStep(4);
    }
    setLoading(false);
  };

  const severityColor = 
    liveSeverity === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    liveSeverity === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
    'text-green-400 bg-green-500/10 border-green-500/20';

  const severityDot = 
    liveSeverity === 'High' ? 'bg-red-400' :
    liveSeverity === 'Medium' ? 'bg-yellow-400' :
    'bg-green-400';

  // Discomfort scale labels
  const discomfortLabels = ['None', 'Minimal', 'Mild', 'Moderate', 'Notable', 'Significant', 'Severe'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      <Navbar />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 lg:pb-20 flex flex-col gap-12">
        
        <SymptomHeader />

        <div className="flex flex-col gap-8 w-full">
          {/* STEP 1 */}
          <section className="relative z-20 w-full max-w-4xl mx-auto md:-mt-16">
             <SymptomInput 
                input={input} 
                onChange={handleInputChange} 
                onAction={handleStartAssessment} 
                buttonText="Start Auto-Triage"
                disabled={loading}
                loading={loading}
              />
          </section>
          
          {unlockedStep > 1 && (
            <section className="grid lg:grid-cols-12 gap-8 items-start relative z-10 w-full mt-4">
              
              {/* LEFT COLUMN: GUIDED QUESTIONS */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* STEP 2: PAIN SLIDER */}
                <div 
                  onMouseEnter={() => setStep(2)}
                  className={`bg-white/[0.02] backdrop-blur-xl rounded-[20px] p-6 md:p-8 shadow-xl transition-all duration-300 ${step === 2 ? 'border border-indigo-500/50 shadow-indigo-500/20 opacity-100 scale-[1.02]' : 'border border-white/5 opacity-60 cursor-pointer hover:border-white/20'}`}
                >
                  <h3 className="text-xl text-indigo-50 mb-6 font-medium">How severe is the pain on a scale of 1-10?</h3>
                  <div className="flex flex-col gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={painLevel}
                      onChange={(e) => setPainLevel(parseInt(e.target.value))}
                      onMouseUp={handlePainChangeEnd}
                      onTouchEnd={handlePainChangeEnd}
                      className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none hover:bg-slate-600/50 transition-colors"
                    />
                    <div className="flex justify-between text-indigo-300/60 text-sm font-medium">
                      <span>None (0)</span>
                      <span className="text-xl text-indigo-400 font-bold">{painLevel}</span>
                      <span>Severe (10)</span>
                    </div>
                  </div>
                </div>

                {/* STEP 3: AI-GENERATED FOLLOW-UP QUESTIONS */}
                {unlockedStep >= 3 && (
                  <div 
                    onMouseEnter={() => step < 4 && setStep(3)}
                    className={`bg-white/[0.02] backdrop-blur-xl rounded-[20px] p-6 md:p-8 shadow-xl transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${step === 3 ? 'border border-indigo-500/50 shadow-indigo-500/20 opacity-100 scale-[1.02]' : 'border border-white/5 opacity-60 cursor-pointer hover:border-white/20'}`}
                  >
                    <h3 className="text-xl text-indigo-50 mb-2 font-medium">Clinical Follow-Up Questions</h3>
                    <p className="text-sm text-indigo-300/50 mb-6">AI-generated based on your symptom to improve diagnostic accuracy</p>

                    {questionsLoading ? (
                      <div className="flex items-center gap-3 py-8 justify-center">
                        <div className="w-6 h-6 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        <span className="text-indigo-200/60 text-sm animate-pulse">Generating clinical questions...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5">
                        {followUpQuestions.map((q, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border transition-all duration-300 ${followUpAnswers[idx] != null ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                            <p className="text-indigo-50 font-medium mb-3 text-[15px]">{q.question}</p>

                            {/* SCALE TYPE (0-6 discomfort) */}
                            {q.type === 'scale' && (
                              <div className="flex flex-col gap-2">
                                <input 
                                  type="range" min="0" max="6" 
                                  value={followUpAnswers[idx] ?? 0}
                                  onChange={(e) => handleFollowUpAnswer(idx, parseInt(e.target.value))}
                                  className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none"
                                />
                                <div className="flex justify-between text-xs text-indigo-300/50 font-medium">
                                  <span>None (0)</span>
                                  <span className="text-base text-indigo-400 font-bold">
                                    {followUpAnswers[idx] != null ? `${followUpAnswers[idx]} — ${discomfortLabels[followUpAnswers[idx]]}` : '0 — None'}
                                  </span>
                                  <span>Severe (6)</span>
                                </div>
                              </div>
                            )}

                            {/* YES/NO TYPE */}
                            {q.type === 'yesno' && (
                              <div className="flex gap-3">
                                {['Yes', 'No'].map(opt => (
                                  <button 
                                    key={opt}
                                    onClick={() => handleFollowUpAnswer(idx, opt)}
                                    className={`flex-1 py-3 rounded-xl border transition-all duration-300 text-sm font-medium ${followUpAnswers[idx] === opt ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'border-white/10 bg-black/20 text-indigo-100 hover:bg-white/5 hover:border-white/20'}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* MULTI TYPE */}
                            {q.type === 'multi' && q.options && (
                              <div className="flex flex-wrap gap-2">
                                {q.options.map(opt => (
                                  <button 
                                    key={opt}
                                    onClick={() => handleFollowUpAnswer(idx, opt)}
                                    className={`px-4 py-2.5 rounded-xl border transition-all duration-300 text-sm font-medium ${followUpAnswers[idx] === opt ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'border-white/10 bg-black/20 text-indigo-100 hover:bg-white/5 hover:border-white/20'}`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Progress indicator */}
                        {followUpQuestions.length > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${(answeredCount / followUpQuestions.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-indigo-300/50 font-medium">{answeredCount}/{followUpQuestions.length}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: ACCOMPANYING SYMPTOMS */}
                {unlockedStep >= 4 && (
                  <div 
                    onMouseEnter={() => setStep(4)}
                    className={`bg-white/[0.02] backdrop-blur-xl rounded-[20px] p-6 md:p-8 shadow-xl transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${step === 4 ? 'border border-indigo-500/50 shadow-indigo-500/20 opacity-100 scale-[1.02]' : 'border border-white/5 opacity-60 cursor-pointer hover:border-white/20'}`}
                  >
                    <h3 className="text-xl text-indigo-50 mb-6 font-medium">Select or add any accompanying symptoms:</h3>
                    
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="relative" ref={dropdownRef}>
                        <input
                          type="text"
                          placeholder="Type additional symptom & press Enter..."
                          value={customInput}
                          onChange={(e) => handleCustomInputChange(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setHighlightIdx(prev => Math.min(prev + 1, autoSuggestions.length - 1));
                              return;
                            }
                            if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setHighlightIdx(prev => Math.max(prev - 1, 0));
                              return;
                            }
                            if (e.key === 'Escape') {
                              setAutoSuggestions([]);
                              setHighlightIdx(-1);
                              return;
                            }
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              let val;
                              if (highlightIdx >= 0 && autoSuggestions[highlightIdx]) {
                                val = autoSuggestions[highlightIdx];
                              } else {
                                val = customInput.trim();
                              }
                              if (val && !selectedSymptoms.includes(val)) {
                                setSelectedSymptoms(prev => {
                                  const withoutNone = prev.filter(s => s !== 'None');
                                  return [...withoutNone, val];
                                });
                              }
                              setCustomInput('');
                              setAutoSuggestions([]);
                              setHighlightIdx(-1);
                            }
                          }}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        />

                        {/* Autocomplete Dropdown */}
                        {autoSuggestions.length > 0 && (
                          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            {autoSuggestions.map((s, idx) => (
                              <button
                                key={s}
                                onClick={() => {
                                  if (!selectedSymptoms.includes(s)) {
                                    setSelectedSymptoms(prev => {
                                      const withoutNone = prev.filter(x => x !== 'None');
                                      return [...withoutNone, s];
                                    });
                                  }
                                  setCustomInput('');
                                  setAutoSuggestions([]);
                                  setHighlightIdx(-1);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                  idx === highlightIdx
                                    ? 'bg-indigo-500/30 text-white'
                                    : 'text-indigo-100/80 hover:bg-white/5'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => toggleSymptom('None')}
                          className={`px-5 py-2.5 rounded-full border transition-all duration-300 ${selectedSymptoms.includes('None') ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30 font-medium scale-105' : 'border-white/10 bg-white/5 text-indigo-200 hover:bg-purple-500/20 hover:border-purple-500/30'}`}
                        >
                          None
                        </button>
                        
                        {Array.from(new Set([...selectedSymptoms.filter(s => s !== 'None'), ...suggestedSymptoms])).map((symptom) => {
                          const isActive = selectedSymptoms.includes(symptom);
                          return (
                            <button 
                              key={symptom} 
                              onClick={() => toggleSymptom(symptom)}
                              className={`px-5 py-2.5 rounded-full border transition-all duration-300 ${isActive ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 font-medium scale-105' : 'border-white/10 bg-white/5 text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-500/30'}`}
                            >
                              {symptom}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {step === 4 && (
                      <div className="flex justify-end border-t border-white/5 pt-6 mt-4">
                        <button 
                          onClick={handleAnalyze}
                          disabled={selectedSymptoms.length === 0}
                          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-[0_0_20px_-5px_theme(colors.indigo.500/30)] transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Finish & Analyze
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: LIVE STICKY PANEL */}
              <div className="lg:col-span-4 relative mt-2 lg:mt-0">
                <div className="sticky top-24 bg-slate-900/50 md:bg-white/[0.02] backdrop-blur-2xl rounded-[20px] border border-white/10 p-6 shadow-2xl flex flex-col gap-6 transform transition-all duration-500 overflow-hidden">
                  
                  {step < 5 ? (
                    <>
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-indigo-200 font-medium tracking-wide text-sm uppercase">Live Assessment</span>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold transition-colors duration-500 ${severityColor}`}>
                          <span className={`w-2 h-2 rounded-full animate-pulse ${severityDot}`} /> {liveSeverity === 'High' ? 'High Risk' : liveSeverity === 'Medium' ? 'Moderate' : 'Monitoring'}
                        </span>
                      </div>
                      
                      {liveSeverity === 'High' && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 mt-2 animate-in fade-in zoom-in duration-300">
                          <svg className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div className="flex flex-col">
                            <span className="text-rose-400 font-semibold text-sm">Action Recommended</span>
                            <span className="text-rose-300/70 text-xs mt-1">If symptoms suddenly worsen or breathing becomes difficult, seek immediate care.</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-4 opacity-70 mt-4">
                        <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-white/5 shadow-inner">
                          <span className="text-white/80 font-medium text-sm">Confidence Model</span>
                          <span className={`text-sm font-bold tracking-wide ${liveConfidence >= 85 ? 'text-emerald-400' : liveConfidence >= 70 ? 'text-amber-400' : 'text-slate-400'}`}>
                            {liveConfidence}% ({confLabel})
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <h4 className="text-sm text-indigo-300 uppercase tracking-wider font-semibold mt-2">Active Modifiers</h4>
                          {painLevel > 0 && <span className="text-xs text-indigo-200 bg-white/5 px-2 py-1 rounded inline-block w-fit">Pain Intensity (+{painLevel * 2}%)</span>}
                          {answeredCount > 0 && <span className="text-xs text-indigo-200 bg-white/5 px-2 py-1 rounded inline-block w-fit">Questions Answered (+{answeredCount * 4}%)</span>}
                          {selectedSymptoms.filter(s => s !== 'None').length > 0 && <span className="text-xs text-indigo-200 bg-white/5 px-2 py-1 rounded inline-block w-fit">Symptoms Logged (+{selectedSymptoms.filter(s => s !== 'None').length * 5}%)</span>}
                          {discomfortLevel >= 6 && <span className="text-xs text-rose-300 bg-rose-500/10 px-2 py-1 rounded inline-block w-fit">High Discomfort (+10%)</span>}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full animate-in fade-in zoom-in duration-500">
                      <SymptomResult 
                        result={result} 
                        loading={loading} 
                        error={error} 
                      />
                      {result && (
                        <SymptomActions 
                          result={result}
                          onNavigateToFinder={() => navigate("/finderx", { 
                            state: { 
                              specialist: result?.specialist, 
                              condition: result?.conditions?.[0]?.name,
                              severity: result?.severity 
                            }
                          })}
                          onNavigateToDict={() => navigate('/dictionaryx')}
                        />
                      )}
                    </div>
                  )}

                </div>
              </div>

            </section>
          )}

        </div>

        {/* GRAPH SECTION */}
        <section className="w-full relative z-10 mt-6 md:mt-2">
          <HealthTrajectoryGraph />
        </section>

      </div>
    </div>
  );
};

export default SymptomX;

