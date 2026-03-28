function ContextStrip({ selectedFacility, facilityCount, loading }) {
  let message;
  if (loading) {
    message = (
      <>Searching <span className="text-white font-semibold">nearby hospitals</span>...</>
    );
  } else if (facilityCount > 0) {
    message = (
      <>Showing <span className="text-white font-semibold">{facilityCount} hospitals</span> near you</>
    );
  } else {
    message = (
      <>No hospitals found <span className="text-white font-semibold">within range</span></>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400' : facilityCount > 0 ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
        <p className="text-sm font-medium text-indigo-100">
          {message}
        </p>
      </div>
    </div>
  );
}

export default ContextStrip;
