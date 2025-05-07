import { Store, StoreResponse } from "../types/storeTypes";
import { Vendor, VendorResponse } from "../types/vendorTypes";
import { Email, EmailResponse } from "../types/emailTypes";

import { PostgrestError } from "@supabase/supabase-js";

export function handleApiResponse<T extends Store[] | Vendor[] | Email[], R extends StoreResponse | VendorResponse | EmailResponse>(
  apiData: T | null,
  apiError: PostgrestError | null,
  dataType: 'stores' | 'vendors' | 'emails'
): R {
  if (apiError) {
    if (dataType === 'stores') {
      return { stores: null, error: apiError.message || "Unknown error" } as R;
    } else if (dataType === 'emails') {
      return { emails: null, error: apiError.message || "Unknown error" } as R;
    }
    return { vendors: null, error: apiError.message || "Unknown error" } as R;
  } else {
    if (dataType === 'stores') {
      return { stores: apiData as Store[], error: null } as R;
    } else if (dataType === 'emails') {
      return { emails: apiData as Email[], error: null } as R;
    }
    return { vendors: apiData as Vendor[], error: null } as R;
  }
}
