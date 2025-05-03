"use client "

import { Sales } from "@/app/(private)/types/formTypes";
import { validateAmountInput } from "../../utils/formValidation/formValidation";
import { ChangeEvent,  useState } from "react";
import PlusIcon from "@/app/(private)/components/svgs/PlusIcon";
import CheckIcon from "@/app/(private)/components/svgs/CheckIcon";


// import { Sales } from "@/app/(private)/types/formTypes";

interface SalesFormProps {
        formDone: boolean,
        createSalesDate: string,
    onInputChange: (name: keyof Sales, value: string | number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SalesForm({ formDone, createSalesDate, onInputChange, }: SalesFormProps) {

    const [salesError, setSalesError] = useState<string | null>(null);
    const [taxesError, setTaxesError] = useState<string | null>(null);
    const handleAmountChange = (e: ChangeEvent<HTMLInputElement> ) => {
        const { name, value } = e.target;
        const validation = validateAmountInput(value);

        e.target.value = validation.value;

        if (validation.isValid) {
            if (salesError) {
                setSalesError(null);
            } else if (taxesError) {
                setTaxesError(null);
            }
            // If the value is valid but doesn't have a decimal, add .00
            let postValue = validation.value;
            if (validation.isValid && !postValue.includes('.')) {
                postValue = `${postValue}.00`;
            }
            // Convert string to number before passing to onInputChange
            onInputChange(name as keyof Sales, parseFloat(postValue));
        } else if (name === 'sales') {
            setSalesError(validation.error || null);
        } else if (name === 'taxes') {
            setTaxesError(validation.error || null);
        }
    };
    let salesRow = <div> <p>Something went wrong </p></div>;

    if (formDone) {
        salesRow = (<div className="w-full flex items-center justify-center bg-[#F2FBFA] border border-[#ECECEE] rounded-full py-1 shadow-md">
                <p className="text-[16px] text-[#2F2F2F]">Form Completed!</p>
                <div className="h-[20px] w-[20px] ml-1 bg-[#B6E8E4] rounded-full">
                    <CheckIcon className="text-[#0C3C74]"/>
                </div>
        </div>); // error message 
    } else {
    
        salesRow = (
        <div className="border  border-[#DFF4F3] bg-white table-input-shadow w-[772px] rounded-full">
            <form className='flex flex-row items-center rounded-full h-[60px] pl-10 text-gray-800'>

                {/* Date is not editable */}
                <div className="sales-input-field  flex items-center">
                    <p>{createSalesDate}</p>
                </div>
                <div className="pl-12">
                    <input
                        type="text"
                        id="sales"
                        name="sales"
                        required={true}
                        onChange={handleAmountChange}
                        className={`flex items-center justify-center ${salesError ? "input-field-error " : "input-field"}`}
                        placeholder={'0'}
                    />
                </div>
                <div className="pl-12">
                    <input
                        type="text"
                        id="taxes"
                        name="taxes"
                        required={true}
                        onChange={handleAmountChange}
                        className={`flex items-center justify-center ${taxesError ? "input-field-error " : "input-field"}`}
                        placeholder={'0'}
                    />
                </div>
                {/* daily total  */}
                <div className="ml-12 sales-input-field flex items-center ">
                    <p>${0}</p>
                </div>
                {/* daily sum */}
                <div className="ml-12 sales-input-field  flex items-center ">
                    <p>${0}</p>
                </div>
                 <button
                    type="submit"
                    disabled={true} // formError var needed
                    className='cursor-pointer disabled:cursor-not-allowed'
                >
                    <div className={`flex text-lg justify-center items-center rounded-full ml-[3.5px] ${false ? 'bg-red-500 cursor-not-allowed' : 'bg-[#DFF4F3] cursor-pointer border border-[#8ABBFD]'} text-white w-7 h-7`}>

                        <div>{false ? 'x' : 
                            <div className='h-4 w-4 flex items-center justify-center'>
                            <PlusIcon className='text-[#0C3C74]'/>
                            </div>
                            }
                            </div>
                    </div>
                </button>
            </form>
        </div>);
    }
    return salesRow;
}


