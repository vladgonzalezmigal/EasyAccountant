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

export default function PayrollDocumentPagePeriod1() {
    const { year, month } = useParams();
    // Set end date to be the 15th of the month
    const startDate = `${year}-${(month as string).padStart(2, '0')}-01`;
    const endDate = `${year}-${(month as string).padStart(2, '0')}-15`;
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
    console.log(payrollData);
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
                            title={`Period Ending ${months[parseInt(month as string) - 1]} 15`} 
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
                    <div className="w-full">
                        <PayrollTable data={payrollData} save={false} onSave={() => {}} onEdit={() => {}} />
                    </div>
                </div>
            )}
        </div>
    );
}