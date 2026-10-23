import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MaterialItem,
  MaterialRequest,
  Transfer,
  ConstructionSite,
  AppNotification,
  ChatMessage,
  UserProfile,
  MatchRecommendation,
  TransferStatus
} from '../types';
import {
  SEED_MATERIALS,
  SEED_REQUESTS,
  SEED_TRANSFERS,
  SEED_SITES,
  SEED_NOTIFICATIONS,
  SEED_MESSAGES,
  INITIAL_USER
} from '../data/seedData';
import { generateAllSystemMatches } from '../utils/matchingEngine';
import { api } from '../services/apiClient';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  materials: MaterialItem[];
  requests: MaterialRequest[];
  transfers: Transfer[];
  sites: ConstructionSite[];
  activeSite: ConstructionSite;
  currentUser: UserProfile;
  notifications: AppNotification[];
  messages: ChatMessage[];
  unreadNotifsCount: number;
  matches: MatchRecommendation[];
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  setActiveSiteId: (siteId: string) => void;
  addMaterial: (material: Omit<MaterialItem, 'id' | 'createdAt' | 'updatedAt' | 'allocatedQuantity' | 'status'>) => MaterialItem;
  updateMaterial: (id: string, updates: Partial<MaterialItem>) => void;
  deleteMaterial: (id: string) => void;
  addRequest: (request: Omit<MaterialRequest, 'id' | 'createdAt' | 'updatedAt' | 'fulfilledQuantity' | 'allocatedQuantity' | 'status'>) => MaterialRequest;
  updateRequest: (id: string, updates: Partial<MaterialRequest>) => void;
  deleteRequest: (id: string) => void;
  createTransferFromMatch: (match: MatchRecommendation, scheduledDate?: string, scheduledTimeWindow?: string) => Transfer;
  advanceTransferStatus: (transferId: string, nextStatus: TransferStatus, note?: string) => void;
  sendMessage: (text: string) => void;
  markAllNotificationsRead: () => void;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
  isBackendConnected: boolean;
  lastSyncTime: string | null;
  triggerManualSync: () => Promise<void>;
  resetToDemoScenario: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MATERIALS: 'sn_materials_v2',
  REQUESTS: 'sn_requests_v2',
  TRANSFERS: 'sn_transfers_v2',
  SITES: 'sn_sites_v2',
  ACTIVE_SITE_ID: 'sn_active_site_id_v2',
  NOTIFICATIONS: 'sn_notifications_v2',
  MESSAGES: 'sn_messages_v2',
  LANGUAGE: 'sn_lang_v2',
};

