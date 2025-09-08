interface TotalRowProps {
    totalSales: number;
    totalExpenses: number;
    totalPayroll: number;
}

export default function TotalRow({ totalSales, totalExpenses, totalPayroll }: TotalRowProps) {
    const totalProfit = totalSales - totalExpenses - totalPayroll;
    return (
        <div className="flex justify-around w-full mt-4 text-[#2F2F2F] text-[14px] font-semibold">
            <p>Total Sales: ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Total Expenses: ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Total Payroll: ${totalPayroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Total Profit: ${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
    )
}