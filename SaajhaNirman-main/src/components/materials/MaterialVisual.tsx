import React from 'react';
import { MaterialCategory } from '../../types';

interface MaterialVisualProps {
  category: MaterialCategory;
  title: string;
  className?: string;
  imageUrl?: string;
}

export const MaterialVisual: React.FC<MaterialVisualProps> = ({
  category,
  title,
  className = 'h-48 w-full',
  imageUrl,
}) => {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // If custom image fails, hide it to reveal SVG fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Domain-crafted architectural visualizations
  switch (category) {
    case 'Bricks & Blocks':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-amber-800 via-stone-800 to-amber-950 p-4 flex flex-col justify-between ${className}`}>
          {/* Brick masonry pattern */}
          <div className="absolute inset-0 opacity-25">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="brick-pat" width="48" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 0 0 L 48 0 L 48 24 L 0 24 Z" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
                  <line x1="0" y1="12" x2="48" y2="12" stroke="#f59e0b" strokeWidth="1.2" />
                  <line x1="24" y1="0" x2="24" y2="12" stroke="#f59e0b" strokeWidth="1.2" />
                  <line x1="0" y1="12" x2="0" y2="24" stroke="#f59e0b" strokeWidth="1.2" />
                  <line x1="48" y1="12" x2="48" y2="24" stroke="#f59e0b" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#brick-pat)" />
            </svg>
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-200/90 bg-amber-950/60 px-2 py-0.5 rounded backdrop-blur-xs border border-amber-500/20">
              Masonry
            </span>
            <span className="text-xs font-mono text-amber-300">Standard 9×4×3</span>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="text-lg font-bold text-white tracking-tight drop-shadow-md">
              {title}
            </div>
            <div className="text-xs text-amber-200/80 mt-0.5">
              Reclaimed clay · Cleaned & palletized
            </div>
          </div>
        </div>
      );

    case 'Tiles & Flooring':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-700 via-stone-800 to-cyan-950 p-4 flex flex-col justify-between ${className}`}>
          {/* Ceramic tile grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="tile-pat" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect x="2" y="2" width="36" height="36" rx="2" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tile-pat)" />
            </svg>
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-200/90 bg-cyan-950/60 px-2 py-0.5 rounded backdrop-blur-xs border border-cyan-500/20">
              Ceramic / Vitrified
            </span>
            <span className="text-xs font-mono text-cyan-300">600×600 mm</span>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="text-lg font-bold text-white tracking-tight drop-shadow-md">
              {title}
            </div>
            <div className="text-xs text-cyan-200/80 mt-0.5">
              High sheen · Original carton boxes
            </div>
          </div>
        </div>
      );

    case 'Pipes & Plumbing':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-800 to-indigo-950 p-4 flex flex-col justify-between ${className}`}>
          {/* Pipe contour lines */}
          <div className="absolute inset-0 opacity-25">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pipe-pat" width="60" height="30" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="8" x2="60" y2="8" stroke="#60a5fa" strokeWidth="3" />
                  <line x1="0" y1="22" x2="60" y2="22" stroke="#93c5fd" strokeWidth="3" />
                  <circle cx="15" cy="15" r="4" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                  <circle cx="45" cy="15" r="4" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pipe-pat)" />
            </svg>
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200/90 bg-blue-950/60 px-2 py-0.5 rounded backdrop-blur-xs border border-blue-500/20">
              Plumbing Conduits
            </span>
            <span className="text-xs font-mono text-blue-300">Schedule 40</span>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="text-lg font-bold text-white tracking-tight drop-shadow-md">
              {title}
            </div>
            <div className="text-xs text-blue-200/80 mt-0.5">
              4m lengths · Clean drainage rating
            </div>
          </div>
        </div>
      );

    case 'Timber & Wood':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-yellow-950 via-amber-900 to-stone-900 p-4 flex flex-col justify-between ${className}`}>
          {/* Wood grain pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="wood-pat" width="100" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0,10 Q25,2 50,10 T100,10" fill="none" stroke="#fde68a" strokeWidth="1.5" />
                  <path d="M0,18 Q25,12 50,18 T100,18" fill="none" stroke="#fde68a" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#wood-pat)" />
            </svg>
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-200/90 bg-amber-950/60 px-2 py-0.5 rounded backdrop-blur-xs border border-amber-500/20">
              Salvaged Timber
            </span>
            <span className="text-xs font-mono text-amber-300">Seasoned 2×6</span>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="text-lg font-bold text-white tracking-tight drop-shadow-md">
              {title}
            </div>
            <div className="text-xs text-amber-200/80 mt-0.5">
              Denailed teak · High structural integrity
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-800 to-emerald-900 p-4 flex flex-col justify-between ${className}`}>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-200/90 bg-emerald-950/60 px-2 py-0.5 rounded backdrop-blur-xs border border-emerald-500/20">
              {category}
            </span>
            <span className="text-xs font-mono text-emerald-300">Verified Quality</span>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="text-lg font-bold text-white tracking-tight drop-shadow-md">
              {title}
            </div>
            <div className="text-xs text-emerald-200/80 mt-0.5">
              Circulated surplus · Diverted from landfill
            </div>
          </div>
        </div>
      );
  }
};
