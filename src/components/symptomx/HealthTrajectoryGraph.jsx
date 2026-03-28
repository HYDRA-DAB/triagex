import React, { useState } from 'react';

const HealthTrajectoryGraph = () => {
  const [activeTab, setActiveTab] = useState('1W');

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/5 p-6 md:p-8 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Health Trajectory</h3>
          <p className="text-indigo-200/50 text-sm mt-1 font-light">Long-term tracking of your symptomatic patterns.</p>
        </div>
        
        {/* Segmented Control */}
        <div className="flex p-1 bg-black/20 rounded-lg border border-white/5 shrink-0">
          {['1W', '1M', '3M', '1Y'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-indigo-200/50 hover:text-indigo-200/80 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Area */}
      <div className="w-full h-[280px] relative px-2">
        {/* Background Grid (horizontal subtle lines) */}
        <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full border-t border-white/[0.03]" />
          ))}
        </div>

        {/* SVG Graph */}
        <div className="absolute inset-x-0 top-0 bottom-8 group cursor-crosshair">
          <svg
            viewBox="0 0 700 200"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />   {/* Blue */}
                <stop offset="50%" stopColor="#8b5cf6" />  {/* Purple */}
                <stop offset="100%" stopColor="#ec4899" /> {/* Pink/Red */}
              </linearGradient>
              
              <linearGradient id="fill-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path
              d="M0,170 
                 C60,150 100,50 180,70 
                 C240,85 280,140 340,110 
                 C400,80 430,30 500,60 
                 C580,95 620,180 700,140
                 L700,200 L0,200 Z"
              fill="url(#fill-gradient)"
              className="transition-all duration-500 ease-in-out"
            />

            {/* Line Path */}
            <path
              d="M0,170 
                 C60,150 100,50 180,70 
                 C240,85 280,140 340,110 
                 C400,80 430,30 500,60 
                 C580,95 620,180 700,140"
              fill="none"
              stroke="url(#line-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              className="opacity-90 transition-all duration-500 hover:drop-shadow-[0_4px_12px_rgba(236,72,153,0.3)]"
            />

            {/* Subtle Data Points (reveal on hover) */}
            <circle cx="180" cy="70" r="4" fill="#060a14" stroke="#8b5cf6" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <circle cx="340" cy="110" r="4" fill="#060a14" stroke="#d946ef" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <circle cx="500" cy="60" r="5" fill="#060a14" stroke="#ec4899" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 text-[10px] sm:text-xs font-semibold tracking-widest text-indigo-200/40 uppercase">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span className="text-pink-400/80">Sun</span>
        </div>
      </div>
    </div>
  );
};

export default HealthTrajectoryGraph;
