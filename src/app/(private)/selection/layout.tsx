'use client';

import React from "react";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const pathname = usePathname(); // Next.js hook

  // Centralized navigation logic
  const getNavConfig = (path: string) => {
    switch (true) {
      case path.includes('/expenses'):
        return {
          backURL: '/selection',
          title: 'Expenses',
          subtitle: 'Track your spending'
        };
      case path.includes('/sales'):
        return {
          backURL: '/selection',
          title: 'Sales',
          subtitle: 'Record your revenue'
        };
      default:
        return {
          title: 'Dashboard'
        };
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="w-full h-screen">
        {children}
      </div>
    </div>
  );
}
