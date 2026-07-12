export interface AttendanceInput {
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
}

export interface AttendanceResult {
  currentPercentage: number;
  isAboveTarget: boolean;
  classesCanMiss: number;
  classesNeededToAttend: number;
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
}
