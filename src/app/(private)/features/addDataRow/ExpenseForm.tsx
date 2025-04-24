'use client';

import { ChangeEvent, useRef } from 'react';
import { Expense } from '@/app/(private)/types/formTypes';

interface ExpenseFormProps {
    onInputChange: (name: keyof Expense, value: string | number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PAYMENT_TYPES = ['CHECK', 'CASH', 'CARD'] as const;
const COMPANIES = ['JETRO', 'SUPREMA'] as const;
const today = new Date();
const DAY = today.getDate(); // Gets day without leading zero

export default function ExpenseForm({ onInputChange, onSubmit }: ExpenseFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    // TODO: add form validation 

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onInputChange(name as keyof Expense, value);
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow numeric input
        if (/^\d*$/.test(value)) {
            onInputChange(name as keyof Expense, value);
        }
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Only allow numbers and decimal point
        if (/^\d*\.?\d*$/.test(value)) {
            onInputChange(name as keyof Expense, value);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        onSubmit(e);
        formRef.current?.reset();
    };

    return (
        <div className="flex gap-4 p-4 border-2">
            <form ref={formRef} onSubmit={handleSubmit} className='flex flex-row gap-4'>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <input
                        type="text"
                        id="date"
                        name="date"
                        onChange={handleDateChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={DAY.toString()}
                    />
                </div>

                <div>
                    <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                        Payment Type
                    </label>
                    <select
                        id="payment_type"
                        name="payment_type"
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select payment type</option>
                        {PAYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="detail" className="block text-sm font-medium text-gray-700">
                        Detail
                    </label>
                    <input
                        type="text"
                        id="detail"
                        name="detail"
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Company
                    </label>
                    <select
                        id="company"
                        name="company"
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select company</option>
                        {COMPANIES.map((company) => (
                            <option key={company} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <input
                        type="text"
                        id="amount"
                        name="amount"
                        onChange={handleAmountChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.00"
                    />
                </div>
                <div className='flex text-lg justify-center items-center rounded-full bg-blue-500 text-white w-10 h-10'>
                    <button type="submit">
                        <p> + </p>
                    </button>
                </div>
            </form>
        </div>
    );
}
