import { describe, it, expect } from 'vitest';
import { calculateCTCToInHand } from './salary.calculator';

describe('calculateCTCToInHand', () => {
  it('returns basic breakdown for 8 LPA', () => {
    const result = calculateCTCToInHand({ annualCTC: 800000 });
    expect(result.annualCTC).toBe(800000);
    expect(result.basicPay).toBe(320000); // 40%
    expect(result.hra).toBe(160000); // 50% of basic
    expect(result.monthlyInHand).toBeGreaterThan(0);
    expect(result.monthlyInHand).toBeLessThan(800000 / 12);
  });

  it('monthly in-hand is less than CTC/12', () => {
    const result = calculateCTCToInHand({ annualCTC: 1200000 });
    expect(result.monthlyInHand).toBeLessThan(100000);
  });

  it('handles low CTC with zero tax', () => {
    const result = calculateCTCToInHand({ annualCTC: 300000 });
    expect(result.incomeTax).toBe(0);
    expect(result.annualInHand).toBeGreaterThan(0);
  });

  it('professional tax is 2400 per year', () => {
    const result = calculateCTCToInHand({ annualCTC: 600000 });
    expect(result.professionalTax).toBe(2400);
  });

  it('employer PF is capped at 21600', () => {
    const result = calculateCTCToInHand({ annualCTC: 2000000 });
    expect(result.employerPF).toBe(21600);
    expect(result.employeePF).toBe(21600);
  });

  it('never returns negative values', () => {
    const result = calculateCTCToInHand({ annualCTC: 100000 });
    expect(result.annualInHand).toBeGreaterThanOrEqual(0);
    expect(result.monthlyInHand).toBeGreaterThanOrEqual(0);
  });
});
