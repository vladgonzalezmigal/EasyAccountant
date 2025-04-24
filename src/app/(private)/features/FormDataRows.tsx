'use client';
import React, { ReactNode } from 'react';
import { FormData } from '@/app/(private)/types/formTypes';

type FormDataRowsProps = {
    data: FormData[];
    addRowForm?: ReactNode;
};

export function FormDataRows({ data, addRowForm }: FormDataRowsProps) {
    if (data.length === 0) {
        return <p className="text-gray-500 text-center mt-4">No entries found for this period.</p>;
    }

    const keys = Object.keys(data[0]) as (keyof typeof data[0])[];

    return (
        <div className="flex flex-col gap-y-4 border-2 border-blue-300 h-[400px]  overflow-y-auto">
            {addRowForm && addRowForm}
            {/* List of Rows */}
            {data.map((item, index) => (
                <div
                    key={index}
                    className="border flex flex-row items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    {/* Individual Row */}
                    {keys.map((key) => (
                        <div key={key} className={`flex-1 border-2 w-[100px] h-[50px] `}>
                            <p className='text-sm text-gray-800'>
                            {
                                typeof item[key] === 'number'
                                    ? `$${(item[key] as number).toLocaleString('en-US', 
                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : item[key]?.toString()
                            }
                            </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}