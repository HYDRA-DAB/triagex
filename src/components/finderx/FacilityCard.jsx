function FacilityCard({ facility, isSelected, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`text-left w-full bg-white/[0.02] backdrop-blur-xl rounded-[20px] border p-6 flex flex-col gap-4 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected 
        ? 'border-indigo-400/50 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.3)] bg-white/[0.05]' 
        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-white leading-tight pr-4">{facility.name}</h3>
        <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-lg">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
          {facility.distance}
        </span>
      </div>

      <p className="text-sm font-light text-indigo-100/70 line-clamp-2">
        {facility.desc || 'Healthcare facility providing medical services.'}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {/* Tag badge */}
        {facility.tag && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
            facility.tag === 'Closest'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              : facility.tag === 'Top Rated'
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
          }`}>
            {facility.tag}
          </span>
        )}
        {/* Rating */}
        {facility.rating && (
          <span className="px-3 py-1 bg-black/30 border border-white/5 rounded-full text-xs font-medium text-amber-300 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            {facility.rating}
          </span>
        )}
        {/* Open status */}
        {facility.openNow !== undefined && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
            facility.openNow 
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-300 border-red-500/20'
          }`}>
            {facility.openNow ? 'Open Now' : 'Closed'}
          </span>
        )}
      </div>
    </button>
  );
}

export default FacilityCard;
