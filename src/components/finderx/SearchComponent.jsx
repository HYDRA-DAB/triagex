import React from 'react';

function SearchComponent({ value, onChange }) {
  return (
    <div className="relative w-full h-full flex items-center">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-indigo-300/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[20px] py-4 pl-12 pr-4 text-white placeholder-indigo-200/50 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
        placeholder="Search hospitals or specific care..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchComponent;
