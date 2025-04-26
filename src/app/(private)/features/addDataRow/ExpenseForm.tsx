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
        <div className="border border-[#DFDFDF] form-shadow [772px] rounded-full">
            <form ref={formRef} onSubmit={handleSubmit} className='flex flex-row items-center rounded-full h-[60px] pl-10 text-gray-800'>
                <div className="">
                    {/* <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label> */}
                    <input
                        type="text"
                        id="date"
                        name="date"
                        onChange={handleDateChange}
                        className="input-field flex items-center justify-center "
                        placeholder={DAY.toString()}
                    />
                </div>

                <div className='pl-12'>
                    {/* <label htmlFor="payment_type" className="block text-sm font-medium text-gray-700">
                        Payment Type
                    </label> */}
                    <select
                        id="payment_type"
                        name="payment_type"
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="">Check</option>
                        {PAYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='pl-12'>
                    {/* <label htmlFor="detail" className="block text-sm font-medium text-gray-700">
                        Detail
                    </label> */}
                    <input
                        type="text"
                        id="detail"
                        name="detail"
                        onChange={handleChange}
                        className="input-field"
                        placeholder='#'
                    />
                </div>

                <div className='pl-12'>
                    {/* <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Company
                    </label> */}
                    <select
                        id="company"
                        name="company"
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="">Company</option>
                        {COMPANIES.map((company) => (
                            <option key={company} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='pl-12'>
                    {/* <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label> */}
                    <input
                        type="text"
                        id="amount"
                        name="amount"
                        onChange={handleAmountChange}
                        className="w-[90px] h-[40px] pl-3 block rounded-full border border-gray-800 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.00"
                    />
                </div>
                <div className='flex text-lg justify-center items-center rounded-full ml-[4px] bg-blue-500 text-white w-10 h-10 cursor-pointer'>
                    <button type="submit" className='cursor-pointer'>
                        <p> + </p>
                    </button>
                </div>
            </form>
        </div>
    );
}
