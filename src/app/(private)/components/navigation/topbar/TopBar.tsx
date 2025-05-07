'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import HouseUserIcon from '../../svgs/HouseUserIcon';
import SalesIcon from '../../svgs/SalesIcon';
import ExpensesIcon from '../../svgs/ExpensesIcon';
import PayrollIcon from '../../svgs/PayrollIcon';
import MailIcon from '../../svgs/MailIcon';
import GearIcon from '../../svgs/GearIcon';
import CalculatorIcon from '../../svgs/CalculatorIcon';

interface TopBarProps {
    activePage: string;
}

export default function TopBar({ activePage }: TopBarProps) {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getUserEmail() {
            try {
                setIsLoading(true);
                const supabase = createClient();
                const { data: { user }, error } = await supabase.auth.getUser();
                
                if (error) {
                    throw error;
                }
                
                setUserEmail(user?.email || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user email');
                console.error('Error fetching user email:', err);
            } finally {
                setIsLoading(false);
            }
        }

        getUserEmail();
    }, []);

    const getIcon = () => {
        switch (activePage) {
            case 'selection':
                return <HouseUserIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'sales':
                return <SalesIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'expenses':
                return <ExpensesIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'payroll':
                return <PayrollIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'mail':
                return <MailIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'settings':
                return <GearIcon className="w-6 h-6 text-[#2A7D7B]" />;
            case 'analytics':
                return <CalculatorIcon className="w-6 h-6 text-[#2A7D7B]" />;
            default:
                return null;
        }
    };

    const formatPageTitle = (page: string) => {
        return page.charAt(0).toUpperCase() + page.slice(1);
    };

    return (
        <div className="flex items-center justify-between px-16 bg-[#B6E8E4] shadow-sm py-4 w-full border-b border-b-[#DADADA]">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-[#DFF4F3] rounded-full flex items-center justify-center">
                    {getIcon()}
                </div>
                <h1 className="text-[24px] font-bold text-[#2F2F2F] pl-4">{formatPageTitle(activePage)}</h1>
            </div>
            <div className="text-[16px] font-medium text-[#585858] ">
                {isLoading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    userEmail || 'No email found'
                )}
            </div>
        </div>
    );
}
