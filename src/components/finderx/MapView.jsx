import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// ─── Custom Marker Icons ────────────────────────────────────────────
function createMarkerIcon(color, size = 12, selected = false) {
  const outerSize = selected ? size + 10 : size + 6;
  return L.divIcon({
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    html: `
      <div style="
        width: ${outerSize}px; height: ${outerSize}px;
        border-radius: 50%;
        background: ${color}33;
        border: 2px solid ${color};
        display: flex; align-items: center; justify-content: center;
        ${selected ? `box-shadow: 0 0 16px ${color}88, 0 0 32px ${color}44;` : `box-shadow: 0 0 8px ${color}44;`}
        transition: all 0.3s ease;
      ">
        <div style="
          width: ${size / 2}px; height: ${size / 2}px;
          border-radius: 50%;
          background: ${color};
        "></div>
      </div>
    `,
  });
}

function createUserIcon() {
  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute; inset: 0;
          border-radius: 50%;
          background: rgba(96, 165, 250, 0.25);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #60a5fa;
          border: 2.5px solid white;
          box-shadow: 0 0 12px rgba(96, 165, 250, 0.7);
        "></div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
  });
}

const userIcon = createUserIcon();
const defaultIcon = createMarkerIcon('#818cf8', 12, false);  // indigo
const selectedIcon = createMarkerIcon('#a78bfa', 14, true);  // purple

// ─── Map Auto-Centering ─────────────────────────────────────────────
function MapUpdater({ center, selectedFacility }) {
  const map = useMap();
  const initialRef = useRef(true);

  useEffect(() => {
    if (initialRef.current && center) {
      map.setView([center.lat, center.lng], 14, { animate: false });
      initialRef.current = false;
    }
  }, [center, map]);

  useEffect(() => {
    if (selectedFacility) {
      map.flyTo([selectedFacility.lat, selectedFacility.lng], 15, {
        duration: 0.8,
      });
    }
  }, [selectedFacility, map]);

  return null;
}

// ─── MapView Component ──────────────────────────────────────────────
function MapView({ facilities, selectedId, onSelect, userLocation }) {
  if (!userLocation) return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-[24px] border border-white/10 p-2 shadow-xl relative overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center">
      <p className="text-indigo-200/50 text-sm">Waiting for location...</p>
    </div>
  );

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-[24px] border border-white/10 p-2 shadow-xl group relative overflow-hidden h-[400px] md:h-[500px]">
      <div className="w-full h-full rounded-[20px] overflow-hidden relative border border-white/5">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={14}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />

          <MapUpdater center={userLocation} selectedFacility={facilities.find(f => f.id === selectedId)} />

          {/* User location marker */}
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <span style={{ color: '#1e1b4b', fontWeight: 600, fontSize: '13px' }}>📍 Your Location</span>
            </Popup>
          </Marker>

          {/* Facility markers */}
          {facilities.map((fac) => (
            <Marker
              key={fac.id}
              position={[fac.lat, fac.lng]}
              icon={selectedId === fac.id ? selectedIcon : defaultIcon}
              eventHandlers={{ click: () => onSelect(fac) }}
            >
              <Popup>
                <div style={{ color: '#1e1b4b', minWidth: '140px' }}>
                  <strong style={{ fontSize: '13px' }}>{fac.name}</strong>
                  <br />
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>{fac.distance}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;
