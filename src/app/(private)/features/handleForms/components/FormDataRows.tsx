'use client';
import React, { ReactNode } from 'react';
import { FormData } from '@/app/(private)/types/formTypes';
import { sumColumn } from '../../utils/analytics';

type DeleteConfig = {
    mode: boolean;
    rows: number[];
    onRowSelect: (id: number) => void;
};

type FormDataRowsProps = {
    data: FormData[];
    colToSum: number;
    addRowForm?: ReactNode;
    deleteConfig: DeleteConfig;
};

export function FormDataRows({ data, colToSum, addRowForm, deleteConfig }: FormDataRowsProps) {
    if (data.length === 0) {
        return <p className="text-gray-500 text-center mt-4">No entries found for this period.</p>;
    }

    // Get all keys except 'id' to display
    const displayKeys = Object.keys(data[0]).filter(key => key !== 'id') as (keyof typeof data[0])[];

    return (
        <div className="w-full  flex flex-col items-center ">
            <div className="flex flex-col gap-y-3  h-[304px] lg: px-4 overflow-y-auto ">
                {addRowForm &&
                    <div className='pt-3'>
                        {addRowForm}
                    </div>
                }
                {/* List of Rows */}
                {data.map((item) => {
                    // Destructure id from displayData
                    const { id, ...displayData } = item as { id: number } & Record<string, string | number>;

                    return (
                        // Data Row Container
                        <div
                            key={id}
                            className="border border-[#DFDFDF] relative flex items-center justify-between  bg-white w-[772px] px-10 rounded-2xl 
                        shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            {/* Individual Row Data */}
                            {displayKeys.map((displayKey) => {
                                return (
                                    <div key={displayKey} className={`  h-[60px] flex flex-col items-center justify-center `}>
                                        <div className=' h-[40px] w-[100px] flex items-center pl-3'>
                                            <p className='text-[16px] text-[#585858]'> 
                                                {
                                                    typeof displayData[displayKey] === 'number'
                                                        ? `$${(displayData[displayKey] as number).toLocaleString('en-US',
                                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                        : displayData[displayKey]?.toString()
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Delete Button */}
                            {deleteConfig.mode && (
                                <div 
                                    onClick={() => deleteConfig.onRowSelect(id)}
                                    className={`absolute top-1/2 right-[5px] transform -translate-y-1/2 ${deleteConfig.rows.includes(id) ? 'row-delete-active' : 'row-delete-inactive'}`}
                                >
                                    <p>x</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div>
                <div className="rounded-full bg-[#DFDFDF] w-[772px] h-[4px] "></div>
                {/* Sum row */}
                <div className='flex justify-between pl-14 pr-10 text-[24px] py-4 text-gray-600 font-semibold'>
                    <p>Total</p>
                    <p>${sumColumn(data, (colToSum+1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>

    );
}