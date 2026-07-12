import { describe, it, expect } from 'vitest';
import { calculateAge } from './age.calculator';

describe('calculateAge', () => {
  it('calculates exact age correctly', () => {
    const result = calculateAge(new Date('2000-01-15'), new Date('2024-06-20'));
    expect(result).not.toBeNull();
    expect(result!.years).toBe(24);
    expect(result!.months).toBe(5);
    expect(result!.days).toBe(5);
  });

  it('handles same day (birthday)', () => {
    const result = calculateAge(new Date('2000-03-10'), new Date('2024-03-10'));
    expect(result!.years).toBe(24);
    expect(result!.months).toBe(0);
    expect(result!.days).toBe(0);
  });

  it('returns null when birth date is after target', () => {
    const result = calculateAge(new Date('2025-01-01'), new Date('2024-01-01'));
    expect(result).toBeNull();
  });

  it('calculates total days', () => {
    const result = calculateAge(new Date('2024-01-01'), new Date('2024-01-31'));
    expect(result!.totalDays).toBe(30);
  });

  it('handles month boundary correctly', () => {
    const result = calculateAge(new Date('2000-01-31'), new Date('2000-03-01'));
    expect(result).not.toBeNull();
    expect(result!.months).toBe(1);
  });

  it('handles leap year', () => {
    const result = calculateAge(new Date('2000-02-29'), new Date('2024-02-29'));
    expect(result!.years).toBe(24);
    expect(result!.months).toBe(0);
    expect(result!.days).toBe(0);
  });

  it('calculates next birthday correctly', () => {
    const result = calculateAge(new Date('2000-06-15'), new Date('2024-06-10'));
    expect(result!.nextBirthday).toBe(5);
  });

  it('calculates next birthday when birthday has passed this year', () => {
    const result = calculateAge(new Date('2000-01-01'), new Date('2024-06-15'));
    expect(result!.nextBirthday).toBeGreaterThan(100);
  });
});
