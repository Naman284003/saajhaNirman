import { MaterialItem, MaterialRequest, Transfer, UserProfile } from '../types';

export interface SyncResponse {
  success: boolean;
  serverTimestamp?: string;
  syncedCounts?: {
    materials: number;
    requests: number;
    transfers: number;
  };
  data?: {
    materials: MaterialItem[];
    requests: MaterialRequest[];
    transfers: Transfer[];
  };
}

class ApiClient {
  private token: string | null = null;
  public isConnected: boolean = false;
  public lastSyncTime: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('sn_auth_token') : null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sn_auth_token', token);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        this.isConnected = true;
        return true;
      }
    } catch {
      this.isConnected = false;
    }
    return false;
  }

  async login(email?: string, siteId?: string): Promise<{ success: boolean; user?: UserProfile; token?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, siteId }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        this.setToken(data.token);
      }
      return data;
    } catch (err) {
      console.warn('API login network fallback:', err);
      return { success: true };
    }
  }

  async syncWithBackend(payload: {
    materials: MaterialItem[];
    requests: MaterialRequest[];
    transfers: Transfer[];
  }): Promise<SyncResponse> {
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        body: JSON.stringify({
          ...payload,
          clientTimestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        this.isConnected = true;
        this.lastSyncTime = new Date().toLocaleTimeString();
        return data;
      }
    } catch (err) {
      console.warn('Backend sync failed, maintaining local state:', err);
      this.isConnected = false;
    }

    return {
      success: false,
      syncedCounts: {
        materials: payload.materials.length,
        requests: payload.requests.length,
        transfers: payload.transfers.length,
      },
    };
  }

  async extractMaterialFromText(text: string): Promise<any> {
    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('AI extract fetch error:', err);
    }
    return null;
  }
}

export const api = new ApiClient();
