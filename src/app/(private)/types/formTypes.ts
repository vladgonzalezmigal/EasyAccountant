export type Expense = {
    id: number;
    date: string; // Supabase returns date as string
    payment_type: string;
    detail: string;
    company: string;
    amount: number;
};

export interface Sales {
    id: number;
    store_id: number; 
    date: string; // Supabase returns it as string
    sales: number;
    taxes: number; 
};

export interface SalesDisplay extends Sales {
    daily_total: number;
    cumulative_total: number;
}

export type Payroll = {
    id: number;
    employee_name: string; // handle repeat names 
    wage_type: string;
    wage_rate: number;
    hours: number;
};

export type FormData = Expense | Sales | SalesDisplay | Payroll;