'use client';
import DocumentSelection from "@/app/(private)/features/handleForms/components/DocumentSelection";
import { useStore } from "@/store";
import { useParams } from "next/navigation";
export default function SalesSelectionPage() {
  const { store_id } = useParams();
  const { storeState } = useStore();
  const { stores } = storeState;


  let store_name = stores?.find((store) => store.id === parseInt(store_id as string))?.store_name;
  if (!store_name) {
    store_name = "searching...";
  }
  // const store_name : 

  return (
      <div className="max-w-5xl px-4 py-8 w-full ">
        <h1 className="mb-8 text-3xl font-bold text-[#2F2F2F]">Sales </h1>
        <h2 className="text-[#8B8F95]"> {store_name} </h2>
        <div className="flex px-8 w-full">
        <DocumentSelection />
        </div>
      </div>
  )
}