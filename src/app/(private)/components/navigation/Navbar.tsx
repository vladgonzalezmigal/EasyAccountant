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

interface NavbarProps {
    backURL?: string;
}

export default function Navbar({ backURL }: NavbarProps) {
    const pathname = usePathname();
    const activePage : Pages | undefined = getActivePath(pathname);
    const pages: Pages[] = ["sales", "expenses", "payroll"];

    return (
        <div className="h-screen bg-white w-[172px] lg:w-[344px] px-2 lg:px-4 py-9 
         border-r border-r-2 border-[#D9D9D9] flex flex-col justify-between">
            {/* Main Navigation */}
            <div>
                <div className="flex w-full justify-between items-center mb-16"> 
                <HomeButton />
                {backURL && <BackButton url={backURL} />}   
                </div>
                <div className="flex flex-col ">
                    <div>
                        <p className="font-semibold text-[#585858] text-[14px] ">Pages</p>
                    </div>
                    {/* Links */}
                    <div className="flex flex-col gap-y-2 py-2">
                        {pages.map((page) => (
                            <Link 
                                key={page}
                                href={getPagesLink(pathname, page)}
                                className={`w-full h-[48px] hover:bg-gray-100 gap-y-2 rounded-lg pl-2 flex items-center ${page === activePage ? 'main-theme' : ''}`}
                            >
                                {/* Icon */}
                                <div className="w-6 h-6 mr-2">
                                    {page === "sales" && <SalesIcon className={page === activePage ? 'active-page-text' : 'inactive-page-text'} />}
                                    {page === "expenses" && <ExpensesIcon className={page === activePage ? 'active-page-text' : 'inactive-page-text'} />}
                                    {page === "payroll" && <PayrollIcon className={page === activePage ? 'active-page-text' : 'inactive-page-text'} />}
                                </div>
                                <p className={`text-[18px] capitalize ${page === activePage ? 'active-page-text' : 'inactive-page-text'}`}>{page}</p>
                            </Link>
                        ))}
                    </div>
                    {/* Other links */}
                    <div>
                        <p className="font-semibold text-[#585858] text-[14px] pb-1">Other</p>
                    </div>
                </div>
            </div>
            <div>
                <SignOutBtn />
            </div>
            
        </div>
    );
} 