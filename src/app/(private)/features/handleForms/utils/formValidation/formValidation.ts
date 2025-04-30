import { getDaysInMonth } from '@/app/(private)/utils/dateUtils';
import { FormData } from '@/app/(private)/types/formTypes';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    value: string;
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
    
    // Handle non-numeric input and leading zeros
    if (!/^\d*$/.test(value) || value === '0') {
        const returnVal = value === '0' ? '' : value.replace(/\D/g, '');
        return {
            isValid: false,
            value: returnVal,
            error: 'Only numeric input with no leading zeros is allowed'
        }
    }

    // Get max days for the given month and year
    const maxDay = getDaysInMonth(month - 1, year);
    
    // Check if date is within valid range
    const dateInRange = 1 <= Number(value) && Number(value) <= maxDay;
    
    if (!dateInRange) {
        return {
            isValid: false,
            value: value,
            error: `Day must be between 1-${maxDay}`
        };
    }

    return {
        isValid: true,
        value: value
    };
};

export const validateAmountInput = (value: string): ValidationResult => {
    // Check for empty string
    if (!value || value.trim() === '') {
        return {
            isValid: false,
            value: value,
            error: "Amount cannot be empty"
        };
    }

    if (value === '00') {
        return {
            isValid: false,
            value: '0',
            error: "Amount cannot be 00"
        };
    }

    // Handle non-numeric input 
    if (!/^\d*\.?\d*$/.test(value)) {
        if ((value.match(/\./g) || []).length > 1) {  // edge case: if there are more than one decimal point
            return {
                isValid: true,
                value: value.replace(/[^\d]/g, '')
            };
        }
        // Remove any non-numeric characters (including the decimal point)
        return {
            isValid: false,
            value: value.replace(/[^\d]/g, ''),
            error: "Only numeric input is allowed"
        };
    }

    const hasDecimal = value.includes('.');
    if (hasDecimal) {
        const parts = value.split('.');
        if (parts.length > 1 && parts[1].length !== 2) {
            return {
                isValid: false,
                value: value,
                error: "Need exactly 2 digits after decimal point"
            };
        }
    }

    return {
        isValid: true,
        value: value
    };
}; 
export const DEFAULT_COMPANY = 'Company';

export const validateCompanyInput = (value: string): ValidationResult => {
    if (value === "" || value === DEFAULT_COMPANY) {
        return {
            isValid: false,
            value: DEFAULT_COMPANY,
            error: "Please select a company"
        };
    }

    return {
        isValid: true,
        value: value
    };
};