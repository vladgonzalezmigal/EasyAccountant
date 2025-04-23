'use client';

import { useParams } from "next/navigation";

export default function ExpensesPage() {
    const { year, month } = useParams();
    return (
        <div>
            <h1>Expenses for {month} {year}</h1>
        </div>
    )
}