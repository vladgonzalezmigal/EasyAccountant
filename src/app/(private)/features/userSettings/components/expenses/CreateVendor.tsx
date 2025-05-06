'use client';

import { useState } from 'react';
import CreateBtn from '../CreateBtn';

export default function CreateVendor() {
    const [vendorName, setVendorName] = useState('');

    const handleVendorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVendorName(e.target.value.toUpperCase());
    };

    return (
        <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm px-4 py-6 max-w-[600px]">
            {/* Header */}
            <h3 className="text-[20px] text-[#404040]">Create Vendor</h3>
            <div className="h-[1.5px] rounded-full w-full bg-[#E4F0F6] mt-3" />
            {/* Form Label */}
            <div className="flex my-4">
                <label htmlFor="vendorName" className="text-[16px] text-[#80848A] font-semibold">Vendor Name</label>
            </div>
            {/* Form Inputs & Button */}
            <div className="flex gap-4 pb-4">
                <div className="flex flex-col">
                    <input
                        type="text"
                        id="vendorName"
                        value={vendorName}
                        onChange={handleVendorNameChange}
                        className="w-[240px] h-[40px] border border-2 border-[#8ABBFD] rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B]"
                        placeholder="AMADO VERDURA"
                    />
                </div>
                <CreateBtn onSubmit={() => {}} />
            </div>
        </div>
    );
}
