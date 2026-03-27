function FinderHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
      <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-widest uppercase shadow-[0_0_15px_rgba(99,102,241,0.2)]">
        SMART HEALTHCARE NAVIGATION
      </span>
      <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200 drop-shadow-sm">
        FinderX — <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Find the Right Care</span> Near You
      </h1>
      <p className="text-lg md:text-xl text-indigo-200/80 font-light leading-relaxed">
        Instantly locate highly-rated hospitals, specialized clinics, and rapid diagnostic centers based on your current health needs.
      </p>
    </div>
  );
}

export default FinderHeader;
