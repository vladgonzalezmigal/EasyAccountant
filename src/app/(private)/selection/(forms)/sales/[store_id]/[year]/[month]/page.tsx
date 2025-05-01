"use client";

import { useParams } from "next/navigation";

export default function SalesFormPage() {
    const { store_id, year, month } = useParams();

    return (
        <div>
            <h1>Sales Form {store_id} {year} {month}</h1>
        </div>
    )
}