export interface CGPAToPercentageResult {
  percentage: number;
  formula: string;
  formulaName: string;
}

export interface MarksPercentageResult {
  percentage: number;
  obtained: number;
  total: number;
}

export type ConversionFormula = 'generic' | 'mumbai' | 'vtu' | 'cbcs';

const formulas: Record<
  ConversionFormula,
  { name: string; convert: (cgpa: number) => number; formula: string }
> = {
  generic: {
    name: 'Generic (CGPA × 9.5)',
    convert: (cgpa) => cgpa * 9.5,
    formula: 'Percentage = CGPA × 9.5',
  },
  mumbai: {
    name: 'Mumbai University (7.1 × CGPA + 11)',
    convert: (cgpa) => 7.1 * cgpa + 11,
    formula: 'Percentage = 7.1 × CGPA + 11',
  },
  vtu: {
    name: 'VTU ((CGPA - 0.75) × 10)',
    convert: (cgpa) => (cgpa - 0.75) * 10,
    formula: 'Percentage = (CGPA - 0.75) × 10',
  },
  cbcs: {
    name: 'CBCS/UGC (CGPA × 10 - 7.5)',
    convert: (cgpa) => cgpa * 10 - 7.5,
    formula: 'Percentage = CGPA × 10 - 7.5',
  },
};

export function convertCGPAToPercentage(
  cgpa: number,
  formulaKey: ConversionFormula
): CGPAToPercentageResult {
  const f = formulas[formulaKey];
  return {
    percentage: Math.max(0, f.convert(cgpa)),
    formula: f.formula,
    formulaName: f.name,
  };
}

export function calculateMarksPercentage(
  obtained: number,
  total: number
): MarksPercentageResult {
  return {
    percentage: total > 0 ? (obtained / total) * 100 : 0,
    obtained,
    total,
  };
}

export function getFormulaOptions() {
  return Object.entries(formulas).map(([key, val]) => ({
    value: key as ConversionFormula,
    label: val.name,
  }));
}
