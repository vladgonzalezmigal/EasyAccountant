import { getDaysInMonth } from '@/app/(private)/utils/dateUtils';
import { FormData } from '@/app/(private)/types/formTypes';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    value?: string;
}

export const PAYMENT_TYPES = ['CASH', 'CARD', "CHECK"].map(type => type.toUpperCase())
export const COMPANIES = ['JETRO', 'SUPREMA'].map(type => type.toUpperCase())

export const fieldConfig: Record<string, { type: 'input' | 'select'; options?: string[] }> = {
    date: { type: 'input' },
    amount: { type: 'input' },
    detail: { type: 'input' },
    company: { type: 'select', options: COMPANIES }, // todo pull from db 
    payment_type: { type: 'select', options: PAYMENT_TYPES },
};

export const isFieldEdited = (
    candidateForm: FormData | undefined,
    displayForm: Record<string, string | number>,
    candidateKey: keyof FormData
): boolean => {
    if (!candidateForm) {
        return false;
    }
    
    return candidateForm[candidateKey] !== displayForm[candidateKey];
};

export const validateDateInput = (
    value: string,
    month: number,
    year: number
): ValidationResult => {
    // Check if input is numeric
    if (!/^\d*$/.test(value)) {
        return {
            isValid: false,
            error: 'Only numeric input is allowed'
        };
    }

    // Get max days for the given month and year
    const maxDay = getDaysInMonth(month - 1, year);
    
    // Check if date is within valid range
    const dateInRange = 1 <= Number(value) && Number(value) <= maxDay;
    
    if (!dateInRange) {
        return {
            isValid: false,
            error: `Day must be between 1-${maxDay}`
        };
    }

    return {
        isValid: true
    };
};

export const validateAmountInput = (value: string): ValidationResult => {
    // Check for empty string
    if (!value || value.trim() === '') {
        return {
            isValid: false,
            error: "Amount cannot be empty"
        };
    }

    // handle leading zeros
    // if (value.startsWith('0')) {
    //     return {
    //         isValid: false,
    //         error: "Amount cannot start with 0"
    //     };
    // }

    // Handle non-numeric input 
    if (!/^\d*\.?\d*$/.test(value)) {
        if ((value.match(/\./g) || []).length > 1) {  // edge case: if there are more than one decimal point
            const returnVal = value.replace(/[^\d]/g, '');
            return {
                isValid: true,
                value: returnVal
            };
        }
        // Remove any non-numeric characters (including the decimal point)
        return {
            isValid: false,
            value: value.replace(/[^\d]/g, '')
        };
    }

    const hasDecimal = value.includes('.');
    if (hasDecimal) {
        const parts = value.split('.');
        if (parts.length > 1 && parts[1].length !== 2) {
            return {
                isValid: false,
                error: "Need exactly 2 decimals"
            };
        }
    }

    return {
        isValid: true,
        value
    };
}; 