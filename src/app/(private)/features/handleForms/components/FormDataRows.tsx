'use client';
import React, { ChangeEvent, ReactNode } from 'react';
import { FormData } from '@/app/(private)/types/formTypes';
import { sumColumn } from '../../utils/analytics';
import { getFieldConfig, isFieldEdited } from '../utils/formValidation/formValidation';
import { EditInputForm } from './editDataRow/EditInputForm';
import { EditSelectForm } from './editDataRow/EditSelectForm';
import { formatDisplayValue } from '../utils/formDataDisplay/formDataDisplay';
import { DeleteConfig, EditConfig } from '../types/configTypes';

type FormDataRowsProps = {
    data: FormData[];
    colToSum: number;
    addRowForm?: ReactNode;
    deleteConfig?: DeleteConfig;
    editConfig: EditConfig;
    tableName: string;
};

export function FormDataRows({ data, colToSum, addRowForm, deleteConfig, editConfig, tableName }: FormDataRowsProps) {
    const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number, colNumber: number) => {
        const { name, value } = e.target;
        const validationResult = editConfig.validationFunction(name as keyof FormData, value as string);

        if (validationResult.value) {
            e.target.value = validationResult.value;
        }
        editConfig.onRowEdit(id, name as keyof FormData, value, colNumber);
    };

    const fieldConfig = getFieldConfig(tableName);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex flex-col gap-y-3 h-[304px] lg:px-4 overflow-y-auto">
                {addRowForm &&
                    <div className={`pt-3 ${(data.length === 0) ? 'h-full w-full flex items-center justify-center' : ''}  `}>
                        {addRowForm}
                    </div>
                }
                {data.map((item) => {
                    // Extract id and only keep the last 5 properties for display
                    const { id, ...rest } = item as { id: number } & Record<string, string | number>;
                    const lastFiveKeys =  Object.keys(rest).slice(-5) as (keyof typeof data[0])[];;
                    const displayData = lastFiveKeys.reduce((obj, key) => {
                        obj[key] = rest[key];
                        return obj;
                    }, {} as Record<string, string | number>);

                    return (
                        <div
                            key={id}
                            className="table-row-style "
                        >
                            {lastFiveKeys.map((displayKey, index) => {
                                return (
                                    <div key={displayKey} className={`h-[60px] flex flex-col items-center justify-center`}>
                                        <div className='h-[40px] w-[100px] flex items-center pl-3'>
                                            {editConfig.mode ? (
                                                fieldConfig[displayKey]?.type === 'null' ? (
                                                    <p className='table-row-text'>
                                                        {formatDisplayValue(displayData[displayKey])}
                                                    </p>
                                                ) : fieldConfig[displayKey]?.type === 'select' ? (
                                                    <EditSelectForm
                                                        name={displayKey as string}
                                                        value={
                                                            editConfig.editedRows.find(row => row.id === id)?.[displayKey] as unknown as string || 
                                                            displayData[displayKey] as string
                                                        }
                                                        onChange={(e) => handleEditChange(e, id, index)}
                                                        hasError={editConfig.validationErrors[id]?.has(index)}
                                                        active={isFieldEdited(editConfig.editedRows.find(row => row.id === id), displayData, displayKey as keyof FormData)}
                                                    />
                                                ) : (
                                                    <EditInputForm
                                                        name={displayKey as string}
                                                        placeholder={formatDisplayValue(displayData[displayKey])}
                                                        onChange={(e) => handleEditChange(e, id, index)}
                                                        hasError={editConfig.validationErrors[id]?.has(index)}
                                                        active={isFieldEdited(editConfig.editedRows.find(row => row.id === id), displayData, displayKey as keyof FormData)}
                                                    />
                                                )
                                            ) : (
                                                <p className='table-row-text'>
                                                    {formatDisplayValue(displayData[displayKey])}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {deleteConfig?.mode && deleteConfig && (
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
                {/* Sum Row  */}
                <div className="rounded-full bg-[#DFDFDF] w-[772px] h-[4px]"></div>
                <div className='flex justify-between pl-14 pr-10 text-[24px] py-4 text-[#4A4A4A] font-semibold'>
                    <p>Total</p>
                    <p>${sumColumn(data, (colToSum + 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
}