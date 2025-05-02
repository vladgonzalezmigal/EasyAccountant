
import supabase from "@/utils/supabase/supaBaseConfig";
import { Store, StoreResponse } from "../types/storeTypes";
import { PostgrestError } from "@supabase/supabase-js";

const handleApiResponse = (apiData: Store[] | null, apiError: PostgrestError | null): StoreResponse => {
    if (apiError) {
        return {
            stores: null,
            error: apiError.message || "Unknown error"
        };
    } else {
        return {
            stores: apiData as Store[],
            error: null
        };
    }
};

export class storeService {
    /**
     * Fetches all stores from the database for the current user
     * 
     * @returns {Promise<StoreResponse>} A promise that resolves to an object containing
     * either the fetched stores data or an error message
     */
    static async fetchStores(): Promise<StoreResponse> {
        // Query the 'stores' table for id and name columns
        const { data: apiData, error } = await supabase
        .from('stores')
        .select('id, store_name'); // select auth_id 

        return handleApiResponse(apiData, error);
    }

    // update store data
    static async updateStore(store: Store): Promise<StoreResponse> {
        const { data: apiData, error } = await supabase
        .from('stores')
        .update(store) // replace with upsert 
        .eq('id', store.id);

        return handleApiResponse(apiData, error);
    }
}