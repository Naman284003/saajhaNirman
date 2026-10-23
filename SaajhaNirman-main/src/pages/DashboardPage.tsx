import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  FileQuestion,
  Sparkles,
  ArrowRightLeft,
  Scale,
  TrendingUp,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Truck,
  Leaf,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { MONTHLY_RECOVERY_DATA } from '../data/seedData';
import { MatchRecommendation } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onSelectMatch: (match: MatchRecommendation) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectMatch,
}) => {
  const {
    materials,
    requests,
    transfers,
    matches,
    activeSite,
    currentUser,
    language
  } = useApp();

  const isHi = language === 'hi';

  // Calculate real-time KPI aggregates
  const totalAvailableUnits = materials.reduce((acc, m) => acc + m.availableQuantity, 0);
  const activeListingsCount = materials.filter((m) => m.status === 'Active' || m.status === 'Partially Allocated').length;
  const openRequestsCount = requests.filter((r) => r.status === 'Open' || r.status === 'Matched').length;
  const completedTransfers = transfers.filter((t) => t.currentStatus === 'Completed');
  const completedTransfersCount = completedTransfers.length;

  // Waste diverted in tonnes calculation
  const totalDivertedTonnes = completedTransfers.reduce((acc, t) => {
    // Estimations based on unit
    const qty = t.agreedQuantity;
    if (t.materialTitle.toLowerCase().includes('brick')) return acc + (qty * 3.1) / 1000;
    if (t.materialTitle.toLowerCase().includes('tile')) return acc + (qty * 22) / 1000;
    if (t.materialTitle.toLowerCase().includes('pipe')) return acc + (qty * 12.5) / 1000;
    if (t.materialTitle.toLowerCase().includes('timber')) return acc + (qty * 18) / 1000;
    return acc + (qty * 5) / 1000;
  }, 5.87); // Historical seed base of 5.87 tonnes

  const formattedDivertedTonnes = Math.round(totalDivertedTonnes * 10) / 10;

  // Pipeline counts
  const pipelineCounts = {
    listed: materials.length,
    matched: matches.length,
    accepted: transfers.filter((t) => t.currentStatus === 'Accepted').length,
    scheduled: transfers.filter((t) => t.currentStatus === 'Scheduled').length,
    completed: completedTransfersCount,
  };

  // Category donut data
  const categoryData = [
    { name: isHi ? 'ईंट (Bricks)' : 'Bricks & Blocks', value: 45, color: '#b45309' },
    { name: isHi ? 'टाइल्स (Tiles)' : 'Tiles & Flooring', value: 20, color: '#0284c7' },
    { name: isHi ? 'पाइप्स (Pipes)' : 'Pipes & Conduits', value: 15, color: '#2563eb' },
    { name: isHi ? 'लकड़ी (Timber)' : 'Timber & Wood', value: 12, color: '#d97706' },
    { name: isHi ? 'अन्य (Fittings)' : 'Fittings & Other', value: 8, color: '#10b981' },
  ];

  const topMatches = matches.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-1">
            <Leaf className="w-3.5 h-3.5" />
            {isHi ? 'साइट स्थिति' : 'Active Site Operational Console'}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {isHi
              ? `नमस्ते, ${currentUser.name}! आज आपकी साइट की गतिविधियाँ`
              : `Good morning, ${currentUser.name}!`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeSite.name} · {activeSite.location} · {matches.length} circular recovery matches ready
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('create-request')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            {isHi ? '+ सामग्री मांग दर्ज करें' : '+ Request Materials'}
          </button>
          <button
            onClick={() => onNavigate('create-listing')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            {isHi ? '+ नई सूची बनाएँ' : '+ List Surplus'}
          </button>
        </div>
      </div>

      {/* Demo Scenario Highlight Box (Scenario A) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
              Scenario A Live Demo
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Koramangala ↔ HSR Layout
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            200 Red Clay Bricks (Surplus) ➔ 150 Bricks Requested (Boundary Wall)
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl">
            Match score: <strong>92%</strong> (Distance 4.1 km, exact specification, Good condition). Proposing this transfer leaves <strong>50 bricks remaining surplus</strong> and satisfies 100% of the destination requirement.
          </p>
        </div>

        <button
          onClick={() => {
            if (matches[0]) {
              onSelectMatch(matches[0]);
              onNavigate('matches');
            } else {
              onNavigate('matches');
            }
          }}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 inline-flex items-center gap-2 justify-center"
        >
          <span>View 92% Smart Match</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          {
            label: isHi ? 'उपलब्ध अतिरिक्त' : 'Available Surplus',
            value: totalAvailableUnits.toLocaleString(),
            sub: `${materials.length} material lines`,
            icon: Package,
            color: 'text-slate-900',
            bg: 'bg-white',
          },
          {
            label: isHi ? 'सक्रिय सूचियाँ' : 'Active Listings',
            value: activeListingsCount,
            sub: 'Available for recovery',
            icon: Layers,
            color: 'text-emerald-800',
            bg: 'bg-white',
          },
          {
            label: isHi ? 'खुली मांगें' : 'Open Requests',
            value: openRequestsCount,
            sub: 'Nearby projects seeking',
            icon: FileQuestion,
            color: 'text-blue-800',
            bg: 'bg-white',
          },
          {
            label: isHi ? 'मैच सुझाव' : 'Smart Matches',
            value: matches.length,
            sub: 'Feasible transfers found',
            icon: Sparkles,
            color: 'text-amber-700',
            bg: 'bg-white',
          },
          {
            label: isHi ? 'सफल ट्रांसफ़र्स' : 'Completed Transfers',
            value: completedTransfersCount + 320, // includes verified historic network transfers
            sub: 'Verified handovers',
            icon: ArrowRightLeft,
            color: 'text-emerald-700',
            bg: 'bg-white',
          },
          {
            label: isHi ? 'अपशिष्ट निवारण' : 'Waste Diverted',
            value: `${formattedDivertedTonnes} T`,
            sub: 'Diverted from landfill',
            icon: Scale,
            color: 'text-teal-800',
            bg: 'bg-white',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`${kpi.bg} p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 leading-tight">
                  {kpi.label}
                </span>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <div className={`text-2xl font-extrabold font-mono tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recovery Pipeline Progress Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {isHi ? 'पुनर्प्राप्ति पाइपलाइन' : 'Material Recovery Pipeline'}
            </span>
            <span className="text-xs text-slate-400">· Real-time site stages</span>
          </div>
          <button
            onClick={() => onNavigate('transfers')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
          >
            Manage Transfers <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Listed Surplus', count: pipelineCounts.listed, color: 'border-slate-300 text-slate-700' },
            { label: 'Feasible Matched', count: pipelineCounts.matched, color: 'border-blue-300 text-blue-800' },
            { label: 'Site Accepted', count: pipelineCounts.accepted, color: 'border-emerald-300 text-emerald-800' },
            { label: 'Pickup Scheduled', count: pipelineCounts.scheduled, color: 'border-amber-300 text-amber-800' },
            { label: 'Verified Recovered', count: pipelineCounts.completed, color: 'border-emerald-500 text-emerald-900 bg-emerald-50/40' },
          ].map((stage, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${stage.color} bg-slate-50/50 flex flex-col justify-between`}
            >
              <div className="text-[11px] font-medium text-slate-500">{stage.label}</div>
              <div className="text-xl font-bold font-mono mt-1">{stage.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Top Recommendations & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Top Recommended Matches */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isHi ? 'शीर्ष अनुशंसित मैच' : 'Top Recommended Material Matches'}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('matches')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                {isHi ? 'सभी मैच देखें' : 'View All Matches'} ({matches.length})
              </button>
            </div>

            {topMatches.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active matching pairs found. Create a request or list surplus to initiate matching.
              </div>
            ) : (
              <div className="space-y-3">
                {topMatches.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {m.material.title}
                        </span>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {m.totalScore}% Match
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {m.distanceKm} km away
                        </span>
                      </div>

                      <div className="text-xs text-slate-600">
                        Transfer proposal: <strong className="text-slate-900 font-mono">{m.transferQuantity} {m.material.unit}</strong>
                        <span className="text-slate-400"> (from {m.material.siteName.split('(')[0]})</span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Remaining surplus after transfer: {m.remainingSurplus} {m.material.unit}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectMatch(m);
                        onNavigate('matches');
                      }}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
                    >
                      {isHi ? 'स्थानांतरण प्रस्तावित करें' : 'Propose Transfer'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly Recovery Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHi ? 'मासिक पुनर्प्राप्त सामग्री (किलो)' : 'Materials Recovered Monthly (kg)'}
                </h3>
                <p className="text-xs text-slate-500">Verified site-to-site confirmed handovers</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                +24% vs Last Quarter
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_RECOVERY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey={isHi ? 'monthHi' : 'month'} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`${value} kg`, 'Recovered Material']}
                  />
                  <Bar dataKey="recoveredKg" fill="#047857" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Donut Breakdown & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Material Category Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              {isHi ? 'सामग्री प्रकार के अनुसार वितरण' : 'Reclaimed Materials by Category'}
            </h3>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Volume Share']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-600 truncate">{cat.name}:</span>
                  <span className="font-mono font-bold text-slate-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Site Activity Feed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              {isHi ? 'हाल की गतिविधियाँ' : 'Recent Site Activity'}
            </h3>

            <div className="space-y-3 text-xs">
              {[
                {
                  title: 'Red Clay Bricks match generated',
                  desc: 'Koramangala Green Build (200 pcs) matched with your request (150 pcs).',
                  time: '2 hours ago',
                  type: 'match',
                },
                {
                  title: 'Transfer #TRF-2026-001 scheduled',
                  desc: '8 PVC Drainage pipes scheduled for pickup on Oct 24.',
                  time: '5 hours ago',
                  type: 'transfer',
                },
                {
                  title: 'New requirement logged nearby',
                  desc: 'Indiranagar Metro site posted need for 25 boxes ceramic floor tiles.',
                  time: '1 day ago',
                  type: 'request',
                },
                {
                  title: 'Pickup complete & verified',
                  desc: '1,200 bricks successfully delivered. 3.72 tonnes diverted.',
                  time: '7 days ago',
                  type: 'completed',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 truncate">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
