'use client'
// this page is for the first half of the month
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/Loading";
import { getDaysInMonth, months } from "@/app/(private)/utils/dateUtils";
import TableTitle from "@/app/(private)/features/handleForms/components/TableTitle";

export default function PayrollDocumentPagePeriod1() {
    const { year, month } = useParams();
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for now
        const timer = setTimeout(() => {
            setFetchLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {fetchLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <>
                    {/* Title */}
                    <div className="w-full text-center w-full flex flex-col items-center">
                        <TableTitle 
                            title={`Period Ending ${months[parseInt(month as string) - 1]} ${getDaysInMonth(parseInt(month as string) - 1, parseInt(year as string))}`} 
                            month={month as string} 
                            year={year as string} 
                            type="payroll" 
                        />
                    </div>

                    {/* Table Component - Placeholder */}
                    <div className="w-full h-full">
                        {/* Table will go here */}
                    </div>
                </>
            )}
        </div>
    );
}