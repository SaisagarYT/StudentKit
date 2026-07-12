export interface CTCBreakdown {
  annualCTC: number;
  basicPay: number;
  hra: number;
  specialAllowance: number;
  employerPF: number;
  employeePF: number;
  professionalTax: number;
  incomeTax: number;
  annualInHand: number;
  monthlyInHand: number;
  totalDeductions: number;
}

export interface SalaryInput {
  annualCTC: number;
  includeHRA?: boolean;
  pfPercentage?: number;
}

export function calculateCTCToInHand(input: SalaryInput): CTCBreakdown {
  const { annualCTC, pfPercentage = 12 } = input;

  // Standard Indian CTC breakdown (estimation)
  const basicPay = annualCTC * 0.4;
  const hra = basicPay * 0.5;
  const employerPF = Math.min(basicPay * (pfPercentage / 100), 21600);
  const specialAllowance = annualCTC - basicPay - hra - employerPF;

  // Deductions
  const employeePF = Math.min(basicPay * (pfPercentage / 100), 21600);
  const professionalTax = 2400; // Standard ₹200/month
  const incomeTax = estimateIncomeTax(annualCTC - employerPF);

  const totalDeductions = employeePF + professionalTax + incomeTax;
  const annualInHand = annualCTC - employerPF - totalDeductions;
  const monthlyInHand = annualInHand / 12;

  return {
    annualCTC,
    basicPay,
    hra,
    specialAllowance: Math.max(specialAllowance, 0),
    employerPF,
    employeePF,
    professionalTax,
    incomeTax,
    annualInHand: Math.max(annualInHand, 0),
    monthlyInHand: Math.max(monthlyInHand, 0),
    totalDeductions,
  };
}

function estimateIncomeTax(taxableIncome: number): number {
  // New tax regime FY 2024-25 (simplified estimation)
  // Standard deduction of ₹75,000
  const income = taxableIncome - 75000;

  if (income <= 300000) return 0;
  if (income <= 700000) return (income - 300000) * 0.05;
  if (income <= 1000000) return 20000 + (income - 700000) * 0.1;
  if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
  if (income <= 1500000) return 80000 + (income - 1200000) * 0.2;
  return 140000 + (income - 1500000) * 0.3;
}
