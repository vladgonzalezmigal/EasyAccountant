import supabase from "@/utils/supabase/supaBaseClientConfig";
import { handleApiResponse } from "./settingsAPIUtils";
import { Vendor, VendorResponse } from "../types/vendorTypes";

const TABLE_NAME = 'vendors';

export class vendorService {
    /**
     * Fetches all vendors from the database for the current user
     * 
     * @returns {Promise<VendorResponse>} A promise that resolves to an object containing
     * either the fetched vendors data or an error message
     */
    static async fetchVendors(): Promise<VendorResponse> {
        // Query the 'stores' table for id and name columns
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .select('id, vendor_name, active'); // select auth_id 

        return handleApiResponse<Vendor[], VendorResponse>(apiData, error, 'vendors');
    }

    // update vendor data
    static async updateVendors(vendor: Vendor): Promise<VendorResponse> {
        const { data: apiData, error } = await supabase
        .from(TABLE_NAME)
        .update(vendor) // replace with upsert 
        .eq('id', vendor.id);

        return handleApiResponse<Vendor[], VendorResponse>(apiData, error, 'vendors');
    }
}