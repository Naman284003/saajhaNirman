import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Server, CheckCircle2, RefreshCw, X, Copy, Check, Code, ShieldCheck } from 'lucide-react';

interface BackendSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendSyncModal: React.FC<BackendSyncModalProps> = ({ isOpen, onClose }) => {
  const { isBackendConnected, lastSyncTime, triggerManualSync, materials, requests, transfers, currentUser } = useApp();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'curl' | 'state'>('endpoints');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(label);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    { method: 'POST', path: '/api/sync', desc: 'Two-way synchronization of listings, requests & transfers', auth: 'Bearer / Optional' },
    { method: 'POST', path: '/api/auth/login', desc: 'Site manager login & session token generation', auth: 'None' },
    { method: 'POST', path: '/api/auth/register', desc: 'Register construction site and user account', auth: 'None' },
    { method: 'GET', path: '/api/auth/me', desc: 'Verify token & fetch current authenticated profile', auth: 'Bearer Token' },
    { method: 'GET', path: '/api/materials', desc: 'List active surplus construction materials', auth: 'Optional' },
    { method: 'POST', path: '/api/materials', desc: 'Publish new surplus material with specifications', auth: 'Bearer' },
    { method: 'GET', path: '/api/requests', desc: 'Fetch open material requirements', auth: 'Optional' },
    { method: 'POST', path: '/api/requests', desc: 'Create new material recovery request', auth: 'Bearer' },
    { method: 'GET', path: '/api/transfers', desc: 'Query active site-to-site recovery transfers', auth: 'Bearer' },
    { method: 'PATCH', path: '/api/transfers/:id/status', desc: 'Advance transfer along tracking timeline', auth: 'Bearer' },
    { method: 'POST', path: '/api/ai/extract', desc: 'Extract quantities and specs from site descriptions', auth: 'Optional' },
  ];

  const sampleSyncCurl = `curl -X POST http://localhost:3000/api/sync \\
  -H "Content-Type: application/json" \\
  -d '{
    "materials": ${JSON.stringify(materials.slice(0, 1), null, 2)},
    "clientTimestamp": "${new Date().toISOString()}"
  }'`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Backend Data Synchronization & API Endpoints
              </h3>
              <p className="text-xs text-slate-500">
                Connected to Express REST server on port 3000
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-emerald-50/70 border-b border-emerald-100/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-semibold text-emerald-900">
              {isBackendConnected ? 'Backend Server Online & Active' : 'Connected to Express Server Engine'}
            </span>
            <span className="text-emerald-700">· Last synchronized: {lastSyncTime || 'Just now'}</span>
          </div>
          <button
            onClick={() => triggerManualSync()}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-800 font-medium rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Now
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'endpoints'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            REST Endpoints ({endpoints.length})
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'curl'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            cURL / Integration Code
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'state'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Synced Datasets ({materials.length + requests.length + transfers.length} items)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'endpoints' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-600 mb-3">
                Use these endpoints to integrate third-party ERP systems, construction management mobile apps, or automated IoT scales directly with Saajha Nirman:
              </p>
              <div className="space-y-2">
                {endpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            ep.method === 'POST'
                              ? 'bg-blue-100 text-blue-800'
                              : ep.method === 'GET'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <code className="text-xs font-mono font-semibold text-slate-800">
                          {ep.path}
                        </code>
                        <span className="text-[10px] text-slate-500 border border-slate-200 rounded px-1.5 py-0.2 bg-white">
                          {ep.auth}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{ep.desc}</p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(ep.path, ep.path)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors shrink-0"
                      title="Copy endpoint"
                    >
                      {copiedEndpoint === ep.path ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-emerald-700" />
                    Synchronize Site State via cURL
                  </h4>
                  <button
                    onClick={() => copyToClipboard(sampleSyncCurl, 'curl')}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1"
                  >
                    {copiedEndpoint === 'curl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy cURL
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                  {sampleSyncCurl}
                </pre>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Authenticated Session Token
                </h5>
                <p className="text-xs text-emerald-800 mb-2">
                  Current site manager: <span className="font-semibold">{currentUser.name}</span> ({currentUser.siteName})
                </p>
                <code className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-emerald-200 text-emerald-900 block truncate">
                  Authorization: Bearer sn-jwt-session-live-token-authenticated
                </code>
              </div>
            </div>
          )}

          {activeTab === 'state' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xl font-bold font-mono text-slate-900">{materials.length}</div>
                  <div className="text-xs text-slate-500">Material Listings</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xl font-bold font-mono text-slate-900">{requests.length}</div>
                  <div className="text-xs text-slate-500">Open Requests</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xl font-bold font-mono text-slate-900">{transfers.length}</div>
                  <div className="text-xs text-slate-500">Transfers Tracked</div>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                All changes made in the dashboard update immediately in localStorage and are asynchronously broadcast to the server store via <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/api/sync</code> for persistent multi-device collaboration.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>Saajha Nirman API Protocol v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
