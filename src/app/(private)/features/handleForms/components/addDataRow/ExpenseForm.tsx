'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Expense } from '@/app/(private)/types/formTypes';
import { useParams } from 'next/navigation';
import { validateDateInput, validateAmountInput } from '@/app/(private)/features/utils/formValidation';

interface ExpenseFormProps {
    onInputChange: (name: keyof Expense, value: string | number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const PAYMENT_TYPES = ['CHECK', 'CASH', 'CARD'] as const;
const COMPANIES = ['JETRO', 'SUPREMA'] as const;
const DEFAULT_COMPANY = 'Company';
const today = new Date();
const DAY = today.getDate(); // Gets day without leading zero

export default function ExpenseForm({ onInputChange, onSubmit }: ExpenseFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { year, month } = useParams();

    // form validation errors
    const [dateError, setDateError] = useState<string | null>(null);
    const [companyError, setCompanyError] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [companySelected, setCompanySelected] = useState<boolean>(false);


    const formError : boolean = (dateError || companyError || amountError) ? true : false;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onInputChange(name as keyof Expense, value);
    };

    const handleCompanyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!companySelected) {
            setCompanySelected(true);
        }
        if (value === "") { // default option is selected
            setCompanyError(true);
        } else {
            setCompanyError(false);
        }
        onInputChange(name as keyof Expense, value);
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Handle non-numeric input and leading zeros
        if (!/^\d*$/.test(value) || value === '0') {
            e.target.value = value === '0' ? '' : value.replace(/\D/g, '');
            return;
        }

        const validation = validateDateInput(
            value,
            parseInt(month as string),
            parseInt(year as string)
        );

        if (validation.isValid) {
            if (dateError) {
                setDateError(null);
            }
            onInputChange(name as keyof Expense, value);
        } else {
            setDateError(validation.error || null);
            // If non-numeric input, reset to previous valid value
            e.target.value = e.target.value.replace(/\D/g, '');
        }
    };



    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const validation = validateAmountInput(value);

        if (validation.value) {
            e.target.value = validation.value;
        }

        if (validation.isValid) {
            if (amountError) {
                setAmountError(null);
            }
            // If the value is valid but doesn't have a decimal, add .00
            let formattedValue = validation.value || value;
            if (validation.isValid && !formattedValue.includes('.')) {
                formattedValue = `${formattedValue}.00`;
            }
            onInputChange(name as keyof Expense, formattedValue);
        } else {
            setAmountError(validation.error || null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!companySelected) {
            setCompanyError(true);
            return;
        }
        onSubmit(e);
        formRef.current?.reset();
    };

    return (
        <div className="border border-[#DFDFDF] bg-white form-shadow [772px] rounded-full">
            <form ref={formRef} onSubmit={handleSubmit} className='flex flex-row items-center rounded-full h-[60px] pl-10 text-gray-800'>
                <div className="">
                    <input
                        type="text"
                        id="date"
                        name="date"
                        required={true}
                        onChange={handleDateChange}
                        className={`flex items-center justify-center ${dateError ? "input-field-error " : "input-field"}`}
                        placeholder={DAY.toString()}
                    />
                </div>

                <div className='pl-12'>
                    <select
                        id="payment_type"
                        name="payment_type"
                        onChange={handleChange}
                        className="input-field"
                    >
                        {/* <option value="">Check</option> */}
                        {PAYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='pl-12'>
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
                    <select
                        id="company"
                        name="company"
                        onChange={handleCompanyChange}
                        className={`flex items-center justify-center ${companyError ? "input-field-error " : "input-field"}`}
                    >
                        <option value="">{DEFAULT_COMPANY}</option>
                        {COMPANIES.map((company) => (
                            <option key={company} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='pl-12'>
                    <input
                        type="text"
                        id="amount"
                        name="amount"
                        required={true}
                        onChange={handleAmountChange}
                        className={`flex items-center justify-center ${amountError ? "input-field-error " : "input-field"}`}
                        placeholder="0.00"
                    />
                </div>
                <div className={`flex text-lg justify-center items-center rounded-full ml-[2px] ${formError ? 'bg-red-500 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'} text-white w-8 h-8`}>
                    <button 
                        type="submit" 
                        disabled={formError}
                        className='cursor-pointer disabled:cursor-not-allowed'
                    >
                        <p>{formError ? 'x' : '+'}</p>
                    </button>
                </div>
            </form>
        </div>
    );
}
