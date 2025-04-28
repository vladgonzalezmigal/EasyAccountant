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
    dataType?: FormData;
}

// Create-specific parameters
export interface PerformCreateParams extends OperationPerformParams {
    createData: FormData; // Data to create
    user_id: string;
}

// Read-specific parameters
export interface PerformReadParams extends OperationPerformParams {
    startDate: string;
    endDate: string;
}

// Delete-specific parameters
export interface PerformDeleteParams extends OperationPerformParams {
    rowsToDelete: number[];  // IDs of rows to delete
}

export type PerformCrudParams = PerformCreateParams | PerformReadParams | PerformDeleteParams;

