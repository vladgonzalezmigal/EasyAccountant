'use client';

import LoginForm from './login/LoginForm';

// home page acts as login page

export default function Home() { 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm />
    </div>
  );
}
