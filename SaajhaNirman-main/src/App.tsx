import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/ui/ToastContainer';
import { BackendSyncModal } from './components/ui/BackendSyncModal';
import { MaterialDetailsModal } from './components/materials/MaterialDetailsModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FindMaterialsPage } from './pages/FindMaterialsPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { CreateRequestPage } from './pages/CreateRequestPage';
import { RequestsPage } from './pages/RequestsPage';
import { MatchesPage } from './pages/MatchesPage';
import { TransfersPage } from './pages/TransfersPage';
import { ImpactAnalyticsPage } from './pages/ImpactAnalyticsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { MaterialItem, MatchRecommendation } from './types';

function MainAppContent() {
  const [appMode, setAppMode] = useState<'landing' | 'portal'>('portal');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [selectedMaterialForModal, setSelectedMaterialForModal] = useState<MaterialItem | null>(null);
  const [selectedMatchForMatchesPage, setSelectedMatchForMatchesPage] = useState<MatchRecommendation | null>(null);
  const [targetTransferId, setTargetTransferId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle material selection from catalog or cards
  const handleSelectMaterial = (material: MaterialItem) => {
    setSelectedMaterialForModal(material);
  };

  const handleRequestFromDetails = (material: MaterialItem, requestedQty: number) => {
    setSelectedMaterialForModal(null);
    setCurrentTab('create-request');
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (appMode === 'landing') {
    return (
      <>
        <LandingPage
          onEnterDashboard={(targetTab) => {
            setAppMode('portal');
            if (targetTab) setCurrentTab(targetTab);
          }}
          onOpenListingModal={() => {
            setAppMode('portal');
            setCurrentTab('create-listing');
          }}
        />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Topbar
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim() && currentTab !== 'find-materials') {
              setCurrentTab('find-materials');
            }
          }}
        />

        {/* Floating Quick Switch to Landing Page */}
        <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Saajha Nirman Circular Construction Grid · Live Prototype</span>
          </div>
          <button
            onClick={() => setAppMode('landing')}
            className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
          >
            ← View Public Landing Page
          </button>
        </div>

        {/* Viewport Dynamic Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <DashboardPage
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectMatch={(match) => {
                setSelectedMatchForMatchesPage(match);
                setCurrentTab('matches');
              }}
            />
          )}

          {currentTab === 'find-materials' && (
            <FindMaterialsPage
              onSelectMaterial={handleSelectMaterial}
              onRequestMaterial={(mat) => {
                handleSelectMaterial(mat);
              }}
              globalSearchQuery={searchQuery}
            />
          )}

          {currentTab === 'my-listings' && (
            <MyListingsPage
              onNavigateToCreate={() => setCurrentTab('create-listing')}
              onSelectMaterial={handleSelectMaterial}
              onViewMatchesForMaterial={(mat) => {
                setCurrentTab('matches');
              }}
            />
          )}

          {currentTab === 'create-listing' && (
            <CreateListingPage
              onListingCreated={() => setCurrentTab('my-listings')}
              onCancel={() => setCurrentTab('overview')}
            />
          )}

          {currentTab === 'create-request' && (
            <CreateRequestPage
              onRequestCreated={() => setCurrentTab('matches')}
              onCancel={() => setCurrentTab('requests')}
            />
          )}

          {currentTab === 'requests' && (
            <RequestsPage
              onNavigateToCreate={() => setCurrentTab('create-request')}
              onNavigateToMatches={() => setCurrentTab('matches')}
            />
          )}

          {currentTab === 'matches' && (
            <MatchesPage
              selectedMatch={selectedMatchForMatchesPage}
              onNavigateToTransfers={(trfId) => {
                setTargetTransferId(trfId);
                setCurrentTab('transfers');
              }}
            />
          )}

          {currentTab === 'transfers' && (
            <TransfersPage
              highlightedTransferId={targetTransferId}
              onNavigateToAnalytics={() => setCurrentTab('analytics')}
            />
          )}

          {currentTab === 'analytics' && <ImpactAnalyticsPage />}

          {currentTab === 'messages' && <MessagesPage />}

          {currentTab === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Global Modals */}
      <MaterialDetailsModal
        material={selectedMaterialForModal}
        onClose={() => setSelectedMaterialForModal(null)}
        onRequestMaterial={handleRequestFromDetails}
        onViewMatches={() => {
          setSelectedMaterialForModal(null);
          setCurrentTab('matches');
        }}
      />

      <BackendSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      {/* Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
