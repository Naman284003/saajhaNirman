import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialCategory, MaterialCondition } from '../types';
import { api } from '../services/apiClient';
import {
  Package,
  Sparkles,
  Upload,
  MapPin,
  Calendar,
  Clock,
  Truck,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface CreateListingPageProps {
  onListingCreated: () => void;
  onCancel: () => void;
}

export const CreateListingPage: React.FC<CreateListingPageProps> = ({
  onListingCreated,
  onCancel,
}) => {
  const { addMaterial, activeSite, language, showToast } = useApp();
  const isHi = language === 'hi';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Bricks & Blocks');
  const [materialType, setMaterialType] = useState('Standard Red Clay Bricks');
  const [quantity, setQuantity] = useState<number>(200);
  const [unit, setUnit] = useState('Pieces');
  const [condition, setCondition] = useState<MaterialCondition>('Good');
  const [description, setDescription] = useState(
    'Foundation phase finished with high quality bricks remaining palletized in dry storage. Direct truck driveway access.'
  );
  const [pickupStartDate, setPickupStartDate] = useState('2026-10-23');
  const [pickupDeadline, setPickupDeadline] = useState('2026-10-30');
  const [pickupTimeWindow, setPickupTimeWindow] = useState('09:00 AM - 05:00 PM');
  const [location, setLocation] = useState(activeSite.location);
  const [loadingNotes, setLoadingNotes] = useState('Ground floor ramp loading. Forklift assistance available.');
  const [aiInputText, setAiInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

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

  // AI Parameter extraction from natural text
  const handleAiExtract = async () => {
    if (!aiInputText.trim()) return;
    setIsExtracting(true);
    const result = await api.extractMaterialFromText(aiInputText);
    setIsExtracting(false);

    if (result && result.extracted) {
      const ext = result.extracted;
      if (ext.title) setTitle(ext.title);
      if (ext.category) setCategory(ext.category as MaterialCategory);
      if (ext.materialType) setMaterialType(ext.materialType);
      if (ext.quantity) setQuantity(ext.quantity);
      if (ext.unit) setUnit(ext.unit);
      if (ext.condition) setCondition(ext.condition as MaterialCondition);
      if (ext.location) setLocation(ext.location);
      showToast('success', 'Parameters Extracted', 'Material attributes extracted from description and autofilled.');
    }
  };

  const handleDetectLocation = () => {
    setLocation(activeSite.location);
    showToast('info', 'Location Set', `Set to active site: ${activeSite.location}`);
  };

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || quantity <= 0) {
      showToast('error', 'Validation Error', 'Please specify a title and quantity greater than zero.');
      return;
    }

    addMaterial({
      title: title.trim(),
      category,
      materialType,
      availableQuantity: Number(quantity),
      originalQuantity: Number(quantity),
      unit,
      condition,
      description,
      siteId: activeSite.id,
      siteName: activeSite.name,
      location,
      distanceKm: 0,
      coordinates: activeSite.coordinates,
      pickupStartDate,
      pickupDeadline,
      pickupTimeWindow,
      loadingNotes,
      contactName: activeSite.managerName,
      contactPhone: activeSite.phone,
      images: uploadedPhotos,
    });

    onListingCreated();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            {isHi ? 'अतिरिक्त सामग्री सूची' : 'Material Listing Workflow'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            {isHi ? 'अतिरिक्त सामग्री सूचीबद्ध करें' : 'List Surplus Construction Material'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Offer unused reusable supplies to nearby construction projects before demobilization or landfill disposal.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* AI Quick-Fill Assistance Panel */}
      <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              AI Smart Description Parser (Optional)
            </h3>
          </div>
          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
            Natural Language Extractor
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 'We have 200 red clay bricks in good condition left over in Koramangala site, ready for pickup by next Friday'"
            value={aiInputText}
            onChange={(e) => setAiInputText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
          />
          <button
            type="button"
            onClick={handleAiExtract}
            disabled={isExtracting || !aiInputText.trim()}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-2xs"
          >
            {isExtracting ? 'Parsing...' : 'Auto-Fill Form'}
          </button>
        </div>
      </div>

      {/* Main Listing Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        {/* Section A: Material Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Section A: Material Details & Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Red Clay Bricks (Standard Size 9x4x3)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Material Sub-Type / Spec
              </label>
              <input
                type="text"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                placeholder="e.g. Wirecut Solid Clay Masonry"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Available Surplus Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Unit of Measurement *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer font-medium"
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
                Material Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as MaterialCondition)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 cursor-pointer font-medium"
              >
                <option value="Excellent">Excellent (New / Unused / Sealed)</option>
                <option value="Good">Good (Usable with minor cosmetic dust)</option>
                <option value="Fair">Fair (Requires slight dressing or trimming)</option>
                <option value="Requires Inspection">Requires Physical Inspection</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Detailed Description & Staging Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material condition, packaging, how it was stored, and access details..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section B: Photographs with Local Drag & Drop Preview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Section B: Site Staging Photographs
          </h3>

          <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700">
              Drag and drop material photos or click to select
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports JPEG, PNG, WebP up to 10MB per photo.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUploadSim}
              className="mt-3 text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
            />
          </div>

          {uploadedPhotos.length > 0 && (
            <div className="flex gap-3 flex-wrap pt-2">
              {uploadedPhotos.map((photo, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                  <img src={photo} alt="Uploaded preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-slate-900/70 text-white rounded-full hover:bg-slate-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section C: Pickup Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Section C: Pickup Window & Site Logistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Location *</label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  Detect from site
                </button>
              </div>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pickup Time Window
              </label>
              <input
                type="text"
                value={pickupTimeWindow}
                onChange={(e) => setPickupTimeWindow(e.target.value)}
                placeholder="e.g. 08:30 AM - 05:00 PM"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pickup Start Date
              </label>
              <input
                type="date"
                value={pickupStartDate}
                onChange={(e) => setPickupStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pickup Deadline *
              </label>
              <input
                type="date"
                required
                value={pickupDeadline}
                onChange={(e) => setPickupDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Loading & Access Instructions
              </label>
              <input
                type="text"
                value={loadingNotes}
                onChange={(e) => setLoadingNotes(e.target.value)}
                placeholder="e.g. Forklift on site, flatbed access via Gate 2, driver ID required"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
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
            <span>{isHi ? 'सूची प्रकाशित करें' : 'Publish Surplus Listing'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
