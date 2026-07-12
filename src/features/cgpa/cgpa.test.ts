import { describe, it, expect } from 'vitest';
import { calculateCGPA } from './cgpa.calculator';

describe('calculateCGPA', () => {
  it('calculates weighted CGPA correctly', () => {
    const result = calculateCGPA([
      { id: '1', sgpa: 8.0, credits: 20 },
      { id: '2', sgpa: 9.0, credits: 22 },
    ]);
    expect(result).not.toBeNull();
    // (8*20 + 9*22) / (20+22) = (160+198)/42 = 358/42 ≈ 8.52
    expect(result!.cgpa).toBeCloseTo(8.52, 1);
    expect(result!.totalCredits).toBe(42);
    expect(result!.semesterCount).toBe(2);
  });

  it('returns null for empty input', () => {
    expect(calculateCGPA([])).toBeNull();
  });

  it('ignores entries with missing values', () => {
    const result = calculateCGPA([
      { id: '1', sgpa: 8.5, credits: 20 },
      { id: '2', sgpa: undefined, credits: 22 },
      { id: '3', sgpa: 7.0, credits: undefined },
    ]);
    expect(result).not.toBeNull();
    expect(result!.semesterCount).toBe(1);
    expect(result!.cgpa).toBe(8.5);
  });

  it('handles single semester', () => {
    const result = calculateCGPA([{ id: '1', sgpa: 9.2, credits: 24 }]);
    expect(result!.cgpa).toBeCloseTo(9.2);
    expect(result!.totalCredits).toBe(24);
  });

  it('handles many semesters', () => {
    const semesters = Array.from({ length: 8 }, (_, i) => ({
      id: String(i),
      sgpa: 7 + i * 0.3,
      credits: 20 + i,
    }));
    const result = calculateCGPA(semesters);
    expect(result).not.toBeNull();
    expect(result!.semesterCount).toBe(8);
    expect(result!.cgpa).toBeGreaterThan(7);
    expect(result!.cgpa).toBeLessThan(10);
  });

  it('ignores entries with zero credits', () => {
    const result = calculateCGPA([
      { id: '1', sgpa: 8.0, credits: 0 },
      { id: '2', sgpa: 9.0, credits: 20 },
    ]);
    expect(result!.semesterCount).toBe(1);
    expect(result!.cgpa).toBe(9.0);
  });
});
