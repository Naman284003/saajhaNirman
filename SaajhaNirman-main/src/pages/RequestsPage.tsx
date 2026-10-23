import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialRequest } from '../types';
import {
  FileQuestion,
  Plus,
  Sparkles,
  MapPin,
  Calendar,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface RequestsPageProps {
  onNavigateToCreate: () => void;
  onNavigateToMatches: () => void;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({
  onNavigateToCreate,
  onNavigateToMatches,
}) => {
  const { requests, deleteRequest, activeSite, language, matches } = useApp();
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const isHi = language === 'hi';

  const tabs = ['All', 'Open', 'Matched', 'Partially Fulfilled', 'Fulfilled'];

  const filteredRequests = requests.filter((r) => {
    if (selectedTab === 'All') return true;
    return r.status === selectedTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <FileQuestion className="w-3.5 h-3.5" />
            {isHi ? 'मांग प्रबंधन' : 'Material Demand Console'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {isHi ? 'मेरी मांगें' : 'Site Material Requirements'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your site's ongoing material requests, track fulfillment percentages, and review circular matching opportunities.
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isHi ? '+ नई मांग दर्ज करें' : '+ Create Request'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white px-4 rounded-xl shadow-2xs overflow-x-auto">
        {tabs.map((tab) => {
          const count =
            tab === 'All'
              ? requests.length
              : requests.filter((r) => r.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedTab === tab
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedTab === tab
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FileQuestion className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No requests in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any material requirements marked under "{selectedTab}".
          </p>
          <button
            onClick={onNavigateToCreate}
            className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl"
          >
            Create Request
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const outstanding = req.requiredQuantity - req.fulfilledQuantity;
            const percentDone = Math.round((req.fulfilledQuantity / req.requiredQuantity) * 100);
            const reqMatches = matches.filter((m) => m.request.id === req.id);

            return (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-700">{req.category}</span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Fulfilled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Matched'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">#{req.id.slice(-6)}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{req.title}</h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {req.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Required by: {req.requiredByDate}
                    </span>
                    <span className="text-slate-600">
                      Min condition: <strong>{req.minCondition}</strong>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-2 max-w-md">
                    <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-1">
                      <span>{req.fulfilledQuantity} / {req.requiredQuantity} {req.unit} fulfilled</span>
                      <span className="font-bold">{percentDone}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${percentDone}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Status & Action Strip */}
                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right font-mono">
                    <div className="text-xs text-slate-400 uppercase font-bold">Outstanding Needed</div>
                    <div className="text-lg font-bold text-amber-800">
                      {outstanding} <span className="text-xs font-normal text-slate-600">{req.unit}</span>
                    </div>
                    {reqMatches.length > 0 && (
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                        {reqMatches.length} nearby match ready
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onNavigateToMatches}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Find Matches</span>
                    </button>

                    <button
                      onClick={() => deleteRequest(req.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Cancel Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
