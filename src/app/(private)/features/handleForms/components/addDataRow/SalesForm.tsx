"use client "

import { validateDateSequence } from "../../utils/formValidation/formValidation";


// import { Sales } from "@/app/(private)/types/formTypes";

interface SalesFormProps {
     dates: string[],
     daysInMonth: number,
}

export default function SalesForm({ dates, daysInMonth }: SalesFormProps) {
    let salesRow = <div> <p>Something went wrong </p></div>; 
    const nextDate = validateDateSequence(dates, daysInMonth);
    if (typeof nextDate === "string") {
        salesRow = (<div> <p>{nextDate}</p></div>);
    } else if (typeof nextDate === "number") {
        salesRow = (<div> <p>Please enter sales for {nextDate.toLocaleString()}</p></div>);
    }
    return salesRow;
}


