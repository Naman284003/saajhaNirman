import React, { useState } from 'react';
import { MaterialItem, MaterialRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import { MaterialVisual } from './MaterialVisual';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  Phone,
  User,
  Calculator,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface MaterialDetailsModalProps {
  material: MaterialItem | null;
  onClose: () => void;
  onRequestMaterial?: (material: MaterialItem, requestedQty: number) => void;
  onViewMatches?: () => void;
}

export const MaterialDetailsModal: React.FC<MaterialDetailsModalProps> = ({
  material,
  onClose,
  onRequestMaterial,
  onViewMatches,
}) => {
  const { requests, activeSite, showToast } = useApp();
  const [requestedQty, setRequestedQty] = useState<number>(() => {
    return material ? Math.min(150, material.availableQuantity) : 100;
  });
  const [isCopied, setIsCopied] = useState(false);

  if (!material) return null;

  const maxQty = material.availableQuantity;
  const safeRequestedQty = Math.min(Math.max(1, requestedQty), maxQty);
  const remainingSurplus = maxQty - safeRequestedQty;

  // Check if our active site has a matching request for this material
  const matchingSiteRequest = requests.find(
    (r) =>
      r.siteId === activeSite.id &&
      (r.category === material.category || r.materialType.toLowerCase().includes(material.materialType.toLowerCase()))
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast('info', 'Link Copied', 'Material listing details link copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRequestSubmit = () => {
    if (onRequestMaterial) {
      onRequestMaterial(material, safeRequestedQty);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
              {material.category}
            </span>
            <span className="text-xs text-slate-500">· Listing #{material.id.slice(-6)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Main Visual & Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <MaterialVisual
                category={material.category}
                title={material.title}
                className="h-56 w-full"
              />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {material.materialType}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      material.condition === 'Excellent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : material.condition === 'Good'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Condition: {material.condition}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{material.title}</h2>
                {material.titleHi && (
                  <p className="text-sm text-slate-500 font-medium">{material.titleHi}</p>
                )}
              </div>

              {/* Inventory Overview Badge */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Available Surplus</div>
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {material.availableQuantity}{' '}
                    <span className="text-sm font-sans font-normal text-slate-600">{material.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Original Listed</div>
                  <div className="text-sm font-mono text-slate-700 font-medium">
                    {material.originalQuantity} {material.unit}
                  </div>
                  {material.allocatedQuantity > 0 && (
                    <div className="text-[11px] text-amber-600 font-medium">
                      {material.allocatedQuantity} {material.unit} allocated
                    </div>
                  )}
                </div>
              </div>

              {/* Site Details */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong className="text-slate-800">{material.location}</strong> ({material.distanceKm} km from your site)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Pickup Available Until: <strong className="text-slate-800">{material.pickupDeadline}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Listed by: {material.siteName} · {material.contactName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Loading notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Material Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/60">
              {material.description}
            </p>
            {material.loadingNotes && (
              <div className="flex items-start gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Logistics & Loading Note:</strong> {material.loadingNotes}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Scenario Calculation Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold">Feasibility & Remaining Surplus Calculator</h4>
              </div>
              <span className="text-xs text-slate-400">Strict Single-Allocation Math</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Requested Quantity ({material.unit})</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={maxQty}
                    value={safeRequestedQty}
                    onChange={(e) => setRequestedQty(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-800 text-white text-base font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Max available: {maxQty}</div>
              </div>

              <div className="col-span-2 p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-300 font-medium">Calculation Result:</div>
                <div className="text-sm font-mono mt-1 text-emerald-400 flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{material.availableQuantity}</span>
                  <span className="text-slate-400">available</span>
                  <span>−</span>
                  <span className="font-bold text-amber-300">{safeRequestedQty}</span>
                  <span className="text-slate-400">requested</span>
                  <span>=</span>
                  <span className="font-bold text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                    {remainingSurplus} {material.unit} remaining surplus
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5">
                  ✓ Transfer quantity will be reserved only when transfer is accepted by both sites.
                </div>
              </div>
            </div>
          </div>

          {/* Potential Matches Notice */}
          {matchingSiteRequest && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    Direct Request Match Detected!
                  </div>
                  <div className="text-xs text-emerald-800">
                    Your active site requires {matchingSiteRequest.requiredQuantity} {material.unit} of this material.
                  </div>
                </div>
              </div>
              {onViewMatches && (
                <button
                  onClick={() => {
                    onClose();
                    onViewMatches();
                  }}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                >
                  View 92% Match
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${material.contactPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 bg-white px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Contact Site Manager
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              Request {safeRequestedQty} {material.unit}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
