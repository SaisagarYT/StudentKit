export interface SemesterEntry {
  id: string;
  sgpa: number | undefined;
  credits: number | undefined;
}

export interface CGPAResult {
  cgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  semesterCount: number;
}
