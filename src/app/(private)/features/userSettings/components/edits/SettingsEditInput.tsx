'use client';

import React from 'react';

interface SettingsEditInputProps {
    value: string;
    onChange: (value: string) => void;
    isEditing: boolean;
}

export default function SettingsEditInput({ 
    value,
    onChange,
    isEditing
}: SettingsEditInputProps) {
    const isEmpty = value.trim() === '';
    
    return (
        <td className="w-[300px] min-w-[300px] max-w-[300px] px-6 py-4 text-[16px] font-medium text-[#585858]">
            {isEditing ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border-2 rounded-full px-3 py-1 focus:outline-none ${
                        isEmpty ? 'border-red-500' : 'border-[#8ABBFD]'
                    }`}
                />
            ) : (
                <div className="overflow-x-auto whitespace-nowrap">
                    {value}
                </div>
            )}
        </td>
    );
} 