'use client';

import { Payroll } from '@/app/(private)/types/formTypes';
import PayrollFormRow from '../addDataRow/PayrollFormRow';

interface PayrollTableRowsProps {
    data: Payroll[];
    showCreateRow: boolean;
}

export default function PayrollTableRows({ data, showCreateRow }: PayrollTableRowsProps) {
    // Calculate total pay
    const totalPay = data.reduce((sum, row) => sum + row.total_pay, 0);
    // const existingEmployeeNames = data.map(row => row.employee_name);

    return (
        <div className="relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom relative z-0 py-4">
            <div className="flex flex-col gap-y-3 h-[304px] overflow-y-auto">
                {/* Empty row for future create functionality */}
                {showCreateRow && (
                    <PayrollFormRow 
                        onInputChange={() => {}}
                        onSubmit={() => {}}
                        data={data}
                    />
                )}
                {data.map((row) => (
                    <div key={row.id} className="table-row-style mx-auto">
                        <div className="h-[60px] flex flex-col items-center justify-center">
                            <div className='h-[40px] w-[200px] flex items-center pl-3'>
                                <p className='table-row-text'>{row.employee_name}</p>
                            </div>
                        </div>
                        <div className="h-[60px] flex flex-col items-center justify-center">
                            <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                <p className='table-row-text'>{row.wage_type}</p>
                            </div>
                        </div>
                        <div className="h-[60px] flex flex-col items-center justify-center">
                            <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                <p className='table-row-text'>${row.wage_rate.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="h-[60px] flex flex-col items-center justify-center">
                            <div className='h-[40px] w-[50px] flex items-center pl-3'>
                                <p className='table-row-text'>{row.hours}</p>
                            </div>
                        </div>
                        <div className="h-[60px] flex flex-col items-center justify-center">
                            <div className='h-[40px] w-[50px] flex items-center pl-3'>
                                <p className='table-row-text'>{row.minutes}</p>
                            </div>
                        </div>
                        <div className="h-[60px] flex flex-col items-center justify-center">
                            <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                <p className='table-row-text'>${row.total_pay.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                {/* Sum Row  */}
                <div className="rounded-full bg-[#DFDFDF] w-[772px] h-[4px] mx-auto"></div>
                <div className='flex justify-between pl-14 pr-10 text-[24px] py-4 text-[#4A4A4A] font-semibold'>
                    <p>Total</p>
                    <p>${totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
}
