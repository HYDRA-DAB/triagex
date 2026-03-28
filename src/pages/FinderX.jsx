import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import FinderHeader from '../components/finderx/FinderHeader';
import ContextStrip from '../components/finderx/ContextStrip';
import MapView from '../components/finderx/MapView';
import InfoPanel from '../components/finderx/InfoPanel';
import FacilityList from '../components/finderx/FacilityList';
import SearchComponent from '../components/finderx/SearchComponent';
import { fetchNearbyHospitals } from '../utils/finderxUtils';

const searchHospitalsIndia = async (query) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=8`
  );

  const data = await res.json();

  return data.map((item, i) => ({
    id: item.place_id || i,
    name: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    distance: "--",
    desc: "Search result",
    tags: ["Search"],
  }));
};

function FinderX() {
  const navigate = useNavigate();

  const [facilities, setFacilities] = useState([]);
  const [nearbyFacilities, setNearbyFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSearching = searchQuery && searchQuery.length > 2;

  useEffect(() => {
    if (!isSearching) {
      if (nearbyFacilities.length > 0 && facilities !== nearbyFacilities) {
        setFacilities(nearbyFacilities);
        setSelectedFacility(nearbyFacilities[0]);
      }
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchHospitalsIndia(searchQuery);
        setFacilities(results);
        if (results.length > 0) {
          setSelectedFacility(results[0]);
        }
      } catch (err) {
        console.error("Global search failed", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, isSearching, nearbyFacilities]);

  // Guard: prevent duplicate fetches (React StrictMode double-mount, re-renders, etc.)
  const hasFetched = useRef(false);

  // ─── Stable fetch function with single retry ─────────────────────
  const loadHospitals = useCallback(async (lat, lng) => {
    console.log('[FinderX] loadHospitals called', { lat, lng });
    setLoading(true);
    setError(null);
    setRetrying(false);

    try {
      const results = await fetchNearbyHospitals(lat, lng, 5000);
      setFacilities(results);
      setNearbyFacilities(results);
      if (results.length > 0) setSelectedFacility(results[0]);
      setLoading(false);
      console.log('[FinderX] ✅ Loaded', results.length, 'hospitals');
    } catch (firstErr) {
      console.warn('[FinderX] First attempt failed:', firstErr.message);

      // ── Retry once after 2.5s ──
      setRetrying(true);
      await new Promise((r) => setTimeout(r, 2500));

      try {
        const results = await fetchNearbyHospitals(lat, lng, 5000);
        setFacilities(results);
        setNearbyFacilities(results);
        if (results.length > 0) setSelectedFacility(results[0]);
        setRetrying(false);
        setLoading(false);
        console.log('[FinderX] ✅ Retry succeeded,', results.length, 'hospitals');
      } catch (retryErr) {
        console.error('[FinderX] ❌ Retry also failed:', retryErr.message);
        setRetrying(false);
        setLoading(false);
        // Only show error if we have NO data from a previous successful load
        if (facilities.length === 0) {
          setError('Unable to fetch hospitals. Please refresh the page to try again.');
        }
      }
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Geolocation (runs once) ─────────────────────────────────────
  useEffect(() => {
    if (hasFetched.current) return;

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (hasFetched.current) return; // double-check after async
        hasFetched.current = true;

        const { latitude: lat, longitude: lng } = position.coords;
        console.log('[FinderX] Location detected:', lat, lng);
        setUserLocation({ lat, lng });
        loadHospitals(lat, lng);
      },
      (geoError) => {
        console.error('[FinderX] Geolocation error:', geoError);
        const messages = {
          1: 'Location access denied. Please allow location permission and refresh.',
          2: 'Location unavailable. Please check your connection.',
          3: 'Location request timed out. Please try again.',
        };
        setError(messages[geoError.code] || 'Could not detect your location.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, [loadHospitals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-slate-100 font-sans relative overflow-hidden selection:bg-purple-500/30">
      <Navbar />

      {/* Background Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12 lg:pb-20 flex flex-col gap-8 md:gap-12">
        <FinderHeader />
        {isSearching ? (
          <div className="w-full flex justify-center">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400' : facilities.length > 0 ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
              <p className="text-sm font-medium text-indigo-100">
                {loading ? 'Searching...' : facilities.length > 0 ? 'Showing results across India' : 'No hospitals found'}
              </p>
            </div>
          </div>
        ) : (
          <ContextStrip
            selectedFacility={selectedFacility}
            facilityCount={facilities.length}
            loading={loading}
          />
        )}

        {/* Error State — only shown after retry also fails AND no data exists */}
        {error && (
          <div className="w-full flex justify-center">
            <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 px-6 py-4 rounded-2xl flex items-center gap-3 max-w-xl">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading / Retrying State */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-400/30 border-t-indigo-400 animate-spin" />
            <p className="text-indigo-200/70 text-sm font-medium animate-pulse">
              {retrying
                ? 'Retrying connection to hospital database...'
                : 'Detecting your location & scanning nearby hospitals...'}
            </p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            <div className="grid lg:grid-cols-12 gap-8 w-full mb-4 relative z-10">
              <div className="lg:col-span-8 w-full relative z-20">
                <SearchComponent
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start w-full">
              <div className="lg:col-span-8 flex flex-col h-full w-full">
                <MapView
                  facilities={facilities}
                  selectedId={selectedFacility?.id}
                  onSelect={setSelectedFacility}
                  userLocation={userLocation}
                />
              </div>
              <div className="lg:col-span-4 w-full h-full">
                <InfoPanel facility={selectedFacility} userLocation={userLocation} />
              </div>
            </div>

            {facilities.length > 0 ? (
              <FacilityList
                facilities={facilities}
                selectedId={selectedFacility?.id}
                onSelect={setSelectedFacility}
              />
            ) : (
              <div className="text-center py-10">
                <p className="text-indigo-200/60 text-sm">No hospitals found within 5 km. Try moving to a different area.</p>
              </div>
            )}

            <div className="flex justify-center -mt-4">
              <button onClick={() => navigate('/dictionaryx')} className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-xl">
                Learn more about condition
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FinderX;
