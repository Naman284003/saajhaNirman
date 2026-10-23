import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  CheckCircle2,
  Server,
  Layers,
  RotateCcw
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    activeSite,
    sites,
    setActiveSiteId,
    currentUser,
    isBackendConnected,
    triggerManualSync,
    resetToDemoScenario,
    language,
    showToast
  } = useApp();

  const isHi = language === 'hi';

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [organization, setOrganization] = useState(currentUser.organization);
  const [role, setRole] = useState(currentUser.role);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Profile Updated', 'Site supervisor contact details have been updated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5" />
          {isHi ? 'साइट प्रोफ़ाइल एवं सेटिंग्स' : 'Site Identity & Operational Context'}
        </span>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
          {isHi ? 'प्रोफ़ाइल एवं निर्माण स्थल सेटिंग्स' : 'Profile & Construction Site Configuration'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Switch active construction project locations, manage team details, and check backend connectivity.
        </p>
      </div>

      {/* Active Construction Site Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Construction Site Selector
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-semibold font-mono">
            {sites.length} Verified Sites in Bangalore Pilot
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Switching your active site allows you to view materials from that location's perspective, manage its listings, and test site-to-site transfer requests.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {sites.map((st) => {
            const isSelected = st.id === activeSite.id;
            return (
              <div
                key={st.id}
                onClick={() => setActiveSiteId(st.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{st.organization}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{st.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Liaison: {st.managerName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editable Contact Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Site Manager & Liaison Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Company / Organization</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Operational Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={resetToDemoScenario}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Initial Demo Scenario
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
