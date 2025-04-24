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