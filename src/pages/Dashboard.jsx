import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);

      if (!data.user) {
        navigate("/");
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Mock Data 
  const userName = currentUser?.email?.split('@')[0] || "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-slate-100 font-sans relative overflow-y-auto selection:bg-purple-500/30 pb-20">
      
      <Navbar />

      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Main Dashboard Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 flex flex-col gap-8 md:gap-10">
        
        {/* USER WELCOME SECTION */}
        <div className="flex justify-between items-end bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{userName}</span>
            </h1>
            <p className="text-indigo-200/70 font-light mt-2">Here is your clinical health summary for today.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white shadow-lg transition-all duration-300 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/50"
          >
            Sign Out
          </button>
        </div>

        {/* DASHBOARD LAYOUT GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Overview & Insights */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. HEALTH OVERVIEW CARD */}
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] border border-white/10 p-6 md:p-8 shadow-2xl transition-all duration-500 hover:bg-white/[0.04] hover:shadow-purple-900/20">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Health Overview</h2>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Stable
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-black/20 rounded-xl p-5 border border-white/5">
                  <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">Current Condition</h3>
                  <p className="text-lg font-medium text-white">Mild Seasonal Allergies</p>
                  <p className="text-sm text-indigo-200/60 mt-1">Symptoms are currently well managed.</p>
                </div>
                <div className="flex-1 bg-black/20 rounded-xl p-5 border border-white/5">
                  <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">Next Suggested Step</h3>
                  <p className="text-lg font-medium text-white">Allergy Medication</p>
                  <p className="text-sm text-indigo-200/60 mt-1">Take prescribed antihistamines at 8 PM.</p>
                </div>
              </div>
            </div>

            {/* 2. HEALTH INTELLIGENCE */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] border border-white/10 p-6 shadow-xl flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-white">Symptom Severity</h3>
                <div className="flex-1 flex items-end gap-2 h-32 pt-4">
                  {/* Bar Chart Mockup */}
                  {[40, 60, 80, 50, 30, 20].map((h, i) => (
                     <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-md relative group">
                        <div className="absolute bottom-0 w-full bg-indigo-500/70 rounded-t-md transition-all duration-500 group-hover:bg-indigo-400" style={{ height: `${h}%` }}></div>
                     </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-indigo-300/50">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] border border-white/10 p-6 shadow-xl flex flex-col items-center justify-center gap-4 text-center">
                <h3 className="text-lg font-semibold text-white w-full text-left">Recovery Indicator</h3>
                <div className="relative w-32 h-32 mt-2">
                   {/* Circular Progress Mockup */}
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                     <circle cx="64" cy="64" r="56" fill="transparent" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="351.858" strokeDashoffset="87.96" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-bold text-white">75%</span>
                   </div>
                </div>
                <p className="text-sm text-indigo-200/70 font-light">+5% better than yesterday</p>
              </div>
            </div>

            {/* 3. VITALS CARDS */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-5 shadow-lg group hover:border-indigo-500/40 transition-colors">
                <svg className="w-6 h-6 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                <div className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">7h 12m</div>
                <div className="text-xs text-indigo-200/60 uppercase tracking-widest mt-1">Sleep Score</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-xl rounded-2xl border border-purple-500/20 p-5 shadow-lg group hover:border-purple-500/40 transition-colors">
                <svg className="w-6 h-6 text-purple-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <div className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">84/100</div>
                <div className="text-xs text-indigo-200/60 uppercase tracking-widest mt-1">Energy Level</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-xl rounded-2xl border border-blue-500/20 p-5 shadow-lg group hover:border-blue-500/40 transition-colors">
                <svg className="w-6 h-6 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <div className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">Low</div>
                <div className="text-xs text-indigo-200/60 uppercase tracking-widest mt-1">Stress Impact</div>
              </div>
            </div>

            {/* 4. PAST RESULTS & RECENT ACTIVITY */}
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] border border-white/10 p-6 shadow-xl flex flex-col gap-5">
              <h3 className="text-lg font-semibold text-white">Recent Activity & Past Results</h3>
              <div className="flex flex-col gap-4">
                
                {/* Activity Card 1 */}
                <div className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors cursor-default">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Last Analysis: Viral Pharyngitis</h4>
                        <p className="text-xs text-indigo-200/60 mt-0.5">SymptomX Report • Oct 12, 2023</p>
                      </div>
                   </div>
                   <span className="text-xs font-semibold px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap hidden sm:block">Viewed</span>
                </div>

                {/* Activity Card 2 */}
                <div className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors cursor-default">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Dictionary Search: Antihistamines</h4>
                        <p className="text-xs text-indigo-200/60 mt-0.5">DictionaryX Term • Oct 10, 2023</p>
                      </div>
                   </div>
                </div>

                {/* Activity Card 3 */}
                <div className="flex justify-between items-center p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors cursor-default">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">FinderX: Westside Clinic</h4>
                        <p className="text-xs text-indigo-200/60 mt-0.5">Facility Viewed • Oct 05, 2023</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* RIGHT COLUMN: Actionable Modules & Medical Records */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* 5. SHORTCUTS TO MODULES */}
            <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[24px] border border-indigo-500/30 p-6 shadow-2xl flex flex-col gap-4">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-indigo-300/80 mb-2">Quick Actions</h3>
              
              <button onClick={() => navigate('/symptomx')} className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Analyze Again
                </span>
                <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

              <button onClick={() => navigate('/dictionaryx')} className="w-full py-4 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Understand Condition
                </span>
                <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

              <button onClick={() => navigate('/finderx')} className="w-full py-4 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all duration-300 flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Find Care
                </span>
                <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* 6. TIMELINE & MEDICAL RECORDS */}
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[20px] border border-white/10 p-6 shadow-xl flex flex-col gap-6">
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Medical Records</h3>
                <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                     <span className="text-sm text-indigo-200">Current Medications</span>
                     <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">2 Active</span>
                  </div>
                  <p className="text-sm font-light text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Loratadine (10mg)
                  </p>
                  <p className="text-sm font-light text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Fluticasone Spray
                  </p>
                  <button className="mt-3 w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-xs font-medium text-indigo-200 focus:outline-none focus:ring-1 focus:ring-white/20">
                    Update Records
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Health Timeline</h3>
                <div className="relative border-l border-white/10 ml-3 flex flex-col gap-6 p-2">
                   <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[1.5rem] top-1 border-[3px] border-slate-900 shadow-[0_0_10px_theme(colors.indigo.500)]" />
                      <p className="text-xs text-indigo-300/60 mb-1">Today, 9:00 AM</p>
                      <p className="text-sm text-white font-medium">Recorded Symptoms</p>
                      <p className="text-xs text-indigo-200/70 mt-1">Nasal congestion, mild headache.</p>
                   </div>
                   <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-white/20 rounded-full -left-[1.5rem] top-1 border-[3px] border-slate-900" />
                      <p className="text-xs text-indigo-300/60 mb-1">Yesterday, 8:00 PM</p>
                      <p className="text-sm text-white font-medium">Medication Taken</p>
                   </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
