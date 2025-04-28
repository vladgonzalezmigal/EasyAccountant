'use client';
import DocumentSelection from "@/app/(private)/features/handleForms/components/DocumentSelection";
export default function PayrollSelectionPage() {

  return (
      <div className="max-w-5xl px-4 py-8 w-full ">
        <h1 className="mb-8 text-3xl font-bold">Payroll</h1>
        <div className="flex px-8 w-full">
        <DocumentSelection />
        </div>
      </div>
  )
}