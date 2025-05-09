'use client';

import { Payroll } from '@/app/(private)/types/formTypes';
import PayrollTableRows from './PayrollTableRows';
import PayrollBtns from './PayrollBtns';
import { useState } from 'react';

interface PayrollTableProps {
    data: Payroll[];
    save: boolean;
    onSave?: () => void;
    onEdit?: () => void;
}

export default function PayrollTable({ data, save,  }: PayrollTableProps) {
    const [createRow, setCreateRow] = useState(false);

    const handleCreateToggle = () => {
        setCreateRow(prev => !prev);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-[800px] ">
                {/* Header */}
                <div className="px-4 bg-[#F5F5F5] z-30 border border-b-0 border-t-2 border-x-2 border-[#ECECEE] h-[60px] rounded-top header-shadow flex items-center relative z-10">
                    <div className="flex flex-row justify-between bg-[#F5F5F5] w-full px-10">
                        <div className="w-[200px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Employee Name</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Wage Type</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Wage Rate</p>
                        </div>
                        <div className="w-[50px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Hours</p>
                        </div>
                        <div className="w-[50px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Minutes</p>
                        </div>
                        <div className="w-[100px] pl-4">
                            <p className="text-[16px] text-[#80848A]">Total Pay</p>
                        </div>
                    </div>
                </div>
                
                {/* Body */}
                <PayrollTableRows 
                    data={data} 
                    showCreateRow={createRow}
                />
            </div>
            
            {/* Action Button */}
            <div className="w-[800px]"> 
                <PayrollBtns
                    deleteMode={false}
                    editMode={false}
                    save={save}
                    clearEdits={false}
                    cudLoading={false}
                    onCreateToggle={handleCreateToggle}
                />
            </div>
        </div>
    );
}
