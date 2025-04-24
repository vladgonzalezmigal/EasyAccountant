'use client';

import SignOutBtn from "../components/SignOutBtn";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  
  // Create an array of form options with type definition
  const formOptions: string[] = ["expenses", "payroll", "sales"];
  
  const handleNavigation = (option: string) => {
    router.push(`/selection/${option}`);
  };

  return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <SignOutBtn />
        <h1 className="mb-8 text-3xl font-bold">Select Document Type</h1>
        <div className="flex flex-col space-y-4">
          {formOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleNavigation(option)}
              className="w-[740px] h-[128px] bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md flex items-center justify-center transition-colors duration-200 mx-auto"
            >
              {option.charAt(0).toUpperCase() + option.slice(1)} 
            </button>
          ))}
        </div>
      </div>
  )
}