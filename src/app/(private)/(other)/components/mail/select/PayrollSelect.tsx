'use client';

interface PayrollSelectProps {
    selectedPayrolls: string[];
    onPayrollSelect: (payroll: string) => void;
    payrolls: string[][];
}

export default function PayrollSelect({ selectedPayrolls, onPayrollSelect, payrolls }: PayrollSelectProps) {
    return (
        <div className="flex flex-col gap-y-2.5 pl-10 mt-1">
            {payrolls.map((payroll, index) => (
                <div 
                    key={index}
                    className="flex items-center pl-2 py-2"
                >
                    <input
                        type="checkbox"
                        id={`payroll-${index}`}
                        checked={selectedPayrolls.includes(payroll.join('-'))}
                        onChange={() => onPayrollSelect(payroll.join('-'))}
                        className="w-4 h-4 rounded border-[#5CB8B1] text-[#2A7D7B] focus:ring-[#2A7D7B] mr-2"
                    />
                    <label 
                        htmlFor={`payroll-${index}`}
                        className={`text-[14px] cursor-pointer ${
                            selectedPayrolls.includes(payroll.join('-'))
                                ? 'text-[#2A7D7B] font-semibold' 
                                : 'text-[#6B7280]'
                        }`}
                    >
                        {`${payroll[0].substring(5)} - ${payroll[1].substring(5)}`} 
                    </label>
                </div>
            ))}
        </div>
    );
}
