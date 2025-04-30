'use client';

import { useStore } from "@/store";
import { Store } from "../../features/userSettings/types/storeTypes";
export default function StoreLinks() {
  const { storeState } = useStore();
  const storeSubpages : Store[] | null  = storeState.stores;

  return (
    <div className="flex flex-col gap-y-2.5 pl-9 mt-2">
      {storeSubpages ? (
        storeSubpages.map((store, index) => (
          <div key={index}>
            <p className="text-[13px] text-[#6B7280] hover:text-[#4B5563] transition-colors duration-200">
              {store.store_name}
            </p>
          </div>
        ))
      ) : (
        <p className="text-[13px] text-[#6B7280]">Please refresh the page</p>
      )}
    </div>
  );
}
