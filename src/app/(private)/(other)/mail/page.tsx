'use client';

import { useState } from 'react';
import { generateSalesPdfs, generatePayrollPdfs, generateExpensePdfs } from '../utils/generateUtils';
import LineBreak from '../../features/userSettings/components/LineBreak';
import MailIcon from '../../components/svgs/MailIcon';
import PlusIcon from '../../components/svgs/PlusIcon';
import MailSearch from '../components/mail/MailSearch';
import SalesSelect from '../components/mail/select/SalesSelect';
import ExpenseSelect from '../components/mail/select/ExpenseSelect';
import PayrollSelect from '../components/mail/select/PayrollSelect';
import { useStore } from "@/store";
import { getDaysInMonth } from '@/app/(private)/utils/dateUtils';
import { months } from '@/app/(private)/utils/dateUtils';
import SalesDocs from '../components/mail/displaydocs/SalesDocs';
import PDFDisplay from '../components/mail/displaydocs/PDFDisplay';
import PayrollDocs from '../components/mail/displaydocs/PayrollDocs';
import ExpenseDocs from '../components/mail/displaydocs/ExpenseDocs';

interface DocMetaData {
  subject: string;
  receiver: string;
  bodyText: string;
  fileName: string;
}

export default function MailPage() {
  const today = new Date();
  const { storeState, vendorState, emailState } = useStore();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedStores, setSelectedStores] = useState<number[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [selectedPayrolls, setSelectedPayrolls] = useState<{ startDate: string; endDate: string }[]>([]);
  const expenses = ["Expenses"];

  // generate document state 
  const [docMetaData, setDocMetaData] = useState<DocMetaData[]>([]);
  const [generatedPdfs, setGeneratedPdfs] = useState<React.ReactNode[]>([]);

  // Create payroll periods
  const payrolls = [
    {
      startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`
    },
    {
      startDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`,
      endDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${getDaysInMonth(currentMonth + 1, currentYear)}`
    }
  ];

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    // Clear docMetaData when month changes
    setDocMetaData([]);
    setGeneratedPdfs([]);
    setSelectedStores([]);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    // Clear docMetaData when year changes
    setDocMetaData([]);
    setGeneratedPdfs([]);
    setSelectedStores([]);
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

  const handlePayrollSelect = (payroll: { startDate: string; endDate: string }) => {
    setSelectedPayrolls(prev => {
      const exists = prev.some(p => p.startDate === payroll.startDate && p.endDate === payroll.endDate);
      if (exists) {
        return prev.filter(p => !(p.startDate === payroll.startDate && p.endDate === payroll.endDate));
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
    setSelectedPayrolls(payrolls);
  };

  const [salesError, setSalesError] = useState<string | null>(null);
  const [payrollError, setPayrollError] = useState<string | null>(null);
  const [expenseError, setExpenseError] = useState<string | null>(null);

  const handleGenerateDocuments = async () => {
    // set all errors to null 
    let metadatas: DocMetaData[] = [];
    let pdfs: React.ReactNode[] = [];
    setGeneratedPdfs([]);
    setDocMetaData(metadatas);
    setSalesError(null);
    setPayrollError(null);

    if (selectedStores.length === 0 && selectedPayrolls.length === 0 && selectedExpenses.length === 0) {
      setSalesError('Please select at least one store, payroll, or expense');
      return;
    } else if (emailState.emails?.[0]?.recipient_email == null || emailState.emails?.[0]?.sender_email == null) {
      setSalesError('Please set the sender and recipient email in the email settings');
      return;
    }

    try {
      // generate sales documents 
      if (selectedStores.length > 0) {
        const { data: salesValidResults, error } = await generateSalesPdfs(selectedStores, storeState.stores || [], currentYear, currentMonth);
        if (error || !salesValidResults) {
          setSalesError(error || 'An error occurred while generating sales documents');
          return;
        }
        const salesMetadatas = salesValidResults.map(result => (
          {
            subject: `Sales for ${result.storeName}, ${months[currentMonth]} ${currentYear}`,
            receiver: emailState.emails![0].recipient_email,
            bodyText: `Sales for ${result.storeName}, ${months[currentMonth]} ${currentYear}, sent by ${emailState.emails![0].sender_email}`,
            fileName: `Sales_${months[currentMonth]}_${currentYear}_${result.storeName.replace(/\s+/g, '_')}.pdf`
          }
        ));

        const salesPdfs = salesValidResults.map(result => (
          <SalesDocs
            key={result.storeName}
            salesData={result.salesData}
            storeName={result.storeName}
            year={String(currentYear)}
            month={months[currentMonth]}
          />
        ));

        metadatas = [...metadatas, ...salesMetadatas];
        pdfs = [...pdfs, ...salesPdfs];
      }
      // generate expense documents
      if (selectedExpenses.length > 0) {
        if (vendorState.vendors?.length === 0 || vendorState.vendors === undefined) {
          setExpenseError('Please add a vendor to the system or refresh the page');
          return;
        }
        const { data: expenseValidResults, error } = await generateExpensePdfs(selectedExpenses, currentYear, currentMonth);
        if (error || !expenseValidResults) {
          setExpenseError(error || 'An error occurred while generating expense documents');
          return;
        }
        const expenseMetadatas = expenseValidResults.map(() => (
          {
            subject: `Expenses for ${months[currentMonth]} ${currentYear}`,
            receiver: emailState.emails![0].recipient_email,
            bodyText: `Expenses for ${months[currentMonth]} ${currentYear}, sent by ${emailState.emails![0].sender_email}`,
            fileName: `Expenses_${months[currentMonth]}_${currentYear}}.pdf`
          }
        ));

        const expensePdfs = expenseValidResults.map(result => (
          <ExpenseDocs
            key={result.expenseName}
            expenseData={result.expenseData}
            year={String(currentYear)}
            month={months[currentMonth]}
            vendors={vendorState.vendors || []}
          />
        ));

        metadatas = [...metadatas, ...expenseMetadatas];
        pdfs = [...pdfs, ...expensePdfs];
      }

      // generate payroll documents 
      if (selectedPayrolls.length > 0) {
        const { data: payrollValidResults, error } = await generatePayrollPdfs(selectedPayrolls);
        if (error || !payrollValidResults) {
          setPayrollError(error || 'An error occurred while generating payroll documents');
          return;
        }


        if (payrollValidResults.length > 0) {
          const payrollMetadatas = payrollValidResults.map(result => (
            {
              subject: `Payroll Period: ${result.startDate} to ${result.endDate}`,
              receiver: (emailState.emails?.[0]?.recipient_email || ""),
              bodyText: `Payroll for period ${result.startDate} to ${result.endDate}, sent by ${emailState.emails?.[0]?.sender_email || ""}`,
              fileName: `Payroll_${months[currentMonth]}_${currentYear}.pdf`
            }
          ));

          const payrollPdfs = payrollValidResults.map(result => (
            <PayrollDocs
              key={`${result.startDate}-${result.endDate}`}
              payrollData={result.payrollData}
              startDate={result.startDate}
              endDate={result.endDate}
            />
          ));

          metadatas = [...metadatas, ...payrollMetadatas];
          pdfs = [...pdfs, ...payrollPdfs];
        }
      }

      setDocMetaData(metadatas);
      setGeneratedPdfs(pdfs);

    } catch (error) {
      setSalesError('An error occurred while generating the PDF' + error);
    } finally {
      console.log(docMetaData)
      setSelectedStores([]);
      setSelectedPayrolls([]);
      setSelectedExpenses([]);
    }
  };

  const handleClosePdfs = () => {
    setGeneratedPdfs([]);
    setDocMetaData([]);
  };

  return (
    <div className="container px-16 py-8 min-h-screen h-full max-h-screen overflow-y-auto bg-[#FAFAFA] min-w-full">
      {/* Display generated PDFs */}
      {generatedPdfs.length > 0 &&
        <PDFDisplay displayPdfs={generatedPdfs} handleClosePdfs={handleClosePdfs} />
      }
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
              className="cursor-pointer flex items-center gap-x-2 px-6 py-3 bg-[#DFF4F3] border-2 border-[#8ABBFD] rounded-lg hover:bg-[#C5E8E6] transition-colors duration-200"
            >
              <PlusIcon className="text-[#8ABBFD] w-6 h-6" />
              <span className="text-[#8ABBFD] font-semibold">Generate Documents</span>
            </button>
          </div>
        </div>
        <LineBreak className="mb-6" />

        {/* Sales Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-x-4 ">
              <div className="flex justify-between w-full">
                <h2 className="text-[20px] font-semibold text-[#2F2F2F]">Sales</h2>
                <button
                  onClick={handleSelectAll}
                  className="px-4  text-[14px] text-[#2A7D7B] font-semibold hover:text-[#48B4A0] transition-colors duration-200"
                >
                  Select All
                </button>
                {salesError && <span className="text-[#FF0000] text-sm">{salesError}</span>}
              </div>


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
            {expenseError && <span className="text-[#FF0000] text-sm">{expenseError}</span>}
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
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-x-4 ">
                <h2 className="text-[20px] font-semibold text-[#2F2F2F]">Payroll</h2>
                <button
                  onClick={handleSelectAllPayrolls}
                  className="px-4  text-[14px] text-[#2A7D7B] font-semibold hover:text-[#48B4A0] transition-colors duration-200"
                >
                  Select All
                </button>
                {payrollError && <span className="text-[#FF0000] text-sm">{payrollError}</span>}
              </div>
            </div>
          </div>
          <PayrollSelect
            selectedPayrolls={selectedPayrolls}
            onPayrollSelect={handlePayrollSelect}
            payrolls={payrolls}
          />
        </div>
        <LineBreak className="mb-6" />
      </div>

    </div>
  );
}
