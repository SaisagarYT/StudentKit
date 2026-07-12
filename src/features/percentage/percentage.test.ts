import { describe, it, expect } from 'vitest';
import {
  convertCGPAToPercentage,
  calculateMarksPercentage,
} from './percentage.calculator';

describe('convertCGPAToPercentage', () => {
  it('converts using generic formula (×9.5)', () => {
    const result = convertCGPAToPercentage(8.5, 'generic');
    expect(result.percentage).toBeCloseTo(80.75);
    expect(result.formula).toContain('9.5');
  });

  it('converts using Mumbai University formula', () => {
    const result = convertCGPAToPercentage(8.0, 'mumbai');
    // 7.1 * 8 + 11 = 56.8 + 11 = 67.8
    expect(result.percentage).toBeCloseTo(67.8);
  });

  it('converts using VTU formula', () => {
    const result = convertCGPAToPercentage(8.0, 'vtu');
    // (8 - 0.75) * 10 = 72.5
    expect(result.percentage).toBeCloseTo(72.5);
  });

  it('converts using CBCS formula', () => {
    const result = convertCGPAToPercentage(8.0, 'cbcs');
    // 8 * 10 - 7.5 = 72.5
    expect(result.percentage).toBeCloseTo(72.5);
  });

  it('does not return negative percentages', () => {
    const result = convertCGPAToPercentage(0.5, 'vtu');
    expect(result.percentage).toBeGreaterThanOrEqual(0);
  });

  it('handles perfect CGPA', () => {
    const result = convertCGPAToPercentage(10, 'generic');
    expect(result.percentage).toBe(95);
  });
});

describe('calculateMarksPercentage', () => {
  it('calculates correct percentage', () => {
    const result = calculateMarksPercentage(420, 600);
    expect(result.percentage).toBe(70);
  });

  it('handles perfect score', () => {
    const result = calculateMarksPercentage(100, 100);
    expect(result.percentage).toBe(100);
  });

  it('handles zero obtained', () => {
    const result = calculateMarksPercentage(0, 500);
    expect(result.percentage).toBe(0);
  });

  it('handles zero total gracefully', () => {
    const result = calculateMarksPercentage(50, 0);
    expect(result.percentage).toBe(0);
  });
});
