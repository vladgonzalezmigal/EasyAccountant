'use client';
import DocumentSelection from "@/app/(private)/features/DocumentSelection";
export default function SalesSelectionPage() {

  return (
      <div className="max-w-5xl px-4 py-8 w-full ">
        <h1 className="mb-8 text-3xl font-bold">Sales</h1>
        <div className="flex px-8 w-full">
        <DocumentSelection />
        </div>
      </div>
  )
}