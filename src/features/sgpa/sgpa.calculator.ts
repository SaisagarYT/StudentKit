import { SubjectEntry, SGPAResult } from './sgpa.types';

export function calculateSGPA(subjects: SubjectEntry[]): SGPAResult | null {
  const validSubjects = subjects.filter(
    (s) =>
      s.gradePoints !== undefined &&
      s.credits !== undefined &&
      s.gradePoints >= 0 &&
      s.credits > 0
  );

  if (validSubjects.length === 0) return null;

  let totalGradePoints = 0;
  let totalCredits = 0;

  for (const sub of validSubjects) {
    totalGradePoints += sub.gradePoints! * sub.credits!;
    totalCredits += sub.credits!;
  }

  const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  return {
    sgpa,
    totalCredits,
    totalGradePoints,
    subjectCount: validSubjects.length,
  };
}
