import FacilityCard from './FacilityCard';

function FacilityList({ facilities, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-6 mt-4 w-full relative z-10">
      <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Top Facilities in Your Perimeter</h2>
        <p className="text-indigo-200/70 font-light text-sm">Highly rated centers equipped to handle your symptoms</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map(fac => (
          <FacilityCard 
            key={fac.id} 
            facility={fac} 
            isSelected={selectedId === fac.id} 
            onClick={() => onSelect(fac)} 
          />
        ))}
      </div>
    </div>
  );
}

export default FacilityList;
