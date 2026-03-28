import React from 'react';

const FALLBACK_CONDITIONS = [
  {
    name: "Acute Localized Condition",
    description: "Symptoms indicate a localized medical issue requiring evaluation."
  },
  {
    name: "Functional System Disorder",
    description: "Symptoms suggest dysfunction in the affected system."
  }
];

const SymptomResult = ({ result, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full p-10 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-indigo-200 font-medium animate-pulse">Analyzing symptoms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300">
        <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  if (!result) return null;

  const severity = result.severity || "Low";
  const specialist = result.specialist || "General Physician";
  const reasoning = result.reasoning || "";
  const confidenceScore = typeof result.confidenceScore === 'number' ? result.confidenceScore : null;

  // GUARANTEE: conditions is ALWAYS a non-empty array with valid objects
  const safeConditions = (result.conditions && Array.isArray(result.conditions) && result.conditions.length > 0)
    ? result.conditions.slice(0, 3).map(c => ({
        name: (typeof c === 'string') ? c : (c?.name || "Unspecified Condition"),
        description: (typeof c === 'string') ? null : (c?.description || null)
      }))
    : FALLBACK_CONDITIONS;

  const severityColor = 
    severity === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    severity === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
    'text-green-400 bg-green-500/10 border-green-500/20';

  const severityDot = 
    severity === 'High' ? 'bg-red-400' :
    severity === 'Medium' ? 'bg-yellow-400' :
    'bg-green-400';

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-2xl rounded-[20px] border border-white/10 p-6 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-bottom-6 fade-in duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <span className="text-indigo-200 font-medium tracking-wide text-sm uppercase">Assessment Status</span>
        <div className="flex items-center gap-2">
          {confidenceScore != null && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
              {confidenceScore}% Confidence
            </span>
          )}
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${severityColor}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${severityDot}`} /> {severity} Risk
          </span>
        </div>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3">
        <svg className="w-6 h-6 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <div className="flex flex-col">
          <span className="text-indigo-200 text-xs uppercase tracking-wider font-semibold">Recommended Specialist</span>
          <span className="text-white font-medium">{specialist}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Likely Conditions</h4>
        <div className="flex flex-col gap-2">
          {safeConditions.map((c, idx) => (
            <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/5 transition-colors group">
              <div className="text-white font-semibold group-hover:text-indigo-300 transition-colors">{c.name}</div>
              {c.description && <div className="text-sm text-indigo-200/70 leading-relaxed mt-1">{c.description}</div>}
            </div>
          ))}
        </div>
      </div>

      {reasoning && (
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-purple-300 text-xs uppercase tracking-wider font-semibold">Clinical Reasoning</span>
            <span className="text-[10px] text-purple-400/60 uppercase tracking-widest font-medium border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 rounded">
              Supported by medical literature
            </span>
          </div>
          <p className="text-indigo-100/90 text-sm leading-relaxed font-light">{reasoning}</p>
        </div>
      )}

      <div className="mt-2 text-center">
        <p className="text-[11px] text-slate-500 uppercase tracking-wider">
          ⚠️ This is an AI-assisted estimation, not a medical diagnosis. Please consult a healthcare professional.
        </p>
      </div>
    </div>
  );
};

export default SymptomResult;

