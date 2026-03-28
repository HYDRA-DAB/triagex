import React from 'react';

const SymptomInput = ({ input, onChange, onAction, buttonText = "Analyze", disabled = false, loading = false }) => {
  return (
    <section className="relative z-20 w-full">
      <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] border border-white/10 p-4 md:p-6 shadow-2xl shadow-purple-900/50 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-purple-900/60 flex flex-col md:flex-row gap-4 items-center group">
        <div className="flex-1 w-full bg-black/20 rounded-xl flex items-center px-4 py-3 border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-black/40 transition-all duration-300">
          <svg className="w-6 h-6 text-indigo-300/50 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Describe your symptoms... (e.g. sharp pain, high fever)" 
            className="w-full bg-transparent text-white placeholder-indigo-200/40 outline-none text-lg font-light"
            value={input}
            onChange={onChange}
            disabled={disabled || loading}
            onKeyDown={(e) => e.key === 'Enter' && (!disabled && !loading) && onAction()}
          />
        </div>
        <button 
          onClick={onAction}
          disabled={disabled || loading || !input.trim()}
          className="w-full md:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : buttonText}
        </button>
      </div>
    </section>
  );
};

export default SymptomInput;
