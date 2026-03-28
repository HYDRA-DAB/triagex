import { buildDirectionsUrl, buildBookingSearchUrl } from '../../utils/finderxUtils';

function InfoPanel({ facility, userLocation }) {
  if (!facility) return <div className="h-full bg-white/[0.02] rounded-[24px] border border-white/10 shadow-xl" />;

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[24px] border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col gap-6 h-full transform transition-all duration-500 hover:border-indigo-500/30 relative overflow-hidden">
      
      {/* Background glow for Panel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />

      <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 leading-tight">{facility.name}</h2>
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {facility.rating}
            </span>
            {facility.reviews && (
              <span className="text-indigo-200/50 text-xs">({facility.reviews} reviews)</span>
            )}
            <span className="text-indigo-200/50">•</span>
            <span className="text-indigo-200 font-medium flex items-center gap-1">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {facility.distance}
            </span>
          </div>
        </div>
        {/* Open / Closed badge */}
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
          facility.openNow 
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
            : 'bg-red-500/15 text-red-400 border border-red-500/20'
        }`}>
          {facility.openNow ? '● Open' : '● Closed'}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-indigo-300/70 mb-2">Facility Overview</h4>
          <p className="text-sm text-indigo-100/80 leading-relaxed font-light">{facility.desc || 'Healthcare facility providing medical services.'}</p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3 mt-auto">
          <svg className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-indigo-200 font-semibold text-sm">
              {facility.tag === 'Closest' ? 'Nearest facility to you' : facility.tag === 'Top Rated' ? 'Highly rated by patients' : 'Recommended facility'}
            </span>
            <span className="text-indigo-200/60 text-xs mt-1">Based on proximity and service coverage, this facility is well-suited for immediate care.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {/* Navigate Now */}
        <a
          href={userLocation ? buildDirectionsUrl(userLocation.lat, userLocation.lng, facility.lat, facility.lng) : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex justify-center items-center gap-2 no-underline text-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          Navigate Now
        </a>

        {/* Call + Book row */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${facility.phone}`}
            className="py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-200 hover:text-white font-medium transition-all duration-300 flex justify-center items-center gap-2 no-underline text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
          <a
            href={buildBookingSearchUrl(facility.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-200 hover:text-white font-medium transition-all duration-300 flex justify-center items-center gap-2 no-underline text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Book
          </a>
        </div>
      </div>

    </div>
  );
}

export default InfoPanel;
