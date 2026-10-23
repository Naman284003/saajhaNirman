import {
  MaterialItem,
  MaterialRequest,
  MatchRecommendation,
  MatchScoreBreakdown,
  MaterialCondition
} from '../types';

export const CONDITION_RANK: Record<MaterialCondition, number> = {
  'Requires Inspection': 1,
  'Fair': 2,
  'Good': 3,
  'Excellent': 4,
};

export const MATCH_WEIGHTS = {
  materialCompatibility: 0.35,
  quantityFulfillment: 0.25,
  conditionSuitability: 0.15,
  distanceScore: 0.15,
  deadlineScore: 0.10,
};

// Haversine formula to compute distance in km
export function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function evaluateMatch(
  material: MaterialItem,
  request: MaterialRequest
): MatchRecommendation | null {
  // 1. Hard Constraints
  // Category check
  const sameCategory =
    material.category.toLowerCase().trim() === request.category.toLowerCase().trim();
  
  const typeCompatible =
    sameCategory ||
    material.materialType.toLowerCase().includes(request.materialType.toLowerCase()) ||
    request.materialType.toLowerCase().includes(material.materialType.toLowerCase());

  if (!typeCompatible) {
    return null;
  }

  // Inventory available check
  const available = material.availableQuantity;
  if (available <= 0) {
    return null;
  }

  const requested = request.requiredQuantity - request.fulfilledQuantity;
  if (requested <= 0) {
    return null;
  }

  // Condition check
  const materialConditionRank = CONDITION_RANK[material.condition] || 1;
  const minRequiredConditionRank = CONDITION_RANK[request.minCondition] || 1;
  if (materialConditionRank < minRequiredConditionRank) {
    // Condition is inferior to minimum acceptable
    return null;
  }

  // Distance check
  const distance = calculateDistance(material.coordinates, request.coordinates);
  const maxDistance = request.maxDistanceKm || 25;
  if (distance > maxDistance + 5) {
    // Too far
    return null;
  }

  // 2. Score Factors (Normalized 0-100)
  // Factor A: Material compatibility (35%)
  let materialCompatibility = 95;
  if (material.materialType.toLowerCase() === request.materialType.toLowerCase()) {
    materialCompatibility = 100;
  } else if (sameCategory) {
    materialCompatibility = 85;
  }

  // Factor B: Quantity fulfillment (25%)
  let quantityFulfillment = 100;
  const proposedTransferQuantity = Math.min(available, requested);
  if (available < requested) {
    quantityFulfillment = Math.round((available / requested) * 100);
  }

  // Factor C: Condition suitability (15%)
  let conditionSuitability = 90;
  if (materialConditionRank > minRequiredConditionRank) {
    conditionSuitability = 100; // Superior condition
  } else if (materialConditionRank === minRequiredConditionRank) {
    conditionSuitability = 95;
  }

  // Factor D: Distance score (15%)
  // Closer is better. 0 km = 100, at maxDistance = 50, beyond maxDistance falls to 10
  const distanceRatio = Math.min(distance / maxDistance, 1.5);
  const distanceScore = Math.max(10, Math.round(100 - distanceRatio * 50));

  // Factor E: Deadline score (10%)
  // Compare pickup deadline with required-by date
  let deadlineScore = 85;
  const materialDeadline = new Date(material.pickupDeadline).getTime();
  const requestDeadline = new Date(request.requiredByDate).getTime();
  const diffDays = Math.round((materialDeadline - requestDeadline) / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 0) {
    deadlineScore = 95;
  } else if (diffDays >= -3) {
    deadlineScore = 75; // Small margin
  } else {
    deadlineScore = 50;
  }

  // Weighted sum
  const totalScore = Math.round(
    MATCH_WEIGHTS.materialCompatibility * materialCompatibility +
    MATCH_WEIGHTS.quantityFulfillment * quantityFulfillment +
    MATCH_WEIGHTS.conditionSuitability * conditionSuitability +
    MATCH_WEIGHTS.distanceScore * distanceScore +
    MATCH_WEIGHTS.deadlineScore * deadlineScore
  );

  const breakdown: MatchScoreBreakdown = {
    materialCompatibility,
    quantityFulfillment,
    conditionSuitability,
    distanceScore,
    deadlineScore,
  };

  const remainingSurplus = material.availableQuantity - proposedTransferQuantity;
  const requestUnfulfilledQuantity = requested - proposedTransferQuantity;

  const reasons: string[] = [
    `Same material specification (${material.materialType})`,
    `Supplies ${proposedTransferQuantity} ${material.unit} (${Math.round((proposedTransferQuantity / requested) * 100)}% of requirement)`,
    `Condition: ${material.condition} (Meets minimum required: ${request.minCondition})`,
    `Short transit radius: ${distance} km from ${request.siteName}`,
  ];

  const caveats: string[] = [];
  if (remainingSurplus > 0) {
    caveats.push(`${remainingSurplus} ${material.unit} surplus will still remain available at source site.`);
  }
  if (requestUnfulfilledQuantity > 0) {
    caveats.push(`Partially fulfills request: ${requestUnfulfilledQuantity} ${material.unit} will still be needed.`);
  }

  return {
    id: `match-${material.id}-${request.id}`,
    material,
    request,
    totalScore,
    breakdown,
    transferQuantity: proposedTransferQuantity,
    remainingSurplus,
    requestUnfulfilledQuantity,
    distanceKm: distance,
    isFeasible: totalScore >= 60,
    reasons,
    caveats,
    status: 'Recommended',
  };
}

export function findMatchesForRequest(
  request: MaterialRequest,
  materials: MaterialItem[]
): MatchRecommendation[] {
  const matches: MatchRecommendation[] = [];
  for (const mat of materials) {
    // Avoid self-matching
    if (mat.siteId === request.siteId) continue;
    if (mat.status !== 'Active' && mat.status !== 'Partially Allocated') continue;

    const match = evaluateMatch(mat, request);
    if (match && match.isFeasible) {
      matches.push(match);
    }
  }
  return matches.sort((a, b) => b.totalScore - a.totalScore);
}

export function findMatchesForMaterial(
  material: MaterialItem,
  requests: MaterialRequest[]
): MatchRecommendation[] {
  const matches: MatchRecommendation[] = [];
  for (const req of requests) {
    // Avoid self-matching
    if (req.siteId === material.siteId) continue;
    if (req.status !== 'Open' && req.status !== 'Partially Fulfilled') continue;

    const match = evaluateMatch(material, req);
    if (match && match.isFeasible) {
      matches.push(match);
    }
  }
  return matches.sort((a, b) => b.totalScore - a.totalScore);
}

export function generateAllSystemMatches(
  materials: MaterialItem[],
  requests: MaterialRequest[]
): MatchRecommendation[] {
  const allMatches: MatchRecommendation[] = [];
  for (const req of requests) {
    if (req.status === 'Fulfilled' || req.status === 'Cancelled') continue;
    const matches = findMatchesForRequest(req, materials);
    allMatches.push(...matches);
  }
  return allMatches.sort((a, b) => b.totalScore - a.totalScore);
}
