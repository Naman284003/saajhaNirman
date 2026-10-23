// Explicitly disable HMR to comply with AI Studio iFrame environment and eliminate WebSocket connection errors
process.env.DISABLE_HMR = 'true';

import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory persistent state store on the server
let serverStore = {
  materials: [] as any[],
  requests: [] as any[],
  transfers: [] as any[],
  notifications: [] as any[],
  lastUpdated: new Date().toISOString(),
};

// Initialize server-side Gemini AI client if key exists
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('Gemini AI client initialization skipped:', err);
  }
}

// ----------------------------------------------------
// Authentication Endpoints
// ----------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, siteId } = req.body;
  
  // Demo or real user authentication
  const user = {
    id: 'usr-' + (email ? email.split('@')[0] : 'manas'),
    name: email?.includes('vikram') ? 'Vikram Sharma' : 'Arjun',
    nameHi: email?.includes('vikram') ? 'विक्रम शर्मा' : 'अर्जुन',
    email: email || 'manas@ecotech.in',
    phone: '+91 98451 77210',
    organization: email?.includes('vikram') ? 'Shanti Construction Corp' : 'EcoTech Infra Ltd',
    role: 'Site Manager',
    siteId: siteId || (email?.includes('vikram') ? 'site-koramangala' : 'site-hsr'),
    siteName: siteId === 'site-koramangala' || email?.includes('vikram') 
      ? 'Koramangala Green Build (Site A)' 
      : 'HSR Layout EcoTech Towers',
    token: `sn-jwt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  };

  res.json({
    success: true,
    message: 'Authenticated successfully',
    user,
    token: user.token,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, organization, siteName, location, role } = req.body;
  const user = {
    id: `usr-${Date.now()}`,
    name: name || 'New Construction Partner',
    email: email || 'partner@saajhanirman.in',
    phone: req.body.phone || '+91 98000 00000',
    organization: organization || 'Independent Site Project',
    role: role || 'Site Supervisor',
    siteId: `site-${Date.now()}`,
    siteName: siteName || `${name}'s Construction Site`,
    token: `sn-jwt-${Date.now()}`,
  };

  res.json({
    success: true,
    message: 'User and construction site registered successfully',
    user,
    token: user.token,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(200).json({
      authenticated: true,
      user: {
        id: 'usr-manas-01',
        name: 'Babloo tekedar',
        nameHi: 'अर्जुन',
        email: 'manas@ecotech.in',
        role: 'Site Manager',
        siteId: 'site-hsr',
        siteName: 'HSR Layout EcoTech Towers',
      },
    });
  }
  res.json({ authenticated: true });
});

// ----------------------------------------------------
// Seamless Data Synchronization Endpoint
// ----------------------------------------------------
app.post('/api/sync', (req: Request, res: Response) => {
  const { materials, requests, transfers, clientTimestamp } = req.body;

  // Merge client data into server store
  if (Array.isArray(materials) && materials.length > 0) {
    serverStore.materials = materials;
  }
  if (Array.isArray(requests) && requests.length > 0) {
    serverStore.requests = requests;
  }
  if (Array.isArray(transfers) && transfers.length > 0) {
    serverStore.transfers = transfers;
  }
  serverStore.lastUpdated = new Date().toISOString();

  res.json({
    success: true,
    serverTimestamp: serverStore.lastUpdated,
    syncedCounts: {
      materials: serverStore.materials.length,
      requests: serverStore.requests.length,
      transfers: serverStore.transfers.length,
    },
    data: {
      materials: serverStore.materials,
      requests: serverStore.requests,
      transfers: serverStore.transfers,
    },
  });
});

// ----------------------------------------------------
// Materials API
// ----------------------------------------------------
app.get('/api/materials', (_req: Request, res: Response) => {
  res.json({ success: true, materials: serverStore.materials });
});

app.post('/api/materials', (req: Request, res: Response) => {
  const newMaterial = {
    ...req.body,
    id: req.body.id || `mat-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  serverStore.materials.unshift(newMaterial);
  res.status(201).json({ success: true, material: newMaterial });
});

app.delete('/api/materials/:id', (req: Request, res: Response) => {
  serverStore.materials = serverStore.materials.filter((m) => m.id !== req.params.id);
  res.json({ success: true, message: 'Material deleted' });
});

// ----------------------------------------------------
// Requests API
// ----------------------------------------------------
app.get('/api/requests', (_req: Request, res: Response) => {
  res.json({ success: true, requests: serverStore.requests });
});

app.post('/api/requests', (req: Request, res: Response) => {
  const newRequest = {
    ...req.body,
    id: req.body.id || `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  serverStore.requests.unshift(newRequest);
  res.status(201).json({ success: true, request: newRequest });
});

// ----------------------------------------------------
// Transfers API
// ----------------------------------------------------
app.get('/api/transfers', (_req: Request, res: Response) => {
  res.json({ success: true, transfers: serverStore.transfers });
});

app.post('/api/transfers', (req: Request, res: Response) => {
  const newTransfer = {
    ...req.body,
    id: req.body.id || `trf-${Date.now()}`,
    transferCode: req.body.transferCode || `#TRF-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
  };
  serverStore.transfers.unshift(newTransfer);
  res.status(201).json({ success: true, transfer: newTransfer });
});

app.patch('/api/transfers/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const transfer = serverStore.transfers.find((t) => t.id === id);
  if (!transfer) {
    return res.status(404).json({ success: false, message: 'Transfer not found' });
  }

  transfer.currentStatus = status;
  if (!transfer.history) transfer.history = [];
  transfer.history.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status transitioned to ${status}`,
  });

  if (status === 'Completed') {
    transfer.completedAt = new Date().toISOString();
  }

  res.json({ success: true, transfer });
});

