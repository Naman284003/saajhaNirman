import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialItem, MaterialCategory, MaterialCondition } from '../types';
import { MaterialVisual } from '../components/materials/MaterialVisual';
import { MaterialMapVisualizer } from '../components/materials/MaterialMapVisualizer';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Grid,
  List,
  Map,
  X,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building
} from 'lucide-react';

interface FindMaterialsPageProps {
  onSelectMaterial: (material: MaterialItem) => void;
  onRequestMaterial: (material: MaterialItem) => void;
  initialCategory?: string;
  globalSearchQuery?: string;
}

export const FindMaterialsPage: React.FC<FindMaterialsPageProps> = ({
  onSelectMaterial,
  onRequestMaterial,
  initialCategory = 'All',
  globalSearchQuery = '',
}) => {
  const { materials, sites, activeSite, language } = useApp();

  const [keyword, setKeyword] = useState<string>(globalSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(25);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  const categories: (MaterialCategory | 'All')[] = [
    'All',
    'Bricks & Blocks',
    'Tiles & Flooring',
    'Pipes & Plumbing',
    'Timber & Wood',
    'Electrical Fittings',
    'Doors & Windows',
    'Steel & Metal',
    'Other Construction Materials',
  ];

  const conditions: (MaterialCondition | 'All')[] = [
    'All',
    'Excellent',
    'Good',
    'Fair',
    'Requires Inspection',
  ];

  // Dynamic filtering
  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      // Keyword filter
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchesKeyword =
          mat.title.toLowerCase().includes(q) ||
          mat.materialType.toLowerCase().includes(q) ||
          mat.location.toLowerCase().includes(q) ||
          mat.siteName.toLowerCase().includes(q) ||
          (mat.titleHi && mat.titleHi.includes(q));
        if (!matchesKeyword) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && mat.category !== selectedCategory) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'All' && mat.condition !== selectedCondition) {
        return false;
      }

      // Radius filter
      if (mat.distanceKm > maxRadiusKm) {
        return false;
      }

      return true;
    });
  }, [materials, keyword, selectedCategory, selectedCondition, maxRadiusKm]);

  const clearFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setMaxRadiusKm(25);
  };

  const hasActiveFilters =
    keyword !== '' ||
    selectedCategory !== 'All' ||
    selectedCondition !== 'All' ||
    maxRadiusKm !== 25;

  const isHi = language === 'hi';

  return (
    <div className="space-y-6">
      {/* Header and Search Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isHi ? 'सामग्री खोजें' : 'Find Available Materials'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Discover reusable and surplus materials listed by construction sites near {activeSite.location}
            </p>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Map View"
            >
              <Map className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Map View</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHi ? 'नाम, ईंट, टाइल्स या स्थान...' : 'Keywords, e.g. Bricks, PVC...'}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Dropdown */}
          <div>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
            >
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  Condition: {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Selector */}
          <div>
            <select
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(parseInt(e.target.value, 10))}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-emerald-600 cursor-pointer font-mono"
            >
              <option value={5}>Within 5 km radius</option>
              <option value={10}>Within 10 km radius</option>
              <option value={25}>Within 25 km radius</option>
              <option value={50}>Within 50 km radius</option>
            </select>
          </div>
        </div>

        {/* Category Quick Chips & Results Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Quick:</span>
            {['All', 'Bricks & Blocks', 'Tiles & Flooring', 'Pipes & Plumbing', 'Timber & Wood'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-mono">{filteredMaterials.length}</strong> available material lots
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <MaterialMapVisualizer
            materials={filteredMaterials}
            sites={sites}
            activeSite={activeSite}
            selectedRadiusKm={maxRadiusKm}
            onSelectMaterial={onSelectMaterial}
          />
        </div>
      )}

      {/* Grid or List View Mode */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching materials found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your search radius or choosing "All" categories to discover surplus supplies.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
            >
              <div
                className="relative cursor-pointer"
                onClick={() => onSelectMaterial(mat)}
              >
                <MaterialVisual
                  category={mat.category}
                  title={mat.title}
                  className="h-44 w-full"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 shadow-2xs backdrop-blur-xs">
                  {mat.condition}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700">{mat.category}</span>
                    <span className="text-slate-400 font-mono">#{mat.id.slice(-5)}</span>
                  </div>

                  <h3
                    onClick={() => onSelectMaterial(mat)}
                    className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {mat.title}
                  </h3>

                  {mat.titleHi && (
                    <div className="text-xs text-slate-500 font-medium">{mat.titleHi}</div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {mat.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available</span>
                      <span className="text-xl font-bold font-mono text-slate-900">
                        {mat.availableQuantity}{' '}
                        <span className="text-xs font-sans font-normal text-slate-600">{mat.unit}</span>
                      </span>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                      <span className="font-semibold text-emerald-800">{mat.distanceKm} km away</span>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[120px]">{mat.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectMaterial(mat)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors text-center"
                    >
                      {isHi ? 'विवरण देखें' : 'View Details'}
                    </button>
                    <button
                      onClick={() => onRequestMaterial(mat)}
                      className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors text-center shadow-2xs"
                    >
                      {isHi ? 'मांग दर्ज करें' : 'Request Material'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-2xs">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 cursor-pointer"
                  onClick={() => onSelectMaterial(mat)}
                >
                  <MaterialVisual category={mat.category} title={mat.title} className="w-full h-full" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700">{mat.category}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                      {mat.condition}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectMaterial(mat)}
                    className="text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                    {mat.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {mat.location} ({mat.distanceKm} km)
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {mat.siteName.split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Available</span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    {mat.availableQuantity} {mat.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectMaterial(mat)}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onRequestMaterial(mat)}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
