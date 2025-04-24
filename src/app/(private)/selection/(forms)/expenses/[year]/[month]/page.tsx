'use client';

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import BackButton from "@/app/(private)/components/BackButton";
import { months } from "@/app/(private)/utils/dateUtils";
import supabase from "@/config/supaBaseConfig";
import { Expense } from "@/app/(private)/types/formTypes";
import { FormDataRows } from "@/app/(private)/features/FormDataRows";
import ExpenseForm from "@/app/(private)/features/addDataRow/ExpenseForm";
import { Loading } from "@/app/components/Loading";
import { getMonthDateRange, formatDate } from "@/app/(private)/utils/dateUtils";

export default function ExpensesPage() {
    const { year, month } = useParams();
    const { session } = UserAuth();
    // End Date is exclusive 
    const { startDate, endDate } = getMonthDateRange(year as string, month as string);
    const currentPath = usePathname();
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<Expense[] | null>(null)
    const [loading, setLoading] = useState(true);

    const [newExpense, setNewExpense] = useState<Expense>({
        date: '',
        payment_type: '',
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
      // api call: TODO: put in util function 
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!session) {
            console.error("No session found");
            return;
        }
        e.preventDefault();

        const { data, error } = await supabase
             .from('expenses')
             .insert({
                ...newExpense,
                user_id: session.user.id
             })
             .select('date, payment_type, detail, company, amount');

        if (error) {
            console.error("Error creating expense", error);
        } else if (data) {
            // TODO: add util for resorting 
            setExpenses((prevExpenses) =>
                [...(prevExpenses || []), data[0]].sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                )
              );
              // clear form 
              setNewExpense({
                date: '',
                payment_type: '',
                detail: '',
                company: '',
                amount: 0
              });
        }
      }

    // TODO: abstract initial fetch into util function 

    useEffect(() => {
        const fetchExpenses = async () => {
            const { data, error } = await supabase
                .from('expenses')
                .select('date, payment_type, detail,company, amount ')
                .gte('date', startDate)
                .lt('date', endDate)
                .order('date', { ascending: false }); // newest first 
            if (error) {
                setFetchError(error.message);
            }
            setExpenses(data);
            setLoading(false);
        }
        fetchExpenses();
    }, [startDate, endDate]);

    return (
        <div className="w-full">
            <BackButton url={currentPath.split('/', 4).slice(0, 3).join('/')} />
            <h1>Expenses for {months[parseInt(month as string) - 1]} {year}</h1>
            {loading ? (
                <Loading />
            ) : (
                // Content 
                <div className="w-full flex flex-col gap-4 justify-center items-center border-2 border-red-300 my-8">
                    <div className="py-4 w-[500px]">
                        {/* Header Rows */}
                        <div className="flex flex-row justify-between">
                            <div>Date</div>
                            <div>Payment Type</div>
                            <div>Detail</div>
                            <div>Company</div>
                            <div>Amount</div>
                        </div>
                        {/* Expense Data Rows */}
                        {/* Pass in a boolean for edit mode */}
                        {(expenses && !fetchError) ? 
                        <FormDataRows data={expenses} addRowForm={<ExpenseForm onInputChange={newExpenseInputChange} 
                        onSubmit={handleSubmit} />} /> :
                            <p>No expenses found</p>}
                    </div>

                </div>
            )}
        </div>
    )
}