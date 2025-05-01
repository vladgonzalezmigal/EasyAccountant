"use client "

// import { Sales } from "@/app/(private)/types/formTypes";

interface SalesFormProps {
     recentRow: {
        recentDate: number,
        recentTotal: number,
     }
}

export default function SalesForm({ recentRow }: SalesFormProps) {
    return (
        <div>
            <h1>Sales Form</h1>
        </div>
    )
}


