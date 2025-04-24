export const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

/**
 * Validates and formats year input
 * @param value The input year value
 * @param currentValue The current year value to fallback to if invalid
 * @returns The validated and formatted year value
 */

export const validateYearInput = (value: string, currentValue: string): string => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return currentValue;
    
    // Prevent leading zeros
    if (value.length === 1 && value.startsWith('0')) return currentValue;
    
    return value;
};

/**
 * Returns the first day of the given month and the first day of the next month.
 * Useful for filtering by a full calendar month.
 *
 * @param yearStr - A 4-digit year string, e.g. "2025"
 * @param monthStr - A 1- or 2-digit month string (1 = January, 12 = December)
 * @returns An object containing `start` and `end` in "YYYY-MM-DD" format
 */
export function getMonthDateRange(yearStr: string, monthStr: string): { startDate: string; endDate: string } {
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-based month

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    throw new Error('Invalid year or month input');
  }

  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;

  return { startDate, endDate};
}

/**
 * Formats date components into "YYYY-MM-DD" format
 * @param day - The day of the month (1-31)
 * @param month - The month (1-12)
 * @param year - The 4-digit year
 * @returns A formatted date string in "YYYY-MM-DD" format
 */
export function formatDate(day: string, month: string, year: string): string {
  const formattedDay = day.padStart(2, '0');
  const formattedMonth = month.padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
}
