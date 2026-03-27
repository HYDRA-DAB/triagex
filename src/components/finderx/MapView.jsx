function MapView({ facilities, selectedId, onSelect }) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-[24px] border border-white/10 p-2 shadow-xl group relative overflow-hidden h-[400px] md:h-[500px]">
      {/* Mock Map Background */}
      <div className="w-full h-full bg-slate-900/60 rounded-[20px] relative border border-white/5 overflow-hidden">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        {/* User Location Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping absolute" />
          <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-white shadow-[0_0_15px_rgba(96,165,250,0.6)] z-10" />
        </div>

        {/* Facility Markers */}
        {facilities.map((fac, idx) => {
          // Hardcode positions just for mockup
          const positions = [
            { top: '30%', left: '60%' },
            { top: '70%', left: '20%' },
            { top: '45%', left: '35%' }
          ];
          const pos = positions[idx % positions.length];
          const isSelected = selectedId === fac.id;

          return (
            <button 
              key={fac.id}
              onClick={() => onSelect(fac)}
              className={`absolute flex flex-col items-center gap-1 transition-all duration-300 ${isSelected ? 'scale-110 z-20' : 'scale-100 hover:scale-105 z-10'}`}
              style={pos}
            >
              <div className={`w-6 h-6 rounded-full border-2 shadow-lg flex items-center justify-center bg-slate-800 ${isSelected ? 'border-purple-400 shadow-purple-500/50' : 'border-indigo-500 shadow-indigo-500/30'}`}>
                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-purple-400' : 'bg-indigo-400'}`} />
              </div>
              {isSelected && (
                <div className="bg-slate-900 border border-purple-500/50 px-2 py-1 rounded text-xs font-semibold shadow-xl whitespace-nowrap text-purple-200">
                  {fac.name}
                </div>
              )}
            </button>
          );
        })}

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/10 flex flex-col overflow-hidden">
            <button className="p-2 hover:bg-white/10 text-indigo-200 transition-colors border-b border-white/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <button className="p-2 hover:bg-white/10 text-indigo-200 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
          </div>
          <button className="bg-indigo-500/20 backdrop-blur-md rounded-lg border border-indigo-500/30 p-2 hover:bg-indigo-500/30 text-indigo-100 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapView;
