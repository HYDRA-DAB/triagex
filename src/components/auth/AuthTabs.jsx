export default function AuthTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: "signin", label: "Sign In" },
    { key: "signup", label: "Sign Up" },
  ];

  return (
    <div className="relative flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.06]">
      {/* Sliding indicator */}
      <div
        className={`
          absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg
          bg-gradient-to-r from-violet-600/80 to-indigo-600/80
          shadow-[0_0_16px_rgba(139,92,246,0.25)]
          transition-transform duration-300 ease-out
          ${activeTab === "signup" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"}
        `}
      />

      {tabs.map((tab) => (
        <button
          key={tab.key}
          id={`auth-tab-${tab.key}`}
          onClick={() => onTabChange(tab.key)}
          className={`
            relative z-10 flex-1 py-2.5 text-sm font-semibold tracking-wide
            rounded-lg cursor-pointer transition-colors duration-300
            ${
              activeTab === tab.key
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