// ----------------------------------------------------
// AI Parsing / Extraction Endpoint
// (Optional extraction of quantities & specs from raw descriptions)
// ----------------------------------------------------
app.post('/api/ai/extract', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text description required' });
  }

  // Attempt using Gemini API if client initialized
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are an expert construction material salvage estimator for Saajha Nirman.
Extract the structured parameters from this natural language construction description:
"${text}"

Return JSON matching this schema:
{
  "title": string,
  "category": "Bricks & Blocks" | "Tiles & Flooring" | "Pipes & Plumbing" | "Timber & Wood" | "Doors & Windows" | "Steel & Metal" | "Electrical Fittings" | "Cement Boards" | "Other Construction Materials",
  "materialType": string,
  "quantity": number,
  "unit": "Pieces" | "Boxes" | "Bags" | "Metres" | "Kilograms" | "Tonnes" | "Sheets",
  "condition": "Excellent" | "Good" | "Fair" | "Requires Inspection",
  "location": string,
  "pickupDays": number
}`
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, extracted: parsed, source: 'gemini-ai' });
      }
    } catch (aiErr) {
      console.warn('Gemini AI extract fallback to rule-based parser:', aiErr);
    }
  }

  // Robust Rule-Based Fallback Parser
  const lower = text.toLowerCase();
  let category = 'Other Construction Materials';
  let materialType = 'Construction Materials';
  let unit = 'Pieces';

  if (lower.includes('brick') || lower.includes('ईंट') || lower.includes('block')) {
    category = 'Bricks & Blocks';
    materialType = 'Red Clay Bricks';
    unit = 'Pieces';
  } else if (lower.includes('tile') || lower.includes('टाइल्स') || lower.includes('flooring')) {
    category = 'Tiles & Flooring';
    materialType = 'Ceramic Floor Tiles';
    unit = 'Boxes';
  } else if (lower.includes('pipe') || lower.includes('पाइप') || lower.includes('pvc') || lower.includes('plumbing')) {
    category = 'Pipes & Plumbing';
    materialType = 'PVC Drainage Pipes 4-inch';
    unit = 'Pieces';
  } else if (lower.includes('timber') || lower.includes('wood') || lower.includes('लकड़ी') || lower.includes('plank')) {
    category = 'Timber & Wood';
    materialType = 'Teak Wood Planks';
    unit = 'Pieces';
  } else if (lower.includes('steel') || lower.includes('iron') || lower.includes('rebar')) {
    category = 'Steel & Metal';
    materialType = 'Structural Rebar Steel';
    unit = 'Kilograms';
  }

  // Number extraction
  const numMatch = text.match(/\b(\d+)\b/);
  const quantity = numMatch ? parseInt(numMatch[1], 10) : 100;

  let condition = 'Good';
  if (lower.includes('new') || lower.includes('sealed') || lower.includes('excellent') || lower.includes('pristine')) {
    condition = 'Excellent';
  } else if (lower.includes('fair') || lower.includes('used') || lower.includes('acceptable')) {
    condition = 'Fair';
  }

  let location = 'Bangalore';
  if (lower.includes('koramangala')) location = 'Koramangala, Bangalore';
  else if (lower.includes('hsr')) location = 'HSR Layout, Bangalore';
  else if (lower.includes('indiranagar')) location = 'Indiranagar, Bangalore';
  else if (lower.includes('whitefield')) location = 'Whitefield, Bangalore';

  res.json({
    success: true,
    extracted: {
      title: `${quantity} ${materialType}`,
      category,
      materialType,
      quantity,
      unit,
      condition,
      location,
      pickupDays: 7,
    },
    source: 'rule-engine',
  });
});

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'Saajha Nirman API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET  /api/auth/me',
      'POST /api/sync',
      'GET  /api/materials',
      'POST /api/materials',
      'GET  /api/requests',
      'POST /api/requests',
      'GET  /api/transfers',
      'PATCH /api/transfers/:id/status',
      'POST /api/ai/extract',
    ],
  });
});

// ----------------------------------------------------
// Vite Dev Server / Static Hosting
// ----------------------------------------------------
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Saajha Nirman full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
