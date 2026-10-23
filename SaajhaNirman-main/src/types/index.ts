export type MaterialCondition = 'Excellent' | 'Good' | 'Fair' | 'Requires Inspection';

export type MaterialCategory = 
  | 'Bricks & Blocks'
  | 'Tiles & Flooring'
  | 'Pipes & Plumbing'
  | 'Timber & Wood'
  | 'Doors & Windows'
  | 'Steel & Metal'
  | 'Electrical Fittings'
  | 'Cement Boards'
  | 'Other Construction Materials';

export type ListingStatus = 'Active' | 'Reserved' | 'Partially Allocated' | 'Completed' | 'Draft';

export type RequestStatus = 'Open' | 'Matched' | 'Partially Fulfilled' | 'Fulfilled' | 'Cancelled';

export type TransferStatus = 
  | 'Proposed'
  | 'Accepted'
  | 'Scheduled'
  | 'Picked Up'
  | 'Confirmed'
  | 'Completed';

export interface MaterialItem {
  id: string;
  title: string;
  titleHi?: string;
  category: MaterialCategory;
  materialType: string;
  availableQuantity: number;
  originalQuantity: number;
  allocatedQuantity: number;
  unit: string;
  condition: MaterialCondition;
  description: string;
  siteId: string;
  siteName: string;
  location: string;
  distanceKm: number;
  coordinates: { lat: number; lng: number };
  pickupStartDate: string;
  pickupDeadline: string;
  pickupTimeWindow?: string;
  loadingNotes?: string;
  contactName: string;
  contactPhone: string;
  images: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequest {
  id: string;
  title: string;
  category: MaterialCategory;
  materialType: string;
  requiredQuantity: number;
  fulfilledQuantity: number;
  allocatedQuantity: number;
  unit: string;
  minCondition: MaterialCondition;
  siteId: string;
  siteName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  maxDistanceKm: number;
  requiredByDate: string;
  preferredPickupWindow?: string;
  deliveryPreference: 'self_pickup' | 'delivery_if_available';
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TransferHistoryEntry {
  status: TransferStatus;
  timestamp: string;
  note: string;
}

export interface Transfer {
  id: string;
  transferCode: string;
  materialId: string;
  materialTitle: string;
  requestId: string;
  requestTitle: string;
  sourceSiteId: string;
  sourceSiteName: string;
  destinationSiteId: string;
  destinationSiteName: string;
  agreedQuantity: number;
  unit: string;
  distanceKm: number;
  matchScore: number;
  currentStatus: TransferStatus;
  scheduledDate: string;
  scheduledTimeWindow: string;
  handoverNotes: string;
  contactPerson: string;
  contactPhone: string;
  history: TransferHistoryEntry[];
  completedAt?: string;
  createdAt: string;
}

export interface ConstructionSite {
  id: string;
  name: string;
  organization: string;
  role: string;
  location: string;
  coordinates: { lat: number; lng: number };
  managerName: string;
  email: string;
  phone: string;
}

export interface MatchScoreBreakdown {
  materialCompatibility: number; // 0-100 (weight 35%)
  quantityFulfillment: number;    // 0-100 (weight 25%)
  conditionSuitability: number;   // 0-100 (weight 15%)
  distanceScore: number;          // 0-100 (weight 15%)
  deadlineScore: number;          // 0-100 (weight 10%)
}

export interface MatchRecommendation {
  id: string;
  material: MaterialItem;
  request: MaterialRequest;
  totalScore: number; // 0-100
  breakdown: MatchScoreBreakdown;
  transferQuantity: number;
  remainingSurplus: number;
  requestUnfulfilledQuantity: number;
  distanceKm: number;
  isFeasible: boolean;
  reasons: string[];
  caveats: string[];
  status: 'Recommended' | 'Pending Acceptance' | 'Accepted' | 'Declined';
}

export interface WasteDiversionReportItem {
  category: MaterialCategory;
  recoveredQuantity: number;
  unit: string;
  kgPerUnit: number;
  totalRecoveredKg: number;
  totalRecoveredTonnes: number;
  co2SavedKg: number;
  completedTransfersCount: number;
  conversionFactorSource: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleHi?: string;
  message: string;
  type: 'match' | 'request' | 'transfer' | 'system';
  timestamp: string;
  read: boolean;
  linkTo?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  siteName: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  nameHi?: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  siteId: string;
  siteName: string;
  token?: string;
}
