// utils/operationHandler.ts
import { SessionState } from "@/types/authTypes";
import { Session } from "@supabase/supabase-js";
import { CrudOperation, DeleteValidationParams, OperationValidationParams, UpdateValidationParams,} from "@/app/(private)/features/handleForms/types/operationTypes";

export abstract class CanPerformOperationHandler {
    constructor(
        protected session: SessionState,
        protected operation: CrudOperation,
        protected params?: OperationValidationParams
    ) {}

    // Shared session validation logic
    protected validateSession(): string | Session {
        if (!this.session || typeof this.session === 'string') {
            return "No session found";
        }
        return this.session;
    }

    // Abstract method to be implemented by each operation type
    abstract validate(callerSession: Session): string | Session;

    // Execute the operation after validation
    execute(): string | Session {
        const sessionError = this.validateSession();
        if (typeof sessionError === 'string') {
            return sessionError;
        } 
        return this.validate(sessionError); // Each subclass can add its specific validation here
        
    }
}

// Create operation validation handler 
export class CanCreateOperationHandler extends CanPerformOperationHandler {
    constructor(session: SessionState) {
        super(session, 'create'); // Pass session and operation type to the base class
    }

    validate(callerSession: Session): Session {
        return callerSession;
    }
}

// Update operation validation handler 
export class CanUpdateOperationHandler extends CanPerformOperationHandler {
    constructor(session: SessionState, params: UpdateValidationParams) {
        super(session, 'update', params); // Pass session and operation type to the base class
    }

    validate(callerSession: Session): Session | string {
        const updateParams = this.params as UpdateValidationParams;
        if (Object.keys(updateParams.validationErrors).length > 0) {
            return "Fix the errors in the form";
        } else if (updateParams.editedRows.length === 0) {
            return "No rows selected for update";
        }
        return callerSession;
    }
}

// Delete operation validation handler 
export class CanDeleteOperationHandler extends CanPerformOperationHandler {
    constructor(session: SessionState, params: DeleteValidationParams) {
        super(session, 'delete', params); // Pass session and operation type to the base class
    }

    // Specific validation for delete operation
    validate(callerSession: Session): string | Session {
        const deleteParams = this.params as DeleteValidationParams;
        if (!deleteParams?.rowsToDelete || deleteParams.rowsToDelete.length === 0) {
            return "No rows selected for deletion";
        } 
        return callerSession;
    }
}