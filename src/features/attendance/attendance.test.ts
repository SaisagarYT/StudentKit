import { describe, it, expect } from 'vitest';
import { calculateAttendance } from './attendance.calculator';

describe('calculateAttendance', () => {
  it('calculates correct percentage', () => {
    const result = calculateAttendance({
      totalClasses: 100,
      attendedClasses: 75,
      targetPercentage: 75,
    });
    expect(result.currentPercentage).toBe(75);
  });

  it('detects above target correctly', () => {
    const result = calculateAttendance({
      totalClasses: 50,
      attendedClasses: 40,
      targetPercentage: 75,
    });
    expect(result.isAboveTarget).toBe(true);
    expect(result.currentPercentage).toBe(80);
  });

  it('detects below target correctly', () => {
    const result = calculateAttendance({
      totalClasses: 50,
      attendedClasses: 30,
      targetPercentage: 75,
    });
    expect(result.isAboveTarget).toBe(false);
    expect(result.currentPercentage).toBe(60);
  });

  it('calculates classes that can be missed when above target', () => {
    const result = calculateAttendance({
      totalClasses: 100,
      attendedClasses: 80,
      targetPercentage: 75,
    });
    expect(result.isAboveTarget).toBe(true);
    // (80*100 - 75*100) / 75 = 500/75 = 6.67 → floor = 6
    expect(result.classesCanMiss).toBe(6);
  });

  it('calculates classes needed to reach target when below', () => {
    const result = calculateAttendance({
      totalClasses: 100,
      attendedClasses: 60,
      targetPercentage: 75,
    });
    expect(result.isAboveTarget).toBe(false);
    // (75*100 - 60*100) / (100-75) = 1500/25 = 60
    expect(result.classesNeededToAttend).toBe(60);
  });

  it('handles zero total classes', () => {
    const result = calculateAttendance({
      totalClasses: 0,
      attendedClasses: 0,
      targetPercentage: 75,
    });
    expect(result.currentPercentage).toBe(0);
  });

  it('handles 100% target when already missed classes', () => {
    const result = calculateAttendance({
      totalClasses: 10,
      attendedClasses: 9,
      targetPercentage: 100,
    });
    expect(result.isAboveTarget).toBe(false);
    expect(result.classesNeededToAttend).toBe(Infinity);
  });

  it('handles perfect attendance', () => {
    const result = calculateAttendance({
      totalClasses: 50,
      attendedClasses: 50,
      targetPercentage: 75,
    });
    expect(result.currentPercentage).toBe(100);
    expect(result.isAboveTarget).toBe(true);
    expect(result.classesCanMiss).toBeGreaterThan(0);
  });

  it('returns zero classes can miss when exactly at target', () => {
    const result = calculateAttendance({
      totalClasses: 100,
      attendedClasses: 75,
      targetPercentage: 75,
    });
    expect(result.isAboveTarget).toBe(true);
    expect(result.classesCanMiss).toBe(0);
  });
});
