'use client';

import React, { useState } from 'react';
import { Vendor } from '../../types/vendorTypes';
import { filterByStartsWith } from '../../../utils/searchUtils';
import SearchBar from '../SearchBar';
import MaximizeIcon from '@/app/(private)/components/svgs/MaximizeIcon';
import MinimizeIcon from '@/app/(private)/components/svgs/MinimizeIcon';

interface DisplayVendorsProps {
  vendors: Vendor[];
}

export default function DisplayVendors({ vendors }: DisplayVendorsProps) {
    const [filteredVendors, setFilteredVendors] = useState(
        [...vendors].sort((a, b) => a.vendor_name.localeCompare(b.vendor_name))
    );
    const [isMaximized, setIsMaximized] = useState(false);

    const handleSearch = (query: string) => {
        const vendorNames = vendors.map(vendor => vendor.vendor_name);
        const filteredVendorNames = filterByStartsWith(vendorNames, query);
        const matchedVendors = filteredVendorNames.map(name => 
            vendors.find(vendor => vendor.vendor_name === name)
        ).filter((vendor): vendor is Vendor => vendor !== undefined);
        setFilteredVendors(matchedVendors);
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

  return (
    <div className="max-w-[600px] ">
    <h3 className="text-xl text-left font-semibold text-[#404040] mb-4">My Vendors</h3>
    {/* Begin Table Container  */}
    <div className="bg-white border border-[#E4F0F6] rounded-lg shadow-sm pb-4">
      
      
      {vendors.length === 0 ? (
        <p className="text-blue-600 text-center text-xl py-4">Please refresh the page</p>
      ) : (
        <div className="">
            {/* Begin Table Container  */}
          <div className={` ${isMaximized ? "" : " min-h-[360px] max-h-[360px] overflow-y-auto "}`}>
            {/* Begin Table Header */}
            <div className="flex items-center justify-center border-b border-b-[#E4F0F6] py-4 relative">
                {/* Search Bar */}
                <div>
                    <SearchBar onSearch={handleSearch} />
                </div>
                <button 
                    onClick={toggleMaximize}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    {isMaximized ? (
                        <MinimizeIcon className="w-5 h-5 text-[#80848A]" />
                    ) : (
                        <MaximizeIcon className="w-5 h-5 text-[#80848A]" />
                    )}
                </button>
            </div>
            {/* Begin Table Data  */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${isMaximized ? '' : 'sticky top-0'} z-10 text-[16px] bg-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1.5px] after:bg-[#E4F0F6]`}>
                <tr>
                  <th scope="col" className="w-[300px] min-w-[300px] max-w-[300px] mx-auto overflow-hidden px-6 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                    Vendor Name
                  </th>
                  <th scope="col" className="w-[100px] min-w-[100px] max-w-[100px] px-10 py-3 text-left text-xs text-[#80848A] text-[16px] tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs text-[#80848A] text-[16px] tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E4F0F6] divide-y-[2px] border-b border-[#E4F0F6]">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-4">
                      No vendors found
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="w-[300px] min-w-[300px] max-w-[300px] px-6 py-4 text-[16px] font-medium text-[#585858]">
                        <div className="overflow-x-auto whitespace-nowrap">
                          {vendor.vendor_name}
                        </div>
                      </td>
                      <td className=" px-10 py-4 whitespace-nowrap text-sm font-medium">
                        <div className={`px-2.5 py-1 flex items-center rounded-full ${vendor.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}> 
                          <div className={`w-3 h-3 rounded-full mr-2 ${vendor.active ? 'bg-green-800' : 'bg-gray-800'}`}></div>
                          <span className={` text-[14px] font-medium `}>
                            {vendor.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#0C3C74] hover:text-[#2A7D7B] mr-4">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
