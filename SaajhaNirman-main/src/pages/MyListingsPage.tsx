import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialItem, ListingStatus } from '../types';
import { MaterialVisual } from '../components/materials/MaterialVisual';
import {
  Package,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface MyListingsPageProps {
  onNavigateToCreate: () => void;
  onSelectMaterial: (material: MaterialItem) => void;
  onViewMatchesForMaterial: (material: MaterialItem) => void;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({
  onNavigateToCreate,
  onSelectMaterial,
  onViewMatchesForMaterial,
}) => {
  const { materials, deleteMaterial, activeSite, language, matches } = useApp();
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const isHi = language === 'hi';

  const tabs = ['All', 'Active', 'Partially Allocated', 'Reserved', 'Completed'];

  // Filter listings by active site & tab
  const siteListings = materials.filter((m) => {
    // Show either this site's or all site inventory for demo exploration
    if (selectedTab === 'All') return true;
    return m.status === selectedTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            {isHi ? 'इन्वेंट्री प्रबंधन' : 'Surplus Inventory Management'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {isHi ? 'मेरी सूचियाँ' : 'My Surplus Material Listings'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your site's surplus stock, monitor reserved quantities, and match incoming requests.
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isHi ? 'नई सूची जोड़ें' : '+ List New Surplus'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white px-4 rounded-xl shadow-2xs overflow-x-auto">
        {tabs.map((tab) => {
          const count =
            tab === 'All'
              ? materials.length
              : materials.filter((m) => m.status === tab).length;

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

      {/* Listings Table / Cards */}
      {siteListings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Package className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No listings in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any items under the "{selectedTab}" tab.
          </p>
          <button
            onClick={onNavigateToCreate}
            className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl"
          >
            Create Listing
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {siteListings.map((mat) => {
            const hasMatches = matches.some((m) => m.material.id === mat.id);

            return (
              <div
                key={mat.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 cursor-pointer"
                    onClick={() => onSelectMaterial(mat)}
                  >
                    <MaterialVisual category={mat.category} title={mat.title} className="w-full h-full" />
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-emerald-700">{mat.category}</span>
                      <span className="text-slate-300">·</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          mat.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : mat.status === 'Partially Allocated'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {mat.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{mat.id.slice(-6)}</span>
                    </div>

                    <h3
                      onClick={() => onSelectMaterial(mat)}
                      className="text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {mat.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {mat.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Available until: {mat.pickupDeadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inventory Allocation Strip */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right font-mono">
                    <div className="text-xs text-slate-400 uppercase font-bold">Available Surplus</div>
                    <div className="text-xl font-bold text-slate-900">
                      {mat.availableQuantity} <span className="text-xs font-normal text-slate-600">{mat.unit}</span>
                    </div>
                    {mat.allocatedQuantity > 0 && (
                      <div className="text-[11px] text-amber-600 font-medium">
                        {mat.allocatedQuantity} {mat.unit} allocated
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {hasMatches && (
                      <button
                        onClick={() => onViewMatchesForMaterial(mat)}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors inline-flex items-center gap-1.5"
                        title="View Smart Matches for this listing"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Matches</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectMaterial(mat)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => deleteMaterial(mat.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Delete Listing"
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
