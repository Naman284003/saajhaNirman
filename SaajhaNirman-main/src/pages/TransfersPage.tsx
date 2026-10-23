import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transfer, TransferStatus } from '../types';
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Truck,
  MapPin,
  Building,
  User,
  Phone,
  FileText,
  ChevronRight,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';

interface TransfersPageProps {
  highlightedTransferId?: string;
  onNavigateToAnalytics: () => void;
}

export const TransfersPage: React.FC<TransfersPageProps> = ({
  highlightedTransferId,
  onNavigateToAnalytics,
}) => {
  const { transfers, advanceTransferStatus, language } = useApp();
  const [selectedTransferId, setSelectedTransferId] = useState<string>(() => {
    return highlightedTransferId || (transfers[0]?.id ?? '');
  });

  const selectedTransfer = transfers.find((t) => t.id === selectedTransferId) || transfers[0];
  const isHi = language === 'hi';

  const timelineSteps: { key: TransferStatus; label: string; labelHi: string; desc: string }[] = [
    { key: 'Proposed', label: 'Proposed', labelHi: 'प्रस्तावित', desc: 'Match identified & recommended' },
    { key: 'Accepted', label: 'Accepted', labelHi: 'स्वीकृत', desc: 'Both site supervisors agreed' },
    { key: 'Scheduled', label: 'Scheduled', labelHi: 'निर्धारित', desc: 'Pickup window & vehicle booked' },
    { key: 'Picked Up', label: 'Picked Up', labelHi: 'उठाया गया', desc: 'Material loaded & left source' },
    { key: 'Confirmed', label: 'Confirmed', labelHi: 'पुष्टि', desc: 'Arrived & physical check verified' },
    { key: 'Completed', label: 'Completed', labelHi: 'पूर्ण', desc: 'Landfill diversion logged' },
  ];

  const getStepIndex = (status: TransferStatus) => {
    return timelineSteps.findIndex((s) => s.key === status);
  };

  const getNextStatus = (current: TransferStatus): TransferStatus | null => {
    switch (current) {
      case 'Proposed':
        return 'Accepted';
      case 'Accepted':
        return 'Scheduled';
      case 'Scheduled':
        return 'Picked Up';
      case 'Picked Up':
        return 'Confirmed';
      case 'Confirmed':
        return 'Completed';
      default:
        return null;
    }
  };

  if (!selectedTransfer) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ArrowRightLeft className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Material Transfers Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Accept a recommendation in Smart Matches to initiate an active site-to-site recovery transfer.
        </p>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(selectedTransfer.currentStatus);
  const nextStatus = getNextStatus(selectedTransfer.currentStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            {isHi ? 'सामग्री स्थानांतरण ट्रैकिंग' : 'Site Transfer Coordination'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {isHi ? 'स्थानांतरण ट्रैकिंग' : 'Material Transfer Tracking'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and verify the chain of custody from source dispatch to physical inspection on the destination site.
          </p>
        </div>

        {/* Transfer Select Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Active Transfers:</span>
          <select
            value={selectedTransfer.id}
            onChange={(e) => setSelectedTransferId(e.target.value)}
            className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
          >
            {transfers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.transferCode} · {t.materialTitle} ({t.currentStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Transfer Workflow Card (Inspired directly by user reference image mockup!) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Top Info Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono shadow-2xs">
              {selectedTransfer.transferCode}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {selectedTransfer.agreedQuantity} {selectedTransfer.unit} of {selectedTransfer.materialTitle}
              </h3>
              <div className="text-xs text-slate-500">
                Distance: {selectedTransfer.distanceKm} km · Match Score: {selectedTransfer.matchScore}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                selectedTransfer.currentStatus === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Stage: {selectedTransfer.currentStatus}
            </span>
          </div>
        </div>

        {/* 6-Step Visual Timeline */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            {isHi ? 'स्थानांतरण स्थिति प्रगति' : 'Transfer Timeline Progress'}
          </h4>

          <div className="relative">
            {/* Connecting Track Line */}
            <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (timelineSteps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Step Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex flex-col sm:items-center text-left sm:text-center space-y-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-600'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div>
                      <div className={`text-xs font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {isHi ? step.labelHi : step.label}
                      </div>
                      <div className="text-[10px] text-slate-400 hidden sm:block">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transfer Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
          {/* Source & Destination sites */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'स्रोत एवं गंतव्य स्थल' : 'Participating Construction Sites'}
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
                <Building className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">From (Source)</span>
                  <span className="font-bold text-slate-900">{selectedTransfer.sourceSiteName}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-emerald-50/60 rounded-lg">
                <Building className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">To (Destination)</span>
                  <span className="font-bold text-emerald-950">{selectedTransfer.destinationSiteName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Window: {selectedTransfer.scheduledTimeWindow}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Date: {selectedTransfer.scheduledDate}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Gate Pass info */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'रसद एवं वाहन विवरण' : 'Logistics & Dispatch Notes'}
            </h4>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 flex items-start gap-2">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{selectedTransfer.handoverNotes}</span>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs">
                <User className="w-4 h-4 text-slate-400" />
                <span>Site Liaison: <strong>{selectedTransfer.contactPerson}</strong></span>
                <span className="text-slate-400">·</span>
                <a
                  href={`tel:${selectedTransfer.contactPhone}`}
                  className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  {selectedTransfer.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="p-6 border-t border-slate-100 bg-white space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isHi ? 'ऑडिट लॉग (इतिहास)' : 'Verified Chain of Custody Audit Log'}
          </h4>

          <div className="space-y-2">
            {selectedTransfer.history.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 text-xs text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="font-bold text-slate-900">{entry.status}</span>
                  <span className="text-slate-500">— {entry.note}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions: Advance Status button */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {selectedTransfer.currentStatus === 'Completed' ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Transfer completed. Material verified & landfill diversion registered.
              </span>
            ) : (
              <span>Next step required to proceed along recovery chain.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {nextStatus ? (
              <button
                onClick={() => advanceTransferStatus(selectedTransfer.id, nextStatus)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <span>Advance Stage to: "{nextStatus}"</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onNavigateToAnalytics}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                <span>View Waste Diversion Report</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
