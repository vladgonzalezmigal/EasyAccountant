import { FormData } from "@/app/(private)/types/formTypes";

export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

export interface CrudResponseData {
    data: FormData[] | null;
    error: string | null;
}


export interface DeleteValidationParams {
    rowsToDelete: number[]; // ids of rows to delete
}

export type OperationValidationParams = DeleteValidationParams;

// params for performing opertion
export interface OperationPerformParams {   
    tableName: string; // All operations must have this field
}

// Create-specific parameters
export interface PerformCreateParams extends OperationPerformParams {
    createData: FormData; // Data to create
    user_id: string;
}

// Delete-specific parameters
export interface PerformDeleteParams extends OperationPerformParams {
    rowsToDelete: number[];  // IDs of rows to delete
}

