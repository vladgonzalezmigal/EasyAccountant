'use client';
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/app/(private)/components/BackButton";
import { months } from "@/app/(private)/utils/dateUtils";
import supabase from "@/config/supaBaseConfig";
import { Expense } from "@/app/(private)/types/formTypes";
import { FormDataRows } from "@/app/(private)/features/FormDataRows";
import { Loading } from "@/app/components/Loading";
export default function ExpensesPage() {
    const { year, month } = useParams();
    const currentPath = usePathname();

    const [fetchError, setFetchError] = useState<string | null>(null);
    const [expenses, setExpenses] = useState<Expense[] | null>(null)
    const [loading, setLoading] = useState(true);


    // TODO abstract into util function 

    useEffect(() => {
        const fetchExpenses = async () => {
            const {data, error} = await supabase
                .from('expenses')
                .select('date, payment_type, detail,company, amount ')
                // .eq('year', year) TODO: filter 
                // .eq('month', month)
                // .eq('user_id', user.id)
            if (error) {
                setFetchError(error.message);
            }
            console.log("moreno", data);
            console.log(typeof data )
            setExpenses(data);
            setLoading(false);
        }
        fetchExpenses();
    }, [year, month]);

    return (
        <div>
            <BackButton url={currentPath.split('/', 4).slice(0, 3).join('/')} />
            <h1>Expenses for {months[parseInt(month as string) - 1]} {year}</h1>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    {/* Header Rows */}
                    <div className="flex flex-row justify-between">
                        <div>Date</div>
                        <div>Payment Type</div>
                        <div>Detail</div>
                        <div>Company</div>
                        <div>Amount</div>
                    </div>
                    {/* Expense Data Rows */}
                    {(expenses && !fetchError) ? <FormDataRows data={expenses} /> :
                    <p>No expenses found</p>}
                </div>
            )}
        </div>
    )
}