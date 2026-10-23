import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Search,
  Package,
  FileQuestion,
  Sparkles,
  ArrowRightLeft,
  BarChart3,
  MessageSquare,
  UserCheck,
  Building2,
  RotateCcw,
  Server,
  Leaf
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSyncModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSyncModal,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    activeSite,
    sites,
    setActiveSiteId,
    currentUser,
    matches,
    transfers,
    isBackendConnected,
    resetToDemoScenario,
    language
  } = useApp();

  const activeTransfersCount = transfers.filter((t) => t.currentStatus !== 'Completed').length;
  const isHi = language === 'hi';

  const navItems = [
    {
      id: 'overview',
      label: isHi ? 'डैशबोर्ड' : 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'find-materials',
      label: isHi ? 'सामग्री खोजें' : 'Find Materials',
      icon: Search,
    },
    {
      id: 'my-listings',
      label: isHi ? 'मेरी सूचियाँ' : 'My Listings',
      icon: Package,
    },
    {
      id: 'requests',
      label: isHi ? 'मेरी मांगें' : 'Material Requests',
      icon: FileQuestion,
    },
    {
      id: 'matches',
      label: isHi ? 'मैच सुझाव' : 'Smart Matches',
      icon: Sparkles,
      badge: matches.length,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
    {
      id: 'transfers',
      label: isHi ? 'स्थानांतरण ट्रैकिंग' : 'Transfers',
      icon: ArrowRightLeft,
      badge: activeTransfersCount > 0 ? activeTransfersCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'analytics',
      label: isHi ? 'प्रभाव विश्लेषण' : 'Impact Analytics',
      icon: BarChart3,
    },
    {
      id: 'messages',
      label: isHi ? 'संदेश' : 'Messages',
      icon: MessageSquare,
    },
    {
      id: 'profile',
      label: isHi ? 'साइट और प्रोफ़ाइल' : 'Profile & Settings',
      icon: UserCheck,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Leaf className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                Saajha Nirman
              </div>
              <div className="text-[11px] font-medium text-emerald-700">
                साझानिर्माण · Circular Materials
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isHi ? 'मुख्य मेनू' : 'Core Workspace'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 shadow-2xs font-bold border border-emerald-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Site Switcher & Status Section */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2.5">
          {/* Site Selector */}
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-emerald-700" />
                Active Site
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                {currentUser.role}
              </span>
            </div>
            <select
              value={activeSite.id}
              onChange={(e) => setActiveSiteId(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSyncModal}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[11px] font-medium text-slate-700 transition-colors shadow-2xs"
              title="Open Backend REST Endpoints & Sync"
            >
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>API Sync</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isBackendConnected ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
              />
            </button>

            <button
              onClick={resetToDemoScenario}
              className="flex items-center justify-center p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shadow-2xs"
              title="Reset Demo Scenario (200 Surplus vs 150 Request)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
