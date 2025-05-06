import { Vendor } from '@/app/(private)/features/userSettings/types/vendorTypes';

interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export const vendorFormValidation = {
    isVendorNameEmpty: (vendor: Vendor | undefined): ValidationResult => {
        if (!vendor?.vendor_name || vendor.vendor_name.trim() === '') {
            return {
                isValid: false,
                message: 'Vendor name cannot be empty'
            };
        }
        return { isValid: true };
    },
    
    isVendorNameDuplicate: (vendor: Vendor | undefined, existingVendors: string[], originalVendorName: string): ValidationResult => {
        if (!vendor?.vendor_name) {
            return { isValid: true };
        }
        
        const normalizedVendorName = vendor.vendor_name.trim().toUpperCase();
        if (existingVendors.includes(normalizedVendorName) && normalizedVendorName !== originalVendorName) {
            return {
                isValid: false,
                message: 'Vendor name already exists'
            };
        }
        return { isValid: true };
    },

    validateVendorForm: (vendor: Vendor | undefined, existingVendors: string[], originalVendorName: string): ValidationResult => {
        const nameValidation = vendorFormValidation.isVendorNameEmpty(vendor);
        if (!nameValidation.isValid) {
            return nameValidation;
        }
        
        const duplicateValidation = vendorFormValidation.isVendorNameDuplicate(vendor, existingVendors, originalVendorName);
        if (!duplicateValidation.isValid) {
            return duplicateValidation;
        }

        return { isValid: true };
    }
}; 