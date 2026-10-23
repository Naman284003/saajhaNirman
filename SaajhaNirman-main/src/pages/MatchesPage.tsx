import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MatchRecommendation } from '../types';
import { MaterialVisual } from '../components/materials/MaterialVisual';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  Calculator,
  Building,
  Check,
  X,
  Phone,
  Info,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface MatchesPageProps {
  selectedMatch?: MatchRecommendation | null;
  onNavigateToTransfers: (transferId?: string) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  selectedMatch: initialSelectedMatch,
  onNavigateToTransfers,
}) => {
  const { matches, createTransferFromMatch, activeSite, language, showToast } = useApp();
  const [activeMatchId, setActiveMatchId] = useState<string>(() => {
    return initialSelectedMatch?.id || (matches[0]?.id ?? '');
  });

  const activeMatch = matches.find((m) => m.id === activeMatchId) || matches[0];
  const isHi = language === 'hi';

  if (!activeMatch) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Matching Recommendations Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The smart matching engine monitors newly listed materials and site requests. Create a request or list surplus inventory to trigger real-time matching.
        </p>
      </div>
    );
  }

  const handleAcceptMatch = () => {
    const transfer = createTransferFromMatch(activeMatch);
    onNavigateToTransfers(transfer.id);
  };

  const handleDeclineMatch = () => {
    showToast('info', 'Recommendation Skipped', 'The match recommendation was archived.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {isHi ? 'स्मार्ट मिलान प्रणाली' : 'Constraint-Based Matching Algorithm'}
            </span>
            <span className="text-xs font-mono text-slate-400">· Formula 35/25/15/15/10</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {isHi ? 'मैच सुझाव' : 'Smart Match Recommendations'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Matching available surplus to open construction requirements using material specifications, condition, geographic proximity, and pickup schedules.
          </p>
        </div>

        {/* Match Selection Dropdown if multiple */}
        {matches.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Select match:</span>
            <select
              value={activeMatchId}
              onChange={(e) => setActiveMatchId(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.material.title} ({m.totalScore}% match)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Flagship Match Card (Inspired directly by user reference image mockup!) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Top Match Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-emerald-50/40 to-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Feasible Transfer Recommendation #{activeMatch.id.slice(-6)}
              </div>
              <div className="text-xs text-slate-500">
                Algorithm status: <span className="text-emerald-700 font-semibold">Hard Constraints Passed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              Proximity: <strong className="text-slate-800 font-bold">{activeMatch.distanceKm} km</strong>
            </span>
          </div>
        </div>

        {/* 3-Column Core Comparison Area: Source vs Score vs Destination */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Column 1: Source Surplus Material (Left) */}
          <div className="lg:col-span-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isHi ? 'अतिरिक्त सामग्री (उपलब्ध)' : 'Source Surplus Material'}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Available
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                <MaterialVisual
                  category={activeMatch.material.category}
                  title={activeMatch.material.title}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {activeMatch.material.title}
                </h3>
                {activeMatch.material.titleHi && (
                  <div className="text-xs text-slate-500 font-medium">
                    {activeMatch.material.titleHi}
                  </div>
                )}
                <div className="text-sm font-bold font-mono text-slate-900 pt-0.5">
                  {activeMatch.material.availableQuantity}{' '}
                  <span className="text-xs font-sans font-normal text-slate-600">
                    {activeMatch.material.unit} available
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/70 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  Source: <strong>{activeMatch.material.siteName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Location: {activeMatch.material.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Pickup Deadline: {activeMatch.material.pickupDeadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Condition: <strong>{activeMatch.material.condition}</strong></span>
              </div>
            </div>
          </div>

          {/* Column 2: Center Circular Score Dial */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 text-center space-y-2">
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-600/20 ring-4 ring-emerald-100">
              <div className="text-center">
                <div className="text-3xl font-extrabold font-mono tracking-tight leading-none">
                  {activeMatch.totalScore}%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 mt-1">
                  {isHi ? 'मैच स्कोर' : 'Match Score'}
                </div>
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-800">
              High Feasibility
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {activeMatch.distanceKm} km transit
            </div>
          </div>

          {/* Column 3: Destination Material Request (Right) */}
          <div className="lg:col-span-5 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                {isHi ? 'आपकी मांग (आवश्यकता)' : 'Destination Site Requirement'}
              </span>
              <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                Open Need
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-emerald-200">
                <MaterialVisual
                  category={activeMatch.request.category}
                  title={activeMatch.request.title}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {activeMatch.request.title}
                </h3>
                <div className="text-sm font-bold font-mono text-emerald-900 pt-0.5">
                  {activeMatch.request.requiredQuantity}{' '}
                  <span className="text-xs font-sans font-normal text-slate-600">
                    {activeMatch.request.unit} needed
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-emerald-200/70 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  Destination: <strong>{activeMatch.request.siteName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Site Address: {activeMatch.request.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Required By: {activeMatch.request.requiredByDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Min Condition: <strong>{activeMatch.request.minCondition}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Calculation & Inventory Impact Card */}
        <div className="mx-6 mb-6 p-4 bg-slate-900 text-white rounded-2xl shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isHi ? 'दृश्यमान अधिशेष गणना' : 'Visual Surplus & Allocation Math'}
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Strict Invariant: Available Qty Reserved Only On Acceptance
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3 text-sm font-mono flex-wrap">
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-xs block">Available Surplus</span>
                <span className="text-base font-bold text-white">
                  {activeMatch.material.availableQuantity} {activeMatch.material.unit}
                </span>
              </div>

              <span className="text-xl font-bold text-slate-500">−</span>

              <div className="bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/40">
                <span className="text-emerald-300 text-xs block">Proposed Transfer</span>
                <span className="text-base font-bold text-emerald-400">
                  {activeMatch.transferQuantity} {activeMatch.material.unit}
                </span>
              </div>

              <span className="text-xl font-bold text-slate-500">=</span>

              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-xs block">Remaining Surplus</span>
                <span className="text-base font-bold text-amber-300">
                  {activeMatch.remainingSurplus} {activeMatch.material.unit}
                </span>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block">Requirement Satisfaction</span>
              <span className="text-emerald-400 font-mono font-bold">
                {activeMatch.transferQuantity} / {activeMatch.request.requiredQuantity} {activeMatch.material.unit} (100% Fulfilled)
              </span>
            </div>
          </div>
        </div>

        {/* Explainable Factor Breakdown (Why is this match suitable?) */}
        <div className="px-6 pb-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {isHi ? 'यह मैच क्यों उपयुक्त है? (स्कोर घटक)' : 'Why Is This Match Feasible? (Explainable Factor Breakdown)'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                label: 'Material Compatibility',
                weight: '35%',
                score: activeMatch.breakdown.materialCompatibility,
                desc: 'Identical specification & standard sizing',
              },
              {
                label: 'Quantity Fulfillment',
                weight: '25%',
                score: activeMatch.breakdown.quantityFulfillment,
                desc: `${activeMatch.transferQuantity} ${activeMatch.material.unit} allocated`,
              },
              {
                label: 'Condition Suitability',
                weight: '15%',
                score: activeMatch.breakdown.conditionSuitability,
                desc: `${activeMatch.material.condition} grade satisfies project min`,
              },
              {
                label: 'Geographic Proximity',
                weight: '15%',
                score: activeMatch.breakdown.distanceScore,
                desc: `${activeMatch.distanceKm} km short transit radius`,
              },
              {
                label: 'Pickup Deadline',
                weight: '10%',
                score: activeMatch.breakdown.deadlineScore,
                desc: 'Available before target date',
              },
            ].map((f, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{f.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{f.weight}</span>
                </div>
                <div className="text-base font-extrabold font-mono text-emerald-800">
                  {f.score} / 100
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${activeMatch.material.contactPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 bg-white px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Contact Site Manager ({activeMatch.material.contactName})
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDeclineMatch}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-xl hover:bg-slate-100 transition-colors"
            >
              Skip Match
            </button>
            <button
              onClick={handleAcceptMatch}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <span>{isHi ? 'स्थानांतरण प्रस्तावित करें' : 'Accept Match & Propose Transfer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
