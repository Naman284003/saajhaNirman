import { MaterialCategory, Transfer, WasteDiversionReportItem } from '../types';

// Standard conversion factors based on Central Building Research Institute (CBRI) & Circular Construction metrics
export const MATERIAL_CONVERSIONS: Record<
  MaterialCategory,
  {
    kgPerUnit: number;
    defaultUnit: string;
    co2PerKg: number; // kg CO2 avoided per kg of reused material
    source: string;
  }
> = {
  'Bricks & Blocks': {
    kgPerUnit: 3.1,
    defaultUnit: 'Pieces',
    co2PerKg: 0.24,
    source: 'CBRI Clay Brick Lifecycle Assessment',
  },
  'Tiles & Flooring': {
    kgPerUnit: 22.0, // per box (approx 10-12 tiles)
    defaultUnit: 'Boxes',
    co2PerKg: 0.45,
    source: 'Indian Ceramic Council Lifecycle Data',
  },
  'Pipes & Plumbing': {
    kgPerUnit: 12.5, // 4-meter PVC pipe segment
    defaultUnit: 'Pieces',
    co2PerKg: 1.85,
    source: 'PVC Pipe Producers Environmental Product Declaration',
  },
  'Timber & Wood': {
    kgPerUnit: 18.0, // reclaimed timber plank
    defaultUnit: 'Pieces',
    co2PerKg: 0.72,
    source: 'Forest Products Circularity Assessment',
  },
  'Doors & Windows': {
    kgPerUnit: 35.0,
    defaultUnit: 'Units',
    co2PerKg: 1.10,
    source: 'Salvaged Architectural Assemblies EPD',
  },
  'Steel & Metal': {
    kgPerUnit: 1.0, // measured in kg
    defaultUnit: 'kg',
    co2PerKg: 1.82,
    source: 'WorldSteel Reused Structural Steel Metric',
  },
  'Electrical Fittings': {
    kgPerUnit: 0.75,
    defaultUnit: 'Pieces',
    co2PerKg: 2.10,
    source: 'E-Waste & Copper Reclamation Index',
  },
  'Cement Boards': {
    kgPerUnit: 28.0, // per 8x4 sheet
    defaultUnit: 'Sheets',
    co2PerKg: 0.38,
    source: 'Fiber Cement Board LCA',
  },
  'Other Construction Materials': {
    kgPerUnit: 5.0,
    defaultUnit: 'Units',
    co2PerKg: 0.30,
    source: 'General Construction Debris Diversion Metric',
  },
};

export function calculateTransferMassKg(
  category: MaterialCategory,
  quantity: number,
  unit?: string
): number {
  const conv = MATERIAL_CONVERSIONS[category] || MATERIAL_CONVERSIONS['Other Construction Materials'];
  
  // If unit is kg or tonnes directly
  const unitLower = (unit || '').toLowerCase();
  if (unitLower === 'kg' || unitLower === 'kilograms') {
    return quantity;
  }
  if (unitLower === 'tonnes' || unitLower === 'tons' || unitLower === 'टन') {
    return quantity * 1000;
  }
  return quantity * conv.kgPerUnit;
}

export function generateWasteDiversionReport(
  completedTransfers: Transfer[],
  allMaterialsMap: Record<string, { category: MaterialCategory }>
): WasteDiversionReportItem[] {
  const categoryMap: Partial<Record<MaterialCategory, {
    quantity: number;
    transfersCount: number;
    unit: string;
  }>> = {};

  for (const tr of completedTransfers) {
    if (tr.currentStatus !== 'Completed') continue;

    const matInfo = allMaterialsMap[tr.materialId];
    const category = matInfo?.category || 'Bricks & Blocks';

    if (!categoryMap[category]) {
      categoryMap[category] = {
        quantity: 0,
        transfersCount: 0,
        unit: tr.unit,
      };
    }

    categoryMap[category]!.quantity += tr.agreedQuantity;
    categoryMap[category]!.transfersCount += 1;
  }

  const reportItems: WasteDiversionReportItem[] = [];

  for (const [catName, data] of Object.entries(categoryMap)) {
    const category = catName as MaterialCategory;
    const conv = MATERIAL_CONVERSIONS[category] || MATERIAL_CONVERSIONS['Other Construction Materials'];
    const totalRecoveredKg = calculateTransferMassKg(category, data.quantity, data.unit);
    const totalRecoveredTonnes = Math.round((totalRecoveredKg / 1000) * 100) / 100;
    const co2SavedKg = Math.round(totalRecoveredKg * conv.co2PerKg);

    reportItems.push({
      category,
      recoveredQuantity: data.quantity,
      unit: data.unit,
      kgPerUnit: conv.kgPerUnit,
      totalRecoveredKg: Math.round(totalRecoveredKg),
      totalRecoveredTonnes,
      co2SavedKg,
      completedTransfersCount: data.transfersCount,
      conversionFactorSource: conv.source,
    });
  }

  return reportItems.sort((a, b) => b.totalRecoveredKg - a.totalRecoveredKg);
}

export function exportImpactReportCSV(reportItems: WasteDiversionReportItem[], totalTransfers: number): void {
  const headers = [
    'Material Category',
    'Recovered Quantity',
    'Unit',
    'Std Conversion (kg/unit)',
    'Total Mass Recovered (kg)',
    'Total Mass (Tonnes)',
    'CO2 Avoided (kg)',
    'Completed Transfers',
    'Conversion Source & Standard',
  ];

  const rows = reportItems.map((item) => [
    `"${item.category}"`,
    item.recoveredQuantity,
    `"${item.unit}"`,
    item.kgPerUnit,
    item.totalRecoveredKg,
    item.totalRecoveredTonnes,
    item.co2SavedKg,
    item.completedTransfersCount,
    `"${item.conversionFactorSource}"`,
  ]);

  const totalKg = reportItems.reduce((acc, curr) => acc + curr.totalRecoveredKg, 0);
  const totalTonnes = Math.round((totalKg / 1000) * 100) / 100;
  const totalCO2 = reportItems.reduce((acc, curr) => acc + curr.co2SavedKg, 0);

  const summaryRow = [
    '"TOTAL"',
    '--',
    '--',
    '--',
    totalKg,
    totalTonnes,
    totalCO2,
    totalTransfers,
    '"Verified Site Handover Audit"',
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((r) => r.join(',')), summaryRow.join(',')].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `saajha-nirman-waste-diversion-report-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
