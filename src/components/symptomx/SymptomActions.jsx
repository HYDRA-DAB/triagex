import React from 'react';

const SymptomActions = ({ result, onNavigateToFinder, onNavigateToDict }) => {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-3 mt-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150">
      {result.severity === 'High' && (
        <button className="w-full py-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-rose-300 font-bold transition-all duration-300 shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse">
          🚨 DECLARE EMERGENCY (SOS)
        </button>
      )}
      
      <button 
        onClick={onNavigateToFinder}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-[0_0_20px_-5px_theme(colors.indigo.500/20)] transition-all duration-300 hover:-translate-y-0.5"
      >
        Find Recommended Care ({result.specialist})
      </button>

      <button 
        onClick={onNavigateToDict}
        className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all duration-300 hover:-translate-y-0.5"
      >
        Understand these conditions
      </button>
    </div>
  );
};

export default SymptomActions;
