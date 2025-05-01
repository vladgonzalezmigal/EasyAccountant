import supabase from "@/config/supaBaseConfig";
import { CrudOperation, CrudResponseData, PerformCreateParams, PerformCrudParams, PerformReadParams, PerformUpdateParams } from "../types/operationTypes";
import { FormData, Sales } from "@/app/(private)/types/formTypes";
import { PerformDeleteParams } from "../types/operationTypes";
import { PostgrestError } from '@supabase/supabase-js';

// Basic handler class that can be extended for various operations
export abstract class PerformOperationHandler {
    protected errorState: string | null = null;

    constructor(
        protected operation: CrudOperation,
        protected params: PerformCrudParams // Params containing tableName and other operation-specific data
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

const getQueryColumns = (dataType: FormData): string => {
    return Object.keys(dataType).join(',');
}

const handleApiResponse = (apiData: FormData[] | null, apiError: PostgrestError | null): CrudResponseData => {
    if (apiError) {
        return {
            data: null,
            error: apiError.message || "Unknown error"
        };
    } else {
        return {
            data: apiData as FormData[],
            error: null
        };
    }
    
};

// Create operation handler

export class PerformCreateOperationHandler extends PerformOperationHandler {
    constructor(params: PerformCreateParams) {
        super('create', params);
    }

    // Perform async operation for create
    async perform(): Promise<CrudResponseData> {
        const createParams = this.params as PerformCreateParams;
        try {
            const { data: apiData, error: apiError } = await supabase 
                .from(createParams.tableName)
                .insert({
                    ...omitId(createParams.createData),
                    user_id: createParams.user_id
                })
                .select(getQueryColumns(createParams.createData));

            return handleApiResponse(apiData as unknown as FormData[], apiError);
        } catch (err) { // network error or other error
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}

// Read operation handler

function buildReadQuery(table: string, params: PerformReadParams) {

    if (!params.dataType) {
        return { data: null, error: "Data type is required " };
    }
    const baseQuery = supabase.from(params.tableName).select(getQueryColumns(params.dataType));

    switch (table) {
        case 'sales':
            const dataType = params.dataType as Sales;
            return baseQuery // todo filter by store_id
                .eq('store_id', dataType.store_id)
                .gte('date', params.startDate)
                .lt('date', params.endDate)
                .order('date', { ascending: false });
        case 'expenses':
            return baseQuery
                .gte('date', params.startDate)
                .lt('date', params.endDate)
                .order('date', { ascending: false }); // newest first 
        default:
            return baseQuery;
    }
}

export class PerformReadOperationHandler extends PerformOperationHandler {
    constructor(params: PerformReadParams) {
        super('read', params);
    }

    // Perform async operation for read
    async perform(): Promise<CrudResponseData> {
        const readParams = this.params as PerformReadParams;
        if (!readParams.dataType) {
            this.errorState = "Data type is required";
            return { data: null, error: this.errorState };
        }
        
        const readQuery = buildReadQuery(readParams.tableName, readParams);
        
        if ('error' in readQuery) {
            return { data: null, error: readQuery.error };
        }

        try {
            const { data: apiData, error: apiError } = await readQuery; 
            return handleApiResponse(apiData as unknown as FormData[], apiError);
        } catch (err) {
            return {
                data: null,
                error: err instanceof Error ? err.message : "Unexpected error occurred"
            };
        }
    }
}

// Update operation handler
export class PerformUpdateOperationHandler extends PerformOperationHandler {
    constructor(params: PerformUpdateParams) {
        super('update', params as PerformUpdateParams);
    }

    // Perform async operation for update
    async perform(): Promise<CrudResponseData> {
        const updateParams = this.params as PerformUpdateParams;
        const updatedRowsWithUserId = updateParams.editedRows.map(row => ({
            ...row,
            user_id: updateParams.user_id
          }));
        console.log("editedRows post upsert", updatedRowsWithUserId);
        try {
            const { data: apiData, error: apiError } = await supabase
                .from(updateParams.tableName)
                .upsert(updatedRowsWithUserId)
                .select(getQueryColumns(updateParams.editedRows[0]))

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

// 