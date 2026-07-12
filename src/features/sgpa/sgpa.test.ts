import { describe, it, expect } from 'vitest';
import { calculateSGPA } from './sgpa.calculator';

describe('calculateSGPA', () => {
  it('calculates weighted SGPA correctly', () => {
    const result = calculateSGPA([
      { id: '1', subject: 'Math', gradePoints: 9, credits: 4 },
      { id: '2', subject: 'Physics', gradePoints: 8, credits: 3 },
      { id: '3', subject: 'CS', gradePoints: 10, credits: 4 },
    ]);
    expect(result).not.toBeNull();
    // (9*4 + 8*3 + 10*4) / (4+3+4) = (36+24+40)/11 ≈ 9.09
    expect(result!.sgpa).toBeCloseTo(9.09, 1);
    expect(result!.totalCredits).toBe(11);
    expect(result!.subjectCount).toBe(3);
  });

  it('returns null for empty input', () => {
    expect(calculateSGPA([])).toBeNull();
  });

  it('returns null when all entries have missing values', () => {
    const result = calculateSGPA([
      { id: '1', subject: '', gradePoints: undefined, credits: undefined },
    ]);
    expect(result).toBeNull();
  });

  it('handles single subject', () => {
    const result = calculateSGPA([
      { id: '1', subject: 'English', gradePoints: 7.5, credits: 3 },
    ]);
    expect(result!.sgpa).toBe(7.5);
    expect(result!.totalCredits).toBe(3);
  });
});
