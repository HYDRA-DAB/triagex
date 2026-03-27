function ContextStrip({ selectedFacility }) {
  return (
    <div className="w-full flex justify-center">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        <p className="text-sm font-medium text-indigo-100">
          Showing <span className="text-white font-semibold">{selectedFacility?.tags[2] || "relevant"}</span>-capable facilities near you
        </p>
      </div>
    </div>
  );
}

export default ContextStrip;
