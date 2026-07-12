export interface SubjectEntry {
  id: string;
  subject: string;
  gradePoints: number | undefined;
  credits: number | undefined;
}

export interface SGPAResult {
  sgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  subjectCount: number;
}