function readStoredData<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;

  const migrated = saved
    .replaceAll('Manas Swarn', 'Arjun')
    .replaceAll('मानस स्वर्ण', 'अर्जुन')
    .replaceAll('Hello Manas!', 'Hello Arjun!');

  if (migrated !== saved) {
    localStorage.setItem(key, migrated);
  }

  return JSON.parse(migrated) as T;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    try {
      return readStoredData(STORAGE_KEYS.MATERIALS, SEED_MATERIALS);
    } catch {
      return SEED_MATERIALS;
    }
  });

  const [requests, setRequests] = useState<MaterialRequest[]>(() => {
    try {
      return readStoredData(STORAGE_KEYS.REQUESTS, SEED_REQUESTS);
    } catch {
      return SEED_REQUESTS;
    }
  });

  const [transfers, setTransfers] = useState<Transfer[]>(() => {
    try {
      return readStoredData(STORAGE_KEYS.TRANSFERS, SEED_TRANSFERS);
    } catch {
      return SEED_TRANSFERS;
    }
  });

  const [sites] = useState<ConstructionSite[]>(SEED_SITES);
  
  const [activeSiteId, setActiveSiteIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SITE_ID);
      return saved || 'site-hsr';
    } catch {
      return 'site-hsr';
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      return readStoredData(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      return readStoredData(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
    } catch {
      return SEED_MESSAGES;
    }
  });

  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (saved as 'en' | 'hi') || 'en';
    } catch {
      return 'en';
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Active site object
  const activeSite = sites.find((s) => s.id === activeSiteId) || sites[0];

  const currentUser: UserProfile = {
    ...INITIAL_USER,
    siteId: activeSite.id,
    siteName: activeSite.name,
    organization: activeSite.organization,
    name: activeSite.managerName,
    email: activeSite.email,
    phone: activeSite.phone,
  };

  const showToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SITE_ID, activeSiteId);
  }, [activeSiteId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  // Background check for backend endpoints & initial synchronization
  useEffect(() => {
    let mounted = true;
    async function initSync() {
      const ok = await api.checkHealth();
      if (mounted) {
        setIsBackendConnected(ok);
        if (ok) {
          const syncRes = await api.syncWithBackend({ materials, requests, transfers });
          if (syncRes.success) {
            setLastSyncTime(new Date().toLocaleTimeString());
          }
        }
      }
    }
    initSync();
    return () => {
      mounted = false;
    };
  }, []);

  const triggerManualSync = async () => {
    showToast('info', 'Synchronizing Data', 'Communicating with backend endpoint /api/sync...');
    const res = await api.syncWithBackend({ materials, requests, transfers });
    if (res.success) {
      setIsBackendConnected(true);
      setLastSyncTime(new Date().toLocaleTimeString());
      showToast('success', 'Sync Complete', `Synchronized ${res.syncedCounts?.materials} listings, ${res.syncedCounts?.requests} requests, ${res.syncedCounts?.transfers} transfers.`);
    } else {
      setIsBackendConnected(false);
      showToast('warning', 'Offline Mode', 'Backend currently unreachable. All changes are securely preserved locally.');
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const setActiveSiteId = (siteId: string) => {
    setActiveSiteIdState(siteId);
    const targetSite = sites.find((s) => s.id === siteId);
    showToast('info', 'Site Switched', `Active construction site set to ${targetSite?.name}`);
  };

  // Material operations
  const addMaterial = (newMatData: Omit<MaterialItem, 'id' | 'createdAt' | 'updatedAt' | 'allocatedQuantity' | 'status'>): MaterialItem => {
    const newMaterial: MaterialItem = {
      ...newMatData,
      id: `mat-${Date.now()}`,
      allocatedQuantity: 0,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMaterials((prev) => [newMaterial, ...prev]);
    showToast('success', 'Surplus Listed', `${newMaterial.availableQuantity} ${newMaterial.unit} of ${newMaterial.title} listed for recovery.`);
    
    // Add notif
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Material Listed',
      titleHi: 'नई सामग्री सूचीबद्ध',
      message: `${newMaterial.title} (${newMaterial.availableQuantity} ${newMaterial.unit}) is now discoverable by nearby sites.`,
      type: 'match',
      timestamp: 'Just now',
      read: false,
      linkTo: 'materials',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newMaterial;
  };

  const updateMaterial = (id: string, updates: Partial<MaterialItem>) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    showToast('info', 'Listing Removed', 'The material surplus listing has been deleted.');
  };

  // Request operations
  const addRequest = (newReqData: Omit<MaterialRequest, 'id' | 'createdAt' | 'updatedAt' | 'fulfilledQuantity' | 'allocatedQuantity' | 'status'>): MaterialRequest => {
    const newRequest: MaterialRequest = {
      ...newReqData,
      id: `req-${Date.now()}`,
      fulfilledQuantity: 0,
      allocatedQuantity: 0,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    showToast('success', 'Material Request Created', `Request for ${newRequest.requiredQuantity} ${newRequest.unit} ${newRequest.title} registered. Matching nearby listings...`);
    
    return newRequest;
  };

  const updateRequest = (id: string, updates: Partial<MaterialRequest>) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Request Cancelled', 'The material requirement has been removed.');
  };

  // Transfer creation from Smart Match (Scenario A core execution!)
  const createTransferFromMatch = (
    match: MatchRecommendation,
    scheduledDate?: string,
    scheduledTimeWindow?: string
  ): Transfer => {
    const transferQuantity = match.transferQuantity;
    const transferCode = `#TRF-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newTransfer: Transfer = {
      id: `trf-${Date.now()}`,
      transferCode,
      materialId: match.material.id,
      materialTitle: match.material.title,
      requestId: match.request.id,
      requestTitle: match.request.title,
      sourceSiteId: match.material.siteId,
      sourceSiteName: match.material.siteName,
      destinationSiteId: match.request.siteId,
      destinationSiteName: match.request.siteName,
      agreedQuantity: transferQuantity,
      unit: match.material.unit,
      distanceKm: match.distanceKm,
      matchScore: match.totalScore,
      currentStatus: 'Accepted',
      scheduledDate: scheduledDate || '2026-10-25',
      scheduledTimeWindow: scheduledTimeWindow || '10:00 AM - 01:00 PM',
      handoverNotes: `Smart Match transfer confirmed: ${transferQuantity} ${match.material.unit}. Loading support verified.`,
      contactPerson: match.material.contactName,
      contactPhone: match.material.contactPhone,
      createdAt: new Date().toISOString(),
      history: [
        {
          status: 'Proposed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          note: `Smart match recommended ${match.totalScore}% score between ${match.material.siteName} and ${match.request.siteName}.`,
        },
        {
          status: 'Accepted',
          timestamp: new Date().toISOString(),
          note: `Transfer accepted for ${transferQuantity} ${match.material.unit}. Reserved from source inventory.`,
        },
      ],
    };

    // Update material inventory allocation
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === match.material.id) {
          const newAllocated = m.allocatedQuantity + transferQuantity;
          const newAvailable = Math.max(0, m.availableQuantity - transferQuantity);
          const newStatus = newAvailable === 0 ? 'Reserved' : 'Partially Allocated';
          return {
            ...m,
            availableQuantity: newAvailable,
            allocatedQuantity: newAllocated,
            status: newStatus,
          };
        }
        return m;
      })
    );

    // Update request allocation
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === match.request.id) {
          const newAllocated = r.allocatedQuantity + transferQuantity;
          const isFulfilled = r.fulfilledQuantity + newAllocated >= r.requiredQuantity;
          return {
            ...r,
            allocatedQuantity: newAllocated,
            status: isFulfilled ? 'Fulfilled' : 'Matched',
          };
        }
        return r;
      })
    );

    setTransfers((prev) => [newTransfer, ...prev]);

    showToast(
      'success',
      'Match Accepted & Transfer Created',
      `Transfer ${transferCode} generated. ${transferQuantity} ${match.material.unit} allocated. Source remaining surplus: ${match.remainingSurplus} ${match.material.unit}.`
    );

    return newTransfer;
  };

  // Advance transfer status along timeline:
  // Proposed -> Accepted -> Scheduled -> Picked Up -> Confirmed -> Completed
  const advanceTransferStatus = (transferId: string, nextStatus: TransferStatus, note?: string) => {
    setTransfers((prev) =>
      prev.map((t) => {
        if (t.id === transferId) {
          const isCompleting = nextStatus === 'Completed' && t.currentStatus !== 'Completed';

          const updated: Transfer = {
            ...t,
            currentStatus: nextStatus,
            completedAt: isCompleting ? new Date().toISOString() : t.completedAt,
            history: [
              ...t.history,
              {
                status: nextStatus,
                timestamp: new Date().toISOString(),
                note: note || `Status progressed to ${nextStatus}`,
              },
            ],
          };

          // If completing, finalize the request and material status
          if (isCompleting) {
            setRequests((reqList) =>
              reqList.map((r) => {
                if (r.id === t.requestId) {
                  const newFulfilled = r.fulfilledQuantity + t.agreedQuantity;
                  const newAllocated = Math.max(0, r.allocatedQuantity - t.agreedQuantity);
                  const isDone = newFulfilled >= r.requiredQuantity;
                  return {
                    ...r,
                    fulfilledQuantity: newFulfilled,
                    allocatedQuantity: newAllocated,
                    status: isDone ? 'Fulfilled' : 'Partially Fulfilled',
                  };
                }
                return r;
              })
            );

            showToast(
              'success',
              'Transfer Completed & Verified!',
              `Material received successfully. Landfill waste diversion and recovery metrics updated.`
            );
          } else {
            showToast('info', 'Transfer Status Updated', `Transfer ${t.transferCode} is now in '${nextStatus}' stage.`);
          }

          return updated;
        }
        return t;
      })
    );
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: activeSite.id,
      senderName: activeSite.managerName,
      siteName: activeSite.name,
      text: text.trim(),
      timestamp: 'Just now',
      isCurrentUser: true,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated reply after short interval
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: 'site-koramangala',
        senderName: 'Vikram Sharma',
        siteName: 'Koramangala Green Build (Site A)',
        text: 'Understood, thank you! Gate passes are issued and loading ramp is clear. Looking forward to the recovery pickup.',
        timestamp: 'Just now',
        isCurrentUser: false,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('info', 'Notifications Cleared', 'All alerts marked as read.');
  };

  // Reset demo scenario button
  const resetToDemoScenario = () => {
    setMaterials(SEED_MATERIALS);
    setRequests(SEED_REQUESTS);
    setTransfers(SEED_TRANSFERS);
    setNotifications(SEED_NOTIFICATIONS);
    setMessages(SEED_MESSAGES);
    setActiveSiteIdState('site-hsr');
    showToast('info', 'Demo Reset', 'Reset to initial scenario: 200 Red Clay Bricks surplus available vs 150 requested.');
  };

  const matches = generateAllSystemMatches(materials, requests);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        materials,
        requests,
        transfers,
        sites,
        activeSite,
        currentUser,
        notifications,
        messages,
        unreadNotifsCount,
        matches,
        language,
        toggleLanguage,
        setActiveSiteId,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addRequest,
        updateRequest,
        deleteRequest,
        createTransferFromMatch,
        advanceTransferStatus,
        sendMessage,
        markAllNotificationsRead,
        toasts,
        showToast,
        removeToast,
        isBackendConnected,
        lastSyncTime,
        triggerManualSync,
        resetToDemoScenario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
