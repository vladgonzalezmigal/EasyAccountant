import { validateDateInput, validateAmountInput } from "@/app/(private)/features/handleForms/utils/formValidation/formValidation";

import { Expense, Sales } from '@/app/(private)/types/formTypes';

interface ValidationResult {
    isValid: boolean;
    error?: string;
    value: string;
}

/**
 * Validates expense form inputs based on field type
 * @param key The form field key being validated
 * @param value The value to validate
 * @param month Optional month for date validation
 * @param year Optional year for date validation
 * @returns ValidationResult with validation status and error message if any
 */
export const validateExpenseInput = (
    key: keyof Expense,
    value: string,
    month: number,
    year: number

): ValidationResult => {
    switch (key) {
        case 'date':
            return validateDateInput(value, month, year);
        case 'amount':
            return validateAmountInput(value);
        // Add other expense field validations as needed
        default:
            return { isValid: true, value };
    }
};


/**
 * Validates sales form inputs based on field type
 * @param key The form field key being validated
 * @param value The value to validate
 * @returns ValidationResult with validation status and error message if any
 */
export const validateSalesInput = (
    key: keyof Sales,
    value: string,
): ValidationResult => {
    switch (key) {
        case 'sales':
            return validateAmountInput(value);
        case 'taxes':
            return validateAmountInput(value);
        // Add other sales field validations as needed
        default:
            return { isValid: true, value };
    }
};

