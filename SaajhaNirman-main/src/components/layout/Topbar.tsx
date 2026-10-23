import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Server,
  Globe,
  CheckCircle2,
  ExternalLink,
  X
} from 'lucide-react';

interface TopbarProps {
  currentTab: string;
  onOpenMobileMenu: () => void;
  onNavigate: (tab: string) => void;
  onOpenSyncModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  onOpenMobileMenu,
  onNavigate,
  onOpenSyncModal,
  searchQuery,
  onSearchChange,
}) => {
  const {
    activeSite,
    currentUser,
    notifications,
    unreadNotifsCount,
    markAllNotificationsRead,
    isBackendConnected,
    language,
    toggleLanguage
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return language === 'hi' ? 'डैशबोर्ड अवलोकन' : 'Overview & Site Activity';
      case 'find-materials':
        return language === 'hi' ? 'पुनः प्रयोज्य सामग्री खोजें' : 'Find Available Materials';
      case 'my-listings':
        return language === 'hi' ? 'मेरी अतिरिक्त सूचियाँ' : 'My Surplus Listings';
      case 'requests':
        return language === 'hi' ? 'साइट सामग्री मांगें' : 'Material Requirements & Requests';
      case 'matches':
        return language === 'hi' ? 'स्मार्ट मैच एल्गोरिदम' : 'Smart Matching Recommendations';
      case 'transfers':
        return language === 'hi' ? 'सामग्री स्थानांतरण ट्रैकिंग' : 'Material Recovery Transfers';
      case 'analytics':
        return language === 'hi' ? 'पर्यावरणीय अपशिष्ट निवारण रिपोर्ट' : 'Impact & Waste Diversion Analytics';
      case 'messages':
        return language === 'hi' ? 'साइट समन्वय संदेश' : 'Site-to-Site Messages';
      case 'create-listing':
        return language === 'hi' ? 'अतिरिक्त सामग्री सूचीबद्ध करें' : 'List Surplus Construction Material';
      case 'create-request':
        return language === 'hi' ? 'सामग्री मांग दर्ज करें' : 'Create Material Request';
      case 'profile':
        return language === 'hi' ? 'साइट सेटिंग्स और प्रोफ़ाइल' : 'Site Settings & Team Profile';
      default:
        return 'Saajha Nirman';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Saajha Nirman</span>
              <span>/</span>
              <span className="truncate">{activeSite.name.split('(')[0].trim()}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              {getPageTitle(currentTab)}
            </h1>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'सामग्री, श्रेणी या स्थान खोजें...' : 'Search materials, categories, sites...'}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Actions, Language, Notifications & CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            title="Toggle Hindi / English UI Labels"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Backend API status trigger */}
          <button
            onClick={onOpenSyncModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 text-slate-700 hover:text-emerald-900 text-xs font-medium rounded-xl transition-colors"
            title="Inspect REST API & Synchronization Endpoints"
          >
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline">REST API</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
            />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notification Menu Popover */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50">
                <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadNotifsCount > 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                        {unreadNotifsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifMenu(false);
                        if (n.linkTo) onNavigate(n.linkTo);
                      }}
                      className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                        !n.read ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">
                          {language === 'hi' && n.titleHi ? n.titleHi : n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: List Surplus */}
          <button
            onClick={() => onNavigate('create-listing')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'नई सूची बनाएँ' : '+ List Surplus'}
            </span>
            <span className="sm:hidden">+ List</span>
          </button>
        </div>
      </div>
    </header>
  );
};
