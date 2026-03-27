import AuthCard from "../components/auth/AuthCard";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

/* ── Decorative icons (inline SVG) ── */

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  </svg>
);

const LockKeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m11.5 11.5 4-4" />
    <path d="m17 7-3-.5-.5-3" />
  </svg>
);

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#060a14]">

      {/* ═══════════════════════════════════
          GLOBAL BACKGROUND EFFECTS
      ═══════════════════════════════════ */}

      {/* Top-left violet glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-600/[0.07] blur-[120px]" />
      {/* Bottom-right blue glow */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-blue-600/[0.06] blur-[140px]" />
      {/* Center subtle warm glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[100px]" />


      {/* ═══════════════════════════════════
          LEFT PANEL — Branding
      ═══════════════════════════════════ */}

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16">

        {/* Abstract light streaks background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Diagonal streak 1 */}
          <div className="absolute top-[15%] -left-[10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent rotate-[25deg]" />
          {/* Diagonal streak 2 */}
          <div className="absolute top-[35%] -left-[5%] w-[110%] h-[1px] bg-gradient-to-r from-transparent via-blue-400/15 to-transparent rotate-[18deg]" />
          {/* Diagonal streak 3 */}
          <div className="absolute top-[65%] -left-[10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-violet-400/10 to-transparent rotate-[-12deg]" />
          {/* Diagonal streak 4 */}
          <div className="absolute top-[80%] -left-[5%] w-[110%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent rotate-[8deg]" />
          {/* Radial glow behind heading */}
          <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/[0.04] blur-[80px]" />
        </div>

        {/* ── Top: Logo + Brand + Badge (single row) ── */}
        <div className="relative z-10 flex items-center gap-4">
          {/* Logo + Brand */}
          <a href="/" className="inline-flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="TriageX Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-semibold text-white tracking-tight">
              Triage<span className="text-violet-400">X</span>
            </span>
          </a>

          {/* Divider */}
          <div className="h-5 w-px bg-white/[0.1]" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-emerald-400">
              🔒 Encryption Active
            </span>
          </div>
        </div>

        {/* ── Center: Heading ── */}
        <div className="relative z-10 -mt-8">
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-white">
            Intelligence
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Without
              </span>
              {/* Glow behind "Without" */}
              <span className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 blur-2xl opacity-20 -z-10" />
            </span>
            <br />
            Disclosure.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-400">
            TriageX leverages privacy-first AI to analyze symptoms and clinical
            data without exposing sensitive information — ensuring secure,
            intelligent healthcare decisions at scale.
          </p>
        </div>

        {/* ── Bottom: Info Cards (horizontal row) ── */}
        <div className="relative z-10 flex flex-col lg:flex-row gap-3">
          {/* Card 1: Medical Dashboard */}
          <div className="flex-1 flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-5 py-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.05]">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
              <ActivityIcon />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Medical Dashboard</p>
              <p className="text-xs text-slate-500 mt-0.5">Real-time vitals & AI-powered insights</p>
            </div>
          </div>

          {/* Card 2: Encrypted Items */}
          <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-5 py-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.05]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
                <LockKeyIcon />
              </div>
              <p className="text-sm font-semibold text-white">Secured with E2E</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Your Medics", "Your Analysis", "Your History", "ALL ENCRYPTED"].map(
                (item, i) => (
                  <span
                    key={i}
                    className={`
                      text-[11px] font-medium tracking-wide px-3 py-1.5 rounded-lg
                      ${
                        i === 3
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                          : "bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                      }
                    `}
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════
          RIGHT PANEL — Auth Form
      ═══════════════════════════════════ */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle border between panels */}
        <div className="hidden lg:block absolute left-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

        {/* Decorative dots grid */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Security badge - mobile only (logo shown on left panel for desktop) */}
        <div className="lg:hidden absolute top-6 left-6">
          <a href="/" className="inline-flex items-center gap-2">
            <img
              src={logo}
              alt="TriageX Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-base font-semibold text-white tracking-tight">
              Triage<span className="text-violet-400">X</span>
            </span>
          </a>
        </div>

        {/* Security indicator top-right */}
        <div className="absolute top-6 right-6 flex items-center gap-1.5 text-emerald-400/60">
          <ShieldIcon />
          <span className="text-[10px] font-medium tracking-wider uppercase">Secure</span>
        </div>

        <AuthCard />
      </div>


      {/* ═══════════════════════════════════
          KEYFRAME ANIMATIONS (injected via style tag)
      ═══════════════════════════════════ */}

      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
