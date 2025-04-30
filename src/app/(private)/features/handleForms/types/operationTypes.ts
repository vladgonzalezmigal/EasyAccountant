import { FormData } from "@/app/(private)/types/formTypes";

export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

export interface CrudResponseData {
    data: FormData[] | null;
    error: string | null;
}

export interface UpdateValidationParams {
    editedRows: FormData[]; // rows that have been edited
    validationErrors: Record<number, Set<number>>; // validation errors by row ID and column index
}

export interface DeleteValidationParams {
    rowsToDelete: number[]; // ids of rows to delete
}

export type OperationValidationParams = DeleteValidationParams | UpdateValidationParams;

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

// Update-specific parameters
export interface PerformUpdateParams extends OperationPerformParams {
    editedRows: FormData[]; // rows that have been edited
    user_id: string;
}

// Delete-specific parameters
export interface PerformDeleteParams extends OperationPerformParams {
    rowsToDelete: number[];  // IDs of rows to delete
}

export type PerformCrudParams = PerformCreateParams | PerformReadParams | PerformDeleteParams | PerformUpdateParams;

