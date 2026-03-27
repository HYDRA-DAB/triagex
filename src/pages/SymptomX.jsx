import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

const SymptomX = () => {
  const navigate = useNavigate();
  const [symptomInput, setSymptomInput] = useState('');
  const [painLevel, setPainLevel] = useState(5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      
      <Navbar />

      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 lg:pb-20 flex flex-col gap-16 md:gap-24">
        
        {/* 1. HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200 drop-shadow-sm">
              A Smarter Way to Understand Your Symptoms
            </h1>
            <p className="text-lg md:text-xl text-indigo-200/80 font-light leading-relaxed max-w-xl">
              Experience the next generation of AI-driven symptom analysis. Get precise, personalized insights with clinical-grade accuracy in seconds.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 shadow-[0_0_30px_-5px_theme(colors.purple.500/30)] text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_theme(colors.purple.500/50)] backdrop-blur-md">
                Start Analysis
              </button>
              <button className="px-8 py-4 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 text-indigo-100 font-medium transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg mx-auto lg:ml-auto">
            {/* Glass frame for image */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[20px] border border-white/10 shadow-2xl shadow-indigo-500/20 transform transition-transform duration-500 hover:-translate-y-2 p-3">
              <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent mix-blend-overlay z-10 pointer-events-none" />
                <img 
                  src="/symptomx.jpeg" 
                  alt="Symptom Analysis Interface" 
                  className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[24px] blur-2xl -z-10" />
          </div>
        </section>

        {/* 2. FLOATING INPUT CARD */}
        <section className="relative z-20 -mt-8 md:-mt-16 w-full max-w-4xl mx-auto">
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[20px] border border-white/10 p-4 md:p-6 shadow-2xl shadow-purple-900/50 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-purple-900/60 flex flex-col md:flex-row gap-4 items-center group">
            <div className="flex-1 w-full bg-black/20 rounded-xl flex items-center px-4 py-3 border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-black/40 transition-all duration-300">
              <svg className="w-6 h-6 text-indigo-300/50 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Describe your symptoms..." 
                className="w-full bg-transparent text-white placeholder-indigo-200/40 outline-none text-lg font-light"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 whitespace-nowrap">
              Analyze
            </button>
          </div>
        </section>

        {/* 3. TRIAGE SECTION */}
        <section className="grid lg:grid-cols-12 gap-8 items-start relative z-10 w-full">
          
          {/* LEFT SIDE: Questions */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-10 w-2.5 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <h2 className="text-3xl font-semibold text-white tracking-tight">Clinical Assessment</h2>
            </div>
            
            {/* Question Card 1: Slider */}
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] border border-white/10 p-6 md:p-8 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-2xl hover:border-white/20">
              <h3 className="text-xl text-indigo-50 mb-6 font-medium">How severe is the pain on a scale of 1-10?</h3>
              <div className="flex flex-col gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={painLevel}
                  onChange={(e) => setPainLevel(e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-indigo-300/60 text-sm font-medium">
                  <span>Mild (1)</span>
                  <span className="text-xl text-indigo-400 font-bold">{painLevel}</span>
                  <span>Severe (10)</span>
                </div>
              </div>
            </div>

            {/* Question Card 2: Yes/No */}
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] border border-white/10 p-6 md:p-8 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-2xl hover:border-white/20">
              <h3 className="text-xl text-indigo-50 mb-6 font-medium">Are you experiencing any shortness of breath?</h3>
              <div className="flex gap-4">
                <button className="flex-1 py-4 rounded-xl border border-white/10 bg-black/20 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 text-lg font-medium text-indigo-100 hover:text-white">
                  Yes
                </button>
                <button className="flex-1 py-4 rounded-xl border border-white/10 bg-black/20 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 text-lg font-medium text-indigo-100 hover:text-white">
                  No
                </button>
              </div>
            </div>

            {/* Question Card 3: Chips */}
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] border border-white/10 p-6 md:p-8 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-2xl hover:border-white/20">
              <h3 className="text-xl text-indigo-50 mb-6 font-medium">Select any accompanying symptoms:</h3>
              <div className="flex flex-wrap gap-3">
                {['Nausea', 'Dizziness', 'Chills', 'Fatigue', 'Sweating', 'Cough'].map((symptom) => (
                  <button key={symptom} className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-indigo-200">
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Sticky Panel */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-8 lg:top-24 bg-slate-900/50 backdrop-blur-2xl rounded-[20px] border border-white/10 p-6 shadow-2xl flex flex-col gap-6 transform transition-all duration-500 hover:border-indigo-500/30">
              {/* Risk Badge */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-indigo-200 font-medium tracking-wide text-sm uppercase">Assessment Status</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Moderate
                </span>
              </div>

              {/* Conditions List */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm text-indigo-300 uppercase tracking-wider font-semibold">Possible Matches</h4>
                <div className="flex flex-col gap-3">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-colors cursor-default">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">Viral Pharyngitis</span>
                      <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">78%</span>
                    </div>
                    <p className="text-xs text-indigo-200/50">Common cold symptoms, sore throat.</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 group hover:border-white/10 transition-colors cursor-default">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">Seasonal Allergies</span>
                      <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">45%</span>
                    </div>
                    <p className="text-xs text-indigo-200/50">Environmental triggers, congestion.</p>
                  </div>
                </div>
              </div>

              {/* Emergency Alert */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 mt-2">
                <svg className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-rose-400 font-semibold text-sm">Action Recommended</span>
                  <span className="text-rose-300/70 text-xs mt-1">If symptoms suddenly worsen or breathing becomes difficult, seek immediate care.</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3 mt-2">
                <button onClick={() => navigate('/finderx')} className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-[0_0_20px_-5px_theme(colors.indigo.500/20)] transition-all duration-300 hover:shadow-[0_0_30px_-5px_theme(colors.indigo.500/40)] hover:-translate-y-0.5">
                  Find Hospitals
                </button>
                <button onClick={() => navigate('/dictionaryx')} className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all duration-300 hover:-translate-y-0.5">
                  Understand this condition
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. GRAPH SECTION */}
        <section className="w-full relative z-10">
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-[24px] border border-white/10 p-6 md:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-purple-900/40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">Symptom Timeline</h3>
                <p className="text-indigo-200/60 mt-1">Severity tracking over the past 72 hours</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-indigo-200 hover:bg-white/10 transition-colors">24H</button>
                <button className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-sm text-indigo-100 transition-colors shadow-[0_0_10px_theme(colors.indigo.500/20)]">72H</button>
                <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-indigo-200 hover:bg-white/10 transition-colors">7D</button>
              </div>
            </div>
            
            {/* Simple SVG Line Graph Mockup */}
            <div className="w-full h-64 bg-slate-900/30 rounded-xl border border-white/5 relative overflow-hidden flex items-end p-4 lg:p-6">
              {/* Background Grid Lines */}
              <div className="absolute inset-x-0 bottom-4 top-4 flex flex-col justify-between pointer-events-none px-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-white/5 border-b border-dashed border-white/5" />
                ))}
              </div>
              
              {/* SVG Curve */}
              <svg className="w-full h-full text-indigo-500 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)] absolute inset-0 preserve-3d p-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                    <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,80 Q10,70 20,75 T40,50 T60,30 T80,45 T100,20 L100,100 L0,100 Z" 
                  fill="url(#gradient)" 
                  className="opacity-60"
                />
                <path 
                  d="M0,80 Q10,70 20,75 T40,50 T60,30 T80,45 T100,20" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="drop-shadow-lg"
                />
                {/* Data points */}
                <circle cx="20" cy="75" r="3" fill="white" className="drop-shadow-md" />
                <circle cx="40" cy="50" r="3" fill="white" className="drop-shadow-md" />
                <circle cx="60" cy="30" r="3" fill="white" className="drop-shadow-md" />
                <circle cx="80" cy="45" r="3" fill="white" className="drop-shadow-md" />
                <circle cx="100" cy="20" r="4" fill="#a855f7" stroke="white" strokeWidth="2" className="shadow-[0_0_10px_theme(colors.purple.500)]" />
              </svg>

              {/* X-Axis labels */}
              <div className="absolute bottom-1 left-6 right-6 flex justify-between text-[10px] text-indigo-300/40 uppercase font-medium tracking-widest pl-2">
                <span>Day 1</span>
                <span>Day 2</span>
                <span>Today</span>
              </div>
            </div>
            
          </div>
        </section>

      </div>
    </div>
  );
};

export default SymptomX;
