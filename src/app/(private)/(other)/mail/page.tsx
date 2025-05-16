'use client';

import { useState } from 'react';
import LineBreak from '../../features/userSettings/components/LineBreak';
import MailIcon from '../../components/svgs/MailIcon';
import PlusIcon from '../../components/svgs/PlusIcon';
import MailSearch from '../components/mail/MailSearch';
import SalesSelect from '../components/mail/select/SalesSelect';
import ExpenseSelect from '../components/mail/select/ExpenseSelect';
import PayrollSelect from '../components/mail/select/PayrollSelect';
import { useStore } from "@/store";
import { getDaysInMonth } from '@/app/(private)/utils/dateUtils';

export default function MailPage() {
  const today = new Date();
  const { storeState } = useStore();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const expenses = ["Expenses"];

  // Create payroll periods
  const payrolls = [
    [
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`
    ],
    [
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`,
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${getDaysInMonth(currentMonth + 1, currentYear)}`
    ]
  ];

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    // Add any additional logic needed when month changes
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    // Add any additional logic needed when year changes
  };

  const handleStoreSelect = (storeId: string) => {
    const storeIdInt = parseInt(storeId);
    setSelectedStores(prev => {
      if (prev.includes(storeIdInt)) {
        return prev.filter(id => id !== storeIdInt);
      } else {
        return [...prev, storeIdInt];
      }
    });
  };

  const handleExpenseSelect = (expense: string) => {
    setSelectedExpenses(prev => {
      if (prev.includes(expense)) {
        return prev.filter(e => e !== expense);
      } else {
        return [...prev, expense];
      }
    });
  };

  const handlePayrollSelect = (payroll: string) => {
    setSelectedPayrolls(prev => {
      if (prev.includes(payroll)) {
        return prev.filter(p => p !== payroll);
      } else {
        return [...prev, payroll];
      }
    });
  };

  const handleSelectAll = () => {
    const activeStoreIds = storeState.stores
      ?.filter(store => store.active)
      .map(store => store.id) || [];
    setSelectedStores(activeStoreIds);
  };

  const handleSelectAllPayrolls = () => {
    const allPayrolls = payrolls.map(payroll => payroll.join('-'));
    setSelectedPayrolls(allPayrolls);
  };

  const handleGenerateDocuments = () => {
    console.log('Selected Stores:', selectedStores);
    // generate sales documents 
    console.log('Selected Expenses:', selectedExpenses);
    console.log('Selected Payrolls:', selectedPayrolls);
  };

  return (
    <div className="container px-16 py-8 min-h-screen max-h-screen overflow-y-auto bg-[#FAFAFA] min-w-full">
      {/* Page Title  */}
      <div className="flex items-center h-[52px] w-full justify-begin mb-4">
        <MailIcon className="w-8 h-8 text-[#2F2F2F] mr-2" />
        <h1 className="text-[32px] font-bold text-[#2F2F2F] pl-2">Mail Documents</h1>
      </div>
      <LineBreak className="mb-6" />

      {/* Select Month, Year  */}
      <div className="">
        <div className="mb-8 flex justify-between pr-16">
          <MailSearch
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
             {/* Generate Documents Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerateDocuments}
            className="flex items-center gap-x-2 px-6 py-3 bg-[#DFF4F3] border-2 border-[#8ABBFD] rounded-lg hover:bg-[#C5E8E6] transition-colors duration-200"
          >
            <PlusIcon className="text-[#8ABBFD] w-6 h-6" />
            <span className="text-[#8ABBFD] font-semibold">Generate Documents</span>
          </button>
        </div>
        </div>
        <LineBreak className="mb-6" />

        {/* Store Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-x-4 ">
              <h2 className="text-[20px] font-semibold text-[#2F2F2F]">Sales</h2>
              <button
                onClick={handleSelectAll}
                className="px-4  text-[14px] text-[#2A7D7B] font-semibold hover:text-[#48B4A0] transition-colors duration-200"
              >
                Select All
              </button>
            </div>
          </div>
          <SalesSelect
            selectedStores={selectedStores.map(String)}
            onStoreSelect={handleStoreSelect}
          />
        </div>
        <LineBreak className="mb-6" />

        {/* Expense Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-semibold text-[#2F2F2F]">Expenses</h2>
          </div>
          <ExpenseSelect 
            selectedExpenses={selectedExpenses}
            onExpenseSelect={handleExpenseSelect}
            expenses={expenses}
          />
        </div>
        <LineBreak className="mb-6" />

        {/* Payroll Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-x-4">
              <h2 className="text-[20px] font-semibold text-[#2F2F2F]">Payroll</h2>
              <button
                onClick={handleSelectAllPayrolls}
                className="px-4 text-[14px] text-[#2A7D7B] font-semibold hover:text-[#48B4A0] transition-colors duration-200"
              >
                Select All
              </button>
            </div>
          </div>
          <PayrollSelect 
            selectedPayrolls={selectedPayrolls}
            onPayrollSelect={handlePayrollSelect}
            payrolls={payrolls}
          />
        </div>
        <LineBreak className="mb-6" />

        {/* Your mail content will go here */}
        <div className="w-full">
          {/* Add your mail content here */}
        </div>
      </div>
    </div>
  );
}
