import { StoreResponse } from "@/app/(private)/features/userSettings/types/storeTypes";
import { storeService } from "@/app/(private)/features/userSettings/utils/storeUtils";

export interface StoreSlice {
    storeState: StoreResponse;
    isLoadingStore: boolean;
    // fetch store data 
    fetchStore: () => Promise<void>;
}

export const createStoreSlice = (
    set: (partial: Partial<StoreSlice>) => void,
    // get: () => StoreSlice
): StoreSlice => ({
    // initial state
    storeState: { stores: null, error: null },
    isLoadingStore: false,

    fetchStore: async () => {
        try {
            set({ isLoadingStore: true });
            const storeData = await storeService.fetchStores();
            set({ storeState: storeData, isLoadingStore: false });
        } catch (err) {
            const errorMessage = err instanceof Error
            ? err.message
            : "Error fetching store data.";
            set({
                isLoadingStore: false,
                storeState: { stores: null, error: errorMessage },
            });
        }
    }
})