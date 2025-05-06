import { vendorService } from '@/app/(private)/features/userSettings/utils/vendorUtils';
import { VendorResponse } from './../app/(private)/features/userSettings/types/vendorTypes';

export interface VendorSlice {
    vendorState: VendorResponse;
    isLoadingVendors: boolean;
    // fetch vendor data 
    fetchVendorData: () => Promise<void>;
}

export const createVendorSlice = (
    set: (partial: Partial<VendorSlice>) => void,
    // get: () => VendorSlice
): VendorSlice => ({
    // initial state
    vendorState: { vendors: null, error: null },
    isLoadingVendors: false,

    fetchVendorData: async () => {
        try {
            set({ isLoadingVendors: true });
            const vendorData = await vendorService.fetchVendors();
            set({ vendorState: vendorData, isLoadingVendors: false });
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error fetching vendor data.";
            set({
                isLoadingVendors: false,
                vendorState: { vendors: null, error: errorMessage },
            });
        }
    }
})