export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: number;
}

export function calculateAge(birthDate: Date, targetDate: Date): AgeResult | null {
  if (birthDate > targetDate) return null;

  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor(
    (targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Days until next birthday
  const nextBirthdayYear =
    new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()) > targetDate
      ? targetDate.getFullYear()
      : targetDate.getFullYear() + 1;
  const nextBirthdayDate = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());
  const nextBirthday = Math.ceil(
    (nextBirthdayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    nextBirthday,
  };
}
