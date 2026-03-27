import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import FinderHeader from '../components/finderx/FinderHeader';
import ContextStrip from '../components/finderx/ContextStrip';
import MapView from '../components/finderx/MapView';
import InfoPanel from '../components/finderx/InfoPanel';
import FacilityList from '../components/finderx/FacilityList';

const MOCK_FACILITIES = [
  { id: 1, name: "City Central Cardiology", distance: "1.2 km", rating: 4.8, tags: ["ER wait: 10m", "Diagnostics", "Cardiology"], desc: "Comprehensive cardiac care and diagnostics center." },
  { id: 2, name: "Westside General Hospital", distance: "3.5 km", rating: 4.2, tags: ["ER wait: 45m", "General", "Trauma"], desc: "24/7 general hospital with level 1 trauma center." },
  { id: 3, name: "Apex Imaging Center", distance: "0.8 km", rating: 4.9, tags: ["No wait", "Diagnostics", "MRI/CT"], desc: "Advanced medical imaging and diagnostic laboratories." }
];

function FinderX() {
  const navigate = useNavigate();
  const [selectedFacility, setSelectedFacility] = useState(MOCK_FACILITIES[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      <Navbar />

      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 lg:pb-20 flex flex-col gap-8 md:gap-12">
        <FinderHeader />
        <ContextStrip selectedFacility={selectedFacility} />

        <div className="grid lg:grid-cols-12 gap-8 items-start w-full">
          <div className="lg:col-span-8 flex flex-col h-full w-full">
            <MapView facilities={MOCK_FACILITIES} selectedId={selectedFacility.id} onSelect={setSelectedFacility} />
          </div>
          <div className="lg:col-span-4 w-full h-full">
            <InfoPanel facility={selectedFacility} />
          </div>
        </div>

        <FacilityList facilities={MOCK_FACILITIES} selectedId={selectedFacility.id} onSelect={setSelectedFacility} />
        
        <div className="flex justify-center -mt-4">
          <button onClick={() => navigate('/dictionaryx')} className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-xl">
            Learn more about condition
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinderX;
