'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { months } from "@/app/(private)/utils/dateUtils";
import supabase from "@/config/supaBaseConfig";
import { Expense } from "@/app/(private)/types/formTypes";
import { FormDataRows } from "@/app/(private)/features/handleForms/components/FormDataRows";
import ExpenseForm from "@/app/(private)/features/handleForms/components/addDataRow/ExpenseForm";
import { Loading } from "@/app/components/Loading";
import { getMonthDateRange, formatDate } from "@/app/(private)/utils/dateUtils";
import { canPerformOperation, performCrudOperation } from "@/app/(private)/features/handleForms/utils/operationUtils";
import { Session } from "@supabase/supabase-js";

export default function ExpensesPage() {
    const { year, month } = useParams();
    const { session } = UserAuth();
    // End Date is exclusive 
    const { startDate, endDate } = getMonthDateRange(year as string, month as string);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<Expense[] | null>(null);
    const [loading, setLoading] = useState(true);
    // Delete or edit mode
    // const [editMode, setEditMode] = useState<boolean>(false);
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

    // prevent editing, deleting if delete or edit mode is on

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
        if (canDelete) { // can only make api call if there are rows to delete
            handleSubmitDelete();
        } else {
            setDeleteMode(prevMode => !prevMode);
        }
    };

    // TODO: abstract initial fetch into util function, making 

    useEffect(() => {
        const fetchExpenses = async () => {
            const { data, error } = await supabase
                .from('expenses')
                .select('id, date, payment_type, detail,company, amount ')
                .gte('date', startDate)
                .lt('date', endDate)
                .order('date', { ascending: false }); // newest first 
            if (error) {
                setFetchError(error.message);
            }
            // add id but exclude from table row display 
            setExpenses(data);
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
                                        colToSum={5}
                                        addRowForm={
                                            <ExpenseForm onInputChange={newExpenseInputChange}
                                                onSubmit={handleSubmitCreate} />} />
                                </div>
                                {/* Extra Options */}
                                <div className="w-full bg-[#F4FFFE]  border border-2 -z-30 ">
                                    <div className="flex flex-row gap-x-4 py-4 items-center justify-center">
                                        <div>
                                            {/* Delete Button */}
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