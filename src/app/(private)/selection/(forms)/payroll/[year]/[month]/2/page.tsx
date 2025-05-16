'use client'
// this page is for the first half of the month
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/Loading";
import TableTitle from "@/app/(private)/features/handleForms/components/TableTitle";
import {  months } from "@/app/(private)/utils/dateUtils";
import { getRequest } from "@/app/(private)/features/handleForms/utils/actions/crudOps";
import { Payroll } from "@/app/(private)/types/formTypes";
import PayrollTable from "@/app/(private)/features/handleForms/components/payrollTable/PayrollTable";
import { getDaysInMonth } from "@/app/(private)/utils/dateUtils";
import usePayrollFormCrud from "@/app/(private)/features/handleForms/hooks/usePayrollFormCrud";
import CurEmployeeRows from "@/app/(private)/features/handleForms/components/payrollTable/CurEmployeeRows";


export default function PayrollDocumentPagePeriod2() {
    const { year, month } = useParams();
    // Set end date to be the 15th of the month
    const lastDayOfMonth = getDaysInMonth(parseInt(month as string) - 1, parseInt(year as string));
    const startDate = `${year}-${(month as string).padStart(2, '0')}-15`;
    const endDate = `${year}-${(month as string).padStart(2, '0')}-${lastDayOfMonth}`;
    // fetch logic 
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [payrollData, setPayrollData] = useState<Payroll[]>([]);
    useEffect(() => {
        const fetchExpenses = async () => {
            const dataType = { id: -1, end_date: '', employee_name: '', wage_type: 'salary', wage_rate: -1, hours: 0,   minutes: 0, total_pay: 0 } as Payroll;
            const readRes = await getRequest({ tableName: 'payroll', dataType: dataType, startDate, endDate });
            if (typeof readRes !== 'string' && !readRes.data) {
                setFetchError(readRes.error);
                return;
            } else if (typeof readRes !== 'string' && readRes.data) {
                setPayrollData(readRes.data as Payroll[]);
            }
            setFetchLoading(false);
        }
        fetchExpenses();
        
    }, [startDate, endDate]);

     // create mode state 
     const [newPayrolls, setNewPayrolls] = useState<Payroll[]>([{ // omit id field
        id: 1,
        end_date: endDate, // YYYY-MM-DD
        employee_name: '',
        wage_type: 'hourly', // default wage type
        wage_rate: 0,
        hours: 0,
        minutes: 0,
        total_pay: 0
    }]);

    const newPayrollInputChange = (id: number, field: keyof Payroll, value: string | number) => {
        // value is validated & formatted by the PayrollForm component
        setNewPayrolls(prev => {
            // Create a new array by mapping through the previous array
            return prev.map(payroll => {
                // Only update the payroll entry with the matching id
                if (payroll.id === id) {
                    return { ...payroll, [field]: value };
                }
                // Return unchanged for other entries
                return payroll;
            });
        });
        return value;
    };

    // delete mode state 
    const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);

    // Add delete row selection handler
    const handleDeleteRowSelect = (id: number) => {
        setRowsToDelete(prev => 
            prev.includes(id) 
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    // Toggle delete mode
    const handleToggleDeleteMode = () => {
        setDeleteMode(prev => !prev);
        if (deleteMode) {
            setRowsToDelete([]);
        }
    };
    // edit mode state
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedRows, setEditedRows] = useState<Payroll[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<number, Set<number>>>({});
    const clearEdits = Object.keys(validationErrors).length > 0;

    // Toggle edit mode
    const handleToggleEditMode = () => {
        setEditMode(prev => !prev);
        if (editMode) {
            // Reset edit state when exiting edit mode
            setEditedRows([]);
            setValidationErrors({});
        }
    };

    // Handle row edit
    const handleRowEdit = (id: number, field: keyof Payroll, value: string | number, colIndex?: number) => {
        // Update edited rows
        const existingRowIndex = editedRows.findIndex(row => row.id === id);
        
        if (existingRowIndex !== -1) {
            // Update existing edited row
            setEditedRows(prev => {
                const newRows = [...prev];
                newRows[existingRowIndex] = {
                    ...newRows[existingRowIndex],
                    [field]: value
                };
                return newRows;
            });
        } else {
            // Add new edited row
            const originalRow = payrollData.find(row => row.id === id);
            if (originalRow) {
                setEditedRows(prev => [
                    ...prev,
                    { ...originalRow, [field]: value }
                ]);
            }
        }

        // Update validation errors if colIndex is provided
        if (colIndex !== undefined) {
            setValidationErrors(prev => {
                // Create a new errors object
                const newErrors = { ...prev };
                
                // If no errors for this row yet, create a new Set
                if (!newErrors[id]) {
                    newErrors[id] = new Set<number>();
                }
                
                return newErrors;
            });
        }
    };

    // hooks
    const { handleSubmitCreate, handleSubmitDelete, handleSubmitEdit, cudLoading, cudError } = usePayrollFormCrud({ 
        setPayrollData, 
        setNewPayrolls, 
        setRowsToDelete, 
        setDeleteMode,
        setEditMode,
        setEditedRows,
        setValidationErrors,
        endDate, 
        tableName: 'payroll' 
    });


    // Create delete config object
    const deleteConfig = {
        mode: deleteMode,
        rows: rowsToDelete,
        onRowSelect: handleDeleteRowSelect
    };

    // Create edit config object
    const editConfig = {
        mode: editMode,
        editedRows: editedRows,
        validationErrors: validationErrors,
        onRowEdit: handleRowEdit
    };

    // Handle delete submission
    const handleDelete = () => {
        if (deleteMode && rowsToDelete.length > 0) {
            handleSubmitDelete(rowsToDelete);
        } else {
            handleToggleDeleteMode();
        }
    };

    // Handle edit submission
    const handleSaveEdits = () => {
        if (editMode && editedRows.length > 0 && Object.keys(validationErrors).length === 0) {
            handleSubmitEdit(editedRows, validationErrors);
        } else {
            handleToggleEditMode();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {fetchLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-1">
                    {/* Title */}
                    <div className="w-full text-center w-full flex flex-col items-center">
                        <TableTitle 
                            title={`Period Ending ${months[parseInt(month as string) - 1]} ${lastDayOfMonth}`} 
                            month={month as string} 
                            year={year as string} 
                            type="payroll" 
                        />
                        <div className="flex flex-col items-center justify-center">
                            <p className="font-semibold text-[#585858]">  </p>
                            {/* <CudError cudError={cudError} /> */}
                        </div>
                    </div>
                    <div>
                        {fetchError && <div className="text-red-500">{fetchError}</div>}
                    </div>

                     {/* Table Component */}
                     {payrollData.length === 0 ? (
                        <div className="w-full mb-8">
                            <CurEmployeeRows
                                newPayrolls={newPayrolls}
                                setNewPayrolls={setNewPayrolls}
                                endDate={endDate}
                                onSubmitCreate={(e) => handleSubmitCreate(e, newPayrolls)}
                                cudLoading={cudLoading}
                            />
                        </div>
                    ) : (
                        <div className="w-full">
                            <PayrollTable 
                                data={payrollData} 
                                onSave={() => {}} 
                                onEdit={() => {}} 
                                onCreate={newPayrollInputChange} 
                                onSubmitCreate={(e) => handleSubmitCreate(e, newPayrolls)}
                                cudLoading={cudLoading}
                                cudError={cudError}
                                deleteConfig={deleteConfig}
                                handleDelete={handleDelete}
                                deleteMode={deleteMode}
                                editConfig={editConfig}
                                editMode={editMode}
                                clearEdits={clearEdits}
                                handleSaveEdits={handleSaveEdits}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}