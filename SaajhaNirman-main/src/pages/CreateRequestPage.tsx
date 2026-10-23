import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialCategory, MaterialCondition } from '../types';
import {
  FileQuestion,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Layers,
  HelpCircle
} from 'lucide-react';

interface CreateRequestPageProps {
  onRequestCreated: () => void;
  onCancel: () => void;
}

export const CreateRequestPage: React.FC<CreateRequestPageProps> = ({
  onRequestCreated,
  onCancel,
}) => {
  const { addRequest, activeSite, language, showToast } = useApp();
  const isHi = language === 'hi';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Bricks & Blocks');
  const [materialType, setMaterialType] = useState('Red Clay Bricks');
  const [requiredQuantity, setRequiredQuantity] = useState<number>(150);
  const [unit, setUnit] = useState('Pieces');
  const [minCondition, setMinCondition] = useState<MaterialCondition>('Good');
  const [requiredByDate, setRequiredByDate] = useState('2026-10-28');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(15);
  const [deliveryPreference, setDeliveryPreference] = useState<'self_pickup' | 'delivery_if_available'>('self_pickup');
  const [location, setLocation] = useState(activeSite.location);
  const [description, setDescription] = useState(
    'Urgent requirement of 150 standard red clay bricks for boundary retaining wall. We have a mini-truck ready for immediate self-pickup.'
  );

  const categories: MaterialCategory[] = [
    'Bricks & Blocks',
    'Tiles & Flooring',
    'Pipes & Plumbing',
    'Timber & Wood',
    'Doors & Windows',
    'Steel & Metal',
    'Electrical Fittings',
    'Cement Boards',
    'Other Construction Materials',
  ];

  const units = ['Pieces', 'Boxes', 'Bags', 'Metres', 'Kilograms', 'Tonnes', 'Sheets'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || requiredQuantity <= 0) {
      showToast('error', 'Validation Error', 'Please enter a request title and valid quantity.');
      return;
    }

    addRequest({
      title: title.trim(),
      category,
      materialType,
      requiredQuantity: Number(requiredQuantity),
      unit,
      minCondition,
      siteId: activeSite.id,
      siteName: activeSite.name,
      location,
      coordinates: activeSite.coordinates,
      maxDistanceKm: Number(maxDistanceKm),
      requiredByDate,
      deliveryPreference,
      description,
    });

    onRequestCreated();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <FileQuestion className="w-3.5 h-3.5" />
            {isHi ? 'सामग्री आवश्यकता' : 'Material Request Workflow'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {isHi ? 'नई सामग्री मांगें' : 'Create Material Request'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log needed supplies so Saajha Nirman's smart matching engine can connect you to nearby surplus sites.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form (Left) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Required Specification
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Request Title / Purpose *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Red Clay Bricks for Boundary Retaining Wall"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Material Type / Spec
                </label>
                <input
                  type="text"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  placeholder="e.g. Red Clay Bricks"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Required Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Minimum Acceptable Condition *
                </label>
                <select
                  value={minCondition}
                  onChange={(e) => setMinCondition(e.target.value as MaterialCondition)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer font-medium"
                >
                  <option value="Good">Good (Standard usable condition)</option>
                  <option value="Excellent">Excellent (Only pristine / new surplus)</option>
                  <option value="Fair">Fair (Minor cosmetic wear acceptable)</option>
                  <option value="Requires Inspection">Requires Physical Inspection</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Required By Date *
                </label>
                <input
                  type="date"
                  required
                  value={requiredByDate}
                  onChange={(e) => setRequiredByDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Logistics Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    deliveryPreference === 'self_pickup'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryPref"
                    checked={deliveryPreference === 'self_pickup'}
                    onChange={() => setDeliveryPreference('self_pickup')}
                    className="accent-emerald-600"
                  />
                  <span>Self Pickup (Our truck)</span>
                </label>

                <label
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    deliveryPreference === 'delivery_if_available'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryPref"
                    checked={deliveryPreference === 'delivery_if_available'}
                    onChange={() => setDeliveryPreference('delivery_if_available')}
                    className="accent-emerald-600"
                  />
                  <span>Delivery if available</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Project Notes & Technical Constraints
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention wall dimensions, tolerance requirements, or vehicle access restrictions..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <span>{isHi ? 'मांग प्रकाशित करें' : 'Publish Request & Find Matches'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Helper Guide */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {isHi ? 'हमारा स्मार्ट मिलान सिस्टम' : 'How Requests Are Matched'}
            </h4>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            When you publish this material requirement, Saajha Nirman continuously scans local construction sites for surplus listings that meet your exact specifications.
          </p>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-700">35%</span>
              <span className="text-slate-600">Material specification & sizing compatibility</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-700">25%</span>
              <span className="text-slate-600">Quantity sufficiency (or valid partial transfers)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-700">15%</span>
              <span className="text-slate-600">Condition rating matching or exceeding your minimum</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-700">15%</span>
              <span className="text-slate-600">Transit proximity to {activeSite.name.split('(')[0]}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono font-bold text-emerald-700">10%</span>
              <span className="text-slate-600">Deadline feasibility before required date</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
