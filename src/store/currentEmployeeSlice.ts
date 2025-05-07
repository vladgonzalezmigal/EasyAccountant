import { CurrentEmployee, CurrentEmployeeResponse } from "@/app/(private)/features/userSettings/types/employeeTypes";
import { currentEmployeeService } from "@/app/(private)/features/userSettings/utils/currentEmployeeUtils";

export interface CurrentEmployeeSlice {
    currentEmployeeState: CurrentEmployeeResponse;
    isLoadingCurrentEmployee: boolean;
    isCudLoadingCurrentEmployees: boolean;
    // fetch current employee data 
    fetchCurrentEmployees: () => Promise<void>;
    updateCurrentEmployees: (currentEmployee: CurrentEmployee) => Promise<void>;
}

export const createCurrentEmployeeSlice = (
    set: (partial: Partial<CurrentEmployeeSlice> | ((state: CurrentEmployeeSlice) => Partial<CurrentEmployeeSlice>)) => void,
    // get: () => CurrentEmployeeSlice
): CurrentEmployeeSlice => ({
    // initial state
    currentEmployeeState: { currentEmployees: null, error: null },
    isLoadingCurrentEmployee: false,
    isCudLoadingCurrentEmployees : false,

    fetchCurrentEmployees: async () => {
        try {
            set({ isLoadingCurrentEmployee: true });
            const currentEmployeeData = await currentEmployeeService.fetchCurrentEmployeeData();
            set({ currentEmployeeState: currentEmployeeData, isLoadingCurrentEmployee: false });
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error fetching current employee data.";
            set({
                isLoadingCurrentEmployee: false,
                currentEmployeeState: { currentEmployees: null, error: errorMessage },
            });
        }
    },

    updateCurrentEmployees: async (currentEmployee: CurrentEmployee) => {
        try {   
            set({ isCudLoadingCurrentEmployees: true });
            const currentEmployeeData = await currentEmployeeService.updateCurrentEmployee(currentEmployee)
            
            if (currentEmployeeData.error === null) {
                // Update only the specific current employee in the existing state
                set((state) => {
                    const currentEmployees = state.currentEmployeeState.currentEmployees || [];
                    const updatedCurrentEmployees = currentEmployees.map(e => 
                        e.id === currentEmployee.id ? currentEmployee : e
                    );
                    
                    return {
                        currentEmployeeState: {
                            currentEmployees: updatedCurrentEmployees,
                            error: null
                        },
                        isCudLoadingCurrentEmployees: false
                    };
                });
            } else {
                // If there was an error, just update the error message
                set((state) => ({
                    isCudLoadingCurrentEmployees: false,
                    currentEmployeeState: {
                        currentEmployees: state.currentEmployeeState.currentEmployees,
                        error: currentEmployeeData.error
                    }
                }));
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error updating employee data.";
            
            // Keep existing employees but update the error message
            set((state) => ({
                isCudLoadingCurrentEmployees: false,
                currentEmployeeState: {
                    currentEmployees: state.currentEmployeeState.currentEmployees,
                    error: errorMessage
                }
            }));
        }
    }
})
