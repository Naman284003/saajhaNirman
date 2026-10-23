import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialVisual } from '../components/materials/MaterialVisual';
import { MaterialItem, MaterialCategory } from '../types';
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Truck,
  Repeat,
  Scale,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Building,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (targetTab?: string) => void;
  onOpenListingModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onOpenListingModal,
}) => {
  const { materials, language, toggleLanguage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: (MaterialCategory | 'All')[] = [
    'All',
    'Bricks & Blocks',
    'Tiles & Flooring',
    'Pipes & Plumbing',
    'Timber & Wood',
    'Electrical Fittings',
  ];

  const filteredMaterials = selectedCategory === 'All'
    ? materials.slice(0, 4)
    : materials.filter((m) => m.category === selectedCategory).slice(0, 4);

  const isHi = language === 'hi';

  return (
    <div className="min-h-screen bg-[#F4F5F6] text-[#242B30] flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Leaf className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
              Saajha Nirman
            </span>
            <span className="text-xs text-emerald-700 font-semibold block">
              साझानिर्माण · Reclaimed Construction Grid
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">
            {isHi ? 'यह कैसे काम करता है' : 'How It Works'}
          </a>
          <a href="#materials" className="hover:text-emerald-700 transition-colors">
            {isHi ? 'उपलब्ध सामग्री' : 'Available Materials'}
          </a>
          <a href="#impact" className="hover:text-emerald-700 transition-colors">
            {isHi ? 'पर्यावरणीय प्रभाव' : 'Recovery Impact'}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 transition-colors"
          >
            {isHi ? 'English' : 'हिन्दी'}
          </button>
          <button
            onClick={() => onEnterDashboard('overview')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            {isHi ? 'डैशबोर्ड खोलें' : 'Site Manager Portal'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isHi ? 'स्थानीय निर्माण · स्थानीय समाधान' : 'Hyperlocal Construction Material Recovery'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {isHi ? (
                <>
                  बेकार नहीं, <br />
                  <span className="text-emerald-700">फिर से निर्माण।</span>
                </>
              ) : (
                <>
                  Good Materials Deserve a <br />
                  <span className="text-emerald-700">Second Build.</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {isHi
                ? 'साझानिर्माण एक स्थानीय मंच है जो निर्माण स्थलों पर बची हुई उपयोगी सामग्री को ज़रूरतमंद निर्माण परियोजनाओं तक पहुँचाता है। कम खर्च, कम अपशिष्ट और एक स्वच्छ भविष्य।'
                : 'Connect surplus construction materials with nearby projects that need them before they are discarded. Reduce waste, save resources, and build a measurable circular construction ecosystem.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onEnterDashboard('find-materials')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>{isHi ? 'सामग्री खोजें' : 'Explore Available Materials'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onEnterDashboard('create-listing')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-2xs transition-all"
              >
                <span>{isHi ? 'अतिरिक्त सामग्री दें' : '+ List Surplus Materials'}</span>
              </button>
            </div>

            {/* Proof Points Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-extrabold font-mono text-emerald-800">12.5 T</div>
                <div className="text-xs text-slate-500 font-medium">
                  {isHi ? 'पुनर्प्राप्त सामग्री' : 'Materials Diverted'}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-extrabold font-mono text-slate-900">320</div>
                <div className="text-xs text-slate-500 font-medium">
                  {isHi ? 'सफल ट्रांसफ़र्स' : 'Site Transfers'}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-extrabold font-mono text-teal-800">480 T</div>
                <div className="text-xs text-slate-500 font-medium">
                  {isHi ? 'CO₂ उत्सर्जन में कमी' : 'CO₂ Avoided'}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="text-2xl font-extrabold font-mono text-slate-900">200+</div>
                <div className="text-xs text-slate-500 font-medium">
                  {isHi ? 'सक्रिय निर्माण स्थल' : 'Active Sites'}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-900">
                    Live Demo Match: Red Clay Bricks
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  92% Match Score
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Source: Site A (Koramangala)</div>
                    <div className="font-semibold text-slate-900">200 Red Clay Bricks (Surplus)</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">Good Condition</span>
                </div>

                <div className="flex justify-center -my-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                    ↓
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-700">Destination: Site B (HSR Layout)</div>
                    <div className="font-semibold text-emerald-950">150 Bricks Needed (Boundary Wall)</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800">4.1 km away</span>
                </div>

                {/* Calculation breakdown */}
                <div className="p-3 bg-slate-900 text-white rounded-xl font-mono text-[11px] space-y-1">
                  <div className="text-emerald-400 font-bold">Transfer Equation:</div>
                  <div>200 Available − 150 Transferred = 50 Remaining Surplus</div>
                  <div className="text-slate-400 text-[10px]">Landfill waste prevented: 465 kg clay masonry</div>
                </div>

                <button
                  onClick={() => onEnterDashboard('matches')}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors text-center"
                >
                  Step Through This Transfer Scenario →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works 4-step */}
      <section id="how-it-works" className="py-16 px-6 sm:px-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {isHi ? 'प्रक्रिया' : 'Recovery Process'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isHi ? 'चार सरल चरणों में सामग्री का पुनः उपयोग' : 'How Saajha Nirman Works in 4 Steps'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              From excess inventory on the staging pallet to verified transfer completion and landfill diversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: isHi ? 'अतिरिक्त सामग्री सूचीबद्ध करें' : 'List Surplus Inventory',
                desc: 'Enter quantity, material specification, condition, location, and pickup deadline with photo evidence.',
                icon: Layers,
              },
              {
                step: '02',
                title: isHi ? 'मांगों से मिलान' : 'Smart Algorithm Match',
                desc: 'Client-side weighted scoring evaluates material type (35%), quantity (25%), condition (15%), and proximity (15%).',
                icon: Sparkles,
              },
              {
                step: '03',
                title: isHi ? 'पिकअप और सत्यापन' : 'Coordinate Pickup',
                desc: 'Both sites confirm scheduled truck window, driver gate passes, and verified loading pallet check.',
                icon: Truck,
              },
              {
                step: '04',
                title: isHi ? 'अपशिष्ट निवारण रिपोर्ट' : 'Measure Waste Diverted',
                desc: 'Material quantities are converted to standardized metric tonnes and logged to verified carbon savings.',
                icon: Scale,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-slate-300">{item.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Reusable Materials */}
      <section id="materials" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {isHi ? 'उपलब्ध स्टॉक' : 'Real-Time Inventory'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {isHi ? 'वर्तमान में उपलब्ध निर्माण सामग्री' : 'Available Surplus Materials Nearby'}
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-white border border-slate-200 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              onClick={() => onEnterDashboard('find-materials')}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative">
                <MaterialVisual
                  category={mat.category}
                  title={mat.title}
                  className="h-44 w-full"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-800 shadow-2xs backdrop-blur-xs">
                  {mat.condition}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-emerald-700">{mat.category}</div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Available</span>
                    <span className="text-base font-bold font-mono text-slate-900">
                      {mat.availableQuantity} <span className="text-xs font-normal font-sans text-slate-600">{mat.unit}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">{mat.location}</span>
                    <span className="text-xs font-medium text-emerald-700">{mat.distanceKm} km away</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onEnterDashboard('find-materials')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition-all"
          >
            <span>View All Surplus Materials in Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 py-12 px-6 sm:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-base font-bold text-white">Saajha Nirman (साझानिर्माण)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering construction contractors, project engineers, and sustainability managers to eliminate usable material wastage.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onEnterDashboard('overview')} className="hover:text-emerald-400">
                  Site Manager Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onEnterDashboard('matches')} className="hover:text-emerald-400">
                  Smart Match Engine (92% Score)
                </button>
              </li>
              <li>
                <button onClick={() => onEnterDashboard('transfers')} className="hover:text-emerald-400">
                  Transfer Coordination Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onEnterDashboard('analytics')} className="hover:text-emerald-400">
                  Landfill Waste Diversion Report
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Material Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Red Clay & Wirecut Bricks</li>
              <li>Vitrified Ceramic Tiles</li>
              <li>PVC Drainage & Conduit Pipes</li>
              <li>Reclaimed Teak & Structural Timber</li>
              <li>Galvanized Electrical Fittings</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">API & Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built on client-side deterministic algorithms with Express backend endpoints (`/api/sync`, `/api/materials`, `/api/transfers`).
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Full Stack REST Server Ready
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© 2026 Saajha Nirman Platform. Waste Less. Build More. Together.</div>
          <div className="flex items-center gap-6">
            <span>Verified Circular Construction Standard</span>
            <span>Bengaluru Pilot</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
