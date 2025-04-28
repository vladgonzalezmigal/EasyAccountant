'use client';

import React, { useEffect, useState } from "react";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loading } from "../components/Loading";
interface LayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: LayoutProps) => {
  const { session } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { // only push to login if session promise resolves to null
      router.push("/login"); 
    } else if (session === "loading") {
      setLoading(true);
    } else  { 
       setLoading(false);
    }
  }, [session, router, loading]);

  return loading ? (
    <Loading />
  ) : (
    <div className="">
      {children}
    </div>
  );
};

export default ProtectedLayout;