'use client';

import Link from "next/link";

type SettingsType = 'expenses' | 'payroll';

interface SettingsSubLinksProps {
    type: SettingsType;
}

export default function SettingsSubLinks({ type }: SettingsSubLinksProps) {
    if (type !== 'expenses' && type !== 'payroll') {
        return null;
    }

    return (
        <div className="flex flex-col gap-y-2.5 pl-10 mt-1">
            <Link 
                href={`/settings#${type}`}
                className="hover:bg-gray-50 transition-colors duration-200 rounded-lg pl-2 py-2"
            >
                <p className="text-[14px] text-[#6B7280] hover:text-[#4B5563] transition-colors duration-200 capitalize">
                    {(type === 'expenses') ? "Vendors" : "Employees"}
                </p>
            </Link>
        </div>
    );
} 