'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { months } from '../../../../utils/dateUtils';
import DocumentSearchHeader from './DocumentSearchHeader';

export default function DocumentSelection() {
    const today = new Date();
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const currentMonth: number = today.getMonth();

    // Navigate to the document URL with the selected year and month
    const navigateToDocument = (year: number, month: number) => {
        // Add 1 to month since months are 0-indexed in JavaScript but we want 1-indexed in the URL
        const monthIndex = month + 1;
        router.push(`${window.location.pathname}/${year}/${monthIndex}`);
    };

    return (
        <div className="flex flex-col ">
            {/* Change Year Header */}
          
            <div className="w-[600px] h-[80px] bg-[#F5F5F5] flex items-center justify-center rounded-top border-2 border-[#DFDFDF] shadow-md">
              
                <DocumentSearchHeader 
                    onYearSelect={setSelectedYear}
                    initialYear={selectedYear}
                />
               
            </div>
            {/* Calendar Grid  */}
            <div className="flex w-[600px] justify-center bg-[#FDFDFD] rounded-bottom border-2 border-[#DFDFDF] py-6 shadow-lg">
                <div className="grid grid-cols-4 gap-4  w-[500px]">
                    {months.map((month, index) => (
                        <button
                            key={index}
                            className={`cursor-pointer border-2 border-[#B6E8E4] shadow-md py-[44px] px-[52px] rounded  hover:bg-blue-100 flex items-center justify-center rounded-lg font-semibold text-[18px] ${index === currentMonth ? 'border-[#B6E8E4] bg-[#DFF4F3] text-[#202020]' : 'bg-white text-[#585858]'}`}
                            onClick={() => navigateToDocument(selectedYear, index)}
                        >
                            <p>    {month.substring(0, 3).charAt(0).toUpperCase() + month.substring(1, 3).toLowerCase()}  </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}