'use client';

import { useState } from 'react';
import { UserAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation'
import { AuthError } from '@supabase/supabase-js';

export default function SignupPage() {
    const { signUpNewUser } = UserAuth();
    const router = useRouter();

    interface formData {
        email: string;
        password: string;
    }

    type FormErrors = Record<keyof formData, (string | null)>;

    const [formData, setFormData] = useState<formData>({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        email: null,
        password: null,
    });

    //   const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [signInError, setSignInError] = useState<AuthError | null>(null);

    const validateForm = () => {
        const newErrors: FormErrors = {
            email: null,
            password: null,
        };

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\-=\[\]{};':"\\|,.<>\/?`~]).+$/;

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (
            formData.password.length < 6 ||
            !passwordRegex.test(formData.password)
          ) {
            newErrors.password =
              'Password must be at least 6 characters and include uppercase, lowercase, number, and special character';
          }

        setFormErrors(newErrors);

        return !Object.values(newErrors).some(value => value !== null); // check if any errors are present
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const result = await signUpNewUser(formData.email, formData.password); // Call context function
                if (result.success) {
                    router.push('/selection') // Navigate to selection on success
                } else if (result.error) {
                    console.log("moreno error", result.error.message)
                    setSignInError(result.error as AuthError);
                }
            } catch (error) {
                setSignInError(error as AuthError);
            } finally {
                setLoading(false); // End loading state
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        validateForm();
        // Clear error when user starts typing
        // if (errors[name as keyof typeof errors]) {
        //   setErrors(prev => ({
        //     ...prev,
        //     [name]: '',
        //   }));
        // }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-4xl font-light tracking-wider text-gray-900">
                        Sign up
                    </h2>
                </div>
                {/* email */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {formErrors.email && (
                        <div className="text-red-600 text-sm text-center">{formErrors.email}</div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required={true}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        {/* password */}
                        <div>
                            {formErrors.password && (
                                <div className="text-red-600 text-sm text-center">{formErrors.password}</div>
                            )}
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required={true}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </div>
                    {signInError && (
                        <div className="text-red-600 text-sm text-center">{signInError.message}</div>
                    )}
                </form>
            </div>
        </div>
    );
}
