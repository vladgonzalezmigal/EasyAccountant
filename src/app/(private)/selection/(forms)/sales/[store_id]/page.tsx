'use client';
import DocumentSelection from "@/app/(private)/features/handleForms/components/DocSearch/DocumentSelection";
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
      <div className="w-full ">
        <h1 className="mb-10 text-3xl font-bold text-[#2F2F2F]">Sales Calendar For {store_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} </h1>
        <div className=" w-full">
        <DocumentSelection />
        </div>
      </div>
  )
}