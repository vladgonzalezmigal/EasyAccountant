'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Expense } from '@/app/(private)/types/formTypes';
import { useParams } from 'next/navigation';
import { validateDateInput, validateAmountInput, validateCompanyInput, DEFAULT_COMPANY } from '@/app/(private)/features/handleForms/utils/formValidation/formValidation';
import { formatDate } from '@/app/(private)/utils/dateUtils';

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
    const { year, month } = useParams();

    // form validation errors
    const [dateError, setDateError] = useState<string | null>(null);
    const [companyError, setCompanyError] = useState<string | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [companySelected, setCompanySelected] = useState<string>(DEFAULT_COMPANY);


    const formError: boolean = (dateError || companyError || amountError) ? true : false;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onInputChange(name as keyof Expense, value);
    };

    const handleCompanyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const validation = validateCompanyInput(value);
        e.target.value = validation.value;
        console.log(validation.value);
        setCompanySelected(validation.value);
        if (validation.isValid) {
            setCompanyError(null);
            onInputChange(name as keyof Expense, value);
        } else {
            setCompanyError(validation.error || "please select different company");
        }

    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const validation = validateDateInput(
            value,
            parseInt(month as string),
            parseInt(year as string)
        );

        e.target.value = validation.value;

        if (validation.isValid) {
            if (dateError) {
                setDateError(null);
            }
            const postValue = formatDate(validation.value, month as string, year as string);
            onInputChange(name as keyof Expense, postValue);
        } else {
            setDateError(validation.error || null);
        }
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const validation = validateAmountInput(value);

        e.target.value = validation.value;

        if (validation.isValid) {
            if (amountError) {
                setAmountError(null);
            }
            // If the value is valid but doesn't have a decimal, add .00
            let postValue = validation.value;
            if (validation.isValid && !postValue.includes('.')) {
                postValue = `${postValue}.00`;
            }
            onInputChange(name as keyof Expense, postValue);
        } else {
            setAmountError(validation.error || null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (companySelected === DEFAULT_COMPANY) {
            setCompanyError("Please select a company");
            return;
        }
        onSubmit(e);
        formRef.current?.reset();
        // Reset company selection to default after form submission
        setCompanySelected(DEFAULT_COMPANY);
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
                <button
                    type="submit"
                    disabled={formError}
                    className='cursor-pointer disabled:cursor-not-allowed'
                >
                    <div className={`flex text-lg justify-center items-center rounded-full ml-[2px] ${formError ? 'bg-red-500 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'} text-white w-8 h-8`}>

                        <p>{formError ? 'x' : '+'}</p>

                    </div>
                </button>
            </form>
        </div>
    );
}
