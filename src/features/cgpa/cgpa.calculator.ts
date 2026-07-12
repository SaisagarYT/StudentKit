import { SemesterEntry, CGPAResult } from './cgpa.types';

export function calculateCGPA(semesters: SemesterEntry[]): CGPAResult | null {
  const validSemesters = semesters.filter(
    (s) =>
      s.sgpa !== undefined &&
      s.credits !== undefined &&
      s.sgpa >= 0 &&
      s.credits > 0
  );

  if (validSemesters.length === 0) return null;

  let totalGradePoints = 0;
  let totalCredits = 0;

  for (const sem of validSemesters) {
    totalGradePoints += sem.sgpa! * sem.credits!;
    totalCredits += sem.credits!;
  }

  const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  return {
    cgpa,
    totalCredits,
    totalGradePoints,
    semesterCount: validSemesters.length,
  };
}
