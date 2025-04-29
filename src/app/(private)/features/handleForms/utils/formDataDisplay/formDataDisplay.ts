/**
 * Utility functions for formatting and displaying form data
 */

/**
 * Formats display values for rendering in the form data rows
 * @param value - The value to format, can be a string or number
 * @returns A formatted string representation of the value
 * - For numbers: returns a dollar-formatted string with 2 decimal places
 * - For strings: returns the string value or empty string if null/undefined
 */
export const formatDisplayValue = (value: string | number): string => {
    if (typeof value === 'number') {
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value?.toString() || '';
};
