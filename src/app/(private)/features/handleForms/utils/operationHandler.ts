import supabase from "@/config/supaBaseConfig";
import { CrudOperation, CrudResponseData, PerformCreateParams } from "../types/operationTypes";
import { FormData } from "@/app/(private)/types/formTypes";
import { PerformDeleteParams } from "../types/operationTypes";
import { PostgrestError } from '@supabase/supabase-js';

// Basic handler class that can be extended for various operations
export abstract class PerformOperationHandler {
    protected errorState: string | null = null;

    constructor(
        protected operation: CrudOperation,
        protected params: (PerformDeleteParams | PerformCreateParams) // Params containing tableName and other operation-specific data
    ) {
        if (!this.params.tableName) { 
            this.errorState = "Table name is required";
        }
    }

    // Abstract method to be implemented by subclasses
    abstract perform(): Promise<CrudResponseData>;

    // Execute method that calls the perform method for specific operation
    async execute(): Promise<CrudResponseData> {
        if (this.errorState) {
            // If an error is already set in the constructor, return immediately
            return { data: null, error: this.errorState};
        }

        return await this.perform(); // Delegate the async operation to the specific handler
    }
}

// Helper functions
const omitId = (obj: FormData, arr: string[] = ['id']) =>
    Object.fromEntries(Object.entries(obj).filter(([k]) => !arr.includes(k)));

const handleApiResponse = (apiData: FormData[] | null, apiError: PostgrestError | null): CrudResponseData => {
    if (apiError) {
        return {
            data: null,
            error: apiError.message || "Unknown error"
        };
    }
    return {
        data: apiData as FormData[],
        error: null
    };
};

// Create operation handler

export class PerformCreateOperationHandler extends PerformOperationHandler {
    constructor(params: PerformCreateParams) {
        super('create', params);
    }

    // Perform async operation for create
    async perform(): Promise<CrudResponseData> {
        const createParams = this.params as PerformCreateParams;
        const queryColumns: string = Object.keys(createParams.createData).join(',');
        try {
            const { data: apiData, error: apiError } = await supabase 
                .from(createParams.tableName)
                .insert({
                    ...omitId(createParams.createData),
                    user_id: createParams.user_id
                })
                .select(queryColumns);

            return handleApiResponse(apiData as unknown as FormData[], apiError);
        } catch (err) {
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}

// Delete operation handler
export class PerformDeleteOperationHandler extends PerformOperationHandler {
    constructor(params: PerformDeleteParams) {
        super('delete', params as PerformDeleteParams);
    }

    // Perform async operation for delete
    async perform(): Promise<CrudResponseData> {
        const deleteParams = this.params as PerformDeleteParams;
        try {
            const { data: apiData, error: apiError } = await supabase
                .from(deleteParams.tableName)
                .delete()
                .in('id', deleteParams.rowsToDelete)
                .select('id');

            return handleApiResponse(apiData as FormData[], apiError);
        } catch (err) {
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}