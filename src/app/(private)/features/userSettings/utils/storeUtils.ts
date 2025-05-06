
import supabase from "@/utils/supabase/supaBaseClientConfig";
import { Store, StoreResponse } from "../types/storeTypes";
import { handleApiResponse } from "./settingsAPIUtils";

const TABLE_NAME = 'stores';

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
        .from(TABLE_NAME)
        .select('id, store_name'); // select auth_id 

        return handleApiResponse<Store[], StoreResponse>(apiData, error, 'stores');
    }

    // update store data
    static async updateStore(store: Store): Promise<StoreResponse> {
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .update(store) // replace with upsert 
        .eq('id', store.id);

        return handleApiResponse<Store[], StoreResponse>(apiData, error, 'stores');
    }
}