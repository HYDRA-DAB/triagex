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
        {facility.desc}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {facility.tags.map(tag => (
          <span key={tag} className="px-3 py-1 bg-black/30 border border-white/5 rounded-full text-xs font-medium text-indigo-200">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

export default FacilityCard;
