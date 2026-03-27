import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

const DictionaryX = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      
      <Navbar />

      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 lg:pb-20 flex flex-col gap-12 md:gap-16">
        
        {/* HERO / HEADER SECTION */}
        <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-widest uppercase shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            Intelligence Clinical Search
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200 drop-shadow-sm">
            DictionaryX — Understand Your Health
          </h1>
          <p className="text-lg md:text-xl text-indigo-200/80 font-light leading-relaxed">
            Search, analyze, and understand medical terms, prescriptions, and reports with clinical-grade AI precision.
          </p>
        </div>

        {/* SEARCH SECTION */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] border border-white/10 p-4 md:p-6 shadow-2xl shadow-purple-900/50 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-purple-900/60 flex flex-col gap-5">
            <div className="w-full bg-black/20 rounded-xl flex items-center px-5 py-4 border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-black/40 transition-all duration-300">
              <svg className="w-6 h-6 text-indigo-300/50 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search conditions, symptoms, or medications..." 
                className="w-full bg-transparent text-white placeholder-indigo-200/40 outline-none text-lg font-light"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="ml-4 p-2 text-indigo-300/50 hover:text-indigo-300 transition-colors rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-1">
              <span className="text-sm font-medium text-indigo-300/60 uppercase tracking-wider">Trending:</span>
              <div className="flex flex-wrap gap-2">
                {['Hypertension', 'Diabetes', 'Paracetamol', 'Blood Test'].map((term) => (
                  <button key={term} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 text-sm text-indigo-200 hover:text-white shadow-sm">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* LEFT SIDE: Result Card */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[24px] border border-white/10 p-6 md:p-8 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-2xl hover:border-white/20">
              
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Hypertension</h2>
                  <p className="text-indigo-200/60 font-medium">Commonly known as High Blood Pressure</p>
                </div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Moderate Risk
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left col inside card */}
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-100 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Core Explanation
                    </h3>
                    <p className="text-indigo-200/80 leading-relaxed font-light text-sm md:text-base">
                      A condition in which the force of the blood against the artery walls is too high. Usually hypertension is defined as blood pressure above 130/80, and is considered severe if the pressure is above 180/120.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-100 mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> What It Means
                    </h3>
                    <ul className="space-y-2 text-indigo-200/80 font-light text-sm md:text-base">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Increased workload on the heart and blood vessels.
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Often has no visible symptoms over long periods.
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Can lead to heart disease, stroke, or kidney failure if left untreated.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right col inside card: Medication & Context */}
                <div className="bg-black/20 rounded-2xl p-5 border border-white/5">
                  <h3 className="text-base font-semibold text-indigo-50 uppercase tracking-widest mb-4">Medication Context</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300 mb-1">Purpose</h4>
                      <p className="text-xs text-indigo-200/70">To lower blood pressure and reduce the risk of cardiovascular complications.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300 mb-1">Guidelines</h4>
                      <p className="text-xs text-indigo-200/70">Take exactly as prescribed. Do not stop taking abruptly even if feeling better. Monitor BP at home.</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-indigo-300 mb-2">Possible Side Effects</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Dizziness', 'Fatigue', 'Headache', 'Dry Cough'].map((effect) => (
                          <span key={effect} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-200">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Insights */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <h3 className="text-sm font-semibold text-indigo-300/80 uppercase tracking-wider mb-3">Related Insights</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => navigate("/finderx")} className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-indigo-100 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Find Nearby Care
                  </button>
                  <button className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-indigo-100 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                    Dietary Changes
                  </button>
                  <button className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-indigo-100 text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Tracking Log
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Upload Panel */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-8 lg:top-32 bg-slate-900/50 backdrop-blur-2xl rounded-[24px] border border-white/10 p-6 shadow-2xl flex flex-col gap-6 transform transition-all duration-500 hover:border-indigo-500/30">
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] mx-auto mb-4 shadow-[0_0_20px_-5px_theme(colors.purple.500)]">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Prescription AI</h3>
                <p className="text-sm text-indigo-200/70 font-light px-4">
                  Upload a scan or photo of your medical prescription or report for instant AI analysis and translation into plain English.
                </p>
              </div>

              {/* Upload Box */}
              <div className="w-full mt-2 rounded-2xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300 p-8 flex flex-col items-center justify-center cursor-pointer group">
                <svg className="w-10 h-10 text-indigo-400/70 mb-3 group-hover:text-indigo-400 group-hover:-translate-y-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-indigo-200 font-medium mb-1 group-hover:text-white transition-colors">Drag & drop your file</span>
                <span className="text-xs text-indigo-300/50">or click to browse</span>
              </div>

              <button className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                Upload Prescription
              </button>
              
              <p className="text-center text-xs text-indigo-300/40 font-medium tracking-wide">
                SUPPORTED FORMATS: PDF, JPG, PNG
              </p>

            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="w-full bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 py-4 px-6 text-center shadow-lg transform transition-all hover:bg-white/[0.04]">
          <p className="text-sm text-indigo-200/60 font-light flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-amber-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            This information is for understanding only. Please consult a doctor for formal medical advice.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DictionaryX;
