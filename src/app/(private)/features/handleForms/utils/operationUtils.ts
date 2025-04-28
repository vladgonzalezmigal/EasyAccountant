// utils/canPerformOperation.ts
import { SessionState } from "@/types/authTypes";
import { CrudOperation, DeleteValidationParams, OperationValidationParams,
     PerformCreateParams,
     PerformDeleteParams, PerformReadParams } from "@/app/(private)/features/handleForms/types/operationTypes";
import {  CanDeleteOperationHandler, CanCreateOperationHandler } from "./validationHandler";
import { PerformCreateOperationHandler, PerformDeleteOperationHandler, PerformReadOperationHandler } from "./operationHandler";
import { Session } from "@supabase/supabase-js";
import { CrudResponseData, PerformCrudParams } from "../types/operationTypes";

/**
 * Validates if the current session can perform the requested operation
 * @param session - The current user session state
 * @param operation - The CRUD operation to perform (create, read, update, delete)
 * @param params - Optional validation parameters specific to the operation
 * @returns A Session object if operation is allowed, or an error message string
 */
export function canPerformOperation(
    session: SessionState,
    operation: CrudOperation,
    params?: OperationValidationParams
): string | Session {
    let handler: { execute: () => string | Session } | undefined;

    switch (operation) {
        case 'delete':
            handler = new CanDeleteOperationHandler(session, params as DeleteValidationParams);
            break;
        case 'create':
            handler = new CanCreateOperationHandler(session);
            break;
        case 'read':
            // TODO: Implement ReadOperationHandler
            // handler = new ReadOperationHandler(session, params as ReadParams);
            break;
        case 'update':
            // TODO: Implement UpdateOperationHandler
            // handler = new UpdateOperationHandler(session, params as UpdateParams);
            break;
        default:
            return "Invalid operation";
    }

    return !handler 
        ? "Invalid operation handler" 
        : handler.execute(); // Delegate to the handler's execute method
}

/**
 * Performs the requested operation on the database
 * @param operation - The CRUD operation to perform (create, read, update, delete)
 * @param params - Optional parameters specific to the operation
 * @returns A Session object if operation is successful, or an error message string
 */

export function performCrudOperation(
    operation: CrudOperation,
    params: PerformCrudParams
): Promise<CrudResponseData> | string {
    let handler: { execute: () => Promise<CrudResponseData> } | undefined;

    switch (operation) {
        case 'delete':
            handler = new PerformDeleteOperationHandler(params as PerformDeleteParams);
            break;
        case 'create':
            handler = new PerformCreateOperationHandler(params as PerformCreateParams);
            break;
        case 'read':
            handler = new PerformReadOperationHandler(params as PerformReadParams);
            break;
        default:
            return "Invalid operation";
    }

    return !handler 
        ? "Invalid operation handler" 
        : handler.execute(); // Delegate to the handler's execute method
}
