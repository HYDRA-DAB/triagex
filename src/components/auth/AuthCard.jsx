import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AuthTabs from "./AuthTabs";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

/* ── Icons (inline SVGs for zero deps) ── */

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

/* ── Component ── */

export default function AuthCard() {
  const [tab, setTab] = useState("signin");
  const [remember, setRemember] = useState(false);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  };

  return (
    <div
      className="
        w-full max-w-[420px]
        rounded-2xl
        border border-white/[0.08]
        bg-white/[0.03] backdrop-blur-2xl
        shadow-[0_8px_64px_rgba(0,0,0,0.45)]
        p-8
        flex flex-col gap-6
        animate-[fadeSlideUp_0.6s_ease-out]
      "
    >
      {/* ── Tabs ── */}
      <AuthTabs activeTab={tab} onTabChange={setTab} />

      {/* ── Sign In Form ── */}
      {tab === "signin" && (
        <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Sign in to access secure diagnostics
            </p>
          </div>

          {/* Google */}
          <AuthButton id="btn-google-signin" variant="google" onClick={handleGoogleLogin}>
            <GoogleIcon />
            Continue with Google
          </AuthButton>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-600">
              or use email
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Fields */}
          <AuthInput
            id="signin-email"
            label="Work Email"
            type="email"
            placeholder="you@hospital.org"
            icon={<MailIcon />}
          />
          <AuthInput
            id="signin-password"
            label="Security Key"
            type="password"
            placeholder="••••••••••••"
            icon={<LockIcon />}
          />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="remember-me"
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div
                className={`
                  w-4 h-4 rounded border flex items-center justify-center
                  transition-all duration-200
                  ${
                    remember
                      ? "bg-violet-600 border-violet-500"
                      : "bg-transparent border-white/[0.15]"
                  }
                `}
                onClick={() => setRemember(!remember)}
              >
                {remember && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2 2 4-4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <input
                id="remember-me"
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="sr-only"
              />
              <span className="text-xs text-slate-500">Remember device</span>
            </label>

            <a
              href="#"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Forgot key?
            </a>
          </div>

          {/* CTA */}
          <AuthButton id="btn-authorize" variant="primary" type="submit">
            <LockIcon />
            Authorize Identity
          </AuthButton>
        </div>
      )}

      {/* ── Sign Up Form ── */}
      {tab === "signup" && (
        <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Create Secure Account
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Join the privacy-first healthcare platform
            </p>
          </div>

          <AuthInput
            id="signup-name"
            label="Full Name"
            placeholder="Dr. Jane Smith"
            icon={<UserIcon />}
          />
          <AuthInput
            id="signup-email"
            label="Work Email"
            type="email"
            placeholder="you@hospital.org"
            icon={<MailIcon />}
          />
          <AuthInput
            id="signup-password"
            label="Password"
            type="password"
            placeholder="••••••••••••"
            icon={<LockIcon />}
          />

          {/* Terms */}
          <p className="text-[11px] text-slate-600 leading-relaxed">
            By creating an account you agree to our{" "}
            <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">
              Privacy Policy
            </a>
            .
          </p>

          {/* CTA */}
          <AuthButton id="btn-create-account" variant="primary" type="submit">
            Create Secure Account
          </AuthButton>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-[11px] text-slate-600">
        Protected by end-to-end encryption
      </p>
    </div>
  );
}
