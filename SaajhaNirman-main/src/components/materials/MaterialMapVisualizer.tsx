import React, { useState } from 'react';
import { MaterialItem, ConstructionSite } from '../../types';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, CheckCircle } from 'lucide-react';

interface MaterialMapVisualizerProps {
  materials: MaterialItem[];
  sites: ConstructionSite[];
  activeSite: ConstructionSite;
  onSelectMaterial?: (material: MaterialItem) => void;
  selectedRadiusKm?: number;
}

export const MaterialMapVisualizer: React.FC<MaterialMapVisualizerProps> = ({
  materials,
  sites,
  activeSite,
  onSelectMaterial,
  selectedRadiusKm = 25,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  // Map coordinates projection for Bangalore sites
  // Bounding box: lat 12.82 to 12.99, lng 77.58 to 77.68
  const minLat = 12.83;
  const maxLat = 12.99;
  const minLng = 77.58;
  const maxLng = 77.68;

  const projectToSvg = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 600 + 50;
    // Invert Y because SVG coordinates go top-down
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 40;
    return { x, y };
  };

  const centerPos = projectToSvg(activeSite.coordinates.lat, activeSite.coordinates.lng);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
      {/* Map Control Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 text-white rounded-xl border border-slate-700/80 backdrop-blur-md text-xs shadow-lg">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold">Bangalore Metro Construction Grid</span>
          <span className="text-slate-400">· Radius: {selectedRadiusKm} km</span>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 backdrop-blur-md shadow-lg">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Map Canvas */}
      <div className="w-full h-80 sm:h-96 overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 700 440"
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            {/* Radial glow for active site */}
            <radialGradient id="active-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background & Grid */}
          <rect width="100%" height="100%" fill="#0f172a" />
          <rect width="100%" height="100%" fill="url(#map-grid)" />

          {/* Major arterial roads (Outer Ring Road, Hosur Road, Old Airport Rd) */}
          <path
            d="M 120 180 Q 300 220 580 320"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 120 180 Q 300 220 580 320"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <path
            d="M 280 60 Q 380 200 480 400"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 280 60 Q 380 200 480 400"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Active Site Proximity Radius Ring */}
          <circle
            cx={centerPos.x}
            cy={centerPos.y}
            r="110"
            fill="url(#active-glow)"
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.6"
          />
          <circle
            cx={centerPos.x}
            cy={centerPos.y}
            r="190"
            fill="none"
            stroke="#059669"
            strokeWidth="0.8"
            strokeDasharray="6 6"
            strokeOpacity="0.3"
          />

          {/* Transit Connection Lines from active site to other sites */}
          {sites.map((st) => {
            if (st.id === activeSite.id) return null;
            const destPos = projectToSvg(st.coordinates.lat, st.coordinates.lng);
            return (
              <g key={`conn-${st.id}`}>
                <line
                  x1={centerPos.x}
                  y1={centerPos.y}
                  x2={destPos.x}
                  y2={destPos.y}
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  strokeOpacity="0.5"
                />
              </g>
            );
          })}

          {/* Sites & Material Markers */}
          {sites.map((st) => {
            const pos = projectToSvg(st.coordinates.lat, st.coordinates.lng);
            const isOrigin = st.id === activeSite.id;
            const siteMaterials = materials.filter((m) => m.siteId === st.id);
            const hasMaterials = siteMaterials.length > 0;
            const isHovered = hoveredSite === st.id;

            return (
              <g
                key={st.id}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredSite(st.id)}
                onMouseLeave={() => setHoveredSite(null)}
                onClick={() => {
                  if (siteMaterials[0] && onSelectMaterial) {
                    onSelectMaterial(siteMaterials[0]);
                  }
                }}
              >
                {/* Marker Outer Ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isOrigin ? 18 : isHovered ? 16 : 13}
                  fill={isOrigin ? '#10b981' : hasMaterials ? '#0284c7' : '#64748b'}
                  fillOpacity="0.25"
                  className="transition-all"
                />

                {/* Marker Center Pin */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isOrigin ? 8 : 6}
                  fill={isOrigin ? '#10b981' : hasMaterials ? '#38bdf8' : '#94a3b8'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* Site Label */}
                <text
                  x={pos.x}
                  y={pos.y - (isOrigin ? 22 : 18)}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="600"
                  className="drop-shadow"
                >
                  {st.name.split('(')[0].trim()}
                </text>

                {/* Materials count pill */}
                {hasMaterials && (
                  <text
                    x={pos.x}
                    y={pos.y + 20}
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="9.5"
                    fontWeight="500"
                  >
                    {siteMaterials.reduce((acc, m) => acc + m.availableQuantity, 0)} units available
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Legend Strip */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
            <span>Your Active Construction Site ({activeSite.name.split('(')[0]})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white"></span>
            <span>Partner Site with Surplus Materials</span>
          </div>
        </div>
        <div className="text-slate-400 text-[11px]">
          Click any site marker to preview local recovery inventory
        </div>
      </div>
    </div>
  );
};
