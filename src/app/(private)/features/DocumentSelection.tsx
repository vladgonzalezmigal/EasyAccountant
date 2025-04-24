'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { months } from '../utils/dateUtils';
import { validateYearInput } from '../utils/dateUtils';

export default function DocumentSelection() {

    const today = new Date();
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputYear, setInputYear] = useState<string>(selectedYear.toString());

    const currentMonth : number = today.getMonth();

    // Navigate to the document URL with the selected year and month
    const navigateToDocument = (year: number, month: number) => {
        // Add 1 to month since months are 0-indexed in JavaScript but we want 1-indexed in the URL
        const monthIndex = month + 1;
        router.push(`${window.location.pathname}/${year}/${monthIndex}`);
    };

    // handle year input  
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = validateYearInput(e.target.value, inputYear);
        setInputYear(value);
    };
    // handle edit button 
    const toggleEditing = () => {
        if (isEditing) {
            // Save the year when clicking "Save"
            const newYear = parseInt(inputYear);
            if (!isNaN(newYear) && newYear > 0) {
                setSelectedYear(newYear);
            } else {
                // Reset to current selected year if invalid
                setInputYear(selectedYear.toString());
            }
        } else {
            // When entering edit mode, set input to current year
            setInputYear(selectedYear.toString());
        }
        setIsEditing(!isEditing);
    };
    
    return (
        <div className="flex flex-col gap-4">
            {/* Change Year */}
            <div>
                <input 
                    type="text" 
                    placeholder="2025" 
                    value={isEditing ? inputYear : selectedYear}
                    onChange={handleYearChange}
                    disabled={!isEditing}
                    className={`border p-2 rounded ${isEditing ? 'border-blue-500 border-2' : ''}`}
                />
                {/* Edit & Save button */}
                <button onClick={toggleEditing}> {isEditing ? 'Save' : 'Edit'} </button>
            </div>
            {/* Calendar Grid */}
            <div>{months[currentMonth]} , {selectedYear} </div>
            <div className="grid grid-cols-4 gap-2 p-4">
            {months.map((month, index) => (
                <button
                key={index}
                className={`border p-2 rounded hover:bg-blue-200 ${index === currentMonth ? 'border-purple-500' : ''}`}
                onClick={() => navigateToDocument(selectedYear, index)}
                >
                {month} {index + 1}
                </button>
            ))}
            </div>

        </div>
    )
}