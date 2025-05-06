"use client";

import React, { useEffect } from "react";

import { Loading } from "../components/Loading";
import { useStore } from "@/store";


interface LayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: LayoutProps) => {
  const { fetchStore, fetchVendorData, isLoadingStore, isLoadingVendors, storeState, vendorState } = useStore();

  // (1) load user settings 
  const loadingSettings : boolean = isLoadingStore || isLoadingVendors;

  useEffect(() => {
    // assume user is authenticated due to server-side auth check (middleware)
    const fetchSettings = async () => {
      try {
        await Promise.all([
           fetchStore(),
           fetchVendorData()
           // fetchEmails()
           // fetchEmployees()
        ]);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    };

    const missingSettings = (storeState.stores === null) || (vendorState.vendors === null);

    if (missingSettings) { // only fetch settings if user is authenticated and settings are missing
      console.log("fetching settings called");
       fetchSettings();
    }
  }, [fetchStore, fetchVendorData, storeState, vendorState]);

  return (loadingSettings) ? (
    <Loading />
  ) : (
    <div className="">
      {children}
    </div>
  );
};

export default ProtectedLayout;