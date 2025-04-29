'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { months } from "@/app/(private)/utils/dateUtils";
import { Expense } from "@/app/(private)/types/formTypes";
import { FormDataRows } from "@/app/(private)/features/handleForms/components/FormDataRows";
import ExpenseForm from "@/app/(private)/features/handleForms/components/addDataRow/ExpenseForm";
import { Loading } from "@/app/components/Loading";
import { getMonthDateRange, formatDate } from "@/app/(private)/utils/dateUtils";
import { canPerformOperation, performCrudOperation } from "@/app/(private)/features/handleForms/utils/operationUtils";
import { Session } from "@supabase/supabase-js";
import { validateExpenseInput } from "@/app/(private)/features/handleForms/utils/formValidation/editRowValidation";

export default function ExpensesPage() {
    const { year, month } = useParams();
    const { session } = UserAuth();
    // End Date is exclusive 
    const { startDate, endDate } = getMonthDateRange(year as string, month as string);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<Expense[] | null>(null);
    const [loading, setLoading] = useState(true);
    // Delete or edit mode
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedRows, setEditedRows] = useState<Expense[]>([]);

    const [validationErrors, setValidationErrors] = useState<Record<number, Set<number>>>({});
    // handle data in the child for reusability 

    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);
    const [cudError, setCudError] = useState<string | null>(null);
    const [cudLoading, setCudLoading] = useState<boolean>(false);


    const [newExpense, setNewExpense] = useState<Expense>({
        id: -1,
        date: '',
        payment_type: 'CHECK',
        detail: '',
        company: '',
        amount: 0
    })

    const newExpenseInputChange = (field: keyof Expense, value: string | number) => {
        setNewExpense((prevData) => ({
            ...prevData,
            [field]: field === 'date' ?
                formatDate(value as string, month as string, year as string) :
                value,
        }));
    };
    const editExpenseRowValidation = (key: keyof Expense, value: string) => {
        return validateExpenseInput(key, value, parseInt(month as string), parseInt(year as string));
    }

    const newRowToEditInputChange = (id: number, key: keyof Expense, value: string | number, colNumber: number) => {
        // need to add form validation 
        const validationResult = editExpenseRowValidation(key as keyof Expense, value as string);

        if (!validationResult.isValid) {
            console.log("validation failed");
            // Add to validation errors map if validation fails
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                // Create a new Set if it doesn't exist for this id
                if (!newErrors[id]) {
                    newErrors[id] = new Set<number>();
                }
                // Add the column number to the Set
                newErrors[id].add(colNumber);
                return newErrors;
            });
            return;
        }

        // if validation passes, remove from errors map if it exists
        if (validationErrors[id] && validationErrors[id].has(colNumber)) {
            console.log("validation passed", validationErrors[id], "colNumber", colNumber);
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                if (newErrors[id]) {
                    // Remove the column number from the Set
                    newErrors[id].delete(colNumber);
                    // If Set is empty, remove the id entry
                    if (newErrors[id].size === 0) {
                        delete newErrors[id];
                    }
                }
                return newErrors;
            });
        }


        // if validation passes add to edited rows
        const updatedValue = validationResult.value !== undefined ? validationResult.value : value;
        setEditedRows(prev => {
            console.log(prev);
            const existing = prev.find(row => row.id === id);
            if (existing) {
                return prev.map(row =>
                    row.id === id ? { ...row, [key]: updatedValue } : row
                );
            } else {
                const original = expenses?.find(row => row.id === id);
                if (original) {
                    return [...prev, { ...original, [key]: updatedValue }];
                } else {
                    return prev;
                }
            }
        });
    };

    

    const newRowToDelete = (id: number) => { 
        setRowsToDelete((prevRows) => {
            return prevRows.includes(id)
                ? prevRows.filter(rowId => rowId !== id) // Remove the id if it's already in the array
                : [...prevRows, id]; // Add the id if it's not in the array
        });
    }

    const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationResult: string | Session = canPerformOperation(session, 'create', { rowsToDelete });

        if (typeof validationResult === 'string') {
            setCudError(validationResult);
            return;
        }

        setCudLoading(true);
        setCudError(null);

        const createRes = await performCrudOperation('create', { tableName: 'expenses', createData: newExpense, user_id: validationResult.user.id });

        if (typeof createRes !== 'string' && !createRes.data) {
            setCudError(createRes.error);
            return;
        } else if (typeof createRes !== 'string' && createRes.data) {
            const createData = createRes.data as Expense[];
             setExpenses((prevExpenses) =>
                    [...(prevExpenses || []), createData[0]].sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                );
                // clear form state 
                setNewExpense({id: -1, date: '', payment_type: 'CHECK', detail: '', company: '',amount: 0});
        }
        setCudLoading(false);
    }

    const canDelete: boolean = (rowsToDelete.length > 0);
    const canEdit: boolean = (editedRows.length > 0);

    const handleSubmitDelete = async () => {

        const validationResult: string | Session = canPerformOperation(session, 'delete', { rowsToDelete });

        if (typeof validationResult === 'string') {
            setCudError(validationResult);
            return;
        }
        setCudLoading(true);
        setCudError(null);

        const deleteRes = await performCrudOperation('delete', { tableName: 'expenses', rowsToDelete });

        if (typeof deleteRes !== 'string' && !deleteRes.data) {
            setCudError(deleteRes.error);
            return;
        } else if (typeof deleteRes !== 'string' && deleteRes.data) {
            const expenseData = deleteRes.data as Expense[];
            const deletedIds: number[] = expenseData.map((expense: Expense) => expense.id);
            // Remove the deleted rows from the expenses array
            setExpenses((prevExpenses) =>
                prevExpenses ? prevExpenses.filter(expense => !deletedIds.includes(expense.id)) : null
            );
        }
        setRowsToDelete([]);
        setDeleteMode(false);
        setCudLoading(false);
    }

    const handleDelete = () => {
        if (canDelete && !editMode) { // can only make api call if there are rows to delete
            handleSubmitDelete();
        } else if (!editMode) {
            setDeleteMode(prevMode => !prevMode);
        }
    };

    const handleEdit = () => {
        if (editMode && !deleteMode && canEdit) { // can only make api call if there are rows to edit
            // handleSubmitEdit();
            setEditMode(prevMode => !prevMode);
        } else if (!deleteMode) {
            setEditMode(prevMode => !prevMode);
        }
    };

    useEffect(() => {
        const fetchExpenses = async () => {
            const dataType = {id: -1, date: '', payment_type: 'CHECK', detail: '',company: '',amount: 0} as Expense;
            const readRes = await performCrudOperation('read', { tableName: 'expenses', dataType: dataType, startDate, endDate });
            if (typeof readRes !== 'string' && !readRes.data) {
                setFetchError(readRes.error);
                return;
            } else if (typeof readRes !== 'string' && readRes.data) {
                setExpenses(readRes.data as Expense[]);
            }
            setLoading(false);
        }
        fetchExpenses();
    }, [startDate, endDate]);

    const headerTitles: string[] = ["Date", "Type", "Detail", "Company", "Amount"];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full text-center ">
                <h1 className="text-[#393939] font-semibold text-3xl pb-2">
                    Expenses
                </h1>
                <p className="font-semibold text-[#585858]">  {months[parseInt(month as string) - 1]},  {year} </p>
                <div className="flex flex-row justify-center items-center h-[32px]">
                    {cudError && <p className="text-red-500">{cudError}</p>}
                </div>
            </div>

            {loading ? (
                <Loading />
            ) : (
                // Content 
                <div className="w-full flex flex-col gap-4 justify-center items-center mb-8">
                    <div className="">
                        {/* Table Header */}
                        <div className="px-4 bg-[#F5F5F5] border border-[#DCDCDC] h-[60px] rounded-top header-shadow flex items-center relative z-10">
                            <div className="flex flex-row justify-between bg-[#F5F5F5] w-full px-10">
                                {(() => {
                                    return headerTitles.map((title, index) => (
                                        <div key={index} className="w-[100px] pl-4">
                                            <p className="text-[16px] text-[#80848A]">{title}</p>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                        {/* Table Data */}
                        {(expenses && !fetchError) ?
                            // Table Data Rows
                            <div>
                                <div className="border border-[#DCDCDC] border-t-0 bg-[#FCFCFC] rounded-bottom header-shadow relative z-0">
                                    <FormDataRows
                                        data={expenses}
                                        deleteConfig={{
                                            mode: deleteMode,
                                            rows: rowsToDelete,
                                            onRowSelect: newRowToDelete
                                        }}
                                        editConfig={{
                                            mode: editMode,
                                            editedRows: editedRows,
                                            onRowEdit: newRowToEditInputChange,
                                            validationFunction: editExpenseRowValidation,
                                            validationErrors: validationErrors
                                        }}
                                        colToSum={5}
                                        addRowForm={
                                            <ExpenseForm onInputChange={newExpenseInputChange}
                                                onSubmit={handleSubmitCreate} />} />
                                </div>
                                {/* Extra Options */}
                                <div className="w-full bg-[#F4FFFE]  border border-2 -z-30 ">
                                    <div className="flex flex-row gap-x-4 py-4 items-center justify-center">
                                    {/* Delete Button */}
                                        <div className="flex flex-col items-center gap-y-2">
                                            <button
                                                onClick={handleDelete}
                                                disabled={cudLoading}
                                                className={`cursor-pointer rounded-full w-16 h-16 flex items-center justify-center ${cudLoading ? 'bg-gray-400' :
                                                    deleteMode ? 'bg-yellow-500' :
                                                        canDelete ? 'bg-red-600' : 'bg-red-300'
                                                    }`}>
                                                {cudLoading ?
                                                    <span className="text-white">...</span> :
                                                    deleteMode ?
                                                        <span className="text-white">✓</span> :
                                                        <span className="text-white">✕</span>
                                                }
                                            </button>
                                            <p> Delete </p>
                                        </div>
                                        {/* Edit Button */}
                                        <div className="flex flex-col items-center gap-y-2">
                                            <button
                                                onClick={handleEdit}
                                                disabled={cudLoading}
                                                className={`cursor-pointer rounded-full w-16 h-16 flex items-center justify-center ${cudLoading ? 'bg-gray-400' :
                                                    editMode ? 'bg-yellow-500' :
                                                    editMode ? 'bg-blue-600' : 'bg-blue-300'
                                                    }`}>
                                                {cudLoading ?
                                                    <span className="text-white">...</span> :
                                                    editMode ?
                                                        <span className="text-white">✓</span> :
                                                        <span className="text-white">✕</span>
                                                }
                                            </button>
                                            <p> Edit </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            :
                            <p>No expenses found</p>}
                    </div>
                </div>
            )}
        </div>
    )
}