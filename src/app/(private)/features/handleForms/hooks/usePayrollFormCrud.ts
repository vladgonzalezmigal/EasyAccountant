import { useState } from 'react';
import { postRequest } from '../utils/actions/crudOps';
import { Payroll } from "@/app/(private)/types/formTypes";


// export type 
type PayrollCrudHandlers = {
    handleSubmitCreate: (e: React.FormEvent<HTMLFormElement>, newPayrolls: Payroll[]) => Promise<void>;
    handleSubmitDelete: (rowsToDelete: number[]) => Promise<void>;
    // handleSubmitEdit: (editedRows: Expense[], validationErrors: Record<number, Set<number>>) => Promise<void>;
    cudLoading: boolean;
    cudError: string | null;
};

type UsePayrollFormCrudProps = {
    setPayrollData: React.Dispatch<React.SetStateAction<Payroll[]>>;
    setNewPayrolls: React.Dispatch<React.SetStateAction<Payroll[]>>;
    // setEditedRows: React.Dispatch<React.SetStateAction<Expense[]>>;
    // setValidationErrors: React.Dispatch<React.SetStateAction<Record<number, Set<number>>>>;
    setRowsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
    // setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
    endDate: string,
    tableName: string;
};

export function usePayrollFormCrud({
    setPayrollData,
    setNewPayrolls,
    setRowsToDelete,
    setDeleteMode,
    endDate,
    tableName = 'payroll'
}: UsePayrollFormCrudProps): PayrollCrudHandlers {
    const [cudLoading, setCudLoading] = useState(false);
    const [cudError, setCudError] = useState<string | null>(null);

    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>, newPayrolls: Payroll[]) => {
        e.preventDefault();

        setCudLoading(true);

        const createRes = await postRequest('create', {
            tableName,
            createData: newPayrolls,
        });

        if (createRes.error) {
            setCudError(createRes.error);
            setCudLoading(false);
            return;
        }

        setCudError(null);

        if (createRes.data) { // success 
            const newPayrollData = createRes.data as Payroll[];
            setPayrollData((prevPayrolls) => 
                [...(prevPayrolls || []), ...newPayrollData].sort(
                    (a, b) => a.employee_name.localeCompare(b.employee_name)
                )
            );
             // reset create state 
            setNewPayrolls([{ // omit id field
                id: 1,
                end_date: endDate, // reset to page's enddate
                employee_name: '',
                wage_type: 'hourly', // default wage type
                wage_rate: 0,
                hours: 0,
                minutes: 0,
                total_pay: 0
            }]);
        }
        setCudLoading(false);
    };

    const handleSubmitDelete = async (rowsToDelete: number[]) => {

        setCudLoading(true);
    
        const deleteRes = await postRequest('delete', { tableName, rowsToDelete }, { tableName, rowsToDelete });
    
        if (deleteRes.error) {
          setCudError(deleteRes.error);
          setCudLoading(false);
          return;
        }
    
        setCudError(null);
    
        if (typeof deleteRes !== 'string' && deleteRes.data) {
          const payrollData = deleteRes.data as Payroll[];
          const deletedIds: number[] = payrollData.map((payroll: Payroll) => payroll.id);
          if (tableName === 'payroll' && setPayrollData) {
            setPayrollData((prevPayrolls) =>
                prevPayrolls.filter(payroll => !deletedIds.includes(payroll.id))
            );
          }
          setRowsToDelete([]);
          setDeleteMode(false);
        }
        setCudLoading(false);
      };

    return {
        handleSubmitCreate,
        handleSubmitDelete,
        // handleSubmitEdit,
        cudLoading,
        cudError,
      };
}

export default usePayrollFormCrud