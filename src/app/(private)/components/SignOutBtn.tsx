'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { UserAuth } from "@/context/AuthContext";
import { AuthError } from '@supabase/supabase-js';

const SignOutBtn = () => {
  const { signOut } = UserAuth();
  const [signOutError, setSignOutError] = useState<AuthError | null>(null);

  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement> ) => {
     e.preventDefault();
    // Here you would typically call your sign out function
    // For example: await signOutUser();
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      setSignOutError(error as AuthError);
    }
    
  };

  return (
    <>
    <div className="flex justify-center">
      <button
        onClick={handleSignOut}
        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
      >
        Sign out
      </button>
    </div>
    <div>
        {signOutError && <p className="text-red-500">{signOutError.message}</p>}
    </div>
    </>
  );
};

export default SignOutBtn;
