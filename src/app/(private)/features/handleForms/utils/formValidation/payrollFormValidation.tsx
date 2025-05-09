import { ValidationResult } from './formValidation';

export const checkExistingEmployeeName = (value: string, existingNames: string[]): ValidationResult => {
    const trimmedValue = value.trim().toUpperCase();
    
    if (existingNames.includes(trimmedValue)) {
        return {
            isValid: false,
            value: value, // Return original value
            error: 'Employee name already exists'
        };
    }
    
    return {
        isValid: true,
        value: trimmedValue
    };
};

export const validateEmployeeName = (value: string): ValidationResult => {
    const trimmedValue = value.trim();
    
    return {
        isValid: true,
        value: trimmedValue
    };
};

export const validateMinutes = (value: string): ValidationResult => {
    const numValue = parseInt(value);
    
    if (numValue < 0 || numValue > 59) {
        return {
            isValid: false,
            value: value,
            error: 'Minutes must be between 0 and 59'
        };
    }
    
    return {
        isValid: true,
        value: value
    };
};
