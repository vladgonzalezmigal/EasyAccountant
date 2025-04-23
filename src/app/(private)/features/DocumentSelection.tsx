'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { months } from '../utils/dateUtils';

export default function DocumentSelection() {

    
    const today = new Date();
    // TODO: get last worked on instead 
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
    
    // Navigate to the document URL with the selected year and month
    const navigateToDocument = (year: number, month: number) => {
        // Add 1 to month since months are 0-indexed in JavaScript but we want 1-indexed in the URL
        const monthIndex = month + 1;
        router.push(`${window.location.pathname}/${year}/${monthIndex}`);
    };
    
    return (
        <div className="flex flex-col gap-4">
            {/* Search Bar */}
            {/* Calendar Grid */}
            <div>{months[selectedMonth]} , {selectedYear} </div>
            <div className="grid grid-cols-4 gap-2 p-4">
            {months.map((month, index) => (
                <button
                key={index}
                className={`border p-2 rounded hover:bg-blue-200 ${index === selectedMonth ? 'border-purple-500' : ''}`}
                onClick={() => navigateToDocument(selectedYear, index)}
                >
                {month} {index + 1}
                </button>
            ))}
            </div>

        </div>
    )
}