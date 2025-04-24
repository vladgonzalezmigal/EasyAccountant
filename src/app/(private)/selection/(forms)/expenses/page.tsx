'use client';
import DocumentSelection from "@/app/(private)/features/DocumentSelection";
export default function ExpenseSelectionPage() {

  return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Expenses</h1>
        <DocumentSelection />
      </div>
  )
}