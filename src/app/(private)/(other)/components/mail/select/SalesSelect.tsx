'use client';

import { useStore } from "@/store";
import { Store } from "../../../../features/userSettings/types/storeTypes";

interface SalesSelectProps {
    selectedStores: string[];
    onStoreSelect: (storeId: string) => void;
}

export default function SalesSelect({ selectedStores, onStoreSelect }: SalesSelectProps) {
    const { storeState } = useStore();
    const storeSubpages: Store[] | null = storeState.stores?.filter(store => store.active) || null;

    return (
        <div className="flex flex-col gap-y-2.5 pl-10 mt-1">
            {storeSubpages ? (
                storeSubpages.map((store, index) => (
                    <div 
                        key={index}
                        className="flex items-center pl-2 py-2"
                    >
                        <input
                            type="checkbox"
                            id={`store-${store.id}`}
                            checked={selectedStores.includes(store.id.toString())}
                            onChange={() => onStoreSelect(store.id.toString())}
                            className="w-4 h-4 rounded border-[#5CB8B1] text-[#2A7D7B] focus:ring-[#2A7D7B] mr-2"
                        />
                        <label 
                            htmlFor={`store-${store.id}`}
                            className={`text-[14px] cursor-pointer ${
                                selectedStores.includes(store.id.toString()) 
                                    ? 'text-[#2A7D7B] font-semibold' 
                                    : 'text-[#6B7280]'
                            }`}
                        >
                            {store.store_name}
                        </label>
                    </div>
                ))
            ) : (
                <p className="text-[13px] text-[#6B7280]">Please refresh the page</p>
            )}
        </div>
    );
}
