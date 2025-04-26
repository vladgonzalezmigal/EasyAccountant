'use client';

import { useRouter } from 'next/navigation';
import BackButton from "./BackButton"
import SignOutBtn from './SignOutBtn';

interface NavbarProps {
    backURL?: string;
    title?: string;
    subtitle?: string;
    hyperlinks?: boolean;
}

export default function Navbar({ backURL, title, subtitle, hyperlinks }: NavbarProps) {
    const router = useRouter();

    return (
        <div className="h-screen bg-blue-500">
            {/* Main Navigation */}
            <div>
                <SignOutBtn />
                {backURL && <BackButton url={backURL} />}                
            </div>
        </div>
    );
} 