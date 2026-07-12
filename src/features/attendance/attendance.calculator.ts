import { AttendanceInput, AttendanceResult } from './attendance.types';

export function calculateAttendance(input: AttendanceInput): AttendanceResult {
  const { totalClasses, attendedClasses, targetPercentage } = input;

  const currentPercentage =
    totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  const isAboveTarget = currentPercentage >= targetPercentage;

  let classesCanMiss = 0;
  let classesNeededToAttend = 0;

  if (isAboveTarget) {
    // How many consecutive classes can be missed while staying at/above target
    // (attended) / (total + x) >= target/100
    // attended * 100 >= target * (total + x)
    // x <= (attended * 100 - target * total) / target
    classesCanMiss = Math.floor(
      (attendedClasses * 100 - targetPercentage * totalClasses) /
        targetPercentage
    );
    classesCanMiss = Math.max(classesCanMiss, 0);
  } else {
    // How many consecutive classes needed to reach target
    // (attended + x) / (total + x) >= target/100
    // (attended + x) * 100 >= target * (total + x)
    // 100x - target*x >= target*total - attended*100
    // x(100 - target) >= target*total - attended*100
    // x >= (target*total - attended*100) / (100 - target)
    if (targetPercentage < 100) {
      classesNeededToAttend = Math.ceil(
        (targetPercentage * totalClasses - attendedClasses * 100) /
          (100 - targetPercentage)
      );
      classesNeededToAttend = Math.max(classesNeededToAttend, 0);
    } else {
      classesNeededToAttend = Infinity;
    }
  }

  return {
    currentPercentage,
    isAboveTarget,
    classesCanMiss,
    classesNeededToAttend,
    totalClasses,
    attendedClasses,
    targetPercentage,
  };
}
