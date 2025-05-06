'use client';

import CreateVendor from './CreateVendor';
import DisplayVendors from './DisplayVendors';
import { useStore } from "@/store";

export default function VendorSection() {
    const {vendorState} = useStore();

    return (
        <div className="w-full space-y-6">
            <CreateVendor />
            <DisplayVendors vendors={vendorState.vendors || []} />
        </div>
    );
}
