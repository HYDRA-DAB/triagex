import { supabase } from "../lib/supabaseClient"

export default function Dashboard({ user }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects for consistency */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-600/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[100px]" />

      <div className="relative z-10 w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-[0_8px_64px_rgba(0,0,0,0.45)] p-8 flex flex-col gap-6 text-center animate-[fadeSlideUp_0.6s_ease-out]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Dashboard</h2>
          <p className="mt-2 text-sm text-slate-400">
            Welcome, <span className="text-violet-400 font-semibold">{user?.email}</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 bg-white/[0.06] backdrop-blur-md border border-white/[0.1] text-slate-300 hover:bg-white/[0.1] hover:border-white/[0.18] active:scale-[0.98]"
        >
          Sign Out
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
