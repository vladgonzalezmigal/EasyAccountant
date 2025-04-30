'use client';

import React, { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loading } from "../components/Loading";
import { useStore } from "@/store";
// import { useInitializeSettings } from "../(private)/features/userSettings/utils/settingsUtils";

interface LayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: LayoutProps) => {
  const { session } = UserAuth();
  const { fetchStore, isLoadingStore, storeState } = useStore();
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  // const [checkedAuth, setCheckedAuth] = useState(false);
  // const [loadingState, setLoadingState] = useState(true);

  
  // (1) check if user is authenticated
  useEffect(() => {
    if (!session) { // only push to login if session promise resolves to null
      router.push("/login"); 
    } else if (session === "loading") {
      setLoadingAuth(true);
    } else { 
       setLoadingAuth(false); // if user is authenticated, set loadingAuth to false
    }
  }, [session, router, loadingAuth]);

  // (2) load user settings 
  const loadingSettings : boolean = isLoadingStore
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        await Promise.all([
           fetchStore()
           // fetchEmails()
           // fetchEmployees()
        ]);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    };

    const authenticated = (session != 'loading') && (session != null)
    const missingSettings = (storeState.stores === null)

    if (authenticated && !loadingAuth && missingSettings) { // only fetch settings if user is authenticated and settings are missing
      console.log("fetching settings called");
       fetchSettings();
    }
  }, [session, fetchStore, loadingAuth, storeState]);

  return (loadingAuth || loadingSettings) ? (
    <Loading />
  ) : (
    <div className="">
      {children}
    </div>
  );
};

export default ProtectedLayout;