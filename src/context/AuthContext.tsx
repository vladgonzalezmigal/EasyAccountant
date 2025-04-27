'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User, AuthError } from '@supabase/supabase-js';
import supabase from "@/config/supaBaseConfig";

interface AuthContextType {
  signUpNewUser: (email: string, password: string) => Promise<AuthResponse>;
  signInUser: (email: string, password: string) => Promise<AuthResponse>;
  session: Session | null | string;
  signOut: () => Promise<{ error?: AuthError }>;
}

interface AuthResponse {
  success: boolean;
  data?:{
    user: User | null;
    session: Session | null;
  };
  error?: AuthError;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null | string>("loading");

  // Sign up
  const signUpNewUser = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      // console.error("Error signing up: ", error);
      return { success: false, error: error as AuthError };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        // console.error("Sign-in error:", error.message); // Log the error for debugging
        return { success: false, error: error as AuthError };
      }

      // If no error, return success
      console.log("Sign-in success:", data);
      return { success: true, data }; // Return the user data
    } catch (error) {
      // Handle unexpected issues
      const err = error as AuthError;
      // console.error("Unexpected error during sign-in:", err.message);
      return {
        success: false,
        error: err,
        //  "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("getting session: ", session);
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("setting session on change : ", session);
      setSession(session);
    });
  }, []);

  // Sign out
    async function signOut(): Promise<{ error?: AuthError }> {
      const { error } = await supabase.auth.signOut();
    
      if (error) {
        return { error };
      }
    
      return {};
    }

  return (
    <AuthContext.Provider
      value={{ signUpNewUser, signInUser, session, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};