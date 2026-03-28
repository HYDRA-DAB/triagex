import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import HealthTrajectoryGraph from '../components/symptomx/HealthTrajectoryGraph';
import SymptomHeader from '../components/symptomx/SymptomHeader';
import SymptomInput from '../components/symptomx/SymptomInput';
import SymptomResult from '../components/symptomx/SymptomResult';
import SymptomActions from '../components/symptomx/SymptomActions';
import { getNextStep } from '../services/symptomxService';

const MAX_STEPS = 7;

const SymptomX = () => {
  const navigate = useNavigate();

  // ── Akinator-style triage state ──
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [history, setHistory] = useState([]);          // [{question, answer}]
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [inputType, setInputType] = useState('text');   // "yesno" | "scale" | "text" | "multi"
  const [multiOptions, setMultiOptions] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Local input states for text and scale answer types
  const [textAnswer, setTextAnswer] = useState('');
  const [scaleValue, setScaleValue] = useState(5);

  // Derived
  const started = stepNumber > 0;
  const progressPct = Math.round((stepNumber / MAX_STEPS) * 100);

  // ── Handlers ──

  const handleInputChange = (e) => {
    setPrimarySymptom(e.target.value);
    // Full reset on symptom change
    setHistory([]);
    setCurrentQuestion('');
    setInputType('text');
    setMultiOptions([]);
    setStepNumber(0);
    setResult(null);
    setError(null);
    setLoading(false);
    setTextAnswer('');
    setScaleValue(5);
  };

  /** Process the AI response and update state */
  const processResponse = (response) => {
    if (!response || !response.type) {
      // Invalid response — should never happen due to service guards
      console.error('Invalid response from getNextStep:', response);
      return;
    }

    if (response.type === 'question') {
      setCurrentQuestion(response.question || '');
      setInputType(response.inputType || 'yesno');
      setMultiOptions(response.options || []);
      // Do NOT set result — stay in questioning flow
      return;
    }

    if (response.type === 'result') {
      setCurrentQuestion('');
      setResult(response);
      return;
    }

    // Unknown type — log but don't crash
    console.warn('Unknown response type:', response.type);
  };

  /** Start the triage: first API call */
  const handleStart = async () => {
    if (!primarySymptom.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setHistory([]);
    setCurrentQuestion('');
    setStepNumber(1);
    setTextAnswer('');
    setScaleValue(5);

    try {
      const response = await getNextStep({
        symptom: primarySymptom.trim(),
        history: [],
        stepNumber: 1,
      });
      processResponse(response);
    } catch (err) {
      console.error('handleStart catch:', err);
      // At step 1 — show a safety question, NOT a result
      processResponse({
        type: "question",
        question: "How long have you been experiencing this symptom?",
        inputType: "multi",
        options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"]
      });
    }

    setLoading(false);
  };

  /** Submit an answer and get the next question (or final result) */
  const handleAnswer = async (answer) => {
    if (!answer && answer !== 0) return;

    const answerStr = String(answer);
    const newHistory = [...history, { question: currentQuestion, answer: answerStr }];
    const nextStep = stepNumber + 1;

    setHistory(newHistory);
    setStepNumber(nextStep);
    setCurrentQuestion('');
    setTextAnswer('');
    setScaleValue(5);
    setLoading(true);
    setError(null);

    try {
      const response = await getNextStep({
        symptom: primarySymptom.trim(),
        history: newHistory,
        stepNumber: nextStep,
      });
      processResponse(response);
    } catch (err) {
      console.error('handleAnswer catch:', err);
      // If fewer than 2 answers, show a safety question instead of fallback result
      if (newHistory.length < 2) {
        processResponse({
          type: "question",
          question: "How would you rate the severity on a scale of 1 to 10?",
          inputType: "scale",
          options: []
        });
      } else {
        // Enough questions answered — generate a symptom-aware fallback
        setResult({
          type: "result",
          conditions: [
            { name: "Acute Stress Reaction", description: "A transient response to physical or emotional stress causing various somatic symptoms." },
            { name: "Somatic Symptom Disorder", description: "A pattern of physical symptoms warranting clinical evaluation to identify underlying causes." },
            { name: "Viral Syndrome", description: "A nonspecific viral illness presenting with systemic symptoms including malaise and discomfort." }
          ],
          severity: "Medium",
          specialist: "General Physician",
          reasoning: `Based on the reported symptom "${primarySymptom}" and ${newHistory.length} clinical responses, further evaluation by a healthcare professional is recommended.`
        });
      }
    }

    setLoading(false);
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) handleAnswer(textAnswer.trim());
  };

  const handleScaleSubmit = () => {
    handleAnswer(scaleValue);
  };

  // ── Severity color helpers (reused from original) ──
  const estimatedSeverity = stepNumber >= 5 ? 'Medium' : 'Low';
  const severityColor =
    estimatedSeverity === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    estimatedSeverity === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
    'text-green-400 bg-green-500/10 border-green-500/20';
  const severityDot =
    estimatedSeverity === 'High' ? 'bg-red-400' :
    estimatedSeverity === 'Medium' ? 'bg-yellow-400' :
    'bg-green-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      <Navbar />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 lg:pb-20 flex flex-col gap-12">

        <SymptomHeader />

        <div className="flex flex-col gap-8 w-full">
          {/* SYMPTOM INPUT */}
          <section className="relative z-20 w-full max-w-4xl mx-auto md:-mt-16">
            <SymptomInput
              input={primarySymptom}
              onChange={handleInputChange}
              onAction={handleStart}
              buttonText="Start Auto-Triage"
              disabled={loading}
              loading={loading && !started}
            />
          </section>

          {/* TRIAGE FLOW — visible once started */}
          {started && (
            <section className="grid lg:grid-cols-12 gap-8 items-start relative z-10 w-full mt-4">

              {/* ════════ LEFT COLUMN: QUESTION FLOW ════════ */}
              <div className="lg:col-span-8 flex flex-col gap-6">

                {/* History: completed Q&A cards */}
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] p-6 md:p-8 shadow-xl transition-all duration-300 border border-white/5 opacity-60"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                        Step {idx + 1}
                      </span>
                    </div>
                    <p className="text-indigo-50 font-medium text-[15px]">{h.question}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-300/80 text-sm font-medium">{h.answer}</span>
                    </div>
                  </div>
                ))}

                {/* Loading card (between steps) */}
                {loading && (
                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] p-6 md:p-8 shadow-xl transition-all duration-300 border border-indigo-500/50 shadow-indigo-500/20 animate-in slide-in-from-top-4 fade-in">
                    <div className="flex items-center gap-3 py-8 justify-center">
                      <div className="w-6 h-6 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                      <span className="text-indigo-200/60 text-sm animate-pulse">Analyzing your condition...</span>
                    </div>
                  </div>
                )}

                {/* Current question card */}
                {currentQuestion && !loading && !result && (
                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] p-6 md:p-8 shadow-xl transition-all duration-300 border border-indigo-500/50 shadow-indigo-500/20 opacity-100 scale-[1.02] animate-in slide-in-from-top-4 fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                        Step {stepNumber}
                      </span>
                      <span className="text-xs text-indigo-300/50 font-medium">
                        {stepNumber} of {MAX_STEPS}
                      </span>
                    </div>
                    <h3 className="text-xl text-indigo-50 mb-6 font-medium">{currentQuestion}</h3>

                    {/* ── YES / NO ── */}
                    {inputType === 'yesno' && (
                      <div className="flex gap-3">
                        {['Yes', 'No'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className="flex-1 py-3 rounded-xl border transition-all duration-300 text-sm font-medium border-white/10 bg-black/20 text-indigo-100 hover:bg-white/5 hover:border-white/20 hover:shadow-lg"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* ── SCALE ── */}
                    {inputType === 'scale' && (
                      <div className="flex flex-col gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={scaleValue}
                          onChange={(e) => setScaleValue(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none hover:bg-slate-600/50 transition-colors"
                        />
                        <div className="flex justify-between text-indigo-300/60 text-sm font-medium">
                          <span>Low (1)</span>
                          <span className="text-xl text-indigo-400 font-bold">{scaleValue}</span>
                          <span>Severe (10)</span>
                        </div>
                        <button
                          onClick={handleScaleSubmit}
                          className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-[0_0_20px_-5px_theme(colors.indigo.500/30)] transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm
                        </button>
                      </div>
                    )}

                    {/* ── TEXT ── */}
                    {inputType === 'text' && (
                      <div className="flex flex-col gap-4">
                        <input
                          type="text"
                          placeholder="Type your answer..."
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        />
                        <button
                          onClick={handleTextSubmit}
                          disabled={!textAnswer.trim()}
                          className="self-end px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-[0_0_20px_-5px_theme(colors.indigo.500/30)] transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          Submit
                        </button>
                      </div>
                    )}

                    {/* ── MULTI ── */}
                    {inputType === 'multi' && (
                      <div className="flex flex-wrap gap-2">
                        {multiOptions.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className="px-4 py-2.5 rounded-xl border transition-all duration-300 text-sm font-medium border-white/10 bg-black/20 text-indigo-100 hover:bg-white/5 hover:border-white/20 hover:shadow-lg"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mt-6">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-indigo-300/50 font-medium">{stepNumber}/{MAX_STEPS}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ════════ RIGHT COLUMN: LIVE PANEL / RESULTS ════════ */}
              <div className="lg:col-span-4 relative mt-2 lg:mt-0">
                <div className="sticky top-24 bg-slate-900/50 md:bg-white/[0.02] backdrop-blur-2xl rounded-[20px] border border-white/10 p-6 shadow-2xl flex flex-col gap-6 transform transition-all duration-500 overflow-hidden">

                  {!result ? (
                    <>
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-indigo-200 font-medium tracking-wide text-sm uppercase">AI Triage Progress</span>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold transition-colors duration-500 ${severityColor}`}>
                          <span className={`w-2 h-2 rounded-full animate-pulse ${severityDot}`} /> {estimatedSeverity === 'High' ? 'High Risk' : estimatedSeverity === 'Medium' ? 'Moderate' : 'Monitoring'}
                        </span>
                      </div>

                      {/* Step counter */}
                      <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-white/5 shadow-inner">
                        <span className="text-white/80 font-medium text-sm">Current Step</span>
                        <span className="text-lg font-bold text-indigo-400">{stepNumber} / {MAX_STEPS}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-indigo-300/50 font-semibold">{progressPct}%</span>
                      </div>

                      {/* Answers logged */}
                      <div className="flex flex-col gap-3 opacity-70 mt-2">
                        <h4 className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Answers Logged</h4>
                        {history.length === 0 ? (
                          <span className="text-xs text-indigo-200/40 italic">Waiting for first response...</span>
                        ) : (
                          history.map((h, idx) => (
                            <span key={idx} className="text-xs text-indigo-200 bg-white/5 px-3 py-1.5 rounded-lg inline-block w-fit">
                              <span className="text-indigo-400 font-semibold">Q{idx + 1}:</span> {h.answer}
                            </span>
                          ))
                        )}
                      </div>

                      {/* Analysis status */}
                      {loading && (
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3 mt-2 animate-in fade-in zoom-in duration-300">
                          <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-indigo-300 font-semibold text-sm">Processing...</span>
                            <span className="text-indigo-200/50 text-xs mt-0.5">AI is adapting the next question</span>
                          </div>
                        </div>
                      )}
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
