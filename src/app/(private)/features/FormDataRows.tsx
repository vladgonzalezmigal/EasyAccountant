'use client';
import React, { ReactNode } from 'react';
import { FormData } from '@/app/(private)/types/formTypes';
import { sumColumn } from './utils/analytics';

type FormDataRowsProps = {
    data: FormData[];
    colToSum: number;
    addRowForm?: ReactNode;
};

export function FormDataRows({ data, colToSum, addRowForm }: FormDataRowsProps) {
    if (data.length === 0) {
        return <p className="text-gray-500 text-center mt-4">No entries found for this period.</p>;
    }

    const keys = Object.keys(data[0]) as (keyof typeof data[0])[];

    return (
        <div className="w-full  flex flex-col items-center ">
            <div className="flex flex-col gap-y-3  h-[304px] lg: px-4 overflow-y-auto ">
                {addRowForm &&
                    <div className='pt-3'>
                        {addRowForm}
                    </div>
                }
                {/* List of Rows */}
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="border border-[#DFDFDF] flex items-center justify-between bg-white w-[772px]   px-10 rounded-2xl 
                    shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Individual Column */}
                        {keys.map((key) => (

                            <div key={key} className={`  h-[60px] flex flex-col items-center justify-center `}>
                                <div className=' h-[40px] w-[100px] flex items-center pl-3'>
                                    <p className='text-[16px] text-[#585858]'>
                                        {
                                            typeof item[key] === 'number'
                                                ? `$${(item[key] as number).toLocaleString('en-US',
                                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                : item[key]?.toString()
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {/* Sum: TODO: provide column index to sum data  */}
            <div>
                <div className="rounded-full bg-[#DFDFDF] w-[772px] h-[4px] "></div>
                {/* Sum row */}
                <div className='flex justify-between pl-14 pr-10 text-[24px] py-4 text-gray-600 font-semibold'>
                    <p>Total</p>
                    <p>${sumColumn(data, colToSum).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>

    );
}