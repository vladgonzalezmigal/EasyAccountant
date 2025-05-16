'use client';

interface ExpenseSelectProps {
    selectedExpenses: string[];
    onExpenseSelect: (expense: string) => void;
    expenses: string[];
}

export default function ExpenseSelect({ selectedExpenses, onExpenseSelect, expenses }: ExpenseSelectProps) {
    return (
        <div className="flex flex-col gap-y-2.5 pl-10 mt-1">
            {expenses.map((expense, index) => (
                <div 
                    key={index}
                    className="flex items-center pl-2 py-2"
                >
                    <input
                        type="checkbox"
                        id={`expense-${expense}`}
                        checked={selectedExpenses.includes(expense)}
                        onChange={() => onExpenseSelect(expense)}
                        className="w-4 h-4 rounded border-[#5CB8B1] text-[#2A7D7B] focus:ring-[#2A7D7B] mr-2"
                    />
                    <label 
                        htmlFor={`expense-${expense}`}
                        className={`text-[14px] cursor-pointer ${
                            selectedExpenses.includes(expense)
                                ? 'text-[#2A7D7B] font-semibold' 
                                : 'text-[#6B7280]'
                        }`}
                    >
                        {expense.toUpperCase()}
                    </label>
                </div>
            ))}
        </div>
    );
}
