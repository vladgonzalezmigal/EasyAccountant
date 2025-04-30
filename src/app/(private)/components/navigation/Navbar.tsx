'use client';

import { Pages, getPagesLink, getActivePath } from "../../utils/nav";
import BackButton from "./BackButton"
import SignOutBtn from './SignOutBtn';
import HomeButton from "./HomeButton";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SalesIcon from "../svgs/SalesIcon";
import ExpensesIcon from "../svgs/ExpensesIcon";
import PayrollIcon from "../svgs/PayrollIcon";
import StoreLinks from "./StoreLinks";

interface NavbarProps {
    backURL?: string;
}

export default function Navbar({ backURL }: NavbarProps) {
    const pathname = usePathname();
    const activePage : Pages | undefined = getActivePath(pathname);
    const pages: Pages[] = ["sales", "expenses", "payroll"];

    return (
        <div className="h-screen bg-white w-[172px] lg:w-[344px] px-4 lg:px-6 py-8 
         border-r border-r-2 border-[#E5E7EB] flex flex-col justify-between shadow-sm">
            {/* Main Navigation */}
            <div>
                <div className="flex w-full justify-between items-center mb-12"> 
                    <HomeButton />
                    {backURL && <BackButton url={backURL} />}   
                </div>
                <div className="flex flex-col space-y-6">
                    <div>
                        <p className="font-semibold text-[#6B7280] text-[13px] tracking-wide">Pages</p>
                    </div>
                    {/* Links */}
                    <div className="flex flex-col gap-y-2.5">
                        {pages.map((page) => (
                            <div key={page}>
                            <Link 
                                key={page}
                                href={getPagesLink(pathname, page)}
                                className={`w-full h-[48px] hover:bg-gray-50 gap-y-2 rounded-lg pl-3 flex items-center transition-colors duration-200 ${page === activePage ? 'main-theme shadow-sm' : ''}`}
                            >
                                {/* Icon */}
                                <div className="w-6 h-6 mr-3">
                                    {page === "sales" && <SalesIcon className={page === activePage ? 'active-page-text' : 'inactive-page-text'} />}
                                    {page === "expenses" && <ExpensesIcon className={page === activePage ? 'active-page-text' : 'inactive-page-text'} />}
                                    {page === "payroll" && <PayrollIcon className={page === activePage ? 'active-page-text' : 'inactive-page-text'} />}
                                </div>
                                <p className={`text-[16px] capitalize ${page === activePage ? 'active-page-text font-medium' : 'inactive-page-text'}`}>{page}</p>
                                {/* Store sublinks */}
                               
                            </Link>
                             {page === "sales" && <StoreLinks />}
                            </div>
                        ))}
                    </div>
                    {/* Other links */}
                    <div className="pt-4">
                        <p className="font-semibold text-[#6B7280] text-[13px] tracking-wide">Other</p>
                    </div>
                </div>
            </div>
            <div className="pt-6 border-t border-[#E5E7EB]">
                <SignOutBtn />
            </div>
        </div>
    );
} 